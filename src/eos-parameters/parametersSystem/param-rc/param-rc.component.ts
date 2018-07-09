import { Component } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosParametersDescriptionServ } from '../shared/service/eos-parameters-descriptor.service';
import { RC_PARAM } from '../shared/consts/rc.consts';

@Component({
    selector: 'eos-param-rc',
    templateUrl: 'param-rc.component.html'
})
export class ParamRcComponent extends BaseParamComponent {
    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _paramApiSrv: EosParametersDescriptionServ
    ) {
        super(RC_PARAM);
        this.paramApiSrv = this._paramApiSrv;
        this.dataSrv = this._dataSrv;
        this.inputCtrlSrv = this._inputCtrlSrv;
        this.init();
    }
}
