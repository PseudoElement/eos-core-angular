import { Component } from '@angular/core';
import { EOS_PARAMETERS_TAB } from './shared/consts/eos-parameters.const';

@Component({
    // selector: 'eos-parameters-system',
    templateUrl: 'parametersSystem.component.html'
})
export class ParametersSystemComponent {
    modulesTab = EOS_PARAMETERS_TAB;
}
