import {Injectable} from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import {IFieldDescriptor} from 'eos-user-params/shared/intrfaces/user-params.interfaces';
@Injectable()
export class FormHelperService {
    public _fieldsType = {};
    public _fieldsTypeParce = {};
    public newFormData = {};
    public mapKeyPosition: Map<string, any> = new Map();
    constructor(private _userSrv: UserParamsService ) {

    }

    fillInputFields(inputFields: IInputParamControl[]) {
        const user_scan_right = this._userSrv.curentUser['STREAM_SCAN_RIGHTS'];
        const arrayFills: IInputParamControl[]  = [];
        inputFields.forEach((inputVal: IInputParamControl, index) => {
            const f = Object.assign({}, inputVal);
            arrayFills.push(f);
            switch (f['key']) {
                case 'STREAM_SCAN_RIGHTS_BD' :
                setVal(f, index);
                return;
                case 'STREAM_SCAN_RIGHTS_ARM':
                setVal(f, index);
                return;
                case 'STREAM_SCAN_RIGHTS_BAR_CODE':
                setVal(f, index);
                return;
                default:
                setVal(f, index);
                return;
            }
        });

        return arrayFills;
        function setVal(f, position: number) {
            if (user_scan_right === null) {
                f['value'] = false;
            }   else {
                const splitValue = user_scan_right.split('');
                if (splitValue[position]) {
                    String(splitValue[position]) === '1' ? f['value'] = true : f['value'] = false;
                }   else {
                    f['value'] = false;
                }
            }
        }
    }

    fillInputFieldsSetParams(inputFields: IInputParamControl[]) {
        const user_param = this._userSrv.curentUser['USER_PARMS_HASH'];
        const arrayFills: IInputParamControl[]  = [];
        inputFields.forEach((inputVal: IInputParamControl, index) => {
            const f: IInputParamControl = Object.assign({}, inputVal);
            arrayFills.push(f);
            if (f.controlType === E_FIELD_TYPE.boolean) {
              if (String(user_param[f['key']]) !==  'null' && String(user_param[f['key']]) !==  'undefined') {
                if (user_param[f['key']] === 'NO') {
                    f['value']  = false;
                }   else {
                    f['value']  = true;
                }
              } else {
                f['value']  = false;
              }
            }

            if (f.controlType === E_FIELD_TYPE.string) {
                if (String(user_param[f['key']]) !== 'null' && String(user_param[f['key']]) !==  'undefined') {
                    f['value'] = user_param[f['key']];
                }   else {
                    f['value']  = '';
                }
            }

        });
        return arrayFills;
    }

    changesForm(inputs: IInputParamControl[], newVal) {
        let countChanges = 0;
        let btnDisableFlag = null;
        inputs.forEach((field, index) => {
            if (field.value !== newVal[field.key]) {
                this.newFormData[field.key] = field.value;
                countChanges += 1;
            } else {
                delete this.newFormData[field.key];
            }
        });
        countChanges > 0 ? btnDisableFlag = false : btnDisableFlag = true;
        countChanges = 0;
        return btnDisableFlag;
    }

    getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            this._fieldsType[field.key] = field.type;
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: !!field.readonly,
                formatDbBinary: !!field.formatDbBinary,
                maxValue: field.maxValue || undefined,
                minValue: field.minValue || undefined,
                default: '',
                disabled: field.readonly
            };
        });
        return inputs;
    }
    linearSearchKeyForData(arrayWithKeys, allData) {
        const readyObjectData = {};
        let readyElement;
        for (let i = 0; i < arrayWithKeys.length; i++) {
            readyElement = allData[arrayWithKeys[i].key];
            readyObjectData[arrayWithKeys[i].key] = readyElement;
        }

        return readyObjectData;
    }

    convData(data: Object) {
        const d = {};
        for (const key of Object.keys(data)) {
            d[key] = data[key];
        }
        return { rec: d };
    }

    getInputs(prepareData) {
        const dataInput = {rec: {}};
        Object.keys(prepareData.rec).forEach(key => {
            if (this._fieldsType[key] === 'boolean' || this._fieldsType[key] === 'toggle') {
                if (prepareData.rec[key] === 'YES' || String(prepareData.rec[key]) === '1') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = prepareData.rec[key];
            }
        });
        return dataInput;
    }

    parse_Create(fields, userData) {
        const obj = {};
        fields.forEach((field: IFieldDescriptor) => {
            this._fieldsTypeParce[field.key] = 'all';
            if (field.type === 'radio') {
                obj[field.key] = userData[field.key];
            } else if (field.type === 'string') {
                obj[field.key] = userData[field.key] === (null || '' || undefined) ? '' : userData[field.key];
            }else if (field.type === 'boolean') {
                if (!isNaN(userData[field.key])) {
                    this._fieldsTypeParce[field.key] = 'number';
                    if (+userData[field.key] === 0) {
                        obj[field.key] = false;
                    }   else {
                        obj[field.key] = true;
                    }
                }  else {
                    this._fieldsTypeParce[field.key] = 'string';
                    if (userData[field.key] === 'YES') {
                        obj[field.key] = true;
                    }   else {
                        obj[field.key] = false;
                    }
                }
            } else {
                obj[field.key] = userData[field.key] ? userData[field.key] : '';
            }
        });
        return obj;
    }

    parse_Create_Auto_Search(fields, userData) {
        const obj = {};
        fields.forEach((field: IFieldDescriptor) => {
            if (field.key.indexOf('DEF_') !== -1) {
                this._fieldsTypeParce[field.key] = 'DEV_SEARCH';
                this.mapKeyPosition.set(field.key, field.keyPosition);
               if (field.type === 'radio') {
                    obj[field.key] = userData['DEF_SEARCH_CITIZEN'].charAt(field.keyPosition);
                } else {
                    if (String(userData['DEF_SEARCH_CITIZEN'].charAt(field.keyPosition)) === '0') {
                        obj[field.key] = false;
                    }else {
                        obj[field.key] = true;
                    }
                }
            }   else {
                if (field.type === 'boolean') {
                    if (!isNaN(userData[field.key])) {
                        this._fieldsTypeParce[field.key] = 'number';
                        if (+userData[field.key] === 0) {
                        obj[field.key] = false;
                        }   else {
                        obj[field.key] = true;
                        }
                    }  else {
                        this._fieldsTypeParce[field.key] = 'string';
                        if (userData[field.key] === 'YES') {
                            obj[field.key] = true;
                        }   else {
                            obj[field.key] = false;
                        }
                    }
                } else {
                    const value = userData[field.key];
                    obj[field.key] = (value === '' || value === null || value === undefined ) ? '' : value;
                }
            }
        });
        return obj;
    }
    getObjQueryInputsFieldForDefault(inputs: Array<any>) {
        return {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: inputs.join('||'),
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    queryparams(data, key) {
        const arraQlist = [];
        data[key].forEach(el => {
            arraQlist.push(el.key);
        });
        return arraQlist;
    }

    createhash(data: any) {
        const a = {};
        data.forEach((el: any) => {
            a[el.PARM_NAME] = el.PARM_VALUE;
        });
        return a;
    }

}
