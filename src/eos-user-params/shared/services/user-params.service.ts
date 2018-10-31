import { Injectable } from '@angular/core';
import { UserParamApiSrv } from './user-params-api.service';
import { USER_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';

@Injectable()
export class UserParamsService {
    private _isTechUser: boolean;
    private _userContext: USER_CL;
    private _sysParams;

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
            return this._userContext['ISN_LCLASSIF'];
        }
        return null;
    }
    get curentUser (): USER_CL {
        return this._userContext;
    }
    get userContextParams () {
        if (this._userContext) {
            return this._userContext['USER_PARMS_List'];
        }
        return null;
    }
    get hashUserContext () {
        if (this._userContext) {
            return this._userContext['USER_PARMS_HASH'];
        }
        return null;
    }

    get isUserContexst () {
        return !!this._userContext;
    }
    constructor (
        private _pipSrv: UserParamApiSrv,
        private _msgSrv: EosMessageService
    ) {}
    getUserIsn(isn_cl: string): Promise<boolean> {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: isn_cl
                }
            },
            expand: 'USER_PARMS_List'
        };
        const _user = this._pipSrv.getData<USER_CL>(queryUser);
        const _sys = this.fetchSysParams();
        return Promise.all([_user, _sys])
        .then(([user, sys]) => {
            this._userContext = user[0];
            this._isTechUser = !!this._userContext['DUE_DEP'];
            this._createHash();
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