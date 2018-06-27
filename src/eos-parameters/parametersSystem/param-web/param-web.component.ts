import { Component, OnInit } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { FormGroup } from '@angular/forms';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

@Component({
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent implements OnInit {
    titleHeader = 'WEB';
    inputs: InputBase<any>[];

    data = {
        APPSRV_CRYPTO_ACTIVEX: 'text1',
        APPSRV_CRYPTO_INITSTR: 'text2',
        APPSRV_PKI_ACTIVEX: 'text3',
        APPSRV_PKI_INITSTR: 'text4'
    };

    form: FormGroup;
    constructor(private inputCtrlSrv: InputControlService) {// private dataConvSrv: EosDataConvertService
        this.inputs = this.inputCtrlSrv.generateInputs(WEB_PARAM.fields);
        // this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);

        console.log(this.inputs);
    }

    ngOnInit() {
        console.log('Init');
        // this.inputs = this.dataConvSrv.getInputs({rec: this.inputs}, this.data);
    }
}
