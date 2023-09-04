import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { DEPARTMENT, USER_CERTIFICATE, USER_CL, DELO_BLOB, USERDEP } from '../../../eos-rest';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { BASE_PARAM_INPUTS_CB, BASE_PARAM_ACCESS_INPUT, BASE_PARAM_CONTROL_INPUT } from '../../../eos-user-params/shared/consts/base-param.consts';
import { InputParamControlService } from '../../../eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl, IRoleCB } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from '../shared/base-param-curent.descriptor';
import { OPEN_CLASSIF_DEPARTMENT, OPEN_CLASSIF_FROM_TECH_DUE_DEP } from '../../../eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from '../../../eos-user-params/shared/services/user-params-api.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from '../../../eos-common/consts/common.consts';
import { NavParamService } from '../../../app/services/nav-param.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_UPDATE_USER } from '../../../eos-user-select/shered/consts/confirm-users.const';
import { IMessage } from '../../../eos-common/interfaces';
import { RtUserSelectService } from '../../../eos-user-select/shered/services/rt-user-select.service';
import { CONFIRM_AVSYSTEMS_UNCHECKED, CONFIRM_REDIRECT_AUNT, CONFIRM_SURNAME_REDACT } from '../../../eos-dictionaries/consts/confirm.consts';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { KIND_ROLES_CB } from '../../../eos-user-params/shared/consts/user-param.consts';
import { EMPTY_SEARCH_DL_RESULTS, ESelectDepart } from '../base-param.component';
import { UserSettingsService } from '../../../eos-rest/services/user-settings.service';
import { UserType } from '../../../eos-rest/enum/user-type';
import { IConfirmWindow2 } from '../../../eos-common/confirm-window/confirm-window2.component';
import { ETypeDeloRight } from '../../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights.consts';
import { LoginLengthService } from '../../../eos-user-params/shared/services/login-length.service';

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
    title: string;
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
    singleOwnerCab: boolean = true;
    initSingleOwnerCab: boolean = true;
    currentCbFields: IRoleCB[] = [];
    startRolesCb: IRoleCB[] = [];
    isPhoto: boolean | number = false;
    urlPhoto: string = '';
    errorSave: boolean;
    queryRoles: any[] = [];
    startIsPhoto: boolean | number = false;
    startUrlPhoto: string = '';
    surnameDepartment: string = '';
    updateDL: boolean = false;
    public LicenzeInfo;
    public actualLicenz = [];
    public isShell: boolean = false;
    public criptoView: boolean = false;
    public userSertsDB: USER_CERTIFICATE;
    public maxLoginLength: string;
    private _descSrv;
    private _newData: Map<string, any> = new Map();
    private _newDataformControls: Map<string, any> = new Map();
    private _newDataformAccess: Map<string, any> = new Map();
    private modalRef: BsModalRef;
    private rightsCBDueRole: boolean = false;
    private clearRoles;
     // блок автопоиска при выборе ДЛ
     private _idsForModalDictDep: string[] = []; // @task157113 due ДЛ для окна выбора
     private _defaultDepDue: string;
     private _searchLexem: string = '';
     private _depDueLinkOrg: string = undefined;
     private _sysParamsDueOrganiz: string = undefined;

    get newInfo() {
        if (this._newDataformAccess.size || this._newData.size || this._newDataformControls.size || this.queryRoles.length || this.rightsCBDueRole) {
            return false;
        }
        return true;
    }
    private _ngUnsubscribe: Subject<void> = new Subject<void>();

    get stateHeaderSubmit() {
        return this._newData.size > 0 || this._newDataformAccess.size > 0 || this._newDataformControls.size > 0 || this.queryRoles.length > 0;
    }
    get getCbRole() {
        return this.editMode && !this.singleOwnerCab && (this.gt()['delo_web_delo'] || this.gt()['delo_web']) && !this.curentUser.isTechUser;
    }
    get appctx() {
        return this._appCtx.limitCardsUser.length;
    }
    get getSelectNote(): boolean {
        return !this.form.controls['TECH_DUE_DEP'].value;
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
        private _userSettingsService: UserSettingsService,
        private _appCtx: AppContext,
        private loginLength: LoginLengthService
    ) {}

    ngOnInit() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List,USERDEP_List',
            shortSys: true
        }).then(async (data) => {
            if (data) {
                let flagAncud = false;
                let flagCrypto = false;
                this._userParamSrv.curentUser.USER_PARMS_List.forEach(elem => {
                    if (elem.PARM_NAME === 'ANCUD' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('SIGNATURA') !== -1) {
                        flagAncud = true;
                    }
                    if (elem.PARM_NAME === 'CRYPTO_ACTIVEX' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('EosUtils.EosCryptoSvc') !== -1) {
                        flagCrypto = true;
                    }
                });
                if (flagCrypto && flagAncud) {
                    this.criptoView = flagCrypto && flagAncud;
                } else {
                    const answer = await this.apiSrvRx.read<any>({
                        USER_PARMS: {
                            criteries: {
                                ISN_USER_OWNER: '-99',
                                PARM_NAME: 'ANCUD|CRYPTO_ACTIVEX'
                            }
                        }
                    });
                    answer.forEach((elem) => {
                        if (elem.PARM_NAME === 'ANCUD' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('SIGNATURA') !== -1) {
                            flagAncud = true;
                        }
                        if (elem.PARM_NAME === 'CRYPTO_ACTIVEX' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('EosUtils.EosCryptoSvc') !== -1) {
                            flagCrypto = true;
                        }
                    })
                }
                this.apiSrvRx.read<any>({
                    LicenseInfo: ALL_ROWS
                })
                .then(ans => {
                    if (typeof (ans) === 'string') {
                        this.LicenzeInfo = JSON.parse(ans);
                    } else {
                        this.LicenzeInfo = ans;
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
                // if (localStorage.getItem('lastNodeDue') == null) {
                //     localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
                // }
            }
        });
        this._userParamSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this._ngUnsubscribe)
            )
        .subscribe((rout: RouterStateSnapshot) => {
                this._userParamSrv.submitSave = this.submit('true');
        });
        this._userSettingsService.readDepartments().then(x => { // @task157113 читаем подразделение по дефолту и организацию из параметров (если надо)
            const { sections } = x;
            this._defaultDepDue = this._existsMainFolder(sections) ? this._getDueDepFefault(sections) : '';
            if (this._defaultDepDue.length === 0) {
                this.apiSrvRx.read({
                    DELO_OWNER: 1
                }).then(org => {
                    if (org.length > 0) { // задана организация по умолчанию
                        this._sysParamsDueOrganiz = org[0]['DUE_ORGANIZ'];
                        this._readSysParamsOrg();
                    }
                });
            }
        });
    }

    afterInit() {
        this._userParamSrv.curentUser.USER_PARMS_List.forEach(elem => {
            if (elem.PARM_NAME === 'CRYPTO_INITSTR' && elem.PARM_VALUE && elem.PARM_VALUE.indexOf('spki') !== -1) {
                this.criptoView = true;
            }
        });
        this.selfLink = this._router.url.split('?')[0];
        this.init();
        this.getTitle();
        if (!this.curentUser['IS_PASSWORD'] && this.curentUser.USERTYPE !== 1 && this.curentUser.USERTYPE !== -1 && this.curentUser.USERTYPE !== 4) {
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

    init() {
        this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
        this.curentUser = this._userParamSrv.curentUser;
        if (this.curentUser.DUE_DEP) {
            this.getPhotoUser(this.curentUser.DUE_DEP, true)
            .then(() => {
                this.initSingleOwnerCab = this.singleOwnerCab;
            });
        }
        const baseInput = [...BASE_PARAM_CONTROL_INPUT];
        /*
        * По логике в ЦБ может быть роль или роль вибр и одна из них должна быть заполнена если не заполнена ни одна то выдавать ошибку
        */
        baseInput.forEach((item) => {
            if (item.key === 'SELECT_ROLE') {
                item.required = false;
            }
        });
        this.inputFields = this._descSrv.fillValueInputField(BASE_PARAM_INPUTS_CB, !this.editMode);
        this.controlField = this._descSrv.fillValueControlField(baseInput, !this.editMode);
        this.accessField = this._descSrv.fillValueAccessField(BASE_PARAM_ACCESS_INPUT, !this.editMode);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);
        if (this.inputs['NOTE'].value === 'null') {
            this.inputs['NOTE'].value = '';
        }
        this.inputs['NOTE'].value = this.inputs['NOTE'].value || '';
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);
        // установка значения в связи с новым контролом @task161934
        // this.dueDepName = this.form.controls['DUE_DEP_NAME'].value;
        this.dueDepName = this.inputs['DUE_DEP_NAME'].value;
        this.dueDepSurname = this.curentUser['SURNAME_PATRON'];
        this.maxLoginLength = this.loginLength.definitionValue(String(this.curentUser.USERTYPE));
        this.isLoading = false;
        this.setValidators();
        this.subscribeForms();
        return Promise.resolve();
    }

    /**
     * 
     * @param flag Передаём галочку технического пользователя
     */
    updateParamsTech(flag: boolean) {
        this.accessField.forEach((item) => {
            switch (item['key']) {
                case 'delo_web':
                case '25':
                case '17':
                case '15':
                case '2':
                case '5':
                    if (flag) {
                        this.formAccess.get(item['key']).disable({emitEvent: false});
                        this.formAccess.get(item['key']).setValue(false);
                    } else if (this.formAccess.get(item['key']).disabled) {
                        this.formAccess.get(item['key']).enable({emitEvent: false});
                        this.formAccess.get(item['key']).setValue(item.value || false);
                    }
                    break;
                case '1-27':
                    if (flag) {
                        this.formAccess.get(item['key']).disable({emitEvent: false});
                        this.formAccess.get(item['key']).setValue(null);
                    } else if (this.formAccess.get(item['key']).disabled) {
                        this.formAccess.get(item['key']).enable({emitEvent: false});
                        this.formAccess.get(item['key']).setValue(item.value || false);
                    }
                    break;
                default:
                    break;
            }
        });
    }
    createActualLicenze() {
        const masEl = [];
        this.LicenzeInfo.forEach(elem => {
            if (elem.Users > elem.ActualUsers || (elem.Id === 28 && elem.Users > 0)) {
                masEl.push('' + (elem.Id - 1));
            }
        });
        if (masEl.indexOf('0') !== -1 && (masEl.indexOf('1') !== -1 || masEl.indexOf('31') !== -1)) {
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
                } else {
                    this.formAccess.controls['1-27'].setValue(radioVal, { emitEvent: false });
                    this._toggleFormControl(this.formAccess.controls['1-27'], true);
                }
            }
        }
    }
    editLicenze() {
        if (this.LicenzeInfo.length === 0) {
            return;
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
    getPhotoUser(due: string, init?: boolean): Promise<any> {
        return this._userParamSrv.getPhotoUser(due).then((data: DEPARTMENT[]) => {
            this.isPhoto = data[0]['ISN_PHOTO'];
            this.surnameDepartment = data[0]['SURNAME'];
            if (this.isPhoto) {
                this._rtUserSel.getSVGImage(this.isPhoto).then((res: DELO_BLOB[]) => {
                    const url = `url(data:image/${res[0].EXTENSION};base64,${res[0].CONTENTS})`;
                    this.urlPhoto = url;
                    if (init) {
                        this.startUrlPhoto = this.urlPhoto;
                        this.startIsPhoto = this.isPhoto;
                    }
                });
            } else {
                this.startUrlPhoto = null;
                this.startIsPhoto = null;
            }
            if (!this.curentUser.isTechUser) {
                return this.getCabinetOwnUser(data[0]['ISN_CABINET'], data[0]['DUE'], init);
            } else {
                this.singleOwnerCab = true;
                this.patchCbRoles();
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

    dueDepNameNullUndef(date: string): boolean {
        if (!date) {
            return false;
        }
        return true;
    }

    getCabinetOwnUser(isnCabinet: number, due: string, changeDue: boolean): Promise<any> {
        if (isnCabinet) {
            return this._userParamSrv.getCabinetOwnUser(isnCabinet).then((depD: DEPARTMENT[]) => {
                if (depD.length === 1) {
                    this.singleOwnerCab = false;
                    return this._userParamSrv.getUserCbRoles(due).then((data: IRoleCB[]) => {
                        if (changeDue) {
                            this.startRolesCb = data;
                            this.currentCbFields = JSON.parse(JSON.stringify(this.startRolesCb));
                        }
                        this.patchCbRoles();
                    });
                } else {
                    this.singleOwnerCab = true;
                    this.patchCbRoles();
                }
            });
        } else {
            this.singleOwnerCab = true;
            this.patchCbRoles();
        }
    }

    getTitle(): void {
        if (this.curentUser.isTechUser) {
            this.title = this.curentUser.CLASSIF_NAME;
        } else {
            this.title = `${this.curentUser['DUE_DEP_SURNAME']} (${this.curentUser['CLASSIF_NAME']})`;
        }
    }

    cheackCtech(): boolean {
        if (!this.dueDepNameNullUndef(this.formControls.get('DUE_DEP_NAME').value) && !this.curentUser.isTechUser) {
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
                            // this.form.get('NOTE').patchValue('');
                        }
                        newD['NOTE'] = '' + (this.form.get('NOTE').value || '');
                        newD['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                    }
                    if (key === 'TECH_DUE_DEP') {
                        newD['NOTE'] = '' + (this.form.get('NOTE').value || '');
                        newD['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                    }
                    delete newD['DUE_DEP_NAME'];
                });
            }
            /* if (newD['TECH_DUE_DEP']) {
                delete newD['NOTE'];
            } */
            query.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: newD
            });
            if ((newD.hasOwnProperty('AV_SYSTEMS') && newD['AV_SYSTEMS'].charAt(1) === '0') || (newD.hasOwnProperty('DUE_DEP') && newD.DUE_DEP !== undefined)) {
                this.clearRoles = this._userParamSrv.clearRolesCb(this.startRolesCb);
            }
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
                    if (i === 24 || i === 25 || i === 33) {
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
            if (!/1/.test(accessStr)) {
                return true;
            }
        }
        return false;
    }
    /** Если снимаем галочку личного доступа у администратора системы */
    getCheckAdmSave() {
        return this.formAccess.controls['1-27'].value !== '1' && this.accessInputs['1-27'].value === '1';
    }
    submit(meta?: string): Promise<any> {
        if (this.getErrorSave) {
            this.messageAlert({ title: 'Предупреждение', msg: 'Изменения не сохранены', type: 'warning' });
            return Promise.resolve('error');
        }
        if (this.cheackCtech() || this.checkRole()) {
            return Promise.resolve('error');
        }
        if (this._newData.get('IS_SECUR_ADM') && this.curentUser.DELO_RIGHTS && this.curentUser.DELO_RIGHTS[+ETypeDeloRight.SystemTechnologist] === '1') {
            this.messageAlert({ title: 'Предупреждение', msg: `Право "Администратор системы" не может быть назначено одновременно с правом "Cистемный технолог"`, type: 'warning' });
            return Promise.resolve('error');
        }
        const id = this._userParamSrv.userContextId;
        const newD = {};
        const query = [];
        const accessStr = '';
        return this.checkDLSurname(query)
            .then(async () => {
                this.setQueryNewData(accessStr, newD, query);
                this.setNewDataFormControl(query, id);
                if (this._newData.get('IS_SECUR_ADM') === false || this.getCheckAdmSave()) {
                    if (this.getCheckAdmSave()) {
                        const answ: USER_CL[] = await this._userParamSrv.getQueryTech();
                        if (!(answ.length !== 0)) {
                            this.confirmAlert({
                                title: 'Предупреждение',
                                typeIcon: 'warning',
                                bodyList: [],
                                body: `В системе не будет ни одного действующего системного технолога с полным доступом к справочнику "Пользователя"`,
                                buttons: [
                                    {title: 'Скрыть ', result: 1, isDefault: true},
                                ],
                            })
                            return 'error';
                        }
                    }
                    return this.apiSrvRx.read<USER_CL>({
                        USER_CL: PipRX.criteries({
                            'IS_SECUR_ADM': '1',
                            'ORACLE_ID': 'isnotnull',
                            'AV_SYSTEMS':'_1________________________________________%'
                        }),
                        orderby: 'ISN_LCLASSIF',
                        top: 2,
                        loadmode: 'Table'
                    }).then((admns: USER_CL[]) => {
                        const adminUsers = this._apiSrv._getListUsers(admns).filter((user) => {
                            return user.id !== this.curentUser.ISN_LCLASSIF && !user.blockedUser && !user.blockedSystem && !user.deleted;
                        });
                        if (!adminUsers.length) {
                            this.confirmAlert({
                                title: 'Предупреждение',
                                typeIcon: 'warning',
                                bodyList: [],
                                body: 'В системе не будет ни одного незаблокированного пользователя с правом «Администратор»',
                                buttons: [
                                    {title: 'Скрыть ', result: 1, isDefault: true},
                                ],
                            })
                            return 'error';
                        } else {
                            /*  добавил meta чтобы не появлялось сообщение о смене пароля при переходе на другую вкладку */
                            if (
                                !this.curentUser['IS_PASSWORD'] && 
                                this.curentUser.USERTYPE !== UserType.OSAuthentication && 
                                // this.curentUser.USERTYPE !== UserType.noLoginRights && 
                                this.curentUser.USERTYPE !== UserType.OSAuthenticationServer && 
                                !meta
                            ) {
                                return this._confirmSrv.confirm(CONFIRM_REDIRECT_AUNT).then(res => {
                                    if (res) {
                                        return this.ConfirmAvSystems(accessStr, id, query, meta).then(() => {
                                            this._router.navigate(['/user-params-set/auntefication']);
                                        });
                                    } else {
                                        return this.ConfirmAvSystems(accessStr, id, query, meta);
                                    }
                                });
                            } else {
                                return this.ConfirmAvSystems(accessStr, id, query, meta);
                            }
                        }
                    });
                } else {
                    /*  добавил meta чтобы не появлялось сообщение о смене пароля при переходе на другую вкладку */
                    if (
                        !this.curentUser['IS_PASSWORD'] && 
                        this.curentUser.USERTYPE !== UserType.OSAuthentication && 
                        // this.curentUser.USERTYPE !== UserType.noLoginRights && 
                        this.curentUser.USERTYPE !== UserType.OSAuthenticationServer && 
                        !meta
                    ) {
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
    }
    /**
     * метод checkRole
     * проверяет перед сохранением, что у пользователя
     * задана роль (поле SELECT_ROLE не пустое)
     */
    private checkRole(): boolean {
        const role = this.formControls.get('SELECT_ROLE');
        if (!role.value && !role.disabled) {
            if (!this.controls['SELECT_ROLE_VIBR'].value) {
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
        return false;
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

    ConfirmAvSystems(accessStr: string, id: number, query: any[], route?: string): Promise<any> {
        if (this.uncheckedAvSystems()) {
            return this._confirmSrv.confirm(CONFIRM_AVSYSTEMS_UNCHECKED).then(res => {
                // меняем метод saveAfterSystems на saveData
                // так как согласно таску 139328:
                // "Разрешаем назначать роль пользователю без АДЛ"
                // не имеет смысла проверка кабинета
                if (res) {
                    if (this.clearRoles) {
                        query = query.concat(JSON.parse(JSON.stringify(this.clearRoles)));
                    }
                    return this.saveData(accessStr, id, query, route);
                } else {
                    this.clearRoles = undefined;
                    return;
                }
            });
        }
        this.clearRoles = undefined;
        return this.saveData(accessStr, id, query, route);
    }

    // saveAfterSystems(accessStr: string, id: number, query: any): Promise<any> {
    //     if (this.formControls.controls['SELECT_ROLE'].value && this.formControls.controls['SELECT_ROLE'].value !== '...') {
    //         return this._rtUserSel.getInfoCabinet(this.curentUser.ISN_LCLASSIF).then(cab => {
    //             if (cab/* || cab === undefined*/) {
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

    saveData(accessStr: string, id: number, query: any, route?: string): Promise<any> {
        this.isLoading = true;
        if (this.inputs.CLASSIF_NAME.value !== this.form.value.CLASSIF_NAME) {
            if (this.curentUser['IS_PASSWORD'] === 0) {
                return this.sendData(query, accessStr, route);
            } else {
                const queryPas = [{
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: {
                        IS_PASSWORD: 0
                    }
                }];
                return this._userParamSrv.сhangeLogin(id, this.curentUser.USERTYPE, this.form.controls['CLASSIF_NAME'].value).then(() => {
                    if (+this.curentUser.USERTYPE !== 1) {
                        this.messageAlert({ title: 'Предупреждение', msg: `Изменён логин, нужно задать пароль`, type: 'warning' });
                        return this.apiSrvRx.batch(queryPas, '').then(() => {
                            return this.sendData(query, accessStr, route);
                        });
                    } else {
                        return this.sendData(query, accessStr, route);
                    }
                }).catch(error => {
                    this._errorSrv.errorHandler(error);
                    this.cancel();
                });
            }
        } else {
            return this.sendData(query, accessStr, route);
        }
    }

    sendData(query, accessStr, route?): Promise<any> {
        return Promise.all([
            this.apiSrvRx.batch(this.queryRoles, ''),
            this._apiSrv.setData(query)])
            .then(() => {
                const newDl = this._newData.get('DUE_DEP_NAME');
                if (newDl) {
                    return this.apiSrvRx.batch([{
                        method: 'POST',
                        requestUri: `FillUserCl?isn_user=${this._userParamSrv.curentUser.ISN_LCLASSIF}&role=${encodeURI(this.formControls.value.SELECT_ROLE)}&isn_user_copy_from=0`
                    }], '')
                    .then(() => {
                        return this.AfterSubmit(accessStr, query, route);
                    });
            } else {
                return this.AfterSubmit(accessStr, query, route);
            }
            }).catch(error => {
                this._nanParSrv.scanObserver(!this.accessInputs['3'].value);
                this.cancel();
                this._errorSrv.errorHandler(error);
            });
    }
    AfterSubmit(accessStr: string, query, route?): Promise<any> {
        if (accessStr.length > 1) {
            const number = accessStr.charAt(3);
            this._nanParSrv.scanObserver(number === '1' ? false : true);
        }
        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        this.clearMap();
        this.startRolesCb = [];
        this.queryRoles = [];
        if (route === 'true') {
            return Promise.resolve();
        }
        return this.GetUserData().then(() => {
            if (this.currentCbFields.length) {
                this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
                this.controls['DUE_DEP_NAME'].value = this.dueDepName;
                this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
                this.cancelValues(this.controls, this.formControls);
                this.currentCbFields = [];
            }
            if (this.curentUser.DUE_DEP) {
                return this.getPhotoUser(this.curentUser.DUE_DEP, true)
                .then(() => {
                    this.initSingleOwnerCab = this.singleOwnerCab;
                });
            }
        });
    }

    GetUserData(): Promise<any> {
        return this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List,USERDEP_List',
            shortSys: true
        }).then(() => {
            this.editMode = false;
            if (this.updateDL) {
                this.updateDL = false;
                this.dueDepName = String(this.form.controls['DUE_DEP_NAME'].value).replace(this.curentUser._orig['SURNAME_PATRON'], this.form.controls['SURNAME_PATRON'].value);
                this.form.controls['DUE_DEP_NAME'].setValue(this.dueDepName, { emitEvent: false });
            } else {
                this.dueDepName = this.form.controls['DUE_DEP_NAME'].value;
            }
            this.curentUser = this._userParamSrv.curentUser;
            this.getTitle();
            this.upform(this.inputs, this.form);
            this.upform(this.controls, this.formControls);
            this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);
            this.upform(this.accessInputs, this.formAccess);
            this.dueDepSurname = this.form.controls['SURNAME_PATRON'].value;
            if (this.curentUser.isTechUser) {
                this.singleOwnerCab = true;
            }
            this.isLoading = false;
            this.editModeF();
            this._pushState();
            this._userParamSrv.ProtocolService(this._userParamSrv.curentUser.ISN_LCLASSIF, 4);

            if (this.curentUser.DUE_DEP && this.currentCbFields.length && this.rightsCBDueRole) {
                this._userParamSrv.addRightsForCBRole(this.curentUser.ISN_LCLASSIF);
                this.rightsCBDueRole = false;
            }
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
        this.dueDepName = this.curentUser._orig['DUE_DEP_NAME'];
        this.dueDepSurname = this.inputs['SURNAME_PATRON'].value;
        this.isPhoto = this.startIsPhoto;
        this.startUrlPhoto = this.startUrlPhoto;
        this.cancelValues(this.inputs, this.form);
        this.cancelValues(this.accessInputs, this.formAccess);
        this.form.controls['NOTE2'].patchValue(this.inputs['NOTE2'].value);
        if (JSON.stringify(this.currentCbFields) !== JSON.stringify(this.startRolesCb) && !this.singleOwnerCab) {
            this.currentCbFields = JSON.parse(JSON.stringify(this.startRolesCb));
            this.patchCbRoles();
            this.queryRoles = [];
        } else {
            // if (this.startRolesCb.length) {
            //     const str = this.startRolesCb.length > 1 ? this.startRolesCb[0].role + ' ...' : this.startRolesCb[0].role;
            //     this.controls['SELECT_ROLE'].options = [{
            //         title: str,
            //         value: str
            //     }];
            //     this.controls['SELECT_ROLE'].value = str;
            // } else {
            //     this.controls['SELECT_ROLE'].value = this._userParamSrv.hashUserContext['CATEGORY'];
            // }
            this.controls['SELECT_ROLE'].value = this._userParamSrv.hashUserContext['CATEGORY'];
            this.currentCbFields = JSON.parse(JSON.stringify(this.startRolesCb));
        }
        this.singleOwnerCab = this.initSingleOwnerCab;
        this.controls['teсhUser'].value = this._userParamSrv.isTechUser;
        this.controls['DUE_DEP_NAME'].value = this.dueDepName;
        this.cancelValues(this.controls, this.formControls);
        this.clearMap();
        this._pushState();
        this.editModeF();
    }
    getSerts(template: TemplateRef<any>): void {
        if (this.editMode) {
            this.modalRef = this.modalService.show(template, { class: 'serts', ignoreBackdropClick: true });
        }
    }
    cancelValues(inputs, form: FormGroup) {
        Object.keys(inputs).forEach((key, val, arr) => {
            form.controls[key].patchValue(inputs[key].value, { emitEvent: false });
        });
    }
    gt(): any {
       // const delo = this.formAccess.get('0').value;
       // const delo_web_delo = this.formAccess.get('0-1').value;
        const delo_web = this.formAccess.get('delo_web').value;
        return {
           delo_web
        };
    }
    edit() {
        this.curentUser.isTechUser = this.formControls.get('teсhUser').value;
        this.editMode = !this.editMode;
        this.editModeF();
        this.checRadioB();
        if (this.gt()['delo_web']) {
            this.checkMeinControlAccess({ target: { checked: true } }, 'delo_web');
        } else {
           // this._toggleFormControl(this.formAccess.controls['0'], false);
           // this._toggleFormControl(this.formAccess.controls['0-1'], false);
            this._toggleFormControl(this.formAccess.controls['delo_web'], false);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        }
        this.tf();
        this.updateParamsTech(this.formControls.get('teсhUser').value);
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
        // } else {
        // let str = '';
        // if (this.currentCbFields.length > 1) {
        //     str = this.currentCbFields[0].role + ' ...';
        // } else if (this.currentCbFields.length === 1) {
        //     str = this.currentCbFields[0].role;
        // }
        // if (str) {
        //     this.formControls.controls['SELECT_ROLE'].patchValue(str);
        // }
        // }
    }
    checkMeinControlAccess($event, data) {
        if (data === '0') {
           // this._toggleFormControl(this.formAccess.controls['0-1'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['delo_web'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        } else if (data === '0-1') {
           // this._toggleFormControl(this.formAccess.controls['0'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['delo_web'], $event.target.checked);
            this._toggleFormControl(this.formAccess.controls['1-27'], true);
        } else {
           // this._toggleFormControl(this.formAccess.controls['0'], $event.target.checked);
           // this._toggleFormControl(this.formAccess.controls['0-1'], $event.target.checked);
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
    close() { /*  */
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
                // при переназначении ДЛ меняем это поле в бд, для ограниченного технолога
                // if (this.inputs['DUE_DEP_NAME'].value === data[0].CLASSIF_NAME) {
                //     this.form.get('TECH_DUE_DEP').patchValue(data[0]['PARENT_DUE']);
                //     this._userParamSrv.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
                //         this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
                //     });
                //     return data[0];
                // }
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
                this.formControls.get('teсhUser').setValue(false);
                this.curentUser.DUE_DEP = dep['DUE'];
                this.inputs['DUE_DEP_NAME'].data = dep['DUE'];
                this.currentCbFields = [];
                return this.getPhotoUser(dep['DUE']);
            })
            .catch(() => {
                this.isShell = false;
            });
    }

    selectDepartment() {
        if (this.editMode) {
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
            ['2', '5', '15', '17',  '23', '25'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], false);
            });
        }
        if (this.gt()['delo']) {
            ['2', '5', '15', '17', '25', '26'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], false);
            });
            this._toggleFormControl(this.formAccess.controls['23'], true);
           // this._toggleFormControl(this.formAccess.controls['21'], true);
            this.formAccess.controls['23'].patchValue(false, { emitEvent: false });
           // this.formAccess.controls['21'].patchValue(false, { emitEvent: false });
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

    saveCbRoles(evnt: { currentFields: IRoleCB[], rightsDueRole: boolean }) {
        this.currentCbFields = evnt.currentFields;
        this.rightsCBDueRole = evnt.rightsDueRole;

        if (this.currentCbFields.length) {
            this.patchCbRoles();
        } else {
            this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
            this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
            this.cancelValues(this.controls, this.formControls);
        }
        if (JSON.stringify(this.startRolesCb) !== JSON.stringify(this.currentCbFields)) {
            this.queryRoles = this._userParamSrv.getQueryFromRoles(this.currentCbFields, this.startRolesCb, this.curentUser.DUE_DEP);
        } else {
            this.queryRoles = [];
        }
        this._pushState();
    }
    updateFieldCbToSet(CbFields): string {
        const ans = [];
        CbFields.forEach((r, index) => {
            // const name = r.dueName ? ' (' + r.dueName + ')' : '';
            const rol: string = r.role + ' (' + (index + 1) + '-я роль)';
            ans.push(rol)
        });
        return ans.join('\n');
    }
    patchCbRoles() {
        /* let str = '';
        if (this.currentCbFields.length === 1) {
            str = this.currentCbFields[0].role;
        } else if (this.currentCbFields.length !== 0) {
            str = this.currentCbFields[0].role + ' ...';
        } */
        this.controlField[2].value = this.updateFieldCbToSet(this.currentCbFields);
        if (this.currentCbFields.length === 0 /* && this._userParamSrv.hashUserContext['CATEGORY'] */) {
            this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
        }
        this.controlField.forEach((field) => {
            if (field.key === 'teсhUser') {
                field.value = false;
            }
        });
        // const standartRole: string[] = this._userParamSrv.sysParams['CATEGORIES_FOR_USER'].split(';');
        /* if (this.currentCbFields.length === 0 && standartRole.indexOf(this.formControls.controls['SELECT_ROLE'].value) > -1) {
            this.controlField[2].value = this.formControls.controls['SELECT_ROLE'].value;
        } */
        // this.controlField[0].value = false;
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.cancelValues(this.controls, this.formControls);
    }
    showDepChoose() {
        this.isShell = true;
        OPEN_CLASSIF_DEPARTMENT.selectMulty = false;
        OPEN_CLASSIF_DEPARTMENT['selected'] = '';
        if (this._isFromList(this.formControls.get('DUE_DEP_NAME').value)) { // выбрано что-то из выпадашки
            if (this._idsForModalDictDep.length > 0) {
                OPEN_CLASSIF_DEPARTMENT['selected'] = this._idsForModalDictDep[0];
            }
        } else {  // просто задана лексема и значение не выбрано
            OPEN_CLASSIF_DEPARTMENT.search_query = this._searchLexem;
        }
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                this._setDepartment(data);
            })
            .catch(() => {
                this.isShell = false;
            });
    }
    showDepChooseEmpty() {
        this.isShell = true;
        OPEN_CLASSIF_DEPARTMENT.selectMulty = false;
        OPEN_CLASSIF_DEPARTMENT['selected'] = '';
        OPEN_CLASSIF_DEPARTMENT.search_query = this._searchLexem;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
            .then((data: string) => {
                this._setDepartment(data);
            })
            .catch(() => {
                this.isShell = false;
            });
    }
    private _searchDLinSysParamsOrg() {
        this._searchLexem = this.formControls.get('DUE_DEP_NAME').value;
        this._searchEmpInDep(this._searchLexem, this._depDueLinkOrg);
    }
    private _setDepartment(due: string) {
        let dueDep = '';
        if (!due || due === '') {
            throw new Error();
        }
        dueDep = (due.split('|'))[0];
        this._userParamSrv.getDepartmentFromUser([dueDep])
            .then((data: DEPARTMENT[]) => {
                if (this.formControls.controls['DUE_DEP_NAME'].value) {
                    return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0], true).then(val => {
                            this.fillingDep(data);
                            return val;
                        })
                } else {
                    this.fillingDep(data);
                    return Promise.resolve(data[0]);
                }
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
                this.formControls.get('DUE_DEP_NAME').setValue(dep['CLASSIF_NAME'], { emitEvent: false }); // @task161934 - изменение значения в поле
                this.formControls.get('teсhUser').setValue(false);
                this.curentUser.DUE_DEP = dep['DUE'];
                this.inputs['DUE_DEP_NAME'].data = dep['DUE']; // @task161934 - данные для записи в БД
                this.curentUser.DUE_DEP_NAME = this.dueDepName;
                return this.getPhotoUser(dep['DUE']);
            })
            .catch(() => {
                this.isShell = false;
                this.formControls.get('DUE_DEP_NAME').patchValue(this._searchLexem, { emitEvent: false });
            });
    }

    private fillingDep(data) {
        if (data) {
            this.form.get('TECH_DUE_DEP').patchValue(data[0]['PARENT_DUE']);
        }
        this._userParamSrv.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
            this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
        });
    }
    
    private _isSymbolsCorrect(value): boolean {
        const REGEXP = new RegExp(/^[а-яА-ЯёЁA-Za-z0-9]+$/);
        return REGEXP.test(value);
    }

    private _getSafeQueryLexem(lexem): string {
        const AR = lexem.split('');
        for (let i = 0; i < AR.length; i++) {
            if (!this._isSymbolsCorrect(AR[i])) {
                AR[i] = '%';
            }
        }
        return AR.join('');
    }

    private _searchEmpInDep(empLexem, due) {
        empLexem = empLexem.substring(0, 1).toUpperCase() + empLexem.substring(1).toLowerCase();
        const BASE_VALUES = { IS_NODE: 1, DELETED: 0, CLASSIF_NAME: `%${this._getSafeQueryLexem(empLexem)}%` };
        let VALUES;
        if (due) {
            const ADD = { ISN_HIGH_NODE: due };
            VALUES = { ...BASE_VALUES, ...ADD };
        } else {
            VALUES = BASE_VALUES;
        }
        const CRIT = { DEPARTMENT: { criteries: VALUES } };
        this.apiSrvRx.read<DEPARTMENT>(CRIT).then(empItems => {
            if (empItems.length > 0) {
                const DEP_IDS = empItems.map(x => x.DEPARTMENT_DUE);
                VALUES = { DUE: DEP_IDS.join('|'), DELETED: 0, IS_NODE: 0 };
                const DEP_CRIT = { DEPARTMENT: { criteries: VALUES } };
                this.apiSrvRx.read<DEPARTMENT>(DEP_CRIT).then(depItems => {
                    this.controls['DUE_DEP_NAME'].options = [];
                    empItems.forEach(empItem => {// формируем список выпадашки
                        const { CLASSIF_NAME } = depItems.filter(({ DUE }) => empItem.DEPARTMENT_DUE === DUE)[0];
                        if (empItem.CLASSIF_NAME.toLocaleLowerCase().indexOf(this._searchLexem.toLocaleLowerCase()) >= 0) { // более строгая проверка на формирование dsgflfirb
                            const LIST_ITEM_NAME = `${empItem.CLASSIF_NAME} - ${CLASSIF_NAME}`;
                            this.controls['DUE_DEP_NAME'].options.push({ title: LIST_ITEM_NAME, value: empItem.CLASSIF_NAME, due: empItem.DUE });
                        }
                    });
                    // ставим активную первую запись @task161934 - в случае найденности чего либо
                    if (this.controls['DUE_DEP_NAME'].options.length > 0 && this.controls['DUE_DEP_NAME'].options[0].due !== '-1') {
                        this.controls['DUE_DEP_NAME'].dib.showDropDown();
                    }
                    this._idsForModalDictDep = [empItems[0].DUE]; // передаем только один
                });
            } else {
                this.controls['DUE_DEP_NAME'].options = [{
                    title: EMPTY_SEARCH_DL_RESULTS, value: EMPTY_SEARCH_DL_RESULTS, due: '-1',
                    disabled: true
                }];
                this.controls['DUE_DEP_NAME'].dib.showDropDown();
                this._idsForModalDictDep = [];
            }
        }).catch(err => { throw err; });
    }
    private _getDueDepFefault(obj): string {
        return obj.window.mainFolder;
    }
    private _existsMainFolder(obj): boolean {
        if (obj.window) {
            if (obj.window.mainFolder) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    private _readSysParamsOrg() {
        this.apiSrvRx.read<any>({ DEPARTMENT: PipRX.criteries({ DUE_LINK_ORGANIZ: this._sysParamsDueOrganiz }) }).then(items => {
            const DUE = items[0].DEPARTMENT_DUE;
            this._depDueLinkOrg = DUE.length <= 2 ? undefined : DUE;
        });
    }
    public clearDepartNote() {
        this.form.controls['NOTE'].setValue('');
    }
    public getDepartForTechDueDep() {
        if (this.editMode && (!this.getSelectNote || !this.form.controls['NOTE'].value)) {
            this.showDepartmentNote();
        }
    }
    public onKeyUp($event) {
        this.form.controls['TECH_DUE_DEP'].setValue(null);
    }
    async showDepartmentNote() {
        this.isShell = true;
        const openIcon = Object.assign({}, OPEN_CLASSIF_FROM_TECH_DUE_DEP);
        try {
            const dueDepart = await this._waitClassifSrv.openClassif(openIcon);
            if (!dueDepart || dueDepart === '') {
                throw new Error();
            }
            const depart = await this._userParamSrv.getDepartmentFromUser([dueDepart]);
            this.form.controls['TECH_DUE_DEP'].setValue(depart[ESelectDepart.selectOneElem]['DUE']);
            this.form.controls['NOTE'].setValue(depart[ESelectDepart.selectOneElem]['CLASSIF_NAME']);
            this.isShell = false;
        } catch (error) {
            this.isShell = false;
        }
    }
    private patchVal() {
        ['2', '5', '15', '17',  '23', '25', '26'].forEach(numberControl => {
            this.formAccess.controls[numberControl].patchValue(false, { emitEvent: false });
        });
    }
    private disableAccessSyst(flag) {
        if (flag) {
            ['2', '5', '15', '17',  '23', '25', '26'].forEach(numberControl => {
                this._toggleFormControl(this.formAccess.controls[numberControl], true);
            });
        } else {
            ['2', '5', '15', '17',  '23', '25', '26'].forEach(numberControl => {
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
        const newArr = [].concat(new Array(42).fill(0), new Array(13).fill(''), new Array(1).fill(0));
        arr.forEach((val, index) => {
            switch (index) {
                case 0:
                    if (data['0-1']?.value) {
                        newArr['0'] = '1';
                        newArr['1'] = '1';
                    } else {
                        newArr['1'] = '0';
                        if (data['0']?.value) {
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
                    if (this.dueDepNameNullUndef(this.form.get('DUE_DEP_NAME').value)) {
                        this._confirmSrv.confirm2(CONFIRM_UPDATE_USER).then(confirmation => {
                            if (confirmation && confirmation['result'] === 1) {
                                this.form.get('TECH_DUE_DEP').patchValue('');

                                this.form.get('DUE_DEP_NAME').patchValue('');
                                this.form.get('DUE_DEP_NAME').disable();
                                this.form.get('DUE_DEP_NAME').setValidators(null);

                                this.formControls.controls['DUE_DEP_NAME'].patchValue('');
                                this.formControls.controls['DUE_DEP_NAME'].disable();
                                this.formControls.controls['DUE_DEP_NAME'].setValidators(null);

                                this.updateParamsTech(this.formControls.get('teсhUser').value);

                                this.form.get('NOTE').patchValue('');
                                const selRol = ('' + this.formControls.controls['SELECT_ROLE'].value).replace(' ...', '');
                                if (KIND_ROLES_CB.indexOf(selRol) > -1) {
                                    this.formControls.controls['SELECT_ROLE'].patchValue('');
                                    const standartRole: string[] = this._userParamSrv.sysParams['CATEGORIES_FOR_USER'].split(';');
                                    this.controls['SELECT_ROLE'].options = [];
                                    standartRole.forEach((role) => {
                                        this.controls['SELECT_ROLE'].options.push({
                                            title: role,
                                            value: role
                                        });
                                    });
                                    // this.formControls.controls['SELECT_ROLE'].patchValue('');
                                    // this.formControls.controls['SELECT_ROLE'].disable();
                                }
                            } else {
                                this.curentUser.isTechUser = false;
                                f.get('teсhUser').setValue(false, { emitEvent: false });
                                this.updateParamsTech(false);
                            }
                        }).catch(error => {
                            console.log('Ошибка', error);
                        });
                    }
                    // this.form.get('SURNAME_PATRON').patchValue(this.form.get('CLASSIF_NAME').value, { emitEvent: false });
                    // this.formControls.controls['SELECT_ROLE'].patchValue('...');
                    // this.formControls.controls['SELECT_ROLE'].disable();
                } else {
                    this.curentUser.isTechUser = data;
                    this.form.controls['DUE_DEP_NAME'].patchValue(this.dueDepName);
                    this.form.get('NOTE').patchValue('');
                    // this.form.get('SURNAME_PATRON').patchValue(this.dueDepSurname, { emitEvent: false });
                    // this.formControls.controls['SELECT_ROLE'].patchValue(this._userParamSrv.hashUserContext['CATEGORY'] ? this._userParamSrv.hashUserContext['CATEGORY'] : '...');
                    // this.formControls.controls['SELECT_ROLE'].enable();
                    this.tf();
                    this.updateParamsTech(false);
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
        this._setDueDepNameSubscription();
    }
    private _setDueDepNameSubscription() {
        this.formControls.get('DUE_DEP_NAME').valueChanges
            .pipe(
                debounceTime(1200), takeUntil(this._ngUnsubscribe)
            )
            .subscribe(value => this._setDueDepName(value));
    }

    private _setDueDepName(value) {
        if (value.length < 3) { // нет поиска
            this.controls['DUE_DEP_NAME'].options = [];
            this._idsForModalDictDep = [];
        } else {
            if (this.controls['DUE_DEP_NAME'].options.length > 0) {
                if (!this._isFromList(value)) { // запуск поиска по лексеме
                    this.searchDL();
                } else { // выбрали из выпадашки значение
                    const ITEM = this.controls['DUE_DEP_NAME'].options.filter(item => item.value === value);
                    const DUE: string = ITEM[0].due;
                    this._idsForModalDictDep = [DUE];
                    this._setDepartment(DUE);
                }
            } else {
                this.searchDL();
            }
        }
    }
    searchDL() {
        this._searchLexem = this.formControls.get('DUE_DEP_NAME').value;
        if (this._defaultDepDue.length > 0) {
            this._searchEmpInDep(this._searchLexem, this._defaultDepDue);
        } else {
            this._searchDLinSysParamsOrg();
        }
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

    private confirmAlert(config: IConfirmWindow2) {
        this._confirmSrv.confirm2(config);
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
    private _isFromList(value: string): boolean {
        return this.controls['DUE_DEP_NAME'].options.some(x => value === x.value);
    }
}
