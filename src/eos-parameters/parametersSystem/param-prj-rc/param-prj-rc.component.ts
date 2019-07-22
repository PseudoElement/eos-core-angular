import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PRJ_RC_PARAM } from '../shared/consts/prj-rc.consts';

@Component({
    selector: 'eos-param-prj-rc',
    templateUrl: 'param-prj-rc.component.html'
})
export class ParamPrjRcComponent extends BaseParamComponent {
    @Input() btnError;
    constructor( injector: Injector ) {
        super( injector, PRJ_RC_PARAM);
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
}
