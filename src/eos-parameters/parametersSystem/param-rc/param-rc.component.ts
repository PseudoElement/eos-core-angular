import { Component, Injector } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { RC_PARAM } from '../shared/consts/rc.consts';

@Component({
    selector: 'eos-param-rc',
    templateUrl: 'param-rc.component.html'
})
export class ParamRcComponent extends BaseParamComponent {
    constructor( injector: Injector ) {
        super(injector, RC_PARAM);
        this.init()
        .then(() => {
            this.checkDataToDisabled('RC_CTRL', '1');
        });
    }
}
