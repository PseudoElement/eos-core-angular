import { Component, Input, OnInit } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USER_CL } from 'eos-rest';
// import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT } from 'eos-user-params/shared/consts/user-param.consts';
import { BASE_PARAM_INPUTS } from 'eos-user-params/shared/consts/base-param.consts';
import { FormGroup } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

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
    inputs;
    form: FormGroup;
    isLoading: Boolean = true;
    private _sysParams;
    constructor(
        private _inputCtrlSrv: InputParamControlService,
        private _waitClassifSrv: WaitClassifService,
        // private _apiSrv: UserParamApiSrv,
        private _userParamSrv: UserParamsService
    ) {}
    ngOnInit () {
        this._userParamSrv.getSysParms()
        .then(sysData => {
            this._sysParams = sysData;
            if (!this.newUser) {
                this.curentUser = this._userParamSrv.curentUser;
                this.title = `${this.curentUser['SURNAME_PATRON']} (${this.curentUser['CLASSIF_NAME']})`;
                // console.log(this.curentUser);
                this.inputFields.forEach((f: IInputParamControl) => {
                    f['value'] = this._prepareDataForForm(f);
                });
                // console.log(this.inputFields);
            }
            this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
            // console.log('inputs', this.inputs);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
            this.isLoading = false;
            this.form.valueChanges.subscribe((data) => {
                const date: Date = data['PASSWORD_DATE'];
                console.log(this._dateToString(date) === (this.curentUser['PASSWORD_DATE'].toString()));
            });
        });
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        console.log('cancel');
        // this._apiSrv.setData(this.data);
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

    testClick() {
        console.log('test');
        this._userParamSrv.getSysParms();
    }
    private _prepareDataForForm (field: IInputParamControl) {
        if (field['key'] === 'PASSWORD_DATE') {
            const pass = this._sysParams['CHANGE_PASS']['PARM_VALUE'];
            field['readonly'] = pass !== 'YES' ? true : false;
        }
        if (field.controlType === E_FIELD_TYPE.boolean) {
            return !!this.curentUser[field['key']];
        }
        return this.curentUser[field['key']];
    }
    // private _prepareDataForDb (field: IBaseInput) {
    //     if (field.controlType === 'checkbox') {
    //         return !!this.curentUser[field['key']];
    //     }
    //     return this.curentUser[field['key']];
    // }

    private _dateToString(date: Date) { // 2018-10-29T00:00:00
        return `${date.getFullYear()}-${this._pad(date.getMonth() + 1)}-${this._pad(date.getDate())}T00:00:00`;
    }
    private _pad(n: number): string {
        return n < 10 ? '0' + n : '' + n;
    }
}
