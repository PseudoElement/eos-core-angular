import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { DEPARTMENT, USER_CERTIFICATE, USER_CL, DELO_BLOB } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS_CB, BASE_PARAM_ACCESS_INPUT, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_SETTINGS_COPY } from 'eos-user-params/shared/consts/base-param.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl, IRoleCB } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from '../shared/base-param-curent.descriptor';
import { OPEN_CLASSIF_DEPARTMENT, OPEN_CLASSIF_USER_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { NavParamService } from 'app/services/nav-param.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_UPDATE_USER } from '../../../eos-user-select/shered/consts/confirm-users.const';
import { IMessage } from 'eos-common/interfaces';
import { RtUserSelectService } from 'eos-user-select/shered/services/rt-user-select.service';
import { CONFIRM_AVSYSTEMS_UNCHECKED, CONFIRM_REDIRECT_AUNT } from 'eos-dictionaries/consts/confirm.consts';
import { KIND_ROLES_CB } from 'eos-user-params/shared/consts/user-param.consts';

@Component({
    selector: 'eos-params-base-param-cb',
    templateUrl: './base-param-cb.component.html'
})


export class ParamsBaseParamCBComponent implements OnInit, OnDestroy {
    editMode = false;
    curentUser: IParamUserCl;
    inputFields: IInputParamControl[];
    controlField: IInputParamControl[];
    accessField: IInputParamControl[];
    copyField: IInputParamControl[];
    title: string;
    /* инпуты */
    inputs;
    controls;
    accessInputs;
    settingsCopyInputs;
    /* инпуты */

    /* формы */
    form: FormGroup;
    formControls: FormGroup;
    formAccess: FormGroup;
    formSettingsCopy: FormGroup;
    /* формы */
    isLoading: Boolean = true;
    selfLink = null;
    dueDepName: string = '';
    dueDepSurname: string = '';
    singleOwnerCab: boolean = true;
    currentCbFields: IRoleCB[] = [];
    asistMansStr: string = '';
    startRolesCb: IRoleCB[] = [];
    user_copy_isn: number;
    isPhoto: boolean | number = false;
    urlPhoto: string = '';
    errorSave: boolean;
    queryRoles: any[] = [];
    public isShell: boolean = false;
    public criptoView: boolean = false;
    public userSertsDB: USER_CERTIFICATE;
    public maxLoginLength: string;
    private _sysParams;
    private _descSrv;
    private _newData: Map<string, any> = new Map();
    private _newDataformControls: Map<string, any> = new Map();
    private _newDataformAccess: Map<string, any> = new Map();
    private modalRef: BsModalRef;

    get newInfo() {
        if (this._newDataformAccess.size || this._newData.size || this._newDataformControls.size || this.queryRoles.length) {
            return false;
        }
        return true;
    }
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    get sysParams() {
        return this._sysParams;
    }
    get stateHeaderSubmit() {
        return this._newData.size > 0 || this._newDataformAccess.size > 0 || this._newDataformControls.size > 0 || this.queryRoles.length > 0;
    }
    get getCbRole() {
        return this.editMode && !this.singleOwnerCab && (this.gt()['delo_web_delo'] || this.gt()['delo_web']) && !this.curentUser.isTechUser;
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
        private _rtUserSel: RtUserSelectService,
    ) {
    }
    ngOnInit() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then((data) => {
            if (data) {
                this._userParamSrv.curentUser.USER_PARMS_List.forEach( elem => {
                    if (elem.PARM_NAME === 'CRYPTO_INITSTR' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('spki') !== -1) {
                        this.criptoView = true;
                    }
                });
                this.selfLink = this._router.url.split('?')[0];
                this.init();
                this.getTitle();
                if (!this.curentUser['IS_PASSWORD']) {
                    this.messageAlert({ title: 'Предупреждение', msg: `У пользователя ${this.curentUser['CLASSIF_NAME']} не задан пароль.`, type: 'warning' });
                }
                this.editModeF();
                this._subscribe();
            }
        });
        // if (localStorage.getItem('lastNodeDue') == null) {
        //     localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        // }
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

    init() {
        this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
        this.curentUser = this._userParamSrv.curentUser;
        if (this.curentUser.DUE_DEP) {
            this.getPhotoUser(this.curentUser.DUE_DEP);
        }
        this.inputFields = this._descSrv.fillValueInputField(BASE_PARAM_INPUTS_CB, !this.editMode);
        this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
        this.accessField = this._descSrv.fillValueAccessField(BASE_PARAM_ACCESS_INPUT, !this.editMode);
        this.copyField = this._descSrv.fillValueAccessField(BASE_PARAM_SETTINGS_COPY, !this.editMode);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);
        this.settingsCopyInputs = this._inputCtrlSrv.generateInputs(this.copyField);

        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);
        this.formSettingsCopy = this._inputCtrlSrv.toFormGroup(this.settingsCopyInputs, false);
        this.dueDepName = this.form.controls['DUE_DEP_NAME'].value;
        this.dueDepSurname = this.curentUser['DUE_DEP_SURNAME'];
        this.maxLoginLength = this.curentUser.USERTYPE === 1 ? '64' : '12';
        this.isLoading = false;
        this.setValidators();
        this.subscribeForms();
        return Promise.resolve();
    }

    getPhotoUser(due: string) {
        const query = {
            DEPARTMENT: {
                criteries: {
                    DUE: `${due}`
                }
            }
        };
        return this.apiSrvRx.read(query).then(data => {
            this.isPhoto = data[0]['ISN_PHOTO'];
            if (!this.curentUser.isTechUser) {
                this.getCabinetOwnUser(data[0]['ISN_CABINET']);
            }
            if (this.isPhoto) {
                this._rtUserSel.getSVGImage(this.isPhoto).then((res: DELO_BLOB[]) => {
                    const url = `url(data:image/${res[0].EXTENSION};base64,${res[0].CONTENTS})`;
                    this.urlPhoto = url;
                });
            }
        });
    }

    subscribeForms() {
        this.form.valueChanges.pipe(
            takeUntil(this._ngUnsubscribe)
        ).subscribe(data => {
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
        });
        this._pushState();
    }

    dueDepNameNullUndef(date: any): boolean {
        if (!date) {
            return false;
        }
        return true;
    }

    getCabinetOwnUser(isnCabinet): void {
        if (isnCabinet) {
            this.apiSrvRx.read<DEPARTMENT>({ DEPARTMENT: {
                criteries: {
                    ISN_CABINET: isnCabinet,
                }
            }}).then((depD: any) => {
                if (depD.length === 1) {
                    this.singleOwnerCab = false;
                    this.getUserCbRoles();
                }
            });
        }
    }

    getUserCbRoles() {
        const reqs = [
            this.apiSrvRx.read({CBR_USER_ROLE: {
                criteries: {DUE_PERSON: this.curentUser.DUE_DEP}
            }}),
            this.apiSrvRx.read({CBR_USER_ROLE: {
                    criteries: {ISN_USER: this.curentUser.ISN_LCLASSIF},
                },
                orderby: 'WEIGHT',
            })
        ];
        return Promise.all(reqs).then((data: any[]) => {
            const asistMansData = data[0].filter(el => el.ISN_USER !== this._userParamSrv.curentUser.ISN_LCLASSIF && (el.KIND_ROLE === 4 || el.KIND_ROLE === 5)).map(el => el.ISN_USER);
            if (asistMansData.length > 0) {
                this._getUserCl(asistMansData).then((users: USER_CL[]) => {
                    const sortUsers =  users.sort((a, b) => a.SURNAME_PATRON > b.SURNAME_PATRON ? 1 : -1);
                    sortUsers.forEach(user => {
                        if (this.asistMansStr.indexOf(user.SURNAME_PATRON) === -1) {
                            this.asistMansStr += `${user.SURNAME_PATRON}(${user.NOTE})\n`;
                        }
                    });
                    if (data[1].length) {
                        this.ParseRoles(data[1]);
                    }
                });
            } else {
                if (data[1].length) {
                    this.ParseRoles(data[1]);
                }
            }
        });
    }

    ParseRoles(roles: any[]): Promise<any> {
        return this.apiSrvRx.read<DEPARTMENT>({ DEPARTMENT: roles.map(due => due.DUE_PERSON)}).then((dueName: any) => {
            const dueNames = new Map<string, string>();
            dueName.forEach((dep) => dueNames.set(dep.DUE, dep.CLASSIF_NAME));
            this.parseData(roles, dueNames);
        });
    }

    parseData(data: any[], dueNames: Map<string, string>) {
        this.currentCbFields = [];
        data.forEach(el => {
            if (el.KIND_ROLE === 4 || el.KIND_ROLE === 5) {
                this.currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], dueName: dueNames.get(el.DUE_PERSON),
                due: el.DUE_PERSON, isnRole: el.ISN_USER_ROLE});
            } else if (this.asistMansStr && (el.KIND_ROLE === 1 || el.KIND_ROLE === 2 || el.KIND_ROLE === 3)) {
                this.currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], asistMan: this.asistMansStr, isnRole: el.ISN_USER_ROLE});
            } else {
                this.currentCbFields.push({role: KIND_ROLES_CB[el.KIND_ROLE - 1], isnRole: el.ISN_USER_ROLE});
            }
        });
        this.startRolesCb = JSON.parse(JSON.stringify(this.currentCbFields));
        this.patchCbRoles();
    }

    getTitle(): void {
        if (this.curentUser.isTechUser) {
            this.title = this.curentUser.CLASSIF_NAME;
        } else {
            this.title = `${this.curentUser['DUE_DEP_SURNAME']} (${this.curentUser['CLASSIF_NAME']})`;
        }
    }

    cheackCtech(): boolean {
        if (!this.dueDepNameNullUndef(this.form.get('DUE_DEP_NAME').value) && !this.curentUser.isTechUser) {
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
                    if (key === 'USERTYPE' || key === 'IS_SECUR_ADM') {
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
                    delete newD['DUE_DEP_NAME'];
                });
            }
            query.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: newD
            });
        }
    }
    setNewDataFormControl(query, id) {
        if (this._newDataformControls.size) {
            if (this._newDataformControls.has('SELECT_ROLE') && !this.user_copy_isn) {
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

    selectUser() {
        if (this.editMode) {
            OPEN_CLASSIF_USER_CL['criteriesName'] = this._apiSrv.configList.titleDue;
            OPEN_CLASSIF_USER_CL['selectMulty'] = false;
            OPEN_CLASSIF_USER_CL['skipDeleted'] = null;
            this.isShell = true;
            this._waitClassifSrv.openClassif(OPEN_CLASSIF_USER_CL)
                .then(data => {
                    this.user_copy_isn = +data;
                    return this._getUserCl(this.user_copy_isn);
                })
                .then(data => {
                    this.isShell = false;
                    this.formControls.get('USER_COPY').patchValue(data[0]['SURNAME_PATRON']);
                })
                .catch(() => {
                    this.isShell = false;
                });
        }
    }

    submit(meta?: string): Promise<any> {
        if (this.cheackCtech()) {
            return;
        }
        if (this._newData.get('IS_SECUR_ADM') && this.curentUser.TECH_RIGHTS && this.curentUser.TECH_RIGHTS[0] === '1') {
            this.messageAlert({ title: 'Предупреждение', msg: `Право 'Cистемный технолог.Пользователи' не может быть назначено одновременно с правом 'Администратор системы'`, type: 'warning' });
            return;
        }
        const id = this._userParamSrv.userContextId;
        const newD = {};
        const query = [];
        const accessStr = '';
        this.setQueryNewData(accessStr, newD, query);
        this.setNewDataFormControl(query, id);
        if (this._newData.get('IS_SECUR_ADM') === false) { // IS_SECUR_ADM приватный критерий
            this.apiSrvRx.read<USER_CL>({
                USER_CL: PipRX.criteries({ 'IS_SECUR_ADM': '1',  'ORACLE_ID': 'isnotnull', 'DELETED': '0'}),
                orderby: 'ISN_LCLASSIF',
                top: 2,
                loadmode: 'Table'
              }).then((admns: USER_CL[]) => {
                if (admns.length === 1 && admns[0].ISN_LCLASSIF === this.curentUser.ISN_LCLASSIF) {
                    this.messageAlert({ title: 'Предупреждение', msg: `В системе не будет ни одного незаблокированного пользователя с правом «Администратор»`, type: 'warning' });
                    return;
                } else {
                    if (!this.curentUser['IS_PASSWORD']) {
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
                }
            });
        } else {
            if (!this.curentUser['IS_PASSWORD']) {
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
        }
    }

    ConfirmAvSystems(accessStr: string, id: number, query: any[]): Promise<any> {
        if (this.uncheckedAvSystems()) {
            return this._confirmSrv.confirm(CONFIRM_AVSYSTEMS_UNCHECKED).then(res => {
                if (res) {
                    return this.saveAfterSystems(accessStr, id, query);
                } else {
                    return;
                }
            });
        }
        return this.saveAfterSystems(accessStr, id, query);
    }

    saveAfterSystems(accessStr: string, id: number, query: any): Promise<any> {
        if (this.formControls.controls['SELECT_ROLE'].value && this.formControls.controls['SELECT_ROLE'].value !== '...') {
            return this._rtUserSel.getInfoCabinet(this.curentUser.ISN_LCLASSIF).then(cab => {
                if (cab || cab === undefined) {
                    return true;
                } else {
                    return false;
                }
            }).then(data => {
                if (!data) {
                    this.messageAlert({ title: 'Предупреждение', msg: `Невозможно присвоить пользователю выбранную роль`, type: 'warning' });
                    return;
                } else {
                    return this.saveData(accessStr, id, query);
                }
            });
        } else {
            return this.saveData(accessStr, id, query);
        }
    }

    saveData(accessStr: string, id: number, query: any): Promise<any> {
        this.isLoading = true;
        if (this.inputs.CLASSIF_NAME.value !== this.form.value.CLASSIF_NAME) {
            if (this.curentUser['IS_PASSWORD'] === 0) {
                this.messageAlert({ title: 'Предупреждение', msg: `У пользователя ${this.inputs.CLASSIF_NAME.value} не задан пароль.`, type: 'warning' });
                this.form.controls.CLASSIF_NAME.patchValue(this.inputs.CLASSIF_NAME.value);
                this.cancel();
                return;
            } else {
                const queryPas = [{
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: {
                        IS_PASSWORD: 0
                    }
                }];
                return this.dropLogin(id).then(() => {
                    this.messageAlert({ title: 'Предупреждение', msg: `Изменён логин, нужно задать пароль`, type: 'warning' });
                    return this.apiSrvRx.batch(queryPas, '').then(() => {
                        return this.sendData(query, accessStr);
                    });
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
        return Promise.all([
            this.apiSrvRx.batch(this.queryRoles, ''),
            this._apiSrv.setData(query)])
        .then(() => {
            if (this.user_copy_isn) {
                let url = `FillUserCl?isn_user=${this.curentUser.ISN_LCLASSIF}`;
                url += `&role='${this.formControls.controls['SELECT_ROLE'].value ? encodeURI(this.formControls.controls['SELECT_ROLE'].value) : ''}'`;
                url += `&isn_user_copy_from=${this.user_copy_isn}`;
                return this.apiSrvRx.read({
                    [url]: ALL_ROWS,
                }).then(() => {
                    this.user_copy_isn = null;
                    this.formControls.get('USER_COPY').patchValue('');
                    return this.AfterSubmit(accessStr);
                });
            } else {
                return this.AfterSubmit(accessStr);
            }
        }).catch(error => {
            this._nanParSrv.scanObserver(!this.accessInputs['3'].value);
            this.cancel();
            this._errorSrv.errorHandler(error);
        });
    }
    AfterSubmit(accessStr: string): Promise<any> {
        if (accessStr.length > 1) {
            const number = accessStr.charAt(3);
            this._nanParSrv.scanObserver(number === '1' ? false : true);
        }
        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        this.clearMap();
        if (this.queryRoles.length) {
            return this.GetUserData().then(() =>  {
                this.queryRoles = [];
                this.getUserCbRoles();
            });
        } else {
            return this.GetUserData();
        }
    }

    GetUserData(): Promise<any> {
        return this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then(() => {
            this.editMode = false;
            this.curentUser = this._userParamSrv.curentUser;
            this.getTitle();
            this.upform(this.inputs, this.form);
            this.upform(this.controls, this.formControls);
            this.upform(this.accessInputs, this.formAccess);
            this.dueDepName = this.form.controls['DUE_DEP_NAME'].value;
            this.dueDepSurname = this.form.controls['SURNAME_PATRON'].value;
            this.isLoading = false;
            this.editModeF();
            this._pushState();
            this._userParamSrv.ProtocolService(this._userParamSrv.curentUser.ISN_LCLASSIF, 4);
        });
    }

    clearMap() {
        this._newData.clear();
        this._newDataformAccess.clear();
        this._newDataformControls.clear();
    }
    upform(inputs, form: FormGroup) {
        Object.keys(form.controls).forEach((key, val, arr) => {
            inputs[key].value = form.controls[key].value;
        });
    }
    cancel() {
        this.isLoading = false;
        this.editMode = !this.editMode;
        this.dueDepName = this.inputs['DUE_DEP_NAME'].value;
        this.dueDepSurname = this.inputs['SURNAME_PATRON'].value;
        this.cancelValues(this.inputs, this.form);
        this.cancelValues(this.accessInputs, this.formAccess);
        this.cancelValues(this.settingsCopyInputs, this.formSettingsCopy);
        this.form.controls['NOTE2'].patchValue(this.inputs['NOTE2'].value);
        if (JSON.stringify(this.currentCbFields) !== JSON.stringify(this.startRolesCb) && !this.singleOwnerCab) {
            this.currentCbFields = [...this.startRolesCb];
            this.patchCbRoles();
            this.queryRoles = [];
        } else {
            this.cancelValues(this.controls, this.formControls);
        }
        this.clearMap();
        this._pushState();
        this.editModeF();
    }
    cancelValues(inputs, form: FormGroup) {
        Object.keys(inputs).forEach((key, val, arr) => {
            form.controls[key].patchValue(inputs[key].value, { emitEvent: false });
        });
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
    }
    tf() {
        const val1 = this.formAccess.controls['0-1'].value;
        const val2 = this.formAccess.controls['delo_web'].value;
        if (val1 || val2) {
            this.formControls.controls['SELECT_ROLE'].enable({ emitEvent: false });
        }
        if (!val1 && !val2) {
            this.formControls.controls['SELECT_ROLE'].patchValue(null);
            this.formControls.controls['SELECT_ROLE'].disable({ emitEvent: false });
        }
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
            this._toggleFormControl(this.formAccess.controls['1-27'], !$event.target.checked);
        }
    }
    editModeF() {
        if (this.editMode) {
            this.form.enable({ onlySelf: true, emitEvent: false });
            this.formControls.enable({ onlySelf: true, emitEvent: false });
            this.formAccess.enable({ onlySelf: true, emitEvent: false });
            this.formSettingsCopy.enable({ onlySelf: true, emitEvent: false });
        } else {
            this.form.disable({ onlySelf: true, emitEvent: false });
            this.formControls.disable({ onlySelf: true, emitEvent: false });
            this.formAccess.disable({ onlySelf: true, emitEvent: false });
            this.formSettingsCopy.disable({ onlySelf: true, emitEvent: false });
        }
    }
    close() {
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }

    getUserDepartment(isn_cl): Promise<any> {
        const queryCabinet = {
            DEPARTMENT: {
                criteries: {
                    ISN_NODE: String(isn_cl)
                }
            }
        };
        return this.apiSrvRx.read(queryCabinet)
            .then(result => {
                return result;
            });
    }

    showDepartment() {
        this.isShell = true;
        let dueDep = '';
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                if (data === '') {
                    throw new Error();
                }
                dueDep = data;
                return this._userParamSrv.getDepartmentFromUser([dueDep]);
            })
            .then((data: DEPARTMENT[]) => {
                // при переназначении ДЛ меняем это поле в бд, для ограниченного технолога
                if (this.inputs['DUE_DEP_NAME'].value === data[0].CLASSIF_NAME) {
                    this.form.get('TECH_DUE_DEP').patchValue(data[0]['DEPARTMENT_DUE']);
                    this.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
                        this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
                    });
                    return data[0];
                }
                return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0], true).then(val => {
                    if (data) {
                        this.form.get('TECH_DUE_DEP').patchValue(data[0]['DEPARTMENT_DUE']);
                    }
                    this.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
                        this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
                    });
                    return val;
                });
            })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                this.dueDepName = dep['CLASSIF_NAME'];
                this.dueDepSurname = dep['SURNAME'];
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
                this.form.get('SURNAME_PATRON').patchValue(dep['SURNAME']);
                this.inputs['DUE_DEP_NAME'].data = dep['DUE'];
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

    getTemplateUser(template: TemplateRef<any>, className: string): void {
        if (this.editMode) {
            this.modalRef = this.modalService.show(template, { class: className, ignoreBackdropClick: true });
        }
    }
    closeSerts() {
        this.modalRef.hide();
    }

    saveCbRoles(evnt: IRoleCB[]) {
        this.currentCbFields = evnt;
        if (this.currentCbFields.length) {
            this.patchCbRoles();
        } else {
            this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
            this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
            this.cancelValues(this.controls, this.formControls);
            // this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        }
        if (JSON.stringify(this.startRolesCb) !== JSON.stringify(this.currentCbFields)) {
            this.getQueryFromRoles();
            this._pushState();
        }
    }

    getQueryFromRoles() {
        this.queryRoles = [];
        this.currentCbFields.forEach((field, indx) => {
            if (!field.isnRole) {
                const newElem = {
                    method: 'POST',
                    requestUri: `CBR_USER_ROLE(-99)`,
                    data: {
                        WEIGHT: indx + 1,
                        DUE_PERSON: field.hasOwnProperty('due') ? field.due : this.curentUser.DUE_DEP,
                        KIND_ROLE: KIND_ROLES_CB.indexOf(field.role) + 1,
                        ISN_USER: this.curentUser.ISN_LCLASSIF,
                    }
                };
                if (this.queryRoles.filter(elem => JSON.stringify(newElem) === JSON.stringify(elem)).length === 0) {
                    this.queryRoles.push(newElem);
                }
           }
        });
        this.startRolesCb.forEach((old, index) => {
            const kindRole = KIND_ROLES_CB.indexOf(old.role);
            const weigthNow = this.currentCbFields[index] && this.currentCbFields[index].isnRole === old.isnRole ? false : true;
            if (kindRole === 3 || kindRole === 4 || weigthNow) {
                const repeatRole = this.currentCbFields.filter(cur => cur.isnRole === old.isnRole)[0];
                if (repeatRole) {
                    this.queryRoles.push({
                        method: 'MERGE',
                        requestUri: `CBR_USER_ROLE(${repeatRole.isnRole})`,
                        data: {
                            WEIGHT: this.currentCbFields.indexOf(repeatRole) + 1,
                            DUE_PERSON: repeatRole.due,
                            KIND_ROLE: kindRole + 1,
                            ISN_USER: this.curentUser.ISN_LCLASSIF,
                        }
                    });
                } else {
                    const checkArr = this.queryRoles.map(q => q.requestUri);
                    if (old.isnRole && checkArr && checkArr.indexOf(`CBR_USER_ROLE(${old.isnRole})`) === -1) {
                        this.queryRoles.push({
                            method: 'DELETE',
                            requestUri: `CBR_USER_ROLE(${old.isnRole})`,
                        });
                    }
                }
            } else {
                if (this.currentCbFields.filter(cur => cur.isnRole === old.isnRole).length === 0) {
                    const checkArr = this.queryRoles.map(q => q.requestUri);
                    if (old.isnRole && checkArr.indexOf(`CBR_USER_ROLE(${old.isnRole})`) === -1) {
                        this.queryRoles.push({
                            method: 'DELETE',
                            requestUri: `CBR_USER_ROLE(${old.isnRole})`,
                        });
                    }
                }
            }
        });
    }

    patchCbRoles() {
        let str = '';
        if (this.currentCbFields.length === 1) {
            str = this.currentCbFields[0].role;
        } else if (this.currentCbFields.length === 0) {
            this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
            this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
            this.cancelValues(this.controls, this.formControls);
        } else {
            str = this.currentCbFields[0].role + ' ...';
        }
        this.controlField[1].options = [{
            title: str,
            value: str
        }];
        this.controlField[1].value = str;
        if (this.currentCbFields.length === 0 /* && this._userParamSrv.hashUserContext['CATEGORY'] */) {
            this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
        }
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.cancelValues(this.controls, this.formControls);
        // this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
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
        this._userParamSrv.setChangeState({ isChange: this.stateHeaderSubmit, disableSave: !this.getValidDate});
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
                    if (this.dueDepNameNullUndef(this.form.get('DUE_DEP_NAME').value)) {
                        this._confirmSrv.confirm(CONFIRM_UPDATE_USER).then(confirmation => {
                            if (confirmation) {
                                this.form.get('TECH_DUE_DEP').patchValue('');
                                this.form.get('DUE_DEP_NAME').patchValue('');
                                this.form.get('DUE_DEP_NAME').disable();
                                this.form.get('DUE_DEP_NAME').setValidators(null);
                                this.formControls.controls['SELECT_ROLE'].patchValue('');
                                this.formControls.controls['SELECT_ROLE'].disable();
                            } else {
                                this.curentUser.isTechUser = data;
                                f.get('teсhUser').setValue(false);
                            }
                        }).catch(error => {
                            console.log('Ошибка', error);
                        });
                    }
                    this.form.get('SURNAME_PATRON').patchValue(this.form.get('CLASSIF_NAME').value, { emitEvent: false });
                    this.formControls.controls['SELECT_ROLE'].patchValue('...');
                    this.formControls.controls['SELECT_ROLE'].disable();
                } else {
                    this.curentUser.isTechUser = data;
                    this.form.controls['DUE_DEP_NAME'].patchValue(this.dueDepName);
                    this.form.get('SURNAME_PATRON').patchValue(this.dueDepSurname, { emitEvent: false });
                    this.formControls.controls['SELECT_ROLE'].patchValue(this._userParamSrv.hashUserContext['CATEGORY'] ? this._userParamSrv.hashUserContext['CATEGORY'] : '...');
                    this.formControls.controls['SELECT_ROLE'].enable();
                    this.tf();
                }
            });
        this.form.get('CLASSIF_NAME').valueChanges
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(data => {
                if (f.get('teсhUser').value) {
                    this.form.get('SURNAME_PATRON').patchValue(data, { emitEvent: false });
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

    private _getUserCl(isn: number|number[]) {
        let queryUser;
        if (typeof isn === 'number') {
            queryUser = {
                USER_CL: {
                    criteries: {
                        ISN_LCLASSIF: isn
                    }
                }
            };
        } else {
            queryUser = {
                USER_CL: isn,
            };
        }
        return this.apiSrvRx.read<USER_CL>(queryUser);
    }

    private dropLogin(id): Promise<any> {
        const url = `DropLogin?isn_user=${id}`;
        return this.apiSrvRx.read({ [url]: ALL_ROWS });
    }
    private AddUnderscore(string: string): string {
        return string.replace(new RegExp('_', 'g'), '[' + '_' + ']');
    }
    private SEARCH_INCORRECT_SYMBOLS() {
        return  new RegExp('["|\']', 'g');
    }
    private setValidators() {
        this.form.controls['CLASSIF_NAME'].setAsyncValidators((control: AbstractControl) => {
            if (!this.curentUser['IS_PASSWORD']) {
                this.inputs['CLASSIF_NAME'].readonly = true;
            }
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
}
