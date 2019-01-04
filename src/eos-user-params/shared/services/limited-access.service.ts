import {Injectable} from '@angular/core';
import { UserParamsService } from '../services/user-params.service';
import { UserParamApiSrv } from './user-params-api.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { Subject } from 'rxjs/Subject';
import { FormGroup } from '@angular/forms';
import {NpUserLinks} from '../intrfaces/user-parm.intterfaces';
@Injectable()
export class LimitedAccesseService {
    CurrentUser: any;
    public subscribe: Subject<any> = new Subject();
    GrifForm: FormGroup;
    LinksFrom: FormGroup;
    user_id: number;
    constructor(
        private _userServices: UserParamsService,
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService
        // private _piprx: PipRX
    ) {
        this.CurrentUser = this._userServices.curentUser;
        this.user_id =  this._userServices.userContextId;
    }


    getAccessCode() {
        const user = this._userServices.userContextId;
        const query = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: String(user)
                }
            },
            expand: 'USER_DOCGROUP_ACCESS_List'
        };

    return    this._pipSrv.getData(query)
        .then((result) => {
            const paramsString = this.parseResultAccessCode(result['0'].USER_DOCGROUP_ACCESS_List);
            if (paramsString) {
            return  this.getCodeNameDOCGROUP(paramsString, result['0'].USER_DOCGROUP_ACCESS_List);
            }
            return [];
        }).catch(error => {
            error.message = 'Внутренняя ошибка сервера';
            this._errorHandler(error);
            return false;
        });
    }

    getCodeNameDOCGROUP (queryString: string, result?) {
        const query = {
            DOCGROUP_CL: {
                criteries: {
                    DUE: queryString
                }
            }
        };
      return  this._pipSrv.getData(query)
      .then(results => {
          if (result) {
            result.forEach((el, index) => {
                el['NAME'] = results[index]['CLASSIF_NAME'];
            });
             return result;
          }
        return results;
        }).catch(error => {
            error.message = 'Внутренняя ошибка сервера';
            this._errorHandler(error);
            return false;
        });
    }

    parseResultAccessCode(arrayCode): string {
        let queryParams = '';
        arrayCode.forEach(element => {
            queryParams += element.DUE + '||';
        });
        return queryParams;
    }

    parseClassifResponse(params: string): Array<string> {
        return params.split('|');
    }

    addNewDocument(data) {
        const queryUserCl = data;
        if (data.length) {
            return this._pipSrv.setData(queryUserCl).then(res => {
        return res;
        }).catch(error => {
            console.log(error);
        });
    }
}

preAddNewDocument(form) {
    const data = [];
    const arrForms = form.value.filter(element => {
        return element.newField === true;
    });

    arrForms.forEach(element => {
        data.push({
            method: 'POST',
            requestUri: `USER_CL(${ this._userServices.userContextId})/USER_DOCGROUP_ACCESS_List`,
            data: {
                ISN_LCLASSIF: this._userServices.userContextId,
                DUE: element.due,
                ALLOWED: element.checkbox ? '1' : '0',
            }


        });
    });
   return this.addNewDocument(data);
}

    edit(data) {
        const queryUserCl = data;
        return this._pipSrv.setData(queryUserCl).then(res => {
            return res;
        }).catch(error => {
            console.log(error);
        });
    }

    preEdit(form) {
        const data = [];
        const chengedFields = form.value.filter(element => {
            return element.change === true && element.newField !== true;
        });
        chengedFields.forEach(element => {
            data.push({
                method: 'MERGE',
                requestUri: `USER_CL(${this._userServices.userContextId})/USER_DOCGROUP_ACCESS_List(\'${this._userServices.userContextId} ${element.due}\')`,
                data: {
                    ALLOWED: element.checkbox ? '1' : '0',
                }
            });
        });
        return this.edit(data);
    }

    delite(data): Promise<any> {
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
    preDelite(value: Set<any>) {
        const dataDelite = [];
        Array.from(value).forEach(element => {
            dataDelite.push({
                method: 'DELETE',
                requestUri: `USER_CL(${this._userServices.userContextId})/USER_DOCGROUP_ACCESS_List(\'${this._userServices.userContextId} ${element.due}\')`,
            });
        });
        return this.delite(dataDelite);
    }


    // грифы

    getDataGrifs() {
        const user = this._userServices.userContextId;
        const query = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: String(user)
                }
            },
            expand: 'USERSECUR_List'
        };
     return   this._pipSrv.getData(query);
    }
    getGrifsName() {
        const query = {
            SECURITY_CL: ALL_ROWS
        };
     return   this._pipSrv.getData(query);
    }
    getInfoGrifs() {
        return Promise.all([this.getDataGrifs(), this.getGrifsName()]);
    }

    postGrifs(form) {
        const data = [];
        const chengedFields = form.value.filter(element => {
            return element.action === 'create';
        });
        chengedFields.forEach(element => {
            data.push({
                method: 'POST',
                requestUri: `USER_CL(${ this._userServices.userContextId})/USERSECUR_List`,
                data: {
                    ISN_LCLASSIF: String(this._userServices.userContextId),
                    SECURLEVEL: String(element.SECURLEVEL)
                }
            });
        });
        return   this._pipSrv.setData(data);
    }

    deliteGrifs(form) {
        const data = [];
        const chengedFields = form.value.filter(element => {
            return element.action === 'delite';
        });
        chengedFields.forEach(element => {
            data.push({
                method: 'DELETE',
                requestUri: `USER_CL(${ this._userServices.userContextId})/USERSECUR_List(\'${element.SECURLEVEL} ${this._userServices.userContextId}\')`,
            });
        });
        return   this._pipSrv.setData(data);
    }

    getLinksFromTableLINK_CL(): Promise<any> {
        const query = {
            LINK_CL: ALL_ROWS
        };
       return this._pipSrv.getData(query);
    }

    getIsActiveFromTableNpUserLINK(user: number): Promise<any> {
        const query = {
            NP_USERLINK: {
                criteries: {
                    ISN_LCLASSIF: String(user)
                }
            }
        };
      return this._pipSrv.getData(query);
    }

    getResultArrayForLinks(user) {
        return Promise.all([this.getLinksFromTableLINK_CL(), this.getIsActiveFromTableNpUserLINK(user)]).then(arrayResult => {
            const paramsForInitForm = [];
            const LinksName = arrayResult[0];
            const LinksCheked = arrayResult[1];
            let objParamsFrom = {};
            LinksName.forEach(element => {
                objParamsFrom['CLASSIF_NAME'] = element['CLASSIF_NAME'];
                objParamsFrom['ISN_LINK'] = element['ISN_LCLASSIF'];
                const flag =   LinksCheked.some(checked => {
                    return   checked['ISN_LINK'] === element['ISN_LCLASSIF'] ? true : false;
                });
                flag ?   objParamsFrom['checkbox'] = true :   objParamsFrom['checkbox'] = false;
                paramsForInitForm.push(objParamsFrom);
                objParamsFrom = {};
            });
           return paramsForInitForm;
        });
    }

    createLinksNpUserLInk(value: NpUserLinks[]) {
        const createValue = [];
        const createParams = value.filter((element: NpUserLinks) => {
            return element.ACTION === 'CREATE';
        });
        createParams.forEach((createVlue: NpUserLinks) => {
            createValue.push({
                method: 'POST',
                requestUri: 'NP_USERLINK',
                data: {
                    ISN_LCLASSIF: this._userServices.userContextId,
                    ISN_LINK: createVlue.ISN_LINK
                }
            });
        });
        return   this._pipSrv.setData(createValue);
    }

    deliteLinksFromNpUserLink(value: NpUserLinks[]) {
        const dataDeleted = [];
        const deleteParams = value.filter((element:  NpUserLinks) => {
            return element.ACTION === 'DELETE';
        });

        deleteParams.forEach((deleted: NpUserLinks) => {
            dataDeleted.push({
                method: 'DELETE',
                requestUri: `NP_USERLINK(\'${this._userServices.userContextId} ${deleted.ISN_LINK}\')`,
            });
        });
        return   this._pipSrv.setData(dataDeleted);
    }

    private _errorHandler(err): void {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: '',
            msg: errMessage
        });
    }
}
