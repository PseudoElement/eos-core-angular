import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USER_CL, DEPARTMENT } from 'eos-rest';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT, BASE_PARAM_ACCESS_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { BaseParamNewDescriptor } from './shared/base-param-new.descriptor';
import { Subject } from 'rxjs/Subject';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-select/shered/consts/create-user.consts';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})

export class ParamsBaseParamComponent implements OnInit, OnDestroy {
    @Input('newUser') newUser: boolean;
    title: string = 'Новый пользователь';
    curentUser: USER_CL;
    stateHeaderSubmit: boolean = false;

    inputFields: IInputParamControl[] = BASE_PARAM_INPUTS;
    controlField: IInputParamControl[] = BASE_PARAM_CONTROL_INPUT;
    accessField: IInputParamControl[] = BASE_PARAM_ACCESS_INPUT;
    inputs;
    controls;
    accessInputs;
    form: FormGroup;
    formControls: FormGroup;
    formAccess: FormGroup;
    isLoading: Boolean = true;
    isShell: Boolean = false;
    private _sysParams;
    private _descSrv;

    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    get sysParams() {
        return this._sysParams;
    }
    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        private _userParamSrv: UserParamsService
    ) {}
    ngOnInit () {
        if (!this.newUser) {
            this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
            this.curentUser = this._userParamSrv.curentUser;
            this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        } else {
            this._descSrv = new BaseParamNewDescriptor(this._userParamSrv);
        }

        this._descSrv.fillValueInputField(this.inputFields);
        this._descSrv.fillValueControlField(this.controlField);
        this._descSrv.fillValueAccessField(this.accessField);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);
        this.accessInputs = this._inputCtrlSrv.generateInputs(this.accessField);


        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);
        this.formAccess = this._inputCtrlSrv.toFormGroup(this.accessInputs, false);

        this._subscribeControls();

        this.isLoading = false;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit() {
        console.log('submit', this.form);
    }
    cancel() {
        console.log('cancel', this.formControls);
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
    private _subscribeControls() {
        this.form.valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe((data) => {
            // console.log(data);
            });
        this.formControls.controls['teсhUser'].valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                if (data) {
                    const control = this.form.get('DUE_DEP_NAME');
                    control.patchValue('');
                    this.inputs['DUE_DEP_NAME'].data = '';
                    control.disable();
                } else {
                    this.form.get('DUE_DEP_NAME').enable();
                }
            });
        this.formAccess.get('0').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formControls.controls['delo_web'], data);
            });
        this.formAccess.get('0-1').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formControls.controls['delo_web'], data);
                this._checkRoleControl(data);
            });
        this.formControls.get('delo_web').valueChanges
            .takeUntil(this._ngUnsubscribe)
            .subscribe(data => {
                this._toggleFormControl(this.formAccess.controls['0'], data);
                this._toggleFormControl(this.formAccess.controls['0-1'], data);
                this._toggleFormControl(this.formAccess.controls['1-27'], !data);
                this._checkRoleControl(data);
                if (data) {
                    this.formAccess.controls['1-27'].patchValue('1');
                } else {
                    this.formAccess.controls['1-27'].patchValue('');
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
        if (!this.newUser) {
            if (state) {
                if (this._userParamSrv.curentUser.isAccessDelo) {
                    this._toggleFormControl(this.formControls.controls['SELECT_ROLE'], false);
                }
            } else {
                this.formControls.get('SELECT_ROLE').patchValue('');
                this._toggleFormControl(this.formControls.controls['SELECT_ROLE'], true);
            }
        }
    }
}
