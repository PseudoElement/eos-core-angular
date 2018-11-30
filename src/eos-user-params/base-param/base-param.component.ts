import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { DEPARTMENT } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_ACCESS_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl, IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { Subject } from 'rxjs/Subject';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import { RestError } from 'eos-rest/core/rest-error';
import { Router } from '@angular/router';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})

export class ParamsBaseParamComponent implements OnInit, OnDestroy {
    title: string;
    curentUser: IParamUserCl;
    stateHeaderSubmit: boolean = true;

    inputFields: IInputParamControl[] = BASE_PARAM_INPUTS;
    controlField: IInputParamControl[] = BASE_PARAM_CONTROL_INPUT;
    accessField: IInputParamControl[] = BASE_PARAM_ACCESS_INPUT;
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
    private _sysParams;
    private _descSrv;
    private _newData = {};
    private _dataDb = {};

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
        private _userParamSrv: UserParamsService
    ) {}
    ngOnInit () {
        this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
        this.curentUser = this._userParamSrv.curentUser;
        this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;

        this._descSrv.fillValueInputField(this.inputFields);
        this._descSrv.fillValueControlField(this.controlField);
        this._descSrv.fillValueAccessField(this.accessField);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);


        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);

        this._dataDb['form'] = this.form.value;
        this._dataDb['formControls'] = this.formControls.value;
        this._dataDb['formAccess'] = this.formAccess.value;

        this._subscribeControls();

        this.isLoading = false;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit() {
        if (!this.stateHeaderSubmit) {
            this.stateHeaderSubmit = true;
            const id = this._userParamSrv.userContextId;
            let qPass: Promise<any>;
            const query = [];
            if (this._newData['form'] || this._newData['accessSystems']) {
                let d = {};
                if (this._newData['form']) {
                    d = Object.assign({}, this._newData['form']);
                }
                if (this._newData['accessSystems']) {
                    d = Object.assign(d, { AV_SYSTEMS: this._newData['accessSystems']});
                }
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
                    if (!this.curentUser['ORACLE_ID']) {
                        const url = `CreateLogin?pass='${data['pass']}'&isn_user=${id}`;
                        qPass = this._apiSrv.getData({[url]: ALL_ROWS});
                    } else {
                        console.log('нету пока сопа для изменения пароля');
                        qPass = Promise.resolve(); // TODO вызвать соп для смены пароля
                    }
                } else {
                    qPass = Promise.resolve();
                }
            }
            const form = this._apiSrv.setData(query);
            Promise.all([form, qPass])
            .then(([f, pass]) => {
                if (this._newData['formControls'] && this._newData['formControls']['pass']) {
                    this.formControls.get('pass').reset();
                    this.formControls.get('passRepeated').reset();
                }
                this._newData = {};
                // console.log(f, pass);
                this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
                this._userParamSrv.getUserIsn()
                .then(() => {
                    this.curentUser = this._userParamSrv.curentUser;
                    this._checkForChenge();
                });
            })
            .catch(e => {
                const m: IMessage = {
                    type: 'warning',
                    title: 'Ошибка сервера',
                    msg: '',
                };
                if (e instanceof RestError && (e.code === 434 || e.code === 0)) {
                    this._router.navigate(['login'], {
                        queryParams: {
                            returnUrl: this._router.url
                        }
                    });
                    return undefined;
                }
                if (e instanceof RestError && e.code === 500) {
                    m.msg = 'ошибка сохранения пароля';
                } else {
                    m.msg = e.message ? e.message : e;
                }
                this._msgSrv.addNewMessage(m);
            });
        }
    }
    cancel() {
        this.form.patchValue(this._dataDb['form']);
        this.formControls.patchValue(this._dataDb['formControls']);
        this.formAccess.patchValue(this._dataDb['formAccess']);
    }
    checkPass() {
        if (this.formControls.get('pass').value && this.formControls.get('passRepeated').value) {
            this.errorPass = this.formControls.get('pass').value !== this.formControls.get('passRepeated').value;
            if (this.errorPass) {
                this.formControls.get('passRepeated').setErrors({repeat: true});
            }
        } else {
        this.errorPass = false;
        }
    }
    showDepartment() {
        this.isShell = true;
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
        .then((data: string) => {
            return this._userParamSrv.getDepartmentFromUser(data);
        })
        .then((data: DEPARTMENT[]) => {
            this.isShell = false;
            const dep = data[0];
            this.form.get('DUE_DEP_NAME').patchValue(dep['CLASSIF_NAME']);
            this.inputs['DUE_DEP_NAME'].data = dep['DUE'];
        })
        .catch(() => {
            this.isShell = false;
        });
    }

    selectDepartment(status) {
        if (status) {
            this.showDepartment();
        }
    }
    private _subscribeControls() {                                        /* подписки */
        /* основная форма */
        this.form.valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe((data) => {
                if (data['PASSWORD_DATE']) {
                    data['PASSWORD_DATE'] = this._descSrv.dateToString(data['PASSWORD_DATE']);
                }
                data['USERTYPE'] = +data['USERTYPE'];
                this._newData['form'] = data;
                this._checkForChenge();
            });

        /* форма контролов */
        this.formControls.valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe((data) => {
                this._newData['formControls'] = data;
                this._checkForChenge(this.formControls.invalid);
            });

        /* форма доступа к системам */
        this.formAccess.valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe((data) => {
                this._newData['accessSystems'] = this._createAccessSystemsString(data);
                this._checkForChenge();
            });

            /* -----===== отключение элементов доступа к системам =====----- */
        this.formAccess.get('0').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formAccess.controls['delo_web'], data);
            });
        this.formAccess.get('0-1').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formAccess.controls['delo_web'], data);
                this._checkRoleControl(data);
            });
        this.formAccess.get('delo_web').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formAccess.controls['1-27'], !data);
                this._checkRoleControl(data);
                if (data) {
                    this.formAccess.controls['1-27'].patchValue('1', {emitEvent: false});
                } else {
                    this.formAccess.controls['1-27'].patchValue('', {emitEvent: false});
                }
            });
    }

    private _toggleFormControl(control, disable: boolean) {
        if (disable) {
            if (control.enabled) {
                control.disable({emitEvent: false});
            }
        } else {
            if (control.disabled) {
                control.enable({emitEvent: false});
            }
        }
    }
    private _checkRoleControl (state: boolean) {
        if (state) {
            if (this.curentUser.isAccessDelo) {
                this._toggleFormControl(this.formControls.controls['SELECT_ROLE'], false);
            }
        } else {
            this.formControls.get('SELECT_ROLE').patchValue('');
            this._toggleFormControl(this.formControls.controls['SELECT_ROLE'], true);
        }
    }
    private _createAccessSystemsString (data) {
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
                change = change || (data[k] !== this.curentUser[k]);
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
            this._newData['formControls'] = (pass || role) ? this._newData['formControls'] : null;
            change = change ? change : pass || role;
        }
        if (this._newData['accessSystems']) {
            const c = this._newData['accessSystems'] !== this.curentUser['AV_SYSTEMS'];
            this._newData['accessSystems'] = c ? this._newData['accessSystems'] : null;
            change = change ? change : c;
        }
        this.stateHeaderSubmit = !change || state;
    }
}
