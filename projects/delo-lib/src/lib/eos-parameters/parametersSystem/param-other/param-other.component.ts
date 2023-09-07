import { OTHER_PARAM, OTHER_PARAM_CB } from './../shared/consts/other-consts';
import { BaseParamComponent } from './../shared/base-param.component';
import { Component, Injector, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppContext } from '../../../eos-rest/services/appContext.service';
// import { USER_PARMS } from '../../../eos-rest';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { ISession } from '../../../eos-parameters/interfaces/app-setting.interfaces';

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
    formServer: FormGroup;
    licMedo: boolean = false;
    checkDiadoc: boolean = true;
    public paramSession: any = {
        namespace: AppsettingsParams.Identity,
        typename: AppsettingsTypename.Session,
        instance: 'Default'
    };

    constructor(
        injector: Injector,
        private context: AppContext
        ) {
        super(injector, context.cbBase ? OTHER_PARAM_CB : OTHER_PARAM);
    }
    /**
     * init
     * переписываем метод, чтобы скрывать удаленные Виды доставок в dropdown's
     */
    public init() {
        this.prepareDataParam();
        const allRequest = [];
        allRequest.push(this.getData(this.queryObj));
        allRequest.push(this.getAppSetting<ISession>(this.paramSession));
        return Promise.all(allRequest)
            .then(([data, session]) => {
                data.map(d => {
                    if (d.PARM_NAME === 'СЕРВЕР ПРИЛОЖЕНИЙ') {
                        d.PARM_NAME = 'СЕРВЕР_ПРИЛОЖЕНИЙ';
                    }
                    if (d.PARM_NAME === 'DIADOC_ISN_DELIVERY') {
                        this.checkDiadoc = true;
                    }
                    return d;
                });
                this.prepareData = this.convData(data);
                this.prepareData.rec['TimeoutInMinutes'] = session['TimeoutInMinutes'];
                this._updateDeliveryOptions();
                this.prepareDataParam();
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }
    ngOnInit() {
        this.context.SysParms._more_json.licensed.forEach(elem => {
            if (elem === 35) {
                this.licMedo = true;
            }
        });
        this.getData({DELIVERY_CL: {
            criteries: {
                orderby: 'WEIGHT',
            },
        }})
            .then(data => {
                return data.map(i => {
                    return {
                        value: i['ISN_LCLASSIF'],
                        title: i['CLASSIF_NAME'],
                        disabled: Boolean(i['DELETED']),
                    };
                });
            })
            .then(opts => {
                this._updateDeliveryOptions(opts);
                return this.init()
                .then(() => {
                    this.cancelEdit();
                });
            })
            .catch(err => {
                if (err.code !== 401) {
                    console.log(err);
                }
            });
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    async submit(): Promise<void> {
        if (this.updateData['TimeoutInMinutes']) {
            const newArhivist: ISession = {
                TimeoutInMinutes: +this.updateData['TimeoutInMinutes']
            };
            await this.setAppSetting(this.paramSession, newArhivist);
            delete this.updateData['TimeoutInMinutes'];
        }
        super.submit();
    }
    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        setTimeout(() => this.form.disable({ emitEvent: false }), 100);
    }

    public createObjRequest(): any[] {
        const req = [];
        for (const key in this.updateData) {
            if (key) {
                let key2 = key;
                if (key === 'СЕРВЕР_ПРИЛОЖЕНИЙ') {
                    key2 = 'СЕРВЕР ПРИЛОЖЕНИЙ';
                }
                req.push({
                    method: 'MERGE',
                    requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${key2}')`,
                    data: {
                        PARM_VALUE: this.updateData[key]
                    }
                });
            }
        }
        return req;
    }
    private _updateDeliveryOptions(opts?: any) {
        this.constParam.fields.forEach(field => {
            if (
                field.key === 'EMAIL_ISN_DELIVERY' ||
                field.key === 'SEV_ISN_DELIVERY' ||
                field.key === 'ASPSD_ISN_DELIVERY' ||
                field.key === 'SDS_ISN_DELIVERY' ||
                field.key === 'LK_ISN_DELIVERY' ||
                field.key === 'EPVV_ISN_DELIVERY' ||
                field.key === 'MEDO_ISN_DELIVERY' ||
                field.key === 'DIADOC_ISN_DELIVERY'
            ) {
                if (opts) {
                    field.options = opts;
                } else {
                    const fieldValue = this.prepareData.rec[field.key] || '';
                    field.options = field.options.filter((opt) => !opt.disabled || String(opt.value) === String(fieldValue));
                }
            }
        });
    }
}
