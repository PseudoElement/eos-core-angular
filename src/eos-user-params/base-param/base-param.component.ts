import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { DEPARTMENT, USER_CERTIFICATE } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_ACCESS_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl} from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { IMessage } from 'eos-common/interfaces';
// import { RestError } from 'eos-rest/core/rest-error';
import { ErrorHelperServices } from '../shared/services/helper-error.services';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { NavParamService } from 'app/services/nav-param.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})


export class ParamsBaseParamComponent implements OnInit, OnDestroy {
    editMode = false;
    title: string;
    type: string = 'password';
    type1: string = 'password';
    curentUser: IParamUserCl;
    stateHeaderSubmit: boolean = true;

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
    isShell: Boolean = false;
    errorPass: boolean = false;
    selfLink = null;
    public userSertsDB: USER_CERTIFICATE;
    private _sysParams;
    private _descSrv;
    private _newData = {};
    private _dataDb = {};
    private modalRef: BsModalRef;

    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    get sysParams() {
        return this._sysParams;
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
    ) { }
    async ngOnInit() {
        await this._userParamSrv.getUserIsn();
        this.selfLink = this._router.url.split('?')[0];
        this.init();
        this.editModeF();
        this.checkSelectUser();
        this._subscribeControls();
        this._userParamSrv
            .saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userParamSrv.submitSave = this.submit();
            });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    get getValidDate() {
        return this.form.controls['PASSWORD_DATE'].valid;
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
        this._dataDb['form'] = this.form.value;
        this._dataDb['formControls'] = this.formControls.value;
        this._dataDb['formAccess'] = this.formAccess.value;
        this.isLoading = false;
    }
    submit(): Promise<any> {
        if (!this.stateHeaderSubmit) {
            this.isLoading = true;
            this.stateHeaderSubmit = false;
            const id = this._userParamSrv.userContextId;
            let accessSysString = '';
            let qPass: Promise<any>;
            const query = [];
            if (this._newData['form'] || this._newData['accessSystems']) {
                let d = {};
                if (this._newData['form']) {
                    this._newData['form']['USERTYPE'] = +this._newData['form']['USERTYPE'];
                    d = Object.assign({}, this._newData['form']);
                    delete d['DUE_DEP_NAME'];
                    d['DUE_DEP'] = this.inputs['DUE_DEP_NAME'].data;
                }
                if (this._newData['accessSystems']) {
                    accessSysString = this._newData['accessSystems'];
                    d = Object.assign(d, { AV_SYSTEMS: this._newData['accessSystems'] });
                }

                this._nanParSrv.scanObserver(false);
                query.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})`,
                    data: d
                });
            }
            if (this._newData['formControls']) {
                const data = this._newData['formControls'];
                query.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${id})/USER_PARMS_List('${id} CATEGORY')`,
                    data: {
                        PARM_VALUE: data['SELECT_ROLE']
                    }
                });
                if (data && data['pass']) {
                    if (this.curentUser['IS_PASSWORD'] === 0) {
                        const url = `CreateLogin?pass='${encodeURI(data['pass'])}'&isn_user=${id}`;
                        qPass = this._apiSrv.getData({ [url]: ALL_ROWS });
                    } else {
                        const url = `ChangePassword?isn_user=${id}&pass='${encodeURI(data['pass'])}'`;
                        qPass = this._apiSrv.getData({ [url]: ALL_ROWS });
                    }
                } else {
                    qPass = Promise.resolve();
                }
            }
            const form = this._apiSrv.setData(query);
            return Promise.all([form, qPass])
                .then(([f, pass]) => {
                    if (accessSysString.length === 40) {
                        const number = accessSysString.charAt(3);
                        this._nanParSrv.scanObserver(number === '1' ? false : true);
                    }
                    if (this._newData['formControls'] && this._newData['formControls']['pass']) {
                        this.formControls.get('pass').reset();
                        this.formControls.get('passRepeated').reset();
                    }
                    this._newData = {};
                    this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                    return this._userParamSrv.getUserIsn()
                        .then(() => {
                            this.curentUser = this._userParamSrv.curentUser;
                            this.editMode = false;
                            this.init();
                            setTimeout(() => {
                                this.editModeF();
                                this.checRadioB();
                                this.checkSelectUser();
                                this._subscribeControls();
                                this.stateHeaderSubmit = true;
                                this._pushState();
                            });
                        });
                })
                .catch(e => {
                    this.cancel();
                    this._errorSrv.errorHandler(e);
                    // const m: IMessage = {
                    //     type: 'warning',
                    //     title: 'Ошибка сервера',
                    //     msg: '',
                    // };
                    // if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                    //     this._router.navigate(['login'], {
                    //         queryParams: {
                    //             returnUrl: this._router.url
                    //         }
                    //     });
                    //     return undefined;
                    // }
                    // if (e instanceof RestError && e.code === 500) {
                    //     m.msg = 'ошибка сохранения пароля';
                    // } else {
                    //     m.msg = e.message ? e.message : e;
                    // }
                    // this._msgSrv.addNewMessage(m);
                });
        } else {
            return Promise.resolve();
        }
    }
    cancel() {
        this.isLoading = true;
        this.editMode = !this.editMode;
        setTimeout(() => {
            this.init();
        }, 1000);
        setTimeout(() => {
            this.editModeF();
            this._subscribeControls();
            this.stateHeaderSubmit = true;
            this._pushState();
        }, 1200);
    }
    edit() {
        this.editMode = !this.editMode;
        this.editModeF();
        setTimeout(() => {
            this.checRadioB();
            this.checkSelectUser();
            if (this.curentUser.isTechUser) {
                this.formControls.controls['teсhUser'].disable({ emitEvent: false });
            }
            this.stateHeaderSubmit = true;
            this._pushState();
        });
    }
    checkSelectUser() {
        if (this.curentUser.isAccessDelo && this.editMode) {
            this.formControls.controls['SELECT_ROLE'].enable({ emitEvent: false });
        } else {
            this.formControls.controls['SELECT_ROLE'].disable({ emitEvent: false });
        }
    }
    tf() {
        const val1 = this.formAccess.controls['0-1'].value;
        const val2 = this.formAccess.controls['delo_web'].value;
        if (val1 || val2) {
            this.formControls.controls['SELECT_ROLE'].enable({ emitEvent: false });
        }
        if (!val1 && !val2) {
            this.formControls.controls['SELECT_ROLE'].patchValue('');
            this.formControls.controls['SELECT_ROLE'].disable({ emitEvent: false });
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
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
        // this._router.navigate(['user_param']);
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
    resetControll() {
        this.formControls['passRepeated'].patchValue();
    }
    selectDepartment() {
        if (!this.curentUser.isTechUser && this.editMode) {
            this.showDepartment();
        }
    }
    checRadioB() {
        const delo = this.formAccess.get('0').value;
        const delo_web_delo = this.formAccess.get('0-1').value;
        const delo_web = this.formAccess.get('delo_web').value;
        if (!delo_web) {
            this.formAccess.controls['1-27'].disable({ emitEvent: false });
        } else {
            this.formAccess.controls['0'].disable({ emitEvent: false });
            this.formAccess.controls['0-1'].disable({ emitEvent: false });
        }
        if (delo) {
            this.formAccess.controls['0-1'].disable({ emitEvent: false });
            this.formAccess.controls['delo_web'].disable({ emitEvent: false });
        }
        if (delo_web_delo) {
            this.formAccess.controls['0'].disable({ emitEvent: false });
            this.formAccess.controls['delo_web'].disable({ emitEvent: false });
        }
    }

    getSerts(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template, {class: 'serts'});
    }
    closeSerts() {
        this.modalRef.hide();
    }
    private _subscribeControls() {                                     /* подписки */
        /* основная форма */
        this.form.valueChanges
            .subscribe((data) => {
                if (data['PASSWORD_DATE']) {
                    data['PASSWORD_DATE'] = this._descSrv.dateToString(data['PASSWORD_DATE']);
                }
                this._newData['form'] = data;
                this._checkForChenge(false);
            });

        /* форма контролов */
        this.formControls.valueChanges
            .subscribe((data) => {
                this._newData['formControls'] = data;
                this._checkForChenge();
            });

        /* форма доступа к системам */
        this.formAccess.valueChanges
            .subscribe((data) => {
                this._newData['accessSystems'] = this._createAccessSystemsString(data);
                this._checkForChenge();
            });

        /* -----===== отключение элементов доступа к системам =====----- */
        this.formAccess.get('0').valueChanges
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formAccess.controls['delo_web'], data);
            });
        this.formAccess.get('0-1').valueChanges
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formAccess.controls['delo_web'], data);
                //   this._checkRoleControl(data);
            });
        this.formAccess.get('delo_web').valueChanges
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formAccess.controls['1-27'], !data);
                //    this._checkRoleControl(data);
                if (data) {
                    this.formAccess.controls['1-27'].patchValue('1', { emitEvent: false });
                } else {
                    this.formAccess.controls['1-27'].patchValue('', { emitEvent: false });
                }
            });
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
    private _createAccessSystemsString(data) {
        const arr = this.curentUser['ACCESS_SYSTEMS'].concat();
        arr[0] = '0';
        arr[1] = '0';
        arr[27] = '0';
        // tslint:disable-next-line:forin
        for (const key in data) {
            switch (key) {
                case 'delo_web':
                    if (data[key]) {
                        arr[1] = (data['1-27'] === '1') ? '1' : '0';
                        arr[27] = (data['1-27'] === '27') ? '1' : '0';
                    }
                    break;
                case '1-27':
                    break;
                case '0-1':
                    if (data[key]) {
                        arr[0] = '1';
                        arr[1] = '1';
                    }
                    break;
                default:
                    arr[key] = +data[key];
            }
        }
        return arr.join('');
    }
    private _checkForChenge(state: boolean = false) {
        let change = false;
        if (this._newData['form']) {
            const data = this._newData['form'];
            // tslint:disable-next-line:forin
            for (const k in data) {
                change = change || (data[k] !== this._dataDb['form'][k]);
            }
            this._newData['form'] = change ? this._newData['form'] : null;
        }
        if (this._newData['formControls']) {
            const data = this._newData['formControls'];
            let pass = false;
            const role = data['SELECT_ROLE'] !== this._userParamSrv.hashUserContext['CATEGORY'];
            if (data['pass'] && data['passRepeated']) {
                pass = data['pass'] === data['passRepeated'];
            }
            this.checkchangPass(data['pass'], data['passRepeated']);
            this._newData['formControls'] = (pass || role) ? this._newData['formControls'] : null;
            change = change ? change : pass || role;
        }
        if (this._newData['accessSystems']) {
            const c = this._newData['accessSystems'] !== this.curentUser['AV_SYSTEMS'];
            this._newData['accessSystems'] = c ? this._newData['accessSystems'] : null;
            change = change ? change : c;
        }
        // ибо и так не работало - !!!!
        // this.stateHeaderSubmit = !change || state;
        this.stateHeaderSubmit = false;
        this._pushState();
    }

    private checkchangPass(data1, data2) {
        if (data1 !== '' && data2 !== '') {
            this.errorPass = data1 !== data2;
            if (this.errorPass) {
                this.formControls.get('passRepeated').setErrors({ repeat: true });
            } else {
                this.errorPass = false;
            }
        } else if (data1 !== '' || data2 !== '') {
            this.errorPass = true;
        } else {
            this.errorPass = false;
        }
    }
    private _pushState() {
        this._userParamSrv.setChangeState({ isChange: !this.stateHeaderSubmit, disableSave: !this.getValidDate || this.errorPass });
    }

}
