import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { DEPARTMENT, USER_CERTIFICATE, USER_CL, DELO_BLOB, USERDEP } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_ACCESS_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../shared/services/helper-error.services';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { NavParamService } from 'app/services/nav-param.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_UPDATE_USER } from '../../eos-user-select/shered/consts/confirm-users.const';
import { IMessage } from 'eos-common/interfaces';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { CONFIRM_AVSYSTEMS_UNCHECKED, CONFIRM_REDIRECT_AUNT, CONFIRM_SURNAME_REDACT } from 'eos-dictionaries/consts/confirm.consts';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})


export class ParamsBaseParamComponent implements OnInit, OnDestroy {
    editMode = false;
    curentUser: IParamUserCl;
    inputFields: IInputParamControl[];
    controlField: IInputParamControl[];
    accessField: IInputParamControl[];
    /* инпуты */
    inputs;
    controls;
    accessInputs;
    /* инпуты */

    /* формы */
    form: FormGroup;
    formControls: FormGroup;
    formAccess: FormGroup;
    /* формы */
    isLoading: Boolean = true;
    selfLink = null;
    dueDepName: string = '';
    dueDepSurname: string = '';
    isPhoto: boolean | number = false;
    urlPhoto: string = '';
    startIsPhoto: boolean | number = false;
    startUrlPhoto: string = '';
    surnameDepartment: string = '';
    updateDL: boolean = false;
    public LicenzeInfo;
    public actualLicenz = [];
    public isShell: boolean = false;
    public userSertsDB: USER_CERTIFICATE;
    public maxLoginLength: string;
    private _descSrv;
    private _newData: Map<string, any> = new Map();
    private _newDataformControls: Map<string, any> = new Map();
    private _newDataformAccess: Map<string, any> = new Map();
    private modalRef: BsModalRef;

    get newInfo() {
        if (this._newDataformAccess.size || this._newData.size || this._newDataformControls.size) {
            return false;
        }
        return true;
    }
    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    get stateHeaderSubmit() {
        return this._newData.size > 0 || this._newDataformAccess.size > 0 || this._newDataformControls.size > 0;
    }
    constructor(
        private _router: Router,
        private _msgSrv: EosMessageService,
        private _apiSrv: UserParamApiSrv,
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _userParamSrv: UserParamsService,
        private _nanParSrv: NavParamService,
        private _errorSrv: ErrorHelperServices,
        private modalService: BsModalService,
        private _confirmSrv: ConfirmWindowService,
        private apiSrvRx: PipRX,
        private _rtUserSel: RtUserSelectService
    ) {
    }
    ngOnInit() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this.selfLink = this._router.url.split('?')[0];
                this.apiSrvRx.read<any>({
                    LicenseInfo: ALL_ROWS
                  })
                .then(ans => {
                    if (typeof(ans) === 'string') {
                        this.LicenzeInfo = JSON.parse(ans);
                    } else {
                        this.LicenzeInfo = data;
                    }
                    if (this.LicenzeInfo.length > 0) {
                        this.createActualLicenze();
                    }
                    this.afterInit();
                })
                .catch(err => {
                    this.afterInit();
                    this.LicenzeInfo = [];
                });
            }
        });
        // if (localStorage.getItem('lastNodeDue') == null) {
        //     localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        // }
    }
    afterInit() {
        this.init();
        if (!this.curentUser['IS_PASSWORD'] && this.curentUser.USERTYPE !== 1 && this.curentUser.USERTYPE !== -1) {
            this.messageAlert({ title: 'Предупреждение', msg: `У пользователя ${this.curentUser['CLASSIF_NAME']} не задан пароль.`, type: 'warning' });
        }
        this.editModeF();
        this._subscribe();
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    get validClassif() {
        const val: ValidationErrors = this.form.controls['CLASSIF_NAME'].errors;
        if (val !== null) {
            if (val.required) {
                return 'Поле логин не может быть пустым';
            } else if (val.isUnique) {
                return 'Поле логин должно быть уникальным';
            } else {
                return 'не коректное значение';
            }
        }
        return null;
    }
    get getValidDate() {
        return this.form.controls['NOTE2'].valid && this.form.controls['CLASSIF_NAME'].valid;
    }
    get getErrorSave() {
        const val: ValidationErrors = this.form.controls['CLASSIF_NAME'].errors;
        const clName = this.form.controls['CLASSIF_NAME'].value ? this.form.controls['CLASSIF_NAME'].value : '';
        const suPatron = this.form.controls['SURNAME_PATRON'].value ? this.form.controls['SURNAME_PATRON'].value : '';
        const formError = this.form.status === 'INVALID' ? true : false;
        if (this.editMode && (val !== null || (clName).trim() === '' || (suPatron).trim() === '') || formError) {
            return true;
        } else {
            return false;
        }
    }
    get title(): string {
        if (this.curentUser) {
            if (this.curentUser.isTechUser || this.curentUser._orig.isTechUser && !this.curentUser.isTechUser) {
                return this.curentUser.CLASSIF_NAME;
            } else {
                return `${this.curentUser['DUE_DEP_SURNAME']} (${this.curentUser['CLASSIF_NAME']})`;
            }
        }
        return '';
    }

    init(message?: boolean): Promise<any> {
        return this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List,USERDEP_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
                this.curentUser = this._userParamSrv.curentUser;
                if (this.curentUser.DUE_DEP) {
                    this.getPhotoUser(this.curentUser.DUE_DEP);
                }
                this.inputFields = this._descSrv.fillValueInputField(BASE_PARAM_INPUTS, !this.editMode);
                this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
                this.accessField = this._descSrv.fillValueAccessField(BASE_PARAM_ACCESS_INPUT, !this.editMode);

                this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
                this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
                this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);

                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
                this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
                this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);
                this.dueDepName = this.form.controls['DUE_DEP_NAME'].value;
                this.dueDepSurname = this.curentUser['DUE_DEP_SURNAME'];
                this.maxLoginLength = this.curentUser.USERTYPE === 1 ? '64' : '12';
                this.isLoading = false;
                setTimeout(() => {
                    this.editModeF();
                    this.setValidators();
                    this.subscribeForms();
                    this._subscribe();
                });
            }
            return Promise.resolve();
        });
    }
    createActualLicenze() {
        const masEl = [];
        this.LicenzeInfo.forEach(elem => {
            if (elem.Users > elem.ActualUsers) {
                console.log('ttt');
                masEl.push('' + (elem.Id - 1));
            }
        });
        if (masEl.indexOf('0') !== -1 && masEl.indexOf('1') !== -1) {
            this.actualLicenz.push('0-1');
        }
        if (masEl.indexOf('1') !== -1 || masEl.indexOf('27') !== -1) {
            this.actualLicenz.push('delo_web');
            if (masEl.indexOf('1') !== -1 && masEl.indexOf('27') !== -1) {
                this.actualLicenz.push('1-27');
            }
        }
        masEl.forEach(elem => {
            this.actualLicenz.push(elem);
        });
    }
    setRadioBt($event?) {
        /* попав сюда я знаю что radio содержит только одну лицензию */
        const radioVal = this.actualLicenz.indexOf('1') === -1 ? '27' : '1';
        /* если мы только поставили галочку то */
        if (this.formAccess.controls['delo_web'].value) {
            this._toggleFormControl(this.formAccess.controls['1-27'], false);
            if (!this.accessInputs['1-27'].value || !this.formAccess.controls['1-27'].value) {
                this._toggleFormControl(this.formAccess.controls['1-27'], true);
                this.formAccess.controls['1-27'].setValue(radioVal, { emitEvent: false });
            } else {
                /* если мы уже стоим то нужно проверить на нужной ли лицензии если на нужной просто блок */
                if (this.formAccess.controls['1-27'].value === radioVal) {
                    this._toggleFormControl(this.formAccess.controls['1-27'], true);
                }
            }
        }
    }
    editLicenze() {
        if (this.LicenzeInfo.length === 0) {
            return ;
        }
        Object.keys(this.accessInputs).forEach((input, index) => {
            if (this.LicenzeInfo.length > 0 && this.actualLicenz && !this.formAccess.controls[input].value && this.actualLicenz.indexOf(input) === -1) {
                if (input === '1-27') {
                    if (this.actualLicenz.indexOf('1-27') === -1) {
                        this.setRadioBt();
                    }
                } else {
                    this.formAccess.controls[input].disable({ emitEvent: false });
                }
            }
        });
    }
    getPhotoUser(due: string): Promise<any> {
        return this._userParamSrv.getPhotoUser(due).then((data: DEPARTMENT[]) => {
            this.isPhoto = data[0]['ISN_PHOTO'];
            this.surnameDepartment = data[0]['SURNAME'];
            if (this.isPhoto) {
                this._rtUserSel.getSVGImage(this.isPhoto).then((res: DELO_BLOB[]) => {
                    const url = `url(data:image/${res[0].EXTENSION};base64,${res[0].CONTENTS})`;
                    this.urlPhoto = url;
                });
            } else {
                this.startUrlPhoto = null;
                this.startIsPhoto = null;
            }
        });
    }

    subscribeForms() {
        this.form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(data => {
            this.checkChangeForm(data);
        });

        this.formControls.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(data => {
            this.checkChangeFormControls(data);
        });

        this.formAccess.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(data => {
            this.checkChangeFormAccess(data);
        });
    }
    checkChangeForm(data): void {
        Object.keys(data).forEach((val, index) => {
            if (data[val] !== this.inputs[val].value) {
                this._newData.set(val, data[val]);
            } else {
                this._newData.delete(val);
            }
        });
        this._pushState();
    }
    checkChangeFormControls(data): void {
        Object.keys(data).forEach((val, index) => {
            if (data[val] !== this.controls[val].value) {
                this._newDataformControls.set(val, data[val]);
            } else {
                this._newDataformControls.delete(val);
            }
        });
        this._pushState();
    }
    checkChangeFormAccess(data): void {
        this.checRadioB();
        Object.keys(this.accessInputs).forEach((input, index) => {
            if (this.accessInputs[input].value !== this.formAccess.controls[input].value) {
                this._newDataformAccess.set(input, this.formAccess.controls[input].value);
            } else {
                this._newDataformAccess.delete(input);
            }
            if (this.LicenzeInfo.length > 0 && this.actualLicenz && this.actualLicenz.indexOf(input) === -1) {
                if (input === '1-27') {
                    if (this.actualLicenz.indexOf('1-27') === -1) {
                        this.setRadioBt();
                    }
                } else if (!this.formAccess.controls[input].value) {
                    this.formAccess.controls[input].disable({ emitEvent: false });
                }
            }
        });
        this._pushState();
    }
    cheackCtech(): boolean {
        if (!this.form.get('DUE_DEP_NAME').value && !this.curentUser.isTechUser) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: 'Укажите пользователя техническим или добавьте должностное лицо',
                dismissOnTimeout: 6000,
            });
            return true;
        }
        return false;
    }
    setQueryNewData(accessStr, newD, query): void {
        const id = this._userParamSrv.userContextId;
        if (this._newDataformAccess.size || this._newData.size) {
            if (this._newDataformAccess.size) {
                accessStr = this._createAccessSystemsString(this.formAccess.controls);
                newD['AV_SYSTEMS'] = accessStr;
            }
            if (this._newData.size) {
                this._newData.forEach((val, key, arr) => {
                    if (key === 'USERTYPE') {
                        newD[key] = +val;
                    } else {
                        newD[key] = val;
                    }
                    if (key === 'DUE_DEP_NAME') {
                        if (this.curentUser.isTechUser) {
                            this.inputs['DUE_DEP_NAME'].data = '';
                            this.form.get('NOTE').patchValue('');
                        }
                        newD['NOTE'] = '' + this.form.get('NOTE').value;
                        newD['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                    }
                    if (key === 'TECH_DUE_DEP') {
                        newD['NOTE'] = '' + this.form.get('NOTE').value;
                        newD['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                    }
                    delete newD['DUE_DEP_NAME'];
                });
            }
            query.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: newD
            });
        }
        this.setRulesForDl(id, query);
    }
    setRulesForDl(id, query) {
        if (this._newData.size) {
            const newDl = this._newData.get('DUE_DEP_NAME');
            if (newDl) {
                const newDue = this.curentUser.DUE_DEP;
                let F26 = false;
                let F25 = false;
                this.curentUser.USERDEP_List.forEach((_udep: USERDEP) => {
                    if (_udep.ISN_LCLASSIF === id && _udep.FUNC_NUM === 26) {
                        F26 = true;
                    }
                    if (_udep.ISN_LCLASSIF === id && _udep.FUNC_NUM === 25) {
                        F25 = true;
                    }
                });
                // у нового пользователя тут может быть null -> записываем  строку '000000000000000000000000000000 000      '
                const DELO_RIGHTS = this.curentUser.DELO_RIGHTS ? this.curentUser.DELO_RIGHTS : '000000000000000000000000000000 000      ';
                const arr = DELO_RIGHTS.split('');
                const newDELO_RIGHTS = arr.map((v, i) => {
                    if (i === 24 || i === 25) {
                        return 1;
                    }
                    return v;
                }).join('');
                query.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: {
                        DELO_RIGHTS: newDELO_RIGHTS
                    }
                });

                if (!F26) {
                    query.push({
                        method: 'POST',
                        requestUri: `USER_CL(${id})/USERDEP_List`,
                        data: {
                            'ISN_LCLASSIF': id, 'DUE': `${newDue}`, 'FUNC_NUM': 26, 'DEEP': 1, 'ALLOWED': 0
                        }
                    });
                }
                if (!F25) {
                    query.push({
                        method: 'POST',
                        requestUri: `USER_CL(${id})/USERDEP_List`,
                        data: {
                            'ISN_LCLASSIF': id, 'DUE': `${newDue}`, 'FUNC_NUM': 25, 'DEEP': 1, 'ALLOWED': 0
                        }
                    });
                }
            }
        }
    }
    setNewDataFormControl(query, id) {
        if (this._newDataformControls.size) {
            if (this._newDataformControls.has('SELECT_ROLE')) {
                query.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})/USER_PARMS_List('${id} CATEGORY')`,
                    data: {
                        PARM_VALUE: this._newDataformControls.get('SELECT_ROLE')
                    }
                });
            }
        }
    }
    uncheckedAvSystems(): boolean {
        if (this._newDataformAccess.size) {
            const accessStr = this._createAccessSystemsString(this.formAccess.controls);
            if (accessStr === '0000000000000000000000000000') {
                return true;
            }
        }
        return false;
    }

    submit(meta?: string): Promise<any> {
        if (this.cheackCtech() || this.checkRole()) {
            return;
        }
        const id = this._userParamSrv.userContextId;
        const newD = {};
        const query = [];
        const accessStr = '';
        this.checkDLSurname(query)
            .then(() => {
                this.setQueryNewData(accessStr, newD, query);
                this.setNewDataFormControl(query, id);
                if (!this.curentUser['IS_PASSWORD'] && this.curentUser.USERTYPE !== 1 && this.curentUser.USERTYPE !== -1) {
                    return this._confirmSrv.confirm(CONFIRM_REDIRECT_AUNT).then(res => {
                        if (res) {
                            return this.ConfirmAvSystems(accessStr, id, query).then(() => {
                                this._router.navigate(['/user-params-set/auntefication']);
                            });
                        } else {
                            return this.ConfirmAvSystems(accessStr, id, query);
                        }
                    });
                } else {
                    return this.ConfirmAvSystems(accessStr, id, query);
                }
            });
    }

    checkDLSurname(mas: any[]): Promise<any> {
        if (this._newData.get('SURNAME_PATRON')) {
            if (this.curentUser['SURNAME_PATRON'] === this.surnameDepartment) {
                return this._confirmSrv.confirm2(CONFIRM_SURNAME_REDACT).then(confirmation => {
                    if (confirmation && confirmation['result'] === 1) {

                    } else {
                        this.form.get('SURNAME_PATRON').setValue(this.curentUser._orig['SURNAME_PATRON']);
                    }
                    return null;
                });
            } else {
                return Promise.resolve(null);
            }
        } else {
            return Promise.resolve(null);
        }

    }

    ConfirmAvSystems(accessStr: string, id: number, query: any[]): Promise<any> {
        if (this.uncheckedAvSystems()) {
            return this._confirmSrv.confirm(CONFIRM_AVSYSTEMS_UNCHECKED).then(res => {
                if (res) {
                    // меняем метод saveAfterSystems на saveData
                    // так как согласно таску 139328:
                    // "Разрешаем назначать роль пользователю без АДЛ"
                    // не имеет смысла проверка кабинета

                    this.apiSrvRx.read( {[this._createUrlForSop(`${id}`)]: ALL_ROWS});
                    return this.saveData(accessStr, id, query);
                } else {
                    return;
                }
            });
        }
        return this.saveData(accessStr, id, query);
    }

    // saveAfterSystems(accessStr: string, id: number, query: any): Promise<any> {
    //     if (this.formControls.controls['SELECT_ROLE'].value && this.formControls.controls['SELECT_ROLE'].value !== '...') {
    //         return this._rtUserSel.getInfoCabinet(this.curentUser.ISN_LCLASSIF).then(cab => {
    //             if (cab) {
    //                 return true;
    //             } else {
    //                 return false;
    //             }
    //         }).then(data => {
    //             if (!data) {
    //                 this.messageAlert({ title: 'Предупреждение', msg: `Невозможно присвоить пользователю выбранную роль`, type: 'warning' });
    //                 return;
    //             } else {
    //                 return this.saveData(accessStr, id, query);
    //             }
    //         });
    //     } else {
    //         return this.saveData(accessStr, id, query);
    //     }
    // }

    saveData(accessStr: string, id: number, query: any): Promise<any> {
        this.isLoading = true;
        if (this.inputs.CLASSIF_NAME.value !== this.form.value.CLASSIF_NAME) {
            if (this.curentUser['IS_PASSWORD'] === 0) {
                return this.sendData(query, accessStr);
            } else {
                const queryPas = [{
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: {
                        IS_PASSWORD: 0
                    }
                }];
                return this._userParamSrv.dropLogin(id, this.curentUser.USERTYPE, this.form.controls['CLASSIF_NAME'].value).then(() => {
                    if (+this.curentUser.USERTYPE !== 1) {
                        this.messageAlert({ title: 'Предупреждение', msg: `Изменён логин, нужно задать пароль`, type: 'warning' });
                        return this.apiSrvRx.batch(queryPas, '').then(() => {
                            return this.sendData(query, accessStr);
                        });
                    } else {
                        return this.sendData(query, accessStr);
                    }
                }).catch(error => {
                    this._errorSrv.errorHandler(error);
                    this.cancel();
                });
            }
        } else {
            return this.sendData(query, accessStr);
        }
    }

    sendData(query, accessStr): Promise<any> {
        return this._apiSrv.setData(query).then(() => {
            return this.AfterSubmit(accessStr);
        }).catch(error => {
            this._nanParSrv.scanObserver(!this.accessInputs['3'].value);
            this.cancel();
            this._errorSrv.errorHandler(error);
        });
    }
    AfterSubmit(accessStr: string): void {
        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        this._userParamSrv.ProtocolService(this._userParamSrv.curentUser.ISN_LCLASSIF, 4);
        this.editMode = false;
        if (accessStr.length > 1) {
            const number = accessStr.charAt(3);
            this._nanParSrv.scanObserver(number === '1' ? false : true);
        }
        this.clearMap();
        this._pushState();
        this.ngOnDestroy();
        this.init();
    }

    clearMap() {
        this._newData.clear();
        this._newDataformAccess.clear();
        this._newDataformControls.clear();
    }

    cancel() {
        this.isLoading = false;
        this.editMode = false;
        this.clearMap();
        this.ngOnDestroy();
        this.init();
        this._pushState();
    }

    gt(): any {
        const delo = this.formAccess.get('0').value;
        const delo_web_delo = this.formAccess.get('0-1').value;
        const delo_web = this.formAccess.get('delo_web').value;
        return {
            delo, delo_web_delo, delo_web
        };
    }
    edit() {
        this.curentUser.isTechUser = this.formControls.get('teсhUser').value;
        this.editMode = !this.editMode;
        this.editModeF();
        this.checRadioB();
        if (this.gt()['delo_web_delo']) {
            this.checkMeinControlAccess({ target: { checked: true } }, '0-1');
        } else if (this.gt()['delo_web']) {
            this.checkMeinControlAccess({ target: { checked: true } }, 'delo_web');
        } else if (this.gt()['delo']) {
            this.checkMeinControlAccess({ target: { checked: true } }, '0');
        } else {
            this._toggleFormControl(this.formAccess.controls['0'], false);
            this._toggleFormControl(this.formAccess.controls['0-1'], false);
            this._toggleFormControl(this.formAccess.controls['delo_web'], false);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        }
        this.tf();
        this.editLicenze();
    }
    tf() {
        // const val1 = this.formAccess.controls['0-1'].value;
        // const val2 = this.formAccess.controls['delo_web'].value;
        // if (val1 || val2) {
        //     this.formControls.controls['SELECT_ROLE'].enable({ emitEvent: false });
        // }
        // if (!val1 && !val2) {
        //     this.formControls.controls['SELECT_ROLE'].patchValue(null);
        //     this.formControls.controls['SELECT_ROLE'].disable({ emitEvent: false });
        // }
    }
    checkMeinControlAccess($event, data) {
        if (data === '0') {
            this._toggleFormControl(this.formAccess.controls['0-1'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['delo_web'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        } else if (data === '0-1') {
            this._toggleFormControl(this.formAccess.controls['0'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['delo_web'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        } else {
            this._toggleFormControl(this.formAccess.controls['0'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['0-1'], $event.target.checked);
            if (this.LicenzeInfo.length > 0 && $event.target.checked) {
                if (this.actualLicenz.indexOf('1-27') !== -1) {
                    this._toggleFormControl(this.formAccess.controls['1-27'], false);
                } else {
                    this.setRadioBt();
                }
            } else {
                this._toggleFormControl(this.formAccess.controls['1-27'], !$event.target.checked);
            }
        }
        this.editLicenze();
    }
    editModeF() {
        if (this.editMode) {
            this.form.enable({ onlySelf: true, emitEvent: false });
            this.formControls.enable({ onlySelf: true, emitEvent: false });
            this.formAccess.enable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.disable({ onlySelf: true, emitEvent: false });
            this.formControls.disable({ onlySelf: true, emitEvent: false });
            this.formAccess.disable({ onlySelf: true, emitEvent: false });
        }
    }
    close() {
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }

    showDepartment() {
        this.isShell = true;
        let dueDep = '';
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                if (!data || data === '') {
                    throw new Error();
                }
                dueDep = data;
                return this._userParamSrv.getDepartmentFromUser([dueDep]);
            })
            .then((data: DEPARTMENT[]) => {
                return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0], true).then(val => {
                    if (data) {
                        this.form.get('TECH_DUE_DEP').patchValue(data[0]['PARENT_DUE']);
                    }
                    this._userParamSrv.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
                        this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
                    });
                    return val;
                });
            })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                if (this.dueDepSurname !== dep['SURNAME']) {
                    const depConfirm = Object.assign({}, CONFIRM_SURNAME_REDACT);
                    depConfirm.body = 'ФИО выбранного должностного лица отличается от ФИО пользователя.\n Скорректировать ФИО пользователя?';
                    this._confirmSrv.confirm2(depConfirm).then(confirmation => {
                        if (confirmation && confirmation['result'] === 1) {
                            this.dueDepSurname = dep['SURNAME'];
                            this.form.get('SURNAME_PATRON').patchValue(dep['SURNAME']);
                            this.surnameDepartment = this.form.get('SURNAME_PATRON').value;
                        }
                    });
                }
                this.dueDepName = dep['CLASSIF_NAME'];
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
                this.curentUser.DUE_DEP = dep['DUE'];
                this.inputs['DUE_DEP_NAME'].data = dep['DUE'];
                return this.getPhotoUser(dep['DUE']);
            })
            .catch(() => {
                this.isShell = false;
            });
    }

    selectDepartment() {
        if (!this.curentUser.isTechUser && this.editMode) {
            this.showDepartment();
        }
    }
    checRadioB() {
        if (!this.gt()['delo_web']) {
            this.formAccess.controls['1-27'].patchValue(null, { emitEvent: false });
        } else {
            if (this.formAccess.controls['1-27'].value === null) {
                this.formAccess.controls['1-27'].patchValue('1', { emitEvent: false });
            }
            this.formAccess.controls['26'].disable({ emitEvent: false });
            this.formAccess.controls['26'].patchValue(false, { emitEvent: false });
            ['2', '5', '15', '17', '21', '23', '25'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], false);
            });
        }
        if (this.gt()['delo']) {
            ['2', '5', '15', '17', '25', '26'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], false);
            });
            this._toggleFormControl(this.formAccess.controls['23'], true);
            this._toggleFormControl(this.formAccess.controls['21'], true);
            this.formAccess.controls['23'].patchValue(false, { emitEvent: false });
            this.formAccess.controls['21'].patchValue(false, { emitEvent: false });
        }
        if (this.gt()['delo_web_delo']) {
            this.disableAccessSyst(false);
        }
        if (!this.gt()['delo'] && !this.gt()['delo_web'] && !this.gt()['delo_web_delo']) {
            this.patchVal();
            this.disableAccessSyst(true);
        }
    }

    getSerts(template: TemplateRef<any>): void {
        if (this.editMode) {
            this.modalRef = this.modalService.show(template, { class: 'serts', ignoreBackdropClick: true });
        }
    }
    closeSerts() {
        this.modalRef.hide();
    }
    delSelectUser($event?) { // удаление от кого копировать
        if ($event && $event.keyCode === 46) {
            this.formControls.get('USER_COPY').patchValue('');
        } else if (!$event) {
            this.formControls.get('USER_COPY').patchValue('');
        }
    }
    private patchVal() {
        ['2', '5', '15', '17', '21', '23', '25', '26'].forEach(numberControl => {
            this.formAccess.controls[numberControl].patchValue(false, { emitEvent: false });
        });
    }
    private disableAccessSyst(flag) {
        if (flag) {
            ['2', '5', '15', '17', '21', '23', '25', '26'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], true);
            });
        } else {
            ['2', '5', '15', '17', '21', '23', '25', '26'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], false);
            });
        }
    }

    private _toggleFormControl(control, disable: boolean) {
        if (disable) {
            if (control.enabled) {
                control.disable({ emitEvent: false });
            }
        } else {
            if (control.disabled) {
                control.enable({ emitEvent: false });
            }
        }
    }
    private _createAccessSystemsString(data: Object) {
        const arr = this.curentUser['ACCESS_SYSTEMS'].concat();
        arr[0] = '0';
        arr[1] = '0';
        arr[27] = '0';
        const newArr = [].concat(new Array(28).fill(0), new Array(12).fill(''));
        arr.forEach((val, index) => {
            switch (index) {
                case 0:
                    if (data['0-1'].value) {
                        newArr['0'] = '1';
                        newArr['1'] = '1';
                    } else {
                        newArr['1'] = '0';
                        if (data['0'].value) {
                            newArr['0'] = data['0'].value ? '1' : '0';
                        }
                    }
                    break;
                case 1:
                    if (data['delo_web'].value) {
                        newArr[1] = (data['1-27'].value === '1') ? '1' : '0';
                        newArr[27] = (data['1-27'].value === '27') ? '1' : '0';
                    }
                    break;
                case 27:
                    break;
                default:
                    if (data.hasOwnProperty(index)) {
                        newArr[index] = data[index].value ? '1' : '0';
                    }
                    break;
            }
        });
        return newArr.join('');
    }

    private _pushState() {
        this._userParamSrv.setChangeState({ isChange: this.stateHeaderSubmit, disableSave: !this.getValidDate });
    }

    private _subscribe() {
        const f = this.formControls;
        f.get('teсhUser').valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(data => {
                if (data) {
                    this.curentUser.isTechUser = data;
                    if (this.form.get('DUE_DEP_NAME').value) {
                        this._confirmSrv.confirm2(CONFIRM_UPDATE_USER).then(confirmation => {
                            if (confirmation && confirmation['result'] === 1) {
                                this.form.get('TECH_DUE_DEP').patchValue('');
                                this.form.get('DUE_DEP_NAME').patchValue('');
                                this.form.get('DUE_DEP_NAME').disable();
                                this.form.get('DUE_DEP_NAME').setValidators(null);
                                // this.formControls.controls['SELECT_ROLE'].patchValue('');
                                // this.formControls.controls['SELECT_ROLE'].disable();
                            } else {
                                this.curentUser.isTechUser = data;
                                f.get('teсhUser').setValue(false);
                            }
                        }).catch(error => {
                            console.log('Ошибка', error);
                        });
                    }
                    // this.formControls.controls['SELECT_ROLE'].patchValue('...');
                    // this.formControls.controls['SELECT_ROLE'].disable();
                } else {
                    this.curentUser.isTechUser = data;
                    this.form.controls['DUE_DEP_NAME'].patchValue(this.dueDepName);
                    // this.formControls.controls['SELECT_ROLE'].patchValue(this._userParamSrv.hashUserContext['CATEGORY'] ? this._userParamSrv.hashUserContext['CATEGORY'] : '...');
                    // this.formControls.controls['SELECT_ROLE'].enable();
                    this.tf();
                }
            });
    }
    private messageAlert({ title, msg, type }: IMessage) {
        this._msgSrv.addNewMessage(
            {
                type,
                msg,
                title,
            }
        );
    }

    private AddUnderscore(string: string): string {
        return string.replace(new RegExp('_', 'g'), '[' + '_' + ']');
    }
    private SEARCH_INCORRECT_SYMBOLS() {
        return new RegExp('["|\']', 'g');
    }
    private setValidators() {
        this.form.controls['CLASSIF_NAME'].setAsyncValidators((control: AbstractControl) => {
            /* if (!this.curentUser['IS_PASSWORD']) {
                this.inputs['CLASSIF_NAME'].readonly = true;
            } */
            if (control.value === this.inputs['CLASSIF_NAME'].value) {
                return Promise.resolve(null);
            } else if ((control.value).trim() !== '') {
                return this._apiSrv.getData<USER_CL[]>({
                    USER_CL: {
                        criteries: {
                            CLASSIF_NAME: `="${this.AddUnderscore(`${(control.value).trim().replace(/[!@$&^=]/g, '').replace(this.SEARCH_INCORRECT_SYMBOLS(), '')}`)}"`,
                        }
                    }
                }).then(data => {
                    if (data.length) {
                        return { isUnique: true };
                    }
                    return null;
                });
            } else {
                return Promise.resolve(null);
            }
        });
    }
    /**
     * метод checkRole
     * проверяет перед сохранением, что у пользователя
     * задана роль (поле SELECT_ROLE не пустое)
     */
    private checkRole(): boolean {
        const role = this.formControls.get('SELECT_ROLE');
        if (!role.value && !role.disabled) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение:',
                msg: 'Укажите пользователю роль',
                dismissOnTimeout: 6000,
            });
            return true;
        }
        return false;
    }
    private _createUrlForSop(userId: string): string {
        let url = 'UserRightsReset?';
        url += `users=${userId}`;
        url += `&rights=11`;
        return url;
    }
}
