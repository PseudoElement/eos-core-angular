import { Component } from '@angular/core';
import { WEB_PARAM } from '../consts/sys-parms/web.consts';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { FormGroup } from '@angular/forms';

@Component({
    templateUrl: 'param-web.component.html',
    // encapsulation: ViewEncapsulation.None,
})
export class ParamWebComponent {
    inputs: InputBase<any>[];

    form: FormGroup;
    constructor(private inputCtrlSrv: InputControlService) {
        this.inputs = this.inputCtrlSrv.generateInputs(WEB_PARAM.fields);
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);

        console.log(this.inputs);
    }
}
