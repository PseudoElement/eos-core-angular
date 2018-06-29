import { Component, OnInit } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from '../shared/interfaces/parameters.interfaces';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosParametersApiServ } from '../shared/service/eos-parameters-descriptor.service';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

@Component({
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent implements OnInit {
    titleHeader = 'WEB';
    data = {};
    form: FormGroup;
    prepInpets: any;
    inputs: any;
    private param = WEB_PARAM;
    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _paramApiSrv: EosParametersApiServ
    ) {
        this.prepInpets = this.getOblectInputFields(this.param.fields);
        this._paramApiSrv.getData(this.getObjQueryInputsField(this.prepInpets._list)).then(data => {
            this.data = this.convData(data);
            this.inputs = this._dataSrv.getInputs(this.prepInpets, this.data);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            // tslint:disable-next-line:no-shadowed-variable
            this.form.valueChanges.subscribe(data => console.dir(data)); // подписка на изменения
            // console.dir(this.form);
        });
    }

    ngOnInit() {
        // console.log('OnInit');
    }

    submit() {
        console.log('submit');
        // console.dir(this.createObjRequest(this.prepInpets._list, this.form.value));
        this._paramApiSrv
            .setData(this.createObjRequest(this.prepInpets._list, this.form.value))
            .then(data => console.dir(data));
    }

    cancel() {
        console.log(this.form);
    }

    testClick(event) {
        console.dir(event);
    }

    private getOblectInputFields(fields) {
        const inputs: any = {
            _list: [],
            rec: {}
        };
        fields.forEach(field => {
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key
            };
        });
        return inputs;
    }

    private getObjQueryInputsField(inputs: Array<any>) {
        return { USER_PARMS: { criteries: { PARM_NAME: inputs.join('||'), ISN_USER_OWNER: '-99' } } };
    }

    private convData(data: Array<any>) {
        const d = {};
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
        return { rec: d };
    }

    private createObjRequest(list: any[], value): any[] {
        const req = [];
        list.forEach(item => {
            req.push({
                method: 'POST',
                requestUri: 'SYS_PARMS_Update?PARM_NAME=\'' + item + '\'&PARM_VALUE=\'' + value['rec.' + item] + '\''
            });
        });
        return req;
    }
}


// requestUri: "SYS_PARMS_Update?PARM_NAME='" + item + "'&PARM_VALUE='" + value['rec.' + item] + "'";
