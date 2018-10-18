import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';

@Injectable()
export class UserParamsService {
    private _userContext: USER_CL;
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
    get hashUserContext () {
        if (this._userContext) {
            const hash: any = {};
            this.userContextParams.forEach(item => {
                hash[item.PARM_NAME] = item.PARM_VALUE;
            });
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
            expand: 'USER_PARMS_List'
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
    clearIdStorage() {
        this._storageSrv.removeItem('userContextParam');
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
