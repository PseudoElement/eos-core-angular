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
        this.afterInitUserSearch();
    }
    prepareDataParam() {
        this.prepInputs = this.getObjectInputFields(this.constUserParam.fields);
        this.queryObj = this.getObjQueryInputsField2(this.prepInputs._list);
        console.log(this.queryObj);
    }
    getObjQueryInputsField2(inputs: Array<any>) {
        console.log('Попал в UPOS');
        // inputs.join('||')
        console.log({
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        PARM_GROUP: '12',
                        ISN_USER_OWNER: '3611||-99'
                }
            }
        });

        console.log(this.currTab);

        if (this.currTab === 3) {
            console.log('Fire');
        return {
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        PARM_GROUP: '12',
                        ISN_USER_OWNER: '3611||-99'
                }
            }
        };
    } else {
        return {
        [this.constUserParam.apiInstance]: {
            criteries: {
                PARM_NAME: inputs.join('||'),
                ISN_USER_OWNER: '-99'
        }
    }
};
    }
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
        console.log(inputs);
        console.log(inputs._list);
        return inputs;
    }
    convData(data: Array<any>) {
        const d = {};
        let incrementValueOne = 0;
        let incrementValueTwo = 33;
        console.log(data);
        data.forEach(item => {
            if (item.PARM_GROUP === 12) {
               /* console.log(item);
                console.log(item.PARM_VALUE);
                console.log('' + 12 + '_' + ++incrementValueOne); */
               d['' + 12 + '_' + ++incrementValueOne] = item.PARM_VALUE;
               d['' + 12 + '_' + ++incrementValueTwo] = item.PARM_NAME;
            } else {
                console.log('UPOS');
               d[item.PARM_NAME] = item.PARM_VALUE;
            }
        });
        console.log({ rec: d });
        return { rec: d };
    }
  /*  prepDataAttachField(data) {
        data.forEach(field => {
            if (field.PARM_NAME === 'Доклады СЭВ') {
            this.prepDataAttach.rec['REPORTS_OF_THE CMEA'] = field.PARM_VALUE.indexOf('SURNAME') >= 0 ? 'SURNAME' : null;
            }
        });
    }
    getDataForTable() {

    }*/
    selectfromTheDirectory() {
        // http://localhost/X182
    }
}
