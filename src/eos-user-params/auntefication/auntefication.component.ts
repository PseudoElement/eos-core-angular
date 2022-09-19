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
import { AppContext } from 'eos-rest/services/appContext.service';
import { ESIA_AUTH_PARM_VALUE } from 'eos-parameters/parametersSystem/shared/consts/auth-consts';
import { /* Router, */ RouterStateSnapshot } from '@angular/router';

// Input, Output, EventEmitter
@Component({
    selector: 'eos-auntefication-component',
    styleUrls: ['auntefication.component.scss'],
    templateUrl: 'auntefication.component.html'
})
export class AutenteficationComponent implements OnInit, OnDestroy {

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
    public maxLoginLength: string;
    public esiaExternalAuth: number = 0;
    inputFields: IInputParamControl[];
    public externalOrig: any;
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    get checkCurrentUser() {
        if (this.form) {
            if (this.form.controls['SELECT_AUTENT'].value === '1' && this._appCtx.CurrentUser.CLASSIF_NAME === this.curentUser.CLASSIF_NAME) {
                return true;
            }
            return false;
        }
        return false;
    }
    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _userParamSrv: UserParamsService,
        private apiSrvRx: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _msgSrv: EosMessageService,
        private _appCtx: AppContext,
        // private _router: Router,
    ) {
        this.inputFields = AUNTEFICATION_CONTROL_INPUT;
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, !this.editMode);
        this.subscribeForms();
    }
    ngOnInit() {
        this.isLoading = true;
        this.init();
    }

    get hiddenWithoutEnter() {
        return this.form.get('SELECT_AUTENT').value !== '-1';
    }

    get validClassif() {
        const val = this.form.controls['CLASSIF_NAME'].errors;
        if (val !== null) {
            if (val.required) {
                return 'Поле логин не может быть пустым';
            } else if (val.isUnique) {
                return 'Поле логин должно быть уникальным';
            } else {
                return 'Некорректное значение логина';
            }
        }
        return null;
    }
    viewOptions(value: number): boolean {
        return this.curentUser.USERTYPE === value || !this.optionDisable(value);
    }

    getUserExternal(): Promise<any> {
        return this.apiSrvRx.read<any>({
            USER_AUTH_EXTERNAL_ID: {
                criteries: {
                    ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                }
            },
        });
    }

    getUserParams(): Promise<any> {
        const req = {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99',
                    PARM_NAME: 'SUPPORTED_USER_TYPES||CHANGE_PASS||PASS_DATE||EXTERNAL_AUTH_ADD||ALLOWED_EXTERNAL_AUTH'
                }
            }
        };

        return this.apiSrvRx.read<USER_PARMS>(req);
    }

    init() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this.curentUser = this._userParamSrv.curentUser;
                this.getUserParams()
                    .then((param) => {
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
                            if (elem.PARM_NAME === 'ALLOWED_EXTERNAL_AUTH' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf(ESIA_AUTH_PARM_VALUE) !== -1) {
                                this.esiaExternalAuth++;
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
                                check_date = new Date(d.setDate(d.getDate() - 1));
                            }
                            const date_new = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) :
                                this.curentUser.IS_PASSWORD === 0 ? check_date : '';
                            this.form.controls['PASSWORD_DATE'].setValue(date_new, { emitEvent: false });
                        });
                        if (this.esiaExternalAuth) {
                            this.getUserExternal()
                                .then((external) => {
                                    if (external.length) {
                                        this.externalOrig = external[0];
                                        this.form.controls['EXTERNAL_ID'].setValue(this.externalOrig['EXTERNAL_ID'], { emitEvent: false });
                                        this.form.controls['EXTERNAL_TYPE'].setValue(this.externalOrig['EXTERNAL_TYPE'], { emitEvent: false });
                                    }
                                });
                        }

                    })
                    .catch(er => {
                        console.log('ER', er);
                    });
                this.originAutent = '' + this.curentUser.USERTYPE;
                if (this.originAutent) {
                    this.form.controls['SELECT_AUTENT'].setValue(this.originAutent, { emitEvent: false });
                } else {
                    this.form.controls['SELECT_AUTENT'].setValue('-1', { emitEvent: false });
                }
                this.form.controls['pass'].setValue('', { emitEvent: false });
                this.form.controls['passRepeated'].setValue('', { emitEvent: false });
                // this.form.controls['SELECT_AUTENT'].setValue('' + this.curentUser.USERTYPE, { emitEvent: false });
                this.form.controls['CLASSIF_NAME'].setValue('' + this.curentUser['CLASSIF_NAME'], { emitEvent: false });
                const autent = this.form.get('SELECT_AUTENT').value;
                this.maxLoginLength = autent === 0 ? '12' : '64';
                this.getTitle();
                this.editMode = false;
                this.formUpdate(!this.editMode);
                this.isLoading = false;
                this._pushState(false);
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
            this.getLoginChenge(!this.editMode);
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
        /* this.form.get('CLASSIF_NAME').valueChanges
        .pipe(
            takeUntil(this._ngUnsubscribe)
        ).subscribe(() => {
            this.getErrorSave();
        }); */
        this._userParamSrv.canDeactivateSubmit$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe((rout: RouterStateSnapshot) => {
                this._userParamSrv.submitSave = this.preSubmit(true);
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
        if (this.originAutent !== this.form.get('SELECT_AUTENT').value ||
            (this.form.controls['pass'].value || this.form.controls['pass'].value) ||
            (this.curentUser.CLASSIF_NAME !== this.form.controls['CLASSIF_NAME'].value)) {
            this._pushState(true);
            this.updateData = true;
        } else {
            this._pushState(false);
            this.updateData = false;
        }
    }
    disableLogin() {
        if (this.form.get('SELECT_AUTENT').value === '1') {
            return false;
        } else {
            if (this.curentUser.IS_PASSWORD === 0) {
                return true;
            } else {
                return false;
            }
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
        const autent = this.form.get('SELECT_AUTENT').value;
        this.maxLoginLength = autent === 0 ? '12' : '64';

        // if (this.originAutent === autent) {
        //     this.form.controls['CLASSIF_NAME'].setValue('' + this.curentUser['CLASSIF_NAME']);
        // } else {
        //     this.form.controls['CLASSIF_NAME'].setValue('');
        // }
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
                    this.form.get(key).disable({ emitEvent: false });
                }
            });
        } else {
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).enable({ emitEvent: false });
            });
        }
        this.getLoginChenge(flag);
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
        if (this.originAutent) {
            this.form.controls['SELECT_AUTENT'].setValue(this.originAutent, { emitEvent: false });
        } else {
            this.form.controls['SELECT_AUTENT'].setValue('-1', { emitEvent: false });
        }
        this.form.controls['CLASSIF_NAME'].setValue('' + this.curentUser['CLASSIF_NAME']);
        // this.form.get('SELECT_AUTENT').patchValue(this.originAutent);
        this.autentif.nativeElement.value = this.originAutent;
        /* this._pushState(); */
        this.formUpdate(true);
        this._pushState(false);
    }
    getLoginChenge(flag) {
        if (/* this.curentUser.IS_PASSWORD === 0 ||  */flag) {
            this.form.controls['CLASSIF_NAME'].disable({ emitEvent: false });
            return true;
        } else {
            this.form.controls['CLASSIF_NAME'].enable({ emitEvent: false });
        }
        return false;
    }
    chengeForElemUser(): Promise<any> {
        if (+this.curentUser.USERTYPE === 1) {
            return Promise.resolve(null);
        } else {
            if (+this.curentUser.USERTYPE === 0) {
                return this.dropLogin().then(() => {
                    return this.createLogin('1234', this._userParamSrv.userContextId);
                });
            } else {
                return this.changePassword('1234', this._userParamSrv.userContextId);
            }
        }
    }
    /**Проверяем заполнены ли все поля*/
    externalTypeIsEmpty(): boolean {
        const type = this.form.controls['EXTERNAL_TYPE'].value;
        const id = this.form.controls['EXTERNAL_ID'].value;
        return id && (!type || type === '0') || !id && type && type !== '0';
    }
    /**проверяем изменения полей Esia*/
    externalIsChanged(): boolean {
        const curType = this.form.controls['EXTERNAL_TYPE'].value;
        const curId = this.form.controls['EXTERNAL_ID'].value;
        if (this.externalOrig) {
            return this.externalOrig['EXTERNAL_ID'] !== curId || this.externalOrig['EXTERNAL_TYPE'] !== curType;
        } else {
            return !!curId && !!curType;
        }

    }
    /**Создаем запрос на удаление/добавления/редактирование*/
    writeOrDeleteExternalId(isn: number): Promise<any> {
        if (this.form.controls['EXTERNAL_TYPE'].value !== '0') {
            const type = this.form.controls['EXTERNAL_TYPE'].value;
            const id = this.form.controls['EXTERNAL_ID'].value;
            const method = !this.externalOrig ? 'POST' : 'MERGE';
            const methodUri = method === 'POST' ? `USER_AUTH_EXTERNAL_ID_List` : `USER_AUTH_EXTERNAL_ID_List(${this.externalOrig['ISN_EXTERNAL_ID']})`;
            return this.apiSrvRx.batch([{
                method,
                requestUri: `USER_CL(${isn})/${methodUri}`,
                data: {
                    'ISN_LCLASSIF': isn, 'EXTERNAL_TYPE': type, 'EXTERNAL_ID': id
                }
            }], '');
        } else {
            return this.apiSrvRx.batch([{
                method: 'DELETE',
                requestUri: `USER_CL(${isn})/USER_AUTH_EXTERNAL_ID_List(${this.externalOrig['ISN_EXTERNAL_ID']})`,
            }], '');
        }
    }

    afterSuccessSubmit(flagRout?) {
        this._alertMessage('Изменения сохранены', true);
        if (!flagRout) {  // если сохранение идёт перед переходом то перечитывать данные не нужно
            // this.ngOnDestroy();
            this.ngOnInit();
        }
    }
    /**Сохранение полей ESIA*/
    saveExternal(flagRout?): Promise<any> {
        if (this.externalIsChanged()) {
            return this.writeOrDeleteExternalId(this.curentUser.ISN_LCLASSIF).then(() => {
                this.afterSuccessSubmit(flagRout);
            }).catch(er => {
                this._errorSrv.errorHandler(er);
            });
        } else {
            this.afterSuccessSubmit(flagRout);
        }
    }

    preSubmit($event?): Promise<any> {
        // const url = `DropLogin?isn_user=${this._userParamSrv.userContextId}`;
        // const url = `ChangePassword?isn_user=${this._userParamSrv.userContextId}&pass='${encodeURI('1234')}'`;
        if (this.form.status === 'INVALID' || this.form.controls['CLASSIF_NAME'].value === '' || this.checkCurrentUser || this.errorPass) {
            this._alertMessage('Невозможно сохранить некорректные данные');
            return Promise.resolve('error');
        }
        if (this.externalTypeIsEmpty()) {
            const field = this.form.controls['EXTERNAL_ID'].value ? 'Тип идентификатора' : 'Идентификатор ЕСИА';
            alert(`Поле "${field}" обязательно для заполнения`);
            return Promise.resolve('error');
        }
        return this.apiSrvRx.read({
            USER_CL: {
                criteries: {
                    CLASSIF_NAME: this.form.controls['CLASSIF_NAME'].value // isnull(выборка по null), isnotnull(не null)
                },
            }
        })
            .then(ans => {
                const full = ans.filter(elem =>
                    elem['CLASSIF_NAME'].toUpperCase() === this.form.controls['CLASSIF_NAME'].value.toUpperCase() &&
                    elem['ISN_LCLASSIF'] !== this.curentUser['ISN_LCLASSIF']
                );
                if (full.length > 0) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Сохранение:',
                        msg: 'Пользователь с идентификатором \"' + this.form.controls['CLASSIF_NAME'].value + '\" уже существует.',
                        dismissOnTimeout: 6000,
                    });
                    return Promise.resolve('error');
                }
                const userType = this.form.get('SELECT_AUTENT') &&
                    String(this.form.get('SELECT_AUTENT').value || '-1') || '-1';
                const userPassword = this.form.get('pass') &&
                    String(this.form.get('pass').value || '');
                const userLogin = this.form.get('CLASSIF_NAME') &&
                    String(this.form.get('CLASSIF_NAME').value || '');
                if (this._newDataCheck(userType, userPassword, userLogin)) {
                    switch (userType) {
                        case '0': {
                            return this.saveZeroType(userType, userPassword, userLogin, $event);
                            /* break; */
                        }
                        case '-1': {
                            //  this.saveMinusFirstType(userType, userLogin);
                            // this.ngOnDestroy();
                            if (!$event) {
                                this.ngOnInit();
                            }
                            break;
                        }
                        case '1': {
                            this.saveFirstType(userType, userLogin, $event);
                            break;
                        }
                        case '2': {
                            this.saveSecondType(userType, userLogin, $event);
                            break;
                        }
                        case '3': {
                            this.saveThirdType(userType, userPassword, userLogin, $event);
                            break;
                        }
                        case '4': {
                            this.saveFourthType(userType, userLogin, $event);
                            break;
                        }
                    }
                } else if (this.externalIsChanged()) {
                    this.writeOrDeleteExternalId(this.curentUser.ISN_LCLASSIF).then(() => {
                        this.afterSuccessSubmit($event);
                    }).catch(er => {
                        this._errorSrv.errorHandler(er);
                    });
                } else {
                    this.editMode = false;
                    this.formUpdate(!this.editMode);
                }
            })
            .catch(er => {
                this._errorSrv.errorHandler(er);
            });
    }

    saveZeroType(userType, userPassword, userLogin, flagRout): Promise<any> {
        if (!userPassword) {
            if (this.checkUpdateDate()) {
                if (this.provUpdateDate()) { // Имя/пароль в БД
                    this._alertMessage('Дату смены пароля, установленного пользователем, можно только уменьшить');
                    return Promise.resolve('error');
                }
                // сохранить дату
                let date = this.getNewDate();
                if (date instanceof Date) {
                    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
                }
                return this.updateUser(this._userParamSrv.userContextId, { 'PASSWORD_DATE': date }).then(() => {
                     return this.saveExternal(flagRout);
                }).catch(e => {
                    this.cancel(null);
                    this._errorSrv.errorHandler(e);
                });
            } else {
                this._alertMessage('Необходимо ввести пароль');
                return Promise.resolve('error');
            }
        }
        return this._createUrlChangeLOgin({ userType, userPassword, userLogin }).then(() => {
            return this.saveExternal(flagRout);
            /* if (this.checkUpdateDate()) {
                // сохранить дату
                let date = this.getNewDate();
                if (date instanceof Date) {
                    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
                }
                return this.updateUser(this._userParamSrv.userContextId, { 'PASSWORD_DATE': date }).then(() => {
                    return this.saveExternal(flagRout);
                });
            } else {
                return this.saveExternal(flagRout);
            } */
        }).catch(() => { });
    }

    saveMinusFirstType(userType, userLogin) {
        this._createUrlChangeLOgin({ userType, userLogin }).then(() => {
            this.saveExternal();
        }).catch(() => { });
    }

    saveFirstType(userType, userLogin, flagRout) {
        if (userLogin.indexOf('\\') >= 0) {
            this._createUrlChangeLOgin({ userType, userLogin }).then(() => {
                this.saveExternal(flagRout);
            }).catch(() => { });
        } else {
            this._alertMessage('Имя пользователя не соответствует шаблону для ОС-авторизации.');
        }
    }

    saveSecondType(userType, userLogin, flagRout) {
        this._createUrlChangeLOgin({ userType, userLogin }).then(() => {
            this.saveExternal(flagRout);
        }).catch(() => { });
    }

    saveThirdType(userType, userPassword, userLogin, flagRout) {
        if (!userPassword) {
            if (this.checkUpdateDate()) {
                if (this.provUpdateDate()) { // Имя/пароль
                    this._alertMessage('Дату смены пароля, установленного пользователем, можно только уменьшить');
                    return;
                }
                // сохранить дату
                let date = this.getNewDate();
                if (date instanceof Date) {
                    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
                }
                return this.updateUser(this._userParamSrv.userContextId, { 'PASSWORD_DATE': date }).then(() => {
                    return this.saveExternal(flagRout);
                }).catch(e => {
                    this.cancel(null);
                    this._errorSrv.errorHandler(e);
                });
            } else {
                this._alertMessage('Необходимо ввести пароль');
                return Promise.resolve('error');
            }
        }
        return this._createUrlChangeLOgin({ userType, userPassword, userLogin }).then(() => {
            return this.saveExternal(flagRout);
            /* if (this.checkUpdateDate()) {
                // сохранить дату
                let date = this.getNewDate();
                if (date instanceof Date) {
                    date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON();
                }
                this.updateUser(this._userParamSrv.userContextId, { 'PASSWORD_DATE': date }).then(() => {
                    this.saveExternal(flagRout);
                }).catch(e => {
                    this.cancel(null);
                    this._errorSrv.errorHandler(e);
                });
            } else {
                this.saveExternal(flagRout);
            } */
        }).catch(() => { });
    }

    saveFourthType(userType, userLogin, flagRout) {
        this._createUrlChangeLOgin({ userType, userLogin }).then(() => {
            this.saveExternal(flagRout);
        }).catch(() => { });
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
    checkUpdateDate() {
        // проверка была ли изменена дата
        const cur_date = this.curentUser.PASSWORD_DATE ? new Date(this.curentUser.PASSWORD_DATE) : '';
        return (String(this.form.controls['PASSWORD_DATE'].value) !== String(cur_date));
    }
    getNewDate() {
        // параметр который говорит о возможности изменения пароля пользователем this.paramsChengePass
        if (!this.paramsChengePass || this.checkUpdateDate()) {
            const n_d = this.form.controls['PASSWORD_DATE'].value ? new Date(this.form.controls['PASSWORD_DATE'].value) : null;
            if (!n_d) {
                return null;
            }

            return n_d;
        } else {
            const d = new Date();
            if (this.passDate !== 0) {
                this.form.controls['PASSWORD_DATE'].setValue(new Date(d.setDate(d.getDate() + this.passDate)), { emitEvent: false });
            } else {
                this.form.controls['PASSWORD_DATE'].setValue('', { emitEvent: false });
            }
        }
        return '';
    }
    updateDataSysParam(flag?: boolean) {
        const d = new Date();
        if (this.paramsChengePass) {
            if (this.passDate !== 0) {
                this.form.controls['PASSWORD_DATE'].setValue(new Date(d.setDate(d.getDate() + this.passDate)), { emitEvent: false });
            } else {
                // this.form.controls['PASSWORD_DATE'].setValue(' ', { emitEvent: false });
            }
        } else {
            this.newLogin = true;
            this.form.controls['PASSWORD_DATE'].setValue(new Date(d.setDate(d.getDate() - 1)), { emitEvent: false });
        }
        if (!flag) {
            this.curentUser.PASSWORD_DATE = this.form.controls['PASSWORD_DATE'].value;
        }
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
                check_date = new Date(d.setDate(d.getDate() - 1));
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
    private dropLogin(): Promise<any> {
        if (this.curentUser.IS_PASSWORD === 0) {
            return Promise.resolve(null);
        } else {
            const url = `DropLogin?isn_user=${this._userParamSrv.userContextId}`;
            return this.apiSrvRx.read({ [url]: ALL_ROWS });
        }
    }
    private _pushState(date) {
        this._userParamSrv.setChangeState({ isChange: date });
    }
    private _newDataCheck(userType: string, userPassword: string, userLogin: string) {
        return userPassword ||
            (this.curentUser.CLASSIF_NAME !== userLogin) ||
            this.checkUpdateDate() ||
            (`${this.curentUser.USERTYPE}` !== userType);
    }
    private _alertMessage(msg: string, types?: boolean) {
        const type = types ? 'success' : 'warning';
        this._msgSrv.addNewMessage({
            type,
            title: 'Предупреждение:',
            msg: `${msg}`,
            dismissOnTimeout: 6000,
        });
    }
    private _createUrlChangeLOgin(userData: any): Promise<any> {
        const { userType = '', userPassword = '', userLogin = '' } = userData;
        const id = +this._userParamSrv.userContextId;

        let url = 'ChangeLogin?';
        url += `isn_user=${id}`;
        url += `&userType=${userType}`;
        url += `&classifName='${encodeURIComponent(('' + userLogin).toUpperCase())}'`;
        url += `&pass='${userPassword}'`;

        const request = {
            method: 'POST',
            requestUri: url,
        };
        return this.apiSrvRx.batch([request], '').then(() => {
            this._userParamSrv.ProtocolService(this.curentUser['ISN_LCLASSIF'], 4);
        }).catch(e => {
            // this.cancel(null);
            this._errorSrv.errorHandler(e);
            return Promise.reject();
        });
    }
}
