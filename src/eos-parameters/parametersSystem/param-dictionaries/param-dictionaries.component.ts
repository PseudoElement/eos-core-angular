import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { DICTIONARIES_PARAM } from './../shared/consts/dictionaries-consts';
import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts';

@Component({
    selector: 'eos-param-dictionaries',
    templateUrl: 'param-dictionaries.component.html'
})
export class ParamDictionariesComponent extends BaseParamComponent {
    @Input() btnError;
    constructor( injector: Injector,
        private _eaps: EosAccessPermissionsService,
        ) {
        super( injector, DICTIONARIES_PARAM);
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }

    getRightsRubric() {
        return this._eaps.isAccessGrantedForDictionary(RUBRICATOR_DICT.id, null) !== APS_DICT_GRANT.denied;
    }
}
