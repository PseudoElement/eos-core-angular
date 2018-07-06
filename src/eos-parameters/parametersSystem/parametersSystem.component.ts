import { Component } from '@angular/core';
import { EOS_PARAMETERS_TAB } from './shared/consts/eos-parameters.const';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
    // selector: 'eos-parameters-system',
    templateUrl: 'parametersSystem.component.html'
})
export class ParametersSystemComponent {
    paramId: string;
    modulesTab = EOS_PARAMETERS_TAB;
    constructor(private _route: ActivatedRoute) {
        this._route.params.subscribe(params => this.paramId = params['id']);
    }
}
