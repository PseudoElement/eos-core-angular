import { Component, OnInit } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from '../shared/interfaces/parameters.interfaces';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

@Component({
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent implements OnInit {
    titleHeader = 'WEB';
    data = {
        rec: {
            APPSRV_CRYPTO_ACTIVEX: 'text1',
            APPSRV_CRYPTO_INITSTR: 'text2',
            APPSRV_PKI_ACTIVEX: 'text3',
            APPSRV_PKI_INITSTR: 'text4'
        }
    };
    form: FormGroup;
    prepInpets: any;
    inputs: any;
    private param = WEB_PARAM;
    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService
    ) {
        this.prepInpets = this.getOblectInputFields(this.param.fields);
        this.inputs = this._dataSrv.getInputs(this.prepInpets, this.data);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
        console.dir(this.inputs);
    }

    ngOnInit() {
        // console.dir('Init');
        // this.inputs = this.dataConvSrv.getInputs({rec: this.inputs}, this.data);
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
}
