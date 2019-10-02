import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { DEPARTMENT, USER_CERTIFICATE } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_ACCESS_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../shared/services/helper-error.services';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { NavParamService } from 'app/services/nav-param.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_UPDATE_USER } from '../../eos-user-select/shered/consts/confirm-users.const';
import { IMessage } from 'eos-common/interfaces';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})


export class ParamsBaseParamComponent implements OnInit, OnDestroy {
    submitClick = false;
    editMode = false;
    title: string;
    type: string = 'password';
    type1: string = 'password';
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
    public isShell: boolean = false;
    public userSertsDB: USER_CERTIFICATE;
    public errorPass: boolean = false;
    private _sysParams;
    private _descSrv;
    private _newData: Map<string, any> = new Map();
    private _newDataformControls: Map<string, any> = new Map();
    private _newDataformAccess: Map<string, any> = new Map();
    private modalRef: BsModalRef;

    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    get sysParams() {
        return this._sysParams;
    }
    get stateHeaderSubmit() {
        return this._newData.size > 0 || this._newDataformAccess.size > 0 || this._newDataformControls.size > 0;
    }
    constructor(
        private _router: Router,
        private _snapShot: ActivatedRoute,
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
        private _storage: EosStorageService,
    ) {
    }
    ngOnInit() {
        this._userParamSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List',
            shortSys: true
        }).then(() => {
            this.selfLink = this._router.url.split('?')[0];
            this.init();
            if (this._snapShot.snapshot.queryParams.is_create && !this.curentUser['IS_PASSWORD']) {
                this.messageAlert({ title: 'Предупреждение', msg: `У пользователя ${this.curentUser['CLASSIF_NAME']} не задан пароль.`, type: 'warning' });
            }
            this.editModeF();
            this._subscribe();
        })
            .catch(err => {

            });
        this._userParamSrv
            .saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userParamSrv.submitSave = this.submit('not');
            });
        if (localStorage.getItem('lastNodeDue') == null) {
            localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        }
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
            } else {
                return 'не коректное значение';
            }
        }
        return null;
    }
    get getValidDate() {
        return this.form.controls['PASSWORD_DATE'].valid && this.form.controls['NOTE2'].valid && this.form.controls['CLASSIF_NAME'].valid;
    }

    init() {
        this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
        this.curentUser = this._userParamSrv.curentUser;
        this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        this.inputFields = this._descSrv.fillValueInputField(BASE_PARAM_INPUTS, !this.editMode);
        this.controlField = this._descSrv.fillValueControlField(BASE_PARAM_CONTROL_INPUT, !this.editMode);
        this.accessField = this._descSrv.fillValueAccessField(BASE_PARAM_ACCESS_INPUT, !this.editMode);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);

        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);
        this.isLoading = false;
        this.subscribeForms();
        return Promise.resolve();
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
            if (val === 'PASSWORD_DATE') {
                if (String(data[val]).toString() === String(this.inputs[val].value).toString()) {
                    this._newData.delete(val);
                } else {
                    const newDate = data[val] ? this._descSrv.dateToString(data[val]) : null;
                    this._newData.set(val, newDate);
                }
            } else {
                if (data[val] !== this.inputs[val].value) {
                    this._newData.set(val, data[val]);
                } else {
                    this._newData.delete(val);
                }
            }
        });
        this._pushState();
    }
    checkChangeFormControls(data): void {
        this.checkchangPass(data['pass'], data['passRepeated']);
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

    submit(meta?: string): Promise<any> {
        if (!this.dueDepNameNullUndef(this.form.get('DUE_DEP_NAME').value) && !this.curentUser.isTechUser) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Нельзя сохранить не указано должностное лицо',
                dismissOnTimeout: 6000,
            });
            return;
        }
        this.submitClick = true;
        const id = this._userParamSrv.userContextId;
        const newD = {};
        const query = [];
        const queryLog = [];
        let accessStr = '';
        let allQueries: Promise<any>;
        let qPass: Promise<any>;
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
                            this.form.get('NOTE').patchValue(null);
                        }
                        newD['NOTE'] = '' + this.form.get('NOTE').value;
                        newD['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                    }
                    delete newD['DUE_DEP_NAME'];
                });
            }
            // this._nanParSrv.scanObserver(false);
            query.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})`,
                data: newD
            });
        }
        const pass = this._newDataformControls.get('pass');
        if (this.inputs.CLASSIF_NAME.value !== this.form.value.CLASSIF_NAME) {
            if (this.curentUser['IS_PASSWORD'] === 0) {
                this.messageAlert({ title: 'Предупреждение', msg: `У пользователя ${this.inputs.CLASSIF_NAME.value} не задан пароль.`, type: 'warning' });
                this.form.controls.CLASSIF_NAME.patchValue(this.inputs.CLASSIF_NAME.value);
                this.submitClick = false;
                this.cancel();
                return;
            } else {
                this.title = `${this.curentUser['SURNAME_PATRON']} (${this.form.value.CLASSIF_NAME})`;
                const url = `DropLogin?pass='${encodeURI(pass)}'&isn_user=${id}`;
                const queryPas = [{
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: {
                        IS_PASSWORD: 0
                    }
                }];
                if (pass) {
                    queryLog.push(this.apiSrvRx.read({ [url]: ALL_ROWS }).then(() => {
                        return this.apiSrvRx.batch(queryPas, '').then(() => {
                            const urlLog = `CreateLogin?pass='${encodeURI(pass)}'&isn_user=${id}`;
                            return this.apiSrvRx.read({ [urlLog]: ALL_ROWS }).then(() => {
                                const url1 = `ChangePassword?isn_user=${id}&pass='${encodeURI(pass)}'`;
                                return this.apiSrvRx.read({ [url1]: ALL_ROWS });
                            });
                        });
                }));
                } else {
                    queryLog.push(this.apiSrvRx.read({ [url]: ALL_ROWS }).then(() => {
                        return this.apiSrvRx.batch(queryPas, '');
                    }));
                    this.messageAlert({ title: 'Предупреждение', msg: `Изменён логин, нужно задать пароль`, type: 'warning' });
                }
            }
        }
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
            if (pass) {
                if (this.curentUser['IS_PASSWORD'] === 0) {
                    const url = `CreateLogin?pass='${encodeURI(pass)}'&isn_user=${id}`;
                    qPass = this._apiSrv.getData({ [url]: ALL_ROWS });
                } else if (this.inputs.CLASSIF_NAME.value === this.form.value.CLASSIF_NAME) {
                    const url = `ChangePassword?isn_user=${id}&pass='${encodeURI(pass)}'`;
                    qPass = this._apiSrv.getData({ [url]: ALL_ROWS });
                }
            } else {
                qPass = Promise.resolve();
            }
        }
        const form = this._apiSrv.setData(query);
        if (queryLog.length !== 0) {
            allQueries = Promise.all([queryLog[0]]);
        } else {
            allQueries = Promise.all([qPass, form]);
        }
        return allQueries.then(data => {
            if (queryLog.length !== 0) {
                return Promise.all([qPass, form]).then(() => {
                    this.SubForm(accessStr, meta);
                });
            } else {
                this.SubForm(accessStr, meta);
            }
        }).catch(error => {
            this.submitClick = false;
            this._nanParSrv.scanObserver(!this.accessInputs['3'].value);
            this.cancel();
            this._errorSrv.errorHandler(error);
        });
    }
    SubForm(accessStr: string, meta: string): void {
        this._userParamSrv.ProtocolService(this._userParamSrv.curentUser.ISN_LCLASSIF, 4);
        if (accessStr.length > 1) {
            const number = accessStr.charAt(3);
            this._nanParSrv.scanObserver(number === '1' ? false : true);
        }
        if (this._newDataformControls.has('pass')) {
            this.formControls.get('pass').reset('');
            this.formControls.get('passRepeated').reset('');
        }
        this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
        this.clearMap();
        if (meta && meta === 'not') {
            this.editMode = false;
            this.editModeF();
            this._pushState();
        } else {
            this._userParamSrv.getUserIsn({
                expand: 'USER_PARMS_List,USERCARD_List',
                shortSys: true
            }).then(() => {
                this.editMode = false;
                this.curentUser = this._userParamSrv.curentUser;
                this.upform(this.inputs, this.form);
                this.upform(this.controls, this.formControls);
                this.upform(this.accessInputs, this.formAccess);
                this.editModeF();
                this._pushState();
                this.submitClick = false;
            });
        }
        this.submitClick = false;
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
        //  this.isLoading = true;
        this.editMode = !this.editMode;
        this.cancelValues(this.inputs, this.form);
        this.cancelValues(this.controls, this.formControls);
        this.cancelValues(this.accessInputs, this.formAccess);
        this.clearMap();
        this._pushState();
        this.editModeF();
    }
    cancelValues(inputs, form: FormGroup) {
        Object.keys(inputs).forEach((key, val, arr) => {
            form.controls[key].patchValue(inputs[key].value, { emitEvent: true });
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
        } else {
            this.form.disable({ onlySelf: true, emitEvent: false });
            this.formControls.disable({ onlySelf: true, emitEvent: false });
            this.formAccess.disable({ onlySelf: true, emitEvent: false });
        }
    }
    close() {
        this._storage.setItem('saveQuickSearch', 'true');
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
                if (data) {
                    this.form.get('TECH_DUE_DEP').patchValue(data[0]['DEPARTMENT_DUE']);
                }
                this.getUserDepartment(data[0].ISN_HIGH_NODE).then(result => {
                    this.form.get('NOTE').patchValue(result[0].CLASSIF_NAME);
                });
                return this._userParamSrv.ceckOccupationDueDep(dueDep, data[0], true);
            })
            .then((dep: DEPARTMENT) => {
                this.isShell = false;
                this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
                this.inputs['DUE_DEP_NAME'].data = dep['DUE'];
            })
            .catch(() => {
                this.isShell = false;
            });
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
            this._toggleFormControl(this.formAccess.controls['23'], false);
            this._toggleFormControl(this.formAccess.controls['21'], false);
            this._toggleFormControl(this.formAccess.controls['25'], false);
        }
        if (this.gt()['delo']) {
            this._toggleFormControl(this.formAccess.controls['23'], true);
            this._toggleFormControl(this.formAccess.controls['21'], true);
            this._toggleFormControl(this.formAccess.controls['25'], false);
            this._toggleFormControl(this.formAccess.controls['26'], false);
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
    private patchVal() {
        this.formAccess.controls['23'].patchValue(false, { emitEvent: false });
        this.formAccess.controls['21'].patchValue(false, { emitEvent: false });
        this.formAccess.controls['25'].patchValue(false, { emitEvent: false });
        this.formAccess.controls['26'].patchValue(false, { emitEvent: false });
    }
    private disableAccessSyst(flag) {
        if (flag) {
            this._toggleFormControl(this.formAccess.controls['23'], true);
            this._toggleFormControl(this.formAccess.controls['21'], true);
            this._toggleFormControl(this.formAccess.controls['25'], true);
            this._toggleFormControl(this.formAccess.controls['26'], true);
        } else {
            this._toggleFormControl(this.formAccess.controls['23'], false);
            this._toggleFormControl(this.formAccess.controls['21'], false);
            this._toggleFormControl(this.formAccess.controls['25'], false);
            this._toggleFormControl(this.formAccess.controls['26'], false);
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
    // private _checkForChenge(state: boolean = false) {
    //     this.stateHeaderSubmit = false;
    //     this._pushState();
    // }

    private checkchangPass(pass, passrepeat) {
        if (pass !== '' && passrepeat !== '') {
            this.errorPass = pass !== passrepeat;
            if (this.errorPass) {
                this.formControls.get('passRepeated').setErrors({ repeat: true });
            } else {
                this.errorPass = false;
            }
        } else if (pass !== '' || passrepeat !== '') {
            this.errorPass = true;
        } else {
            this.errorPass = false;
        }
    }
    private _pushState() {
        this._userParamSrv.setChangeState({ isChange: this.stateHeaderSubmit, disableSave: !this.getValidDate || this.errorPass });
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
                    this.formControls.controls['SELECT_ROLE'].patchValue('...');
                    this.formControls.controls['SELECT_ROLE'].disable();
                } else {
                    this.curentUser.isTechUser = data;
                    this.formControls.controls['SELECT_ROLE'].patchValue('...');
                    this.formControls.controls['SELECT_ROLE'].enable();
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

}
