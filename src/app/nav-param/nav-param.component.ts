import { Component } from '@angular/core';
import { EOS_PARAMETERS_TAB } from 'eos-parameters/parametersSystem/shared/consts/eos-parameters.const';

@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent {
    listParams = EOS_PARAMETERS_TAB;
    isWide = false;
    changeState() {
        this.isWide = !this.isWide;
    }
}
