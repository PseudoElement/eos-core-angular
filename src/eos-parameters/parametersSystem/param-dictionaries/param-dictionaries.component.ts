import { DICTIONARIES_PARAM } from './../shared/consts/dictionaries-consts';
import { Component, Injector } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';

@Component({
    selector: 'eos-param-dictionaries',
    templateUrl: 'param-dictionaries.component.html'
})
export class ParamDictionariesComponent extends BaseParamComponent {

    constructor( injector: Injector ) {
        super( injector, DICTIONARIES_PARAM);
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
}
