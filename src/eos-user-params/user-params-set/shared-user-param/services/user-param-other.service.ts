import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { OTHER_USER } from '../consts/other.consts';
import { E_FIELD_TYPE } from '../../../shared/intrfaces/user-params.interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';

@Injectable()
export class UserParamOtherSrv extends BaseUserSrv {
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    currTab = 0;
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    initShablony: Array<any>;
    saveDefaultValue: Array<any>;
    prepDataAttach = {rec: {}};
    private fieldsType = {};
    constructor( injector: Injector ) {
        super(injector, OTHER_USER);
        this.getList().then(list => {
            OTHER_USER.fields.map(field => {
                if (field.key === 'RS_OUTER_DEFAULT_DELIVERY') {
                    list.forEach(item => {
                        field.options.push(
                            {value: item.ISN_LCLASSIF, title: item.CLASSIF_NAME},
                        );
                    });
                }
            });
            this.getDefaultsValues().then(defaultInit => {
                this.constUserParam.fields = this.constUserParam.fields.concat(this.constUserParam.fieldsTemplates);
                this.init();
                this.initShablony = defaultInit;
                this.saveDefaultValue = (defaultInit as Array<any>).slice();
            });
        });
    }

    getList(): Promise<any> {
         const query = {
            DELIVERY_CL: ALL_ROWS
         };
       return  this.userParamApiSrv.getData(query);
    }

    getObjQueryInputsFieldForDefaultAll() {
        return {
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    getDefaultsValues(): Promise<any> {
        // const prepareArrayFields = this.constUserParam.fieldsTemplates.map( el => {
        //     return '\'' +  encodeURI(el.key) + '\'';
        // });
    const query = this.getObjQueryInputsFieldForDefaultAll();
      return  this.getData(query)
        .then(defaultValue => {
         return defaultValue.splice(-33);
        }).then(result => {
            const arrayDateMain = [];
            let prepareObj = {};
            result.forEach(el => {
                let keyForm = 'rec.';
                prepareObj['PARM_NAME'] = el['PARM_NAME'];
                prepareObj['PARM_VALUE'] = el['PARM_VALUE'];
                prepareObj['keyForm'] = keyForm + el['PARM_NAME'];
                arrayDateMain.push(prepareObj);
                keyForm = 'rec.';
                prepareObj = {};
            });
            return arrayDateMain;
        });
    }

    // sort() {
    //     const arrayDateMain = [];
    //     let prepareObj = {};
    //     this.prepInputs._list.forEach(element => {
    //         if (this.mapDefault.has(element)) {
    //             let keyForm = 'rec.';
    //             prepareObj['key'] = element;
    //             prepareObj['defaultValue'] = this.mapDefault.get(element);
    //             prepareObj['keyForm'] = keyForm + element;
    //             arrayDateMain.push(prepareObj);
    //             keyForm = 'rec.';
    //             prepareObj = {};
    //         }
    //     });
    //     return arrayDateMain;
    // }

    default() {
        const changed = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list.splice(0, 17));
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data.concat(this.saveDefaultValue));
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
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
