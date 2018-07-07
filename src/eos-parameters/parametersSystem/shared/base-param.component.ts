import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE, IBaseParameters } from '../shared/interfaces/parameters.interfaces';
import { Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { EosParametersApiServ } from './service/eos-parameters-descriptor.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { InputControlService } from 'eos-common/services/input-control.service';

export class BaseParamComponent implements OnDestroy, OnInit {
    @Output() formChanged = new EventEmitter();
    constParam: IBaseParameters;
    paramApiSrv: EosParametersApiServ;
    dataSrv: EosDataConvertService;
    inputCtrlSrv: InputControlService;
    titleHeader;
    data = {};
    prepareData;
    newData;
    prepInputs: any;
    inputs: any;
    form: FormGroup;
    queryObj;
    subscriptions: Subscription[] = [];
    constructor(paramModel) {
        this.constParam = paramModel;
        this.init();
    }
    ngOnDestroy() {
        // console.log('Destroy');
        this.unsubscribe();
    }
    ngOnInit() {
        this.formChanged.emit(false);
    }
    convData(data: Array<any>) {
        const d = {};
        data.forEach(item => {
            d[item.PARM_NAME] = item.PARM_VALUE;
        });
        return { rec: d };
    }

    getObjQueryInputsField(inputs: Array<any>) {
        return { USER_PARMS: { criteries: { PARM_NAME: inputs.join('||'), ISN_USER_OWNER: '-99' } } };
    }

    createObjRequest(list: any[], value): any[] {
        const req = [];
        list.forEach(item => {
            req.push({
                method: 'POST',
                requestUri: 'SYS_PARMS_Update?PARM_NAME=\'' + item + '\'&PARM_VALUE=\'' + value['rec.' + item] + '\''

            });
        });
        return req;
    }
    private init() {
        this.titleHeader = this.constParam.title;
        this.prepInputs = this.getObjectInputFields(this.constParam.fields);
        this.queryObj = this.getObjQueryInputsField(this.prepInputs._list);
    }

    private getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            inputs._list.push(field.key);
            inputs.rec[field.key] = { title: field.title, type: E_FIELD_TYPE[field.type], foreignKey: field.key };
        });
        return inputs;
    }
    private unsubscribe() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }
}
