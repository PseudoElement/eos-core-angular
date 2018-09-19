import { ApiCfg } from './../../../eos-rest/core/api-cfg';
import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { OTHER_PARAM } from './../shared/consts/other-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
    selector: 'eos-param-other',
    templateUrl: 'param-other.component.html'
})
export class ParamOtherComponent extends BaseParamComponent {
    inputServer = {
        controlType: E_FIELD_TYPE.string,
        key: 'server',
        label: 'Сервер приложений и сервер «ДелоWEB»',
    };
    apiConf = new ApiCfg;

    formServer = new FormGroup({
        server: new FormControl({ value: this.apiConf.apiBaseUrl, disabled: true })
    });
    constructor( injector: Injector ) {
        super(injector, OTHER_PARAM);
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
}
