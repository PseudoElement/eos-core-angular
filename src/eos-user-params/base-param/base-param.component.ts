import { Component, Input, OnInit } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USER_CL } from 'eos-rest';
// import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-params/shared/consts/user-param.consts';
import { BASE_PARAM_INPUTS, BASE_PARAM_CONTROL_INPUT } from 'eos-user-params/shared/consts/base-param.consts';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { BaseParamCurentDescriptor } from './shared/base-param-curent.descriptor';
import { BaseParamNewDescriptor } from './shared/base-param-new.descriptor';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})

export class ParamsBaseParamComponent implements OnInit {
    @Input('newUser') newUser: boolean;
    title: string = 'Новый пользователь';
    curentUser: USER_CL;
    stateHeaderSubmit: boolean = false;

    inputFields: IInputParamControl[] = BASE_PARAM_INPUTS;
    controlField: IInputParamControl[] = BASE_PARAM_CONTROL_INPUT;
    inputs;
    controls;
    form: FormGroup;
    formControls: FormGroup;
    isLoading: Boolean = true;
    private _sysParams;
    private _descSrv;
    get sysParams() {
        return this._sysParams;
    }
    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        // private _apiSrv: UserParamApiSrv,
        private _userParamSrv: UserParamsService
    ) {}
    ngOnInit () {
        // console.log(this._userParamSrv.curentUser);
        if (!this.newUser) {
            this._descSrv = new BaseParamCurentDescriptor(this._userParamSrv);
            this.curentUser = this._userParamSrv.curentUser;
            this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
        } else {
            this._descSrv = new BaseParamNewDescriptor(this._userParamSrv);
        }

        this._descSrv.fillValueInputField(this.inputFields);
        this._descSrv.fillValueControlField(this.controlField);

        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.controls = this._inputCtrlSrv.generateInputs(this.controlField);

        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.formControls = this._inputCtrlSrv.toFormGroup(this.controls, false);

        this.isLoading = false;
        this.form.valueChanges.subscribe((data) => {
            console.log(data);
        });
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        console.log('cancel');
    }
    showDepartment() {
        this._waitClassifSrv.openClassif(OPEN_CLASSIF_DEPARTMENT)
        .then(data => {
            console.log(data);
        })
        .catch(() => {
            console.log('catch');
        });
    }

    selectDepartment() {
        console.log('department');
    }

    testClick() {
        console.log('test');
    }
    // private _prepareDataForDb (field: IBaseInput) {
    //     if (field.controlType === 'checkbox') {
    //         return !!this.curentUser[field['key']];
    //     }
    //     return this.curentUser[field['key']];
    // }

}
