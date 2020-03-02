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
    public queryAll: any = {};
    public newLogin: boolean = false;
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
        /* this.apiSrvRx.read({REGION_CL: {
            criteries: {
                CODE: 1,
                CLASSIF_NAME: '1',
                COD_OKATO: '01',
            }
        }}) */
        this.isLoading = true;
        this.inputFields = AUNTEFICATION_CONTROL_INPUT;
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, !this.editMode);
        this.init();
        this.formUpdate(!this.editMode);
    }

    init() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this.curentUser = this._userParamSrv.curentUser;
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
                        if (elem.PARM_NAME === 'PASS_DATE') {
                            this.passDate = Number(elem.PARM_VALUE);
                        }
                        const d = new Date();
                    let check_date;
                    if (this.paramsChengePass) {
                        if (this.passDate !== 0) {
                            check_date = new Date(d.setDate(d.getDate() + this.passDate));
                        } else {
                            check_date = '';
                        }
                    } else {
                        check_date =  new Date(d.setDate(d.getDate() - 1));
                    }
                    const date_new = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) :
                        this.curentUser.IS_PASSWORD === 0 ? check_date : '';
                    this.form.controls['PASSWORD_DATE'].setValue( date_new, { emitEvent: false });
                    });
                })
                .catch(er => {
                    console.log('ER', er);
                });
                this.originAutent = '' + this.curentUser.USERTYPE;
                this.form.controls['SELECT_AUTENT'].setValue( '' + this.curentUser.USERTYPE, { emitEvent: false });
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
        this.form.get('pass').valueChanges
        .pipe(
            takeUntil(this._ngUnsubscribe)
        ).subscribe(() => {
            this.dateDisable();
        });
        this.form.get('passRepeated').valueChanges
        .pipe(
            takeUntil(this._ngUnsubscribe)
        ).subscribe(() => {
            this.dateDisable();
        });
    }
    getEditDate(): boolean {
        const provElem = !this.form.controls['PASSWORD_DATE'].value;
        // если мы начали менять пароль при необходимости задизейбли
        if (this.newLogin) {
            return true;
        }
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
        if (this.form.get('SELECT_AUTENT').value === '0' || this.form.get('SELECT_AUTENT').value === '3') {
            // пока не понял при каких случаях оно нужно
            /* if (!this.paramsChengePass) {
                this.updateDataSysParam();
            } */
        }
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
                if (this.form.get(key)) {
                    this.form.get(key).disable({emitEvent: false});
                }
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
        if (this.provUpdateDate() && !this.form.get('pass').value ) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: 'Дату смены пароля, установленного пользователем, можно только уменьшить',
                dismissOnTimeout: 6000,
            });
            return ;
        }
        this.isLoading = true;
        const promAll = [];
        let flag = false;
        // в случае если меняется или создаётся пароль, то тогда нужно изменять другие параметры только после смены пароля
        if ((value === 0 || value === 3) && this.form.get('pass').value) {
            promAll.push(this.createOrChengePass());
            this.newLogin = false;
            flag = true;
            if (this.paramsChengePass && this.checkUpdateDate()) {
                flag = false;
                this.getQueryDate(true);
            }
        }
        Promise.all(promAll)
        .then((arr) => {
            if (flag) {
                this.curentUser.IS_PASSWORD = 1;
                this.updateDataSysParam();
            }
            // если был изменён пароль то мы не изменяем дату
            const flag_d = flag ? false : this.checkUpdateDate();
            const flag_t = this.checkUpdateUserType(value);
            if (flag_d || flag_t) {
                this.getQueryDate(flag_d);
                this.getQueryUserType(value, flag_t);
            }
            if (Object.keys(this.queryAll).length > 0) {
                this.updateUser(this._userParamSrv.userContextId, this.queryAll)
                .then(() => {
                    this.queryAll = {};
                })
                .catch(er => {
                    console.log('er', er);
                });
            }
            this.isLoading = false;
            this.originAutent = this.form.get('SELECT_AUTENT').value;
            this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
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
    }

    getQueryUserType(value, flag) {
        // возвращает запрос на изменение или же отсутсвие изменений
        if (flag) {
            if (value === 1) {
                this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
                this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
                this.queryAll['USERTYPE'] = value;
                this.queryAll['PASSWORD_DATE'] = null;
            } else {
                this.queryAll['USERTYPE'] = value;
            }
        }
    }

    provUpdateDate() {
        // проверка можно ли изменить дату
        if (this.curentUser.IS_PASSWORD === 2 && this.passDate !== 0) {
            if (new Date(this.form.controls['PASSWORD_DATE'].value) > new Date(this.curentUser.PASSWORD_DATE) || !this.form.controls['PASSWORD_DATE'].value) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    getQueryDate(flag): any {
        // возвращает запрос на изменение или же отсутсвие изменений
        const data = this.getNewDate();
        if (flag && data !== '') {
            this.queryAll['PASSWORD_DATE'] = data;
        }
        return null;
    }
    checkUpdateDate() {
        // проверка была ли изменена дата
        const cur_date = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) : '';
        return (String(this.form.controls['PASSWORD_DATE'].value) !== String(cur_date));
    }
    checkUpdateUserType(value) {
        // проверка был ли изменён тип пользователя
        return this.curentUser.USERTYPE !== value;
    }
    getNewDate() {
        // параметр который говорит о возможности изменения пароля пользователем this.paramsChengePass
        if (!this.paramsChengePass || this.checkUpdateDate()) {
            const n_d = this.form.controls['PASSWORD_DATE'].value ? new Date(this.form.controls['PASSWORD_DATE'].value) : null;
            if (!n_d) {
                return null;
            }
            let month: string = String(n_d.getMonth() + 1);
            month = month.length === 1 ? '0' + month : month;
            return `${n_d.getFullYear()}-${month}-${n_d.getDate()}T00:00:00`;
        } else {
            const d = new Date();
            if (this.passDate !== 0 ) {
                this.form.controls['PASSWORD_DATE'].setValue( new Date(d.setDate(d.getDate() + this.passDate)), { emitEvent: false });
            } else {
                this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
            }
        }
        return '';
    }
    updateDataSysParam(flag?: boolean) {
        const d = new Date();
        if (this.paramsChengePass) {
            if (this.passDate !== 0 ) {
                this.form.controls['PASSWORD_DATE'].setValue( new Date(d.setDate(d.getDate() + this.passDate)), { emitEvent: false });
            } else {
                this.form.controls['PASSWORD_DATE'].setValue(' ', { emitEvent: false });
            }
        } else {
            this.newLogin = true;
            this.form.controls['PASSWORD_DATE'].setValue( new Date(d.setDate(d.getDate() - 1)), { emitEvent: false });
        }
        if (!flag) {
            this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
        }
    }
    createOrChengePass(): Promise<any> {
        if (this.form.get('pass').value) {
            if (this.curentUser.IS_PASSWORD === 0) {
                return this.createLogin(this.form.get('pass').value, this._userParamSrv.userContextId);
            } else {
                return this.changePassword(this.form.get('pass').value, this._userParamSrv.userContextId);
            }
        }
        return Promise.resolve();
    }
    cancelDate() {
        if (this.form.controls['PASSWORD_DATE'].value !== new Date(this.curentUser.PASSWORD_DATE)) {
            let check_date;
            const d = new Date();
            if (this.paramsChengePass) {
                if (this.passDate !== 0) {
                    check_date = new Date(d.setDate(d.getDate() + this.passDate));
                } else {
                    check_date = '';
                }
            } else {
                check_date =  new Date(d.setDate(d.getDate() - 1));
            }
            const date_new = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) :
                this.curentUser.IS_PASSWORD === 0 ? check_date : '';
            this.form.controls['PASSWORD_DATE'].patchValue(date_new, { emitEvent: false });
        }
        this.newLogin = false;
    }
    cancelValues(inputs, form: FormGroup) {
        form.controls['pass'].patchValue(inputs['pass'].value, { emitEvent: false });
        form.controls['passRepeated'].patchValue(inputs['passRepeated'].value, { emitEvent: false });
        form.controls['ID_USER'].patchValue(inputs['ID_USER'].value, { emitEvent: false });
        this.cancelDate();
    }

    checkChangeForm(data): void {
        this.checkchangPass(data['pass'], data['passRepeated']);
    }
    dateDisable() {
        if (this.form.get('pass').value || this.form.get('passRepeated').value) {
            // меняем дату не обновляя в curentUser
            this.updateDataSysParam(true);
        } else {
            this.cancelDate();
        }
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
