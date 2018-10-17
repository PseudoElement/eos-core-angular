import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { OTHER_USER } from '../consts/other.consts';
import { E_FIELD_TYPE } from '../../../shared/intrfaces/user-params.interfaces';

@Injectable()
export class UserParamOtherSrv extends BaseUserSrv {
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    currTab = 0;
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    private fieldsType = {};
    constructor( injector: Injector ) {
        super(injector, OTHER_USER);
        this.init();
    }
    afterInitUserSearch() {
        this.prepareDataParam();
        this.userParamApiSrv.getData(this.queryObj)
        .then(data => {
            this.prepareData = this.convData(data);
            this.dataAttachDb = data;
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
           // this.inputAttach = this.getInputAttach();
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    setTab(i: number) {
        this.currTab = i;
       // this.afterInitUserSearch();
    }
    prepareDataParam() {
        this.prepInputs = this.getObjectInputFields(this.constUserParam.fields);
        this.queryObj = this.getObjQueryInputsField2(this.prepInputs._list);
    }
    getObjQueryInputsField2(inputs: Array<any>) {
        return {
        [this.constUserParam.apiInstance]: {
            criteries: {
                PARM_NAME: inputs.join('||'),
                ISN_USER_OWNER: '3611'
            }
          }
       };
    }

    getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            this.fieldsType[field.key] = field.type;
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: !!field.readonly,
                formatDbBinary: !!field.formatDbBinary
            };
        });
        return inputs;
    }
    convData(data: Object) {
        const d = {};
     for (const key of Object.keys(data)) {
        d[key] = data[key];
     }
        return { rec: d };
    }
    selectfromTheDirectory() {
        // http://localhost/X182
    }
}
