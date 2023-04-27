import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { ALL_ROWS, AppContext, PipRX, USER_CL } from '../../eos-rest';
import { Observable } from 'rxjs';
import { IKeyRightTech, KEY_RIGHT_TECH } from '..';
import { EosMessageService } from '../../eos-common/index';

@Injectable({ providedIn: "root" })
export class AdministratorGuard implements CanActivate {
    private _userProfile: USER_CL;
    constructor(private _apCtx: AppContext, private _pipSrv: PipRX, private _msgSrv: EosMessageService,) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
            const urlSegment: UrlSegment = next.url[0];
            const url: string = urlSegment.path;
            const conf: IKeyRightTech = this._getConf(url);
        if (this._apCtx.cbBase) {
            return this._getContext().then((user: USER_CL[]) => {
                this._userProfile = user[0];
                if (this._userProfile.IS_SECUR_ADM === 1) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                    });
                    return false;
                }
                return true
            })
        } else {
            return true
        }

    }

    private _getContext(): Promise<USER_CL[]> {
        if (this._apCtx.CurrentUser) {
            return Promise.resolve([this._apCtx.CurrentUser]);
        } else {
            return this._pipSrv.read<USER_CL>({
                CurrentUser: ALL_ROWS
            });
        }
    }

    private _getConf(url: string): IKeyRightTech {
        return KEY_RIGHT_TECH[url];
    }

}
