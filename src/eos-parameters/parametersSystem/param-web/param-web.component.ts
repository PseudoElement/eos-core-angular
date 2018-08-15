import { Component, Injector } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent extends BaseParamComponent {
    constructor( injector: Injector ) {
        super( injector, WEB_PARAM);
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
}
