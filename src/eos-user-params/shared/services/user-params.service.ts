import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT, USERCARD } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IParamUserCl } from '../intrfaces/user-parm.intterfaces';

@Injectable()
export class UserParamsService {
    private _isTechUser: boolean;
    private _userContext: IParamUserCl;
    private _userContextDeparnment: DEPARTMENT;
    private _userContextCard: USERCARD;
    private _sysParams;

    get userContextDeparnment() {
        if (this._userContextDeparnment) {
            return this._userContextDeparnment;
        }
        return null;
    }

    get sysParams() {
        if (this._sysParams) {
            return this._sysParams;
        }
        return null;
    }

    get isTechUser() {
        return this._isTechUser;
    }
    get userContextId () {
        if (this._userContext) {
           // console.log(this._userContext);
            return this._userContext['ISN_LCLASSIF'];
        }
        return null;
    }
    get curentUser (): IParamUserCl {
        return this._userContext;
    }
    get userContextParams () {
        if (this._userContext) {
            return this._userContext['USER_PARMS_List'];
        }
        return null;
    }
    get userCard () {
        if (this._userContext) {
            return this._userContext['USERCARD_List'];
        }
    }

    get userCabinet () {
        if (this._userContextCard) {
            return this._userContextCard['USER_CABINET_List'];
        }
        return null;
    }
    get hashUserContext () {
        if (this._userContext) {
            // const hash: any = {};
            // this.userContextParams.forEach(item => {
            //     hash[item.PARM_NAME] = item.PARM_VALUE;
            // });
            // return hash;

            return this._userContext['USER_PARMS_HASH'];
        }
        return null;
    }

    get hashUserContextCard () {
        if (this._userContext) {
            const hash: any = {};
            this.userCard.forEach(item => {
                hash[item.DUE] = item.FUNCLIST;
            });
            return hash;
        }
        return null;
    }

    get hashUserContexHomeCard () {
        if (this._userContext) {
            const hash: any = {};
            this.userCard.forEach(item => {
                hash[item.DUE] = item.HOME_CARD;
            });
            return hash;
        }
        return null;
    }

    get hashUserContexHomeCard2 () {
      //  console.log(this._userContext);
        if (this._userContext) {
            const hash: any = {};
            this.userCard.forEach(item => {
                hash[item.DUE] = item.ISN_LCLASSIF;
            });
            return hash;
        }
        return null;
    }

    get hashUserContexCabinet () {
        //  console.log(this._userContext);
          if (this._userContextCard) {
              const hash: any = {};
              this.userCabinet.forEach(item => {
                  hash[item.ISN_LCLASSIF] = item.FOLDERS_AVAILABLE;
                  hash[item.ISN_LCLASSIF] = item.HIDE_INACCESSIBLE;
                  hash[item.ISN_LCLASSIF] = item.HIDE_INACCESSIBLE_PRJ;
              });
              return hash;
          }
          return null;
      }

  /*  get hashUserAbsoluteRights () {
        if (this._userContext) {
            const hash: any = {};
            for (let i = 0; i < this._userContext['ISN_CLASSIF'].length; i++) {
                hash[this._userContext['ISN_CLASSIF'][i]] = this._userContext['DELO_RIGHTS'][i];
            }
            console.log(hash);
            return hash;
        }
        return null;
    }*/

    get isUserContexst () {
        return !!this._userContext;
    }
    constructor (
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService
    ) {}
    getUserIsn(isn_cl: string = this.userContextId.toString()): Promise<boolean> {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn_cl ? isn_cl : (this.userContextId + '')
                }
            },
            expand: 'USER_PARMS_List,USERCARD_List/USER_CABINET_List,USER_RIGHT_DOCGROUP_List,USERDEP_List,USERCARD_List/USER_CARD_DOCGROUP_List'
        };
        const _user = this._pipSrv.getData<USER_CL>(queryUser);
        const _sys = this.fetchSysParams();
        return Promise.all([_user, _sys])
        .then(([user, sys]) => {
            this._sysParams = sys;
            this._userContext = user[0];
            this._userContext['DUE_DEP_NAME'] = '';
            this._isTechUser = !this._userContext['DUE_DEP'];
            this._userContext['isTechUser'] = !this._userContext['DUE_DEP'];
            this._userContext['isAccessDelo'] = !!this._userContext.USERCARD_List.length;
            this._userContext['ACCESS_SYSTEMS'] = this._userContext['AV_SYSTEMS'].split('');

            this._createHash();
            if (!this._isTechUser) {
                return this.getDepartmentFromUser(this._userContext['DUE_DEP']);
            }
            return Promise.resolve([]);
        })
        .then((data: any[]) => {
            if (data.length) {
                this._userContextDeparnment = data[0];
                this._userContext['DUE_DEP_NAME'] = this._userContextDeparnment['CLASSIF_NAME'];
            }
            return true;
        })
        .catch(err => {
            this._errorHandler(err);
            return false;
        });
    }
    fetchSysParams() {
        const querySys = {
            USER_PARMS: {
                criteries: {
                    PARM_NAME: 'CHANGE_PASS||CATEGORIES_FOR_USER'
                }
            }
        };

        return this._pipSrv.getData(querySys)
        .then(data => {
            const h = {};
            data.forEach(e => {
                h[e['PARM_NAME']] = e['PARM_VALUE'];
            });
            this._sysParams = h;
            return h;
        });
    }

    getDepartmentFromUser (dueDep: string): Promise<any> {
        const queryDueDep = {
            DEPARTMENT: {
                criteries: {
                    DUE: dueDep
                }
            }
        };
        return this._pipSrv.getData<DEPARTMENT>(queryDueDep);
    }

    fetchExpandUser() {}
    private _errorHandler (err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: '',
            msg: errMessage
        });
    }
    private _createHash() {
        this._userContext['USER_PARMS_HASH'] = {};
        this.userContextParams.forEach(item => {
            this._userContext['USER_PARMS_HASH'][item['PARM_NAME']] = item.PARM_VALUE;
        });
    }
}
