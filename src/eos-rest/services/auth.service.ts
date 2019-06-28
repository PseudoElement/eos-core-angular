import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { PipRX } from './pipRX.service';
import { ApiCfg } from '../core/api-cfg';
import { HTTP_OPTIONS } from '../core/consts';
import { USER_CL, SYS_PARMS } from '../interfaces/structures';
// import { ALL_ROWS } from '../core/consts';
import { AppContext } from './appContext.service';
import { RestError } from 'eos-rest/core/rest-error';

@Injectable()
export class AuthService {
    private _cfg: ApiCfg;

    constructor(private _http: HttpClient, _pipe: PipRX, private appCtx: AppContext) {
        this._cfg = _pipe.getConfig();
    }

    public login(user: string, passwd: string): Promise<any> {
        const _url = this._cfg.authApiUrl + 'Login?app=api&' + 'username=' + user + '&pass=' + encodeURIComponent(passwd);
        const r = this._http.get(_url, {observe: 'events', responseType: 'text', withCredentials: true}).toPromise()
            .then((resp: HttpResponse<any>) => {
                if (resp.body && resp.body.indexOf('error:') > -1) {
                    return {};
                } else {
                    return this.getContext();
                }
            })
            .catch((err) => Promise.reject(new RestError({ http: err })));

        return r;
    }

    public logout() {
        const _url = this._cfg.authApiUrl + 'Logoff';
        return this._http.get(_url, HTTP_OPTIONS).toPromise<any>()
            .catch((err) => Promise.reject(new RestError({ http: err })));
    }

    getContext(): Promise<{ user: USER_CL, sysParams: SYS_PARMS }> {
        return this.appCtx.init()
            .then((arr) => {
                return {
                    user: arr[0],
                    sysParams: arr[1]
                };
            });
        /*const p = this._pipe;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        // p.errorService.LostConnectionAlerted = false;

        const oSysParams = p.read<SYS_PARMS>({
            SysParms: ALL_ROWS,
            _moreJSON: {
                DbDateTime: new Date(),
                licensed: null,
                ParamsDic: '-99'
            }
        });
        const oCurrentUser = p.read<USER_CL>({
            CurrentUser: ALL_ROWS,
            expand: 'USERDEP_List,USERSECUR_List',
            _moreJSON: { ParamsDic: null }
        });

        return Promise.all([oSysParams, oCurrentUser])
            .then(([sysParams, currentUser]) => {
                return {
                    user: <USER_CL>currentUser[0],
                    sysParams: <SYS_PARMS>sysParams[0]
                };
            })
            /*
            .then(d => {
                // tslint:disable-next-line:no-debugger
                debugger;
            })
            */
    }
}
