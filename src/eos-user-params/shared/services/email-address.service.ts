import {Injectable} from '@angular/core';
import { FormArray} from '@angular/forms';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
import { UserParamsService } from '../services/user-params.service';
import { UserParamApiSrv } from './user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { NTYF_OPERATION } from 'eos-rest';
@Injectable()
export class EmailAddressService {
    CurrentUserObj: any;
    NTFY_CODE: Map<string, string>;
    constructor(
        private _userServices: UserParamsService,
        private _pipSrv: UserParamApiSrv,
        // private _piprx: PipRX
    ) {

        this.CurrentUserObj = this._userServices.curentUser;
    }

    Decode(data, code: Map<string, string>) {
        const lentgth = data.length;
        for (let i = 0; i < lentgth; i += 1 ) {
            if ( data[i]['EXCLUDE_OPERATION'] !== '' && data[i]['EXCLUDE_OPERATION'] !== null) {
                const arrCode =  data[i]['EXCLUDE_OPERATION'];
                let str = '';
                arrCode.split(';').forEach(el => {
                    if (code.has(String(el))) {
                        str += code.get(el) + ';';
                        data[i]['EXCLUDE_OPERATION'] = str;
                    }
                });
            }
        }
        this.NTFY_CODE = code;
        return data;
    }

    addMail(data): Promise<any> {
        const queryUserCl = data;
        if (data.length) {
            return this._pipSrv.setData(queryUserCl).then(res => {
        return res;
        }).catch(error => {
            console.log(error);
        });
    }
     return Promise.resolve(1);
    }
    preAddEmail(form: FormArray) {
        const data = [];
        const arrForms = form.value.filter(element => {
            return element.newField === true;
        });

        arrForms.forEach(element => {
            data.push({
                method: 'POST',
                requestUri: `USER_CL(${ this._userServices.curentUser['ISN_LCLASSIF']})/NTFY_USER_EMAIL_List`,
                data: {
                    ISN_USER: this._userServices.curentUser['ISN_LCLASSIF'],
                    EMAIL: element.email,
                    IS_ACTIVE: element.checkbox ? '1' : '0',
                    WEIGHT: element.weigth,
                    EXCLUDE_OPERATION: this.parseCodeFroMerge(element.params)
                }
            });
        });
       return this.addMail(data);
    }


    editEmail(data) {
        const queryUserCl = data;
       return this._pipSrv.setData(queryUserCl).then(res => {
           return res;
       }).catch(error => {
           console.log(error);
       });
    }

    preEditEmail(form: FormArray) {
        const data = [];
        const chengedFields = form.value.filter(element => {
            return element.change === true && element.newField !== true;
        });
        chengedFields.forEach(element => {
            data.push({
                method: 'MERGE',
                requestUri: `USER_CL(${this._userServices.curentUser['ISN_LCLASSIF']})/NTFY_USER_EMAIL_List(\'${this._userServices.curentUser['ISN_LCLASSIF']} ${element.email}\')`,
                data: {
                    IS_ACTIVE: element.checkbox ? '1' : '0',
                    WEIGHT: element.weigth,
                    EXCLUDE_OPERATION: this.parseCodeFroMerge(element.params)
                }
            });
        });
        return this.editEmail(data);

    }

    parseCodeFroMerge(params) {
        let EncodedParams = '';
        if (params && params.length) {
            const paramsToArray = params.split(';')
            .filter((el, index) => {
                return el !== '';
            });
            const SetParams = new Set(paramsToArray);
            this.NTFY_CODE.forEach((value, key, map) => {
                if ( SetParams.has(value.trim())) {
                    EncodedParams += key + ';';
                }
            });
        }
        if (EncodedParams !== '') {
            return EncodedParams;
        }
        return null;
    }
    deliteEmail(data): Promise<any> {
        if (data.length) {
            const queryUserCl = data;
            return this._pipSrv.setData(queryUserCl).then(res => {
               return res;
            }).catch(error => {
                console.log(error);
            });
        }
        return Promise.resolve(1);
    }

    preDeliteEmail(value: Set<any>) {
        const dataDelite = [];
         Array.from(value).forEach(element => {
            dataDelite.push({
                method: 'DELETE',
                requestUri: `USER_CL(${this._userServices.curentUser['ISN_LCLASSIF']})/NTFY_USER_EMAIL_List(\'${this._userServices.curentUser['ISN_LCLASSIF']} ${element.email}\')`,
            });
         });
         return this.deliteEmail(dataDelite);
    }

    getCode2() {
        const map = new Map();
        const query = {
            NTFY_OPERATION: ALL_ROWS
        };
        return this._pipSrv.getData(query)
        .then((result: NTYF_OPERATION[]) => {
            result.forEach((el) => {
                map.set(el.CODE, el.NAME);
            });
            return map;
        });
    }

    getAllEmails(email: string): Promise<boolean> {

        const query = {
            NTFY_USER_EMAIL: {
                criteries: {
                    ISN_USER: String(this._userServices.userContextId)
            }
        }
    };
       return this._pipSrv.getData(query).then(result => {
            if (result.length > 0) {
               return result.some(el => {
                  return  el['EMAIL'] === email;
               });
            }
       });
    }

    getMaxWeigth(array) {
        let maxWeigth = null;
        const arrWeigth = [];
        if (array.length > 0) {
            array.forEach(el => {
                arrWeigth.push(el.WEIGHT);
            });
            maxWeigth = Math.max.apply(null, arrWeigth);
        }else {
            maxWeigth = 1;
        }
        return maxWeigth;
    }
}
