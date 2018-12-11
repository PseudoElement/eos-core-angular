import {Injectable} from '@angular/core';

// import { EosMessageService } from 'eos-common/services/eos-message.service';
import { UserParamsService } from '../services/user-params.service';
import { UserParamApiSrv } from './user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
@Injectable()
export class EmailAddressService {
    CurrentUserObj: any;
    constructor(
        private _userServices: UserParamsService,
        private _pipSrv: UserParamApiSrv,
        // private _piprx: PipRX
    ) {
        this.CurrentUserObj = this._userServices.curentUser;
        console.log(this.CurrentUserObj);
        this.Decode();

    }

    Decode() {
       const code = this.getCode();
        const currentuser =  this._userServices.curentUser;
        const list = currentuser['NTFY_USER_EMAIL_List'];
        const lentgth = list.length;
        for (let i = 0; i < lentgth; i += 1 ) {
            if ( list[i]['EXCLUDE_OPERATION'] !== '' && list[i]['EXCLUDE_OPERATION'] !== null) {
                const arrCode =  list[i]['EXCLUDE_OPERATION'];
                let str = '';
                arrCode.split(';').forEach(el => {
                    if (code.has(String(el))) {
                        str += code.get(el);
                        list[i]['EXCLUDE_OPERATION'] = str + ' ';
                    }
                });
            }
        }
        this.CurrentUserObj['NTFY_USER_EMAIL_List'] = list;
    }

    addMail(email: string): Promise<any> {
        const queryUserCl = [{ // pipe batch
            method: 'POST', // 'POST', 'DELETE'
            requestUri: `USER_CL(${ this._userServices.curentUser['ISN_LCLASSIF']})/NTFY_USER_EMAIL_List`, // строка запроса
            data: { // данные для записи или изменения
                ISN_USER: this._userServices.curentUser['ISN_LCLASSIF'],
                EMAIL: email,
                IS_ACTIVE: 1,
                WEIGHT: 5,
                EXCLUDE_OPERATION: ''
            }
        }];
       return this._pipSrv.setData(queryUserCl).then(res => {
    return queryUserCl[0].data;
    }).catch(error => {
        console.log(error);
    });
}


    editEmail() {
        const queryUserCl = [{ // pipe batch
            method: 'MERGE',
            requestUri: `USER_CL(1003029)/NTFY_USER_EMAIL_List('1003029 test@mail.ru')`,
            data: { // данные для записи или изменения
                // ISN_USER: 1003029,
                EMAIL: 'new@mail.com',
                // IS_ACTIVE: 0,
                // WEIGHT: 3,
                // EXCLUDE_OPERATION: 'null'
            }
        }];
       return this._pipSrv.setData(queryUserCl).then(res => {
           console.log(res);
       }).catch(error => {
           console.log(error);
       });
    }

    deliteEmail() {
        const queryUserCl = [{ // pipe batch
            method: 'DELETE',
            requestUri: `USER_CL(1003029)/NTFY_USER_EMAIL_List('1003029 werwew@mail.com')`,
        }];
       return this._pipSrv.setData(queryUserCl).then(res => {
          return res;
       }).catch(error => {
           console.log(error);
       });
    }

    getCode() {
        // const query = {NTFY_OPERATION: ALL_ROWS};
        // return this._piprx.read(query).then(res => {
        //     console.log(res);
        //     return res;
        // });
        const map = new Map();
        const arrayM = [{
            CODE: 'OPJV2',
            NAME: 'Редактирование поручения. Изменение № пункта документа/автора резолюции'
        },
        {
            CODE: 'OPJS2',
            NAME: 'Редактирование поручения. Изменение содержания'
        },
        {
            CODE: 'URSP',
            NAME: 'Редактирование поручения. Изменение плановой даты поручения'
        },
        {
            CODE: 'URSC',
            NAME: 'Редактирование поручения. Изменения в составе исполнителей'
        }];

        arrayM.forEach((el, index, array) => {
            map.set(el.CODE, el.NAME);
        });
        return map;
    }

    getAllEmails(email: string): Promise<boolean> {
        const query = {
            NTFY_USER_EMAIL: ALL_ROWS
        };
       return this._pipSrv.getData(query).then(result => {
            if (result.length > 0) {
               return result.some(el => {
                  return  el['EMAIL'] === email;
               });
            }
       });
    }

    getMaxWeigth() {
        const arrEmails = this._userServices.curentUser['NTFY_USER_EMAIL_List'];
        let maxWeigth = null;
        const arrWeigth = [];
        if (arrEmails.length > 0) {
            arrEmails.forEach(el => {
                arrWeigth.push(el.WEIGHT);
            });
            maxWeigth = Math.max.apply(null, arrWeigth);
        }else {
            maxWeigth = 1;
        }
        return maxWeigth;
    }
    // getCodeString() {
    //     const h = this.CurrentUserObj['NTFY_USER_EMAIL_List'];
    //     let code = '';
    // }
}
