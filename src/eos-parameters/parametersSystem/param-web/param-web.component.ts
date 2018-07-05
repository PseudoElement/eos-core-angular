import { Component } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { EosParametersApiServ } from '../shared/service/eos-parameters-descriptor.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';

@Component({
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent extends BaseParamComponent {
    constructor(
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _paramApiSrv: EosParametersApiServ
    ) {
        super(WEB_PARAM);
        this._paramApiSrv
            .getData(this.queryObj)
            .then(data => {
                this.dataDb = data;
                console.log(this.dataDb);
                this.data = this.convData(data);
                console.log(this.data);
                this.inputs = this._dataSrv.getInputs(this.prepInputs, this.data);
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
                this.form.valueChanges.subscribe((dataa: any) => console.log(dataa));
                this.form.statusChanges.subscribe(dataa => console.log(dataa));
            })
            .catch(data => console.log(data));
    }

    // ngOnInit() {
    //     // console.log('OnInit');
    // }

    submit() {
        this._paramApiSrv
            .setData(this.createObjRequest(this.prepInputs._list, this.form.value))
            .then(data => console.dir(data))
            .catch(data => console.log(data));
    }

    cancel() {
        console.log(this.form);
    }

}

