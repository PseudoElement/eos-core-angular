import { Component, EventEmitter, /* Input, */ OnInit, Output, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AUNTEFICATION_CONTROL_INPUT } from 'eos-user-params/shared/consts/auntefication-param.consts';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
/* import { BaseParamCurentDescriptor } from 'eos-user-params/base-param/shared/base-param-curent.descriptor'; */
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { EosMessageService } from 'eos-common/services/eos-message.service';

// Input, Output, EventEmitter
@Component({
    selector: 'eos-auntefication-component',
    styleUrls: ['auntefication.component.scss'],
    templateUrl: 'auntefication.component.html'
})
export class AutenteficationComponent  implements OnInit, OnDestroy {

    /* @Input() checkedParams: string; */
    /* @Input() code: Map<string, string>; */
    @ViewChild('autentif') autentif: ElementRef;
    @Output() sendParams = new EventEmitter<any>();

    isLoading = false;
    curentUser: IParamUserCl;
    public checkPass: string = '';
    public type: string = 'password';
    public type1: string = 'password';
    public editMode: boolean = false;
    public titleHeader: string;
    public inputsInfo: any;
    public inputs;
    public _descSrv;
    public form: FormGroup;
    public storeParams = new Set();
    public errorPass: boolean = false;
    public disableSave: boolean = false;
    inputFields: IInputParamControl[];
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _userParamSrv: UserParamsService,
        private apiSrvRx: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _msgSrv: EosMessageService,
    ) {

    }
    ngOnInit() {
        this.isLoading = true;
        this.inputFields = AUNTEFICATION_CONTROL_INPUT;
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, !this.editMode);
        this.formUpdate(!this.editMode);
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this.curentUser = this._userParamSrv.curentUser;
                /* this.curentUser.USER_PARMS_List.forEach(elem => {
                    if (elem.PARM_NAME === 'SUPPORTED_USER_TYPES') {
                        console.log('elem', elem);
                    }
                }); */
                this.form.controls['SELECT_AUTENT'].setValue( '0', { emitEvent: false });
                this.form.controls['PASSWORD_DATE'].setValue( new Date(this.curentUser.PASSWORD_DATE), { emitEvent: false });
                this.getTitle();
                this.subscribeForms();
                this.isLoading = false;
            }
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    subscribeForms() {
        this.form.valueChanges.pipe(
            takeUntil(this._ngUnsubscribe)
        ).subscribe(data => {
            this.checkChangeForm(data);
        });
    }
    returnEdit() {
        return !this.editMode;
    }
    optionDisable(num: number) {
        return false;
    }
    onChangeAuntef($event) {
        this.form.get('SELECT_AUTENT').patchValue(this.autentif.nativeElement.value);
    }
    getTitle(): void {
        if (this.curentUser.isTechUser) {
            this.titleHeader = this.curentUser.CLASSIF_NAME;
        } else {
            this.titleHeader = `${this.curentUser['DUE_DEP_SURNAME']} (${this.curentUser['CLASSIF_NAME']})`;
        }
    }
    setVision(flag?) {
        if (flag) {
            this.type = 'text';
        } else {
            this.type1 = 'text';
        }
    }
    resetVision(flag?) {
        if (flag) {
            this.type = 'password';
        } else {
            this.type1 = 'password';
        }
    }
    formUpdate(flag: boolean) {
        if (flag) {
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).disable({emitEvent: false});
            });
        } else {
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).enable({emitEvent: false});
            });
        }
    }
    edit($event) {
        this.formUpdate(false);
        this.editMode = true;
    }
    cancel($event) {
        this.editMode = false;
        this.isLoading = false;
        this.editMode = !this.editMode;
        this.cancelValues(this.inputs, this.form);
        this.autentif.nativeElement.disabled = true;
        /* this._pushState(); */
        this.formUpdate(true);
    }
    submit($event) {
        const value = +this.form.get('SELECT_AUTENT').value;
        if (this.errorPass && (value === 0 || value === 2)) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: 'Нельзя сохранить несовпадающие пароли',
                dismissOnTimeout: 6000,
            });
            return ;
        }
        this.isLoading = true;
        const promAll = [];
        promAll.push(this.updateUser(this._userParamSrv.userContextId, {'USERTYPE': value}));
        if (value === 0 || value === 2) {
            promAll.push(this.changePassword(this.form.get('pass').value, this._userParamSrv.userContextId));
        }
        Promise.all(promAll)
        .then((arr) => {
            this.formUpdate(true);
            this.cancelValues(this.inputs, this.form);
            this.isLoading = false;
            this.editMode = false;
        })
        .catch((arr) => {
            this._errorSrv.errorHandler('Ошибка сохранения');
            /* this.cancelValues(this.inputs, this.form); */
            this.isLoading = false;
        });
    }

    cancelValues(inputs, form: FormGroup) {
        form.controls['pass'].patchValue(inputs['pass'].value, { emitEvent: false });
        form.controls['passRepeated'].patchValue(inputs['passRepeated'].value, { emitEvent: false });
        form.controls['ID_USER'].patchValue(inputs['ID_USER'].value, { emitEvent: false });
    }

    checkChangeForm(data): void {
        this.checkchangPass(data['pass'], data['passRepeated']);
    }

    getPassDate(): boolean {
        const value = '' + this.form.get('SELECT_AUTENT').value;
        if (value === '0' || value === '3') {
            return true;
        }
        this.cancelValues(this.inputs, this.form);
        return false;
    }


    private checkchangPass(pass, passrepeat) {
        this.checkPass = ''; // pass !== '' ? this._userParamSrv.checkPasswordСonditions(pass) : '';
        if (this.checkPass !== '') {
            this.form.get('pass').setErrors({ repeat: true });
        }
        if (pass !== '' && passrepeat !== '') {
            this.errorPass = pass !== passrepeat;
            if (this.errorPass) {
                this.form.get('passRepeated').setErrors({ repeat: true });
            } else {
                this.errorPass = false;
            }
        } else if (pass !== '' || passrepeat !== '') {
            this.errorPass = true;
        } else {
            this.errorPass = false;
        }
    }

    private updateUser(id: number, newD): Promise<any> {
        const query = [];
        query.push({
            method: 'MERGE',
            requestUri: `USER_CL(${id})`,
            data: newD
        });
        return this.apiSrvRx.batch(query, '');
    }

    private changePassword(pass, id): Promise<any> {
        const url = `ChangePassword?isn_user=${id}&pass='${encodeURI(pass)}'`;
        return this.apiSrvRx.read({ [url]: ALL_ROWS });
    }
}
