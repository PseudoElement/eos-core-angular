import { Component } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { EosParametersDescriptionServ } from '../shared/service/eos-parameters-descriptor.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent extends BaseParamComponent {
    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _paramApiSrv: EosParametersDescriptionServ
    ) {
        super(WEB_PARAM);
        this.paramApiSrv = this._paramApiSrv;
        this.dataSrv = this._dataSrv;
        this.inputCtrlSrv = this._inputCtrlSrv;
        this.init();
    }
}
