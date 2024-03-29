import {Injectable} from '@angular/core';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { IInputParamControl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_FIELD_TYPE, IFieldDescriptor } from '../../../eos-dictionaries/interfaces';
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

    fillInputFieldsSetParams(inputFields: IInputParamControl[], data) {
        const arrayFills: IInputParamControl[]  = [];
        inputFields.forEach((inputVal: IInputParamControl, index) => {
            const f: IInputParamControl = Object.assign({}, inputVal);
            arrayFills.push(f);
            if (f.controlType === E_FIELD_TYPE.boolean) {
              if (String(data[f['key']]) !==  'null' && String(data[f['key']]) !==  'undefined' &&  String(data[f['key']]).replace(/\s/g, '')  !== '') {
                if (data[f['key']] === 'NO') {
                    f['value']  = false;
                }   else {
                    f['value']  = true;
                }
              } else {
                f['value']  = false;
              }
            }

            if (f.controlType === E_FIELD_TYPE.string) {
                if (String(data[f['key']]) !== 'null' && String(data[f['key']]) !==  'undefined') {
                    f['value'] = data[f['key']];
                }   else {
                    f['value']  = '';
                }
            }

        });
        return arrayFills;
    }

    changesForm(inputs, newVal) {
        let countChanges = 0;
        let btnDisableFlag = null;
        Object.keys(inputs).forEach((field, index) => {
            if (inputs.value !== newVal[field]) {
                this.newFormData[field] = inputs.value;
                countChanges += 1;
            } else {
                delete this.newFormData[field];
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
            } else if (field.type === 'boolean') {
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
                    } else {
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

    getObjQueryInputsField() {
        return {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: '-99'
                }
            }
        };
    }

    pushIntoArrayRequest(storeReq: Array<any>, data: Map<string, any>, id, encodeurl: boolean = false): Array<any> {
        Array.from(data).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            storeReq.push({
                method: 'MERGE',
                requestUri: `USER_CL(${id})/USER_PARMS_List(\'${id} ${val[0]}\')`,
                encodeurl: encodeurl,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return storeReq;
    }

    CreateDefaultRequest(storeReq: Array<any>, data: Map<string, any>, encodeurl: boolean = false): Array<any> {
        Array.from(data).forEach(val => {
            let parn_Val;
            if (typeof val[1] === 'boolean') {
                val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
            } else {
                String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
            }
            storeReq.push({
                method: 'MERGE',
                requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${val[0]}')`,
                encodeurl: encodeurl,
                data: {
                    PARM_VALUE: `${parn_Val}`
                }
            });
        });
        return storeReq;
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
