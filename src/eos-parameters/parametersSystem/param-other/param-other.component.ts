import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { OTHER_PARAM } from './../shared/consts/other-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Component({
    selector: 'eos-param-other',
    templateUrl: 'param-other.component.html'
})
export class ParamOtherComponent extends BaseParamComponent implements OnInit {
    inputServer = {
        controlType: E_FIELD_TYPE.string,
        key: 'server',
        label: 'Сервер приложений и сервер «ДелоWEB»',
    };
    formServer: FormGroup;



    constructor(
        injector: Injector,
        private context: AppContext
        ) {
        super(injector, OTHER_PARAM);
    }
    ngOnInit() {
        this.formServer = new FormGroup({
            server: new FormControl({ value: this.context.SysParms._more_json.ParamsDic['СЕРВЕР ПРИЛОЖЕНИЙ'], disabled: true })
        });
        this.getData({DELIVERY_CL: ALL_ROWS})
            .then(data => {
                return data.map(i => {
                    return {
                        value: i['ISN_LCLASSIF'],
                        title: i['CLASSIF_NAME']
                    };
                });
            })
            .then(opsh => {
                this.constParam.fields.forEach(field => {
                    if (field.key === 'EMAIL_ISN_DELIVERY' || field.key === 'SEV_ISN_DELIVERY') {
                        field.options = opsh;
                    }
                });
                return this.init();
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
}
