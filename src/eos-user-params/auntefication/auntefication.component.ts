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
import { USER_PARMS } from 'eos-rest';

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
    public originAutent: string = '0';
    public type: string = 'password';
    public type1: string = 'password';
    public editMode: boolean = false;
    public masDisabled: string[];
    public titleHeader: string;
    public inputsInfo: any;
    public inputs;
    public _descSrv;
    public form: FormGroup;
    public storeParams = new Set();
    public errorPass: boolean = false;
    public disableSave: boolean = false;
    public updateData: boolean = false;
    public paramsChengePass: boolean = false;
    public passDate: number = 0;
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
                const req = {
                    USER_PARMS: {
                        criteries: {
                            ISN_USER_OWNER: '-99',
                            PARM_NAME: 'SUPPORTED_USER_TYPES||CHANGE_PASS||PASS_DATE'
                        }}};
                this.apiSrvRx.read<USER_PARMS>(req)
                .then(param => {
                    param.forEach(elem => {
                        if (elem.PARM_NAME === 'SUPPORTED_USER_TYPES') {
                            this.masDisabled = elem.PARM_VALUE.split(',');
                        }
                        if (elem.PARM_NAME === 'CHANGE_PASS') {
                            this.paramsChengePass = elem.PARM_VALUE === 'YES' ? true : false;
                        }
                        if (elem.PARM_NAME === 'PASS_DATE' && this.paramsChengePass) {
                            this.passDate = Number(elem.PARM_VALUE);
                        }
                    });
                })
                .catch(er => {
                    console.log('ER', er);
                });
                this.curentUser = this._userParamSrv.curentUser;
                const d = new Date();
                const date_new = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) :
                    this.curentUser.IS_PASSWORD === 0 ? new Date(d.setDate(d.getDate() - 1)) : '';
                this.originAutent = '' + this.curentUser.USERTYPE;
                this.form.controls['SELECT_AUTENT'].setValue( '' + this.curentUser.USERTYPE, { emitEvent: false });
                this.form.controls['PASSWORD_DATE'].setValue( date_new, { emitEvent: false });
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
            this.checkUpdate();
        });
    }
    getEditDate(): boolean {
        const provElem = !this.curentUser.PASSWORD_DATE;
        if (this.paramsChengePass || (this.curentUser && this.curentUser.IS_PASSWORD === 2) || provElem) {
            return false;
        }
        return true;
    }
    checkUpdate() {
        if (this.originAutent !== this.form.get('SELECT_AUTENT').value || ( this.form.controls['pass'].value || this.form.controls['pass'].value)) {
            this._pushState(true);
            this.updateData = true;
        } else {
            this._pushState(false);
            this.updateData = false;
        }
    }

    returnEdit() {
        return !this.editMode;
    }
    optionDisable(num: number) {
        if (this.masDisabled && this.masDisabled.indexOf(String(num)) === -1) { // блокируем кнопки к которым не должно быть доступа
            return true;
        }
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
        this.autentif.nativeElement.disabled = false;
        this.formUpdate(false);
        this.editMode = true;
    }
    optionSelected(num: number) {
        if (num === +this.form.get('SELECT_AUTENT').value) {
            return true;
        } else {
            return false;
        }
    }
    cancel($event) {
        this.editMode = false;
        this.isLoading = false;
        this.cancelValues(this.inputs, this.form);
        this.autentif.nativeElement.disabled = true;
        this.form.get('SELECT_AUTENT').patchValue(this.originAutent);
        this.autentif.nativeElement.value = this.originAutent;
        /* this._pushState(); */
        this.formUpdate(true);
        this._pushState(false);
    }
    submit($event) {
        const value = +this.form.get('SELECT_AUTENT').value;
        if (this.errorPass && (value === 0 || value === 3)) {
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
        let flag = false;
        let flagDate = false;
        // в случае если меняется или создаётся пароль, то тогда нужно изменять другие параметры только после смены пароля
        if (value === 0 || value === 3) {
            if (this.form.get('pass').value) {
                if (this.curentUser.IS_PASSWORD === 0) {
                    promAll.push(this.createLogin(this.form.get('pass').value, this._userParamSrv.userContextId));
                    flag = true;
                } else {
                    promAll.push(this.changePassword(this.form.get('pass').value, this._userParamSrv.userContextId));
                    flag = true;
                }
            }
        }
        const n_d = this.form.controls['PASSWORD_DATE'].value ? new Date(this.form.controls['PASSWORD_DATE'].value) : null;
        if (!flag && n_d && String(this.form.controls['PASSWORD_DATE'].value) !== String(new Date(this.curentUser.PASSWORD_DATE))) {
            flagDate = true;
            let month: string = String(n_d.getMonth() + 1);
            month = month.length === 1 ? '0' + month : month;
            promAll.push(this.updateUser(this._userParamSrv.userContextId, {'PASSWORD_DATE': `${n_d.getFullYear()}-${month}-${n_d.getDate()}T00:00:00`}));
        }
        if (!flag && this.updateData && this.curentUser.USERTYPE !== value) {
            const query = value === 1 ? {'USERTYPE': value, 'PASSWORD_DATE': null} : {'USERTYPE': value};
            if (value === 1) {
                this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
                this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
            }
            promAll.push(this.updateUser(this._userParamSrv.userContextId, query));
        }
        if (promAll.length > 0) {
            Promise.all(promAll)
            .then((arr) => {
                if (flag && this.updateData && this.curentUser.USERTYPE !== value) {
                    const query = value === 1 ? {'USERTYPE': value, 'PASSWORD_DATE': null} : {'USERTYPE': value};
                    if ( value === 1) {
                        this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
                        this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
                    }
                    this.updateUser(this._userParamSrv.userContextId, query)
                    .catch(Er => { console.log('Er', Er); });
                }
                const d = new Date();
                if (value !== 1) {
                    if (this.paramsChengePass && n_d && String(this.form.controls['PASSWORD_DATE'].value) !== String(new Date(this.curentUser.PASSWORD_DATE))) {
                        flagDate = true;
                        let month: string = String(n_d.getMonth() + 1);
                        month = month.length === 1 ? '0' + month : month;
                        this.updateUser(this._userParamSrv.userContextId, {'PASSWORD_DATE': `${n_d.getFullYear()}-${month}-${n_d.getDate()}T00:00:00`})
                        .then(elem => {
                            this.form.controls['PASSWORD_DATE'].setValue(new Date(`${n_d.getDate()}.${month}.${n_d.getFullYear()}`), { emitEvent: false });
                            this.isLoading = false;
                            this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
                        });
                    } else {
                        this.isLoading = false;
                        if (flag) {
                            this.curentUser.IS_PASSWORD = 1;
                            if (this.paramsChengePass) {
                                if (this.passDate !== 0 ) {
                                    this.form.controls['PASSWORD_DATE'].setValue( new Date(d.setDate(d.getDate() + this.passDate)), { emitEvent: false });
                                } else {
                                    this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
                                }
                            } else {
                                this.form.controls['PASSWORD_DATE'].setValue( new Date(d.setDate(d.getDate() - 1)), { emitEvent: false });
                            }
                            this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
                        }
                    }
                } else {
                    this.isLoading = false;
                }
                this.originAutent = this.form.get('SELECT_AUTENT').value;
                if (flagDate) {
                    this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
                }
                this.curentUser.USERTYPE = value;
                this.formUpdate(true);
                this.cancelValues(this.inputs, this.form);
                this.editMode = false;
                this._msgSrv.addNewMessage({
                    type: 'success',
                    title: 'Сохранение:',
                    msg: 'Изменения успешно сохранены',
                    dismissOnTimeout: 6000,
                });
                this._pushState(false);
            })
            .catch((arr) => {
                this._errorSrv.errorHandler(arr);
                /* this.cancelValues(this.inputs, this.form); */
                this.isLoading = false;
            });
        } else {
            this.cancelValues(this.inputs, this.form);
            this.formUpdate(true);
            this.editMode = false;
            this.isLoading = false;
            this._pushState(false);
        }
    }

    cancelValues(inputs, form: FormGroup) {
        form.controls['pass'].patchValue(inputs['pass'].value, { emitEvent: false });
        form.controls['passRepeated'].patchValue(inputs['passRepeated'].value, { emitEvent: false });
        form.controls['ID_USER'].patchValue(inputs['ID_USER'].value, { emitEvent: false });
        if (this.form.controls['PASSWORD_DATE'].value !== new Date(this.curentUser.PASSWORD_DATE)) {
            const d = new Date();
            const date_new = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) :
                this.curentUser.IS_PASSWORD === 0 ? new Date(d.setDate(d.getDate() - 1)) : '';
            form.controls['PASSWORD_DATE'].patchValue(date_new, { emitEvent: false });
        }
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
                this.form.get('passRepeated').setErrors(null);
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
    private createLogin(pass, id): Promise<any> {
        const url = `CreateLogin?pass='${encodeURI(pass)}'&isn_user=${id}`;
        return this.apiSrvRx.read({ [url]: ALL_ROWS });
    }
    private _pushState(date) {
        this._userParamSrv.setChangeState({ isChange: date });
    }
}
