import { OTHER_PARAM } from './../shared/consts/other-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AppContext } from 'eos-rest/services/appContext.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-param-other',
    templateUrl: 'param-other.component.html',
    styles: [`.param-other > .inline-block {
        margin-left: 10px;
    }`]
})
export class ParamOtherComponent extends BaseParamComponent implements OnInit {
    @Input() btnError;
    masDisable: any[] = [];
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
                return this.init()
                .then(() => {
                    this.cancelEdit();
                });
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.includes(key)) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
    }
}
