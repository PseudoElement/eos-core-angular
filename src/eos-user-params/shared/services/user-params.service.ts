import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';

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
    constructor (
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService
    ) {}
    getUserIsn(depDue: string): Promise<boolean> { // 0.2SF.2T7.2TB.
        return this._pipSrv.getData<USER_CL>({
            USER_CL: {
                criteries: {
                    DUE_DEP: depDue
                }
            },
            expand: 'USER_PARMS_List'
        })
        .then((user: USER_CL[]) => {
            this._userContext = user[0];
            return true;
        })
        .catch(err => {
            const errMessage = err.message ? err.message : err;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: '',
                msg: errMessage
            });
            return false;
        });
    }
}
