import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL, DEPARTMENT } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';

@Injectable()
export class UserParamsService {
    _userDepartment: DEPARTMENT;
    private _userContext: USER_CL;
   // private _userCard: USERCARD;
    get userContextId () {
        if (this._userContext) {
            return this._userContext['ISN_LCLASSIF'];
        }
        return null;
    }
    get userContextParams () {
        if (this._userContext) {
            return this._userContext['USER_PARMS_List'];
        }
        return null;
    }
    get userCard () {
      //  console.log(this._userContext);
        if (this._userContext) {
            return this._userContext['USERCARD_List'];
        }
    }
    get hashUserContext () {
     //   console.log(this._userContext);
     //   console.log(this.userContextParams);
       // console.log(this._userCard);
    //    console.log(this.userCard);
        if (this._userContext) {
            const hash: any = {};
            this.userContextParams.forEach(item => {
                hash[item.PARM_NAME] = item.PARM_VALUE;
            });
          /*  this.userCard.forEach(item => {
                hash[item.DUE] = item.FUNCLIST;
            });*/
         //   console.log(hash);
            return hash;
        }
        return null;
    }

    get hashUserContextCard () {
        if (this._userContext) {
            const hash: any = {};
          //  console.log(this.userCard);
            this.userCard.forEach(item => {
                hash[item.DUE] = item.FUNCLIST;
            });
         //   console.log(hash);
            return hash;
        }
        return null;
    }

    get hashUserContexHomeCard () {
        if (this._userContext) {
            const hash: any = {};
          //  console.log(this.userCard);
            this.userCard.forEach(item => {
                hash[item.DUE] = item.HOME_CARD;
            });
          //  console.log(hash);
            return hash;
        }
        return null;
    }

    get isUserContexst () {
        return !!this._userContext;
    }
    constructor (
        private _storageSrv: EosStorageService,
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService
    ) {}
    getUserIsn(dueDep?: string): Promise<boolean> {
        const query = {
            USER_CL: {
                criteries: {}
            },
            expand: 'USER_PARMS_List,USERCARD_List'
        };
        if (!this._createRec(query, dueDep)) {
            return Promise.reject(false);
        }
        return this._pipSrv.getData<USER_CL>(query)
        .then((user: USER_CL[]) => {
            this._userContext = user[0];
            this._storageSrv.setItem('userContextParam', this.userContextId, true);
            return true;
        })
        .catch(err => {
            this._errorHandler(err);
            return false;
        });
    }

    private _createRec (req, due?) {
        if (due) {
            req.USER_CL.criteries['DUE_DEP'] = due;
            return true;
        } else if (this.userContextId) {
            req.USER_CL.criteries['ISN_LCLASSIF'] = this.userContextId.toString();
            return true;
        } else if (this._storageSrv.getItem('userContextParam')) {
            req.USER_CL.criteries['ISN_LCLASSIF'] = this._storageSrv.getItem('userContextParam').toString();
            return true;
        } else {
            return false;
        }
    }
    private _errorHandler (err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: '',
            msg: errMessage
        });
    }
}
