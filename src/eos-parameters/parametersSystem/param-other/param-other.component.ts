import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { OTHER_PARAM } from './../shared/consts/other-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppContext } from 'eos-rest/services/appContext.service';

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
    formServer: FormGroup;


    constructor(
        injector: Injector,
        protected context: AppContext
        ) {
        super(injector, OTHER_PARAM);
        this.formServer = new FormGroup({
            server: new FormControl({ value: context.SysParms._more_json.ParamsDic['СЕРВЕР ПРИЛОЖЕНИЙ'], disabled: true })
        });
        this.init()
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
}
