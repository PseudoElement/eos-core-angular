import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs';
import {PipRX} from 'eos-rest/services/pipRX.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
@Injectable()
export class RemasterService {
    cancelEmit: Subject<any> = new Subject();
    defaultEmit: Subject<any> = new Subject();
    submitEmit: Subject<any> = new Subject();
    editEmit:  Subject<any> = new Subject();
    emitDefaultFalues: Subject<any> = new Subject();
    constructor(
       private _apiSrv: PipRX,
       private _msg: EosMessageService,
    ) {

    }

    getOrgGroupName(node: any): Promise<any> {
        const query = {
            ORGANIZ_CL: {
                criteries: {
                    ISN_NODE: node
                }
            }
        };
        return this._apiSrv.read(query).then(res => {
            return res;
        }).catch(error => {
            this._msg.addNewMessage({
                title: 'Ошибка',
                type: 'danger',
                msg: error.message || 'Не установленно соединение с базой'
            });
        });
    }
    getScanShablonBarCode(): Promise<any> {
        const query = {
            DOC_TEMPLATES: {
                criteries: {
                    CATEGORY: `%книжная%`
                }
            },
            order: 'DESCRIPTION'
        };
      return  this._apiSrv.read(query).then(res => {
        return res;
      }).catch(error => {
        this._msg.addNewMessage({
            title: 'Ошибка',
            type: 'danger',
            msg: error.message || 'Не установленно соединение с базой'
        });
      });
    }

    getScanShablonBarCodeL() {
        const query = {
            DOC_TEMPLATES: {
                criteries: {
                    CATEGORY: `%альбомная%`
                },
                order: 'DESCRIPTION'
            }
        };
      return  this._apiSrv.read(query).then(res => {
        return res;
      }).catch(error => {
        this._msg.addNewMessage({
            title: 'Ошибка',
            type: 'danger',
            msg: error.message || 'Не установленно соединение с базой'
        });
      });
    }

    getScanFormatCl() {
        const query = {
            FORMAT_CL: {
                criteries: {
                    DEL_COL: '0'
                },
            }
        };
      return  this._apiSrv.read(query).then(res => {
        return res;
      }).catch(error => {
        this._msg.addNewMessage({
            title: 'Ошибка',
            type: 'danger',
            msg: error.message || 'Не установленно соединение с базой'
        });
      });
    }

    getLink_Type() {
        const query = {
            LINK_CL: { ar: true }
        };
    return  this._apiSrv.read(query).then(res => {
        return res;
    }).catch(error => {
        this._msg.addNewMessage({
            title: 'Ошибка',
            type: 'danger',
            msg: error.message || 'Не установленно соединение с базой'
        });
    });
    }
}
