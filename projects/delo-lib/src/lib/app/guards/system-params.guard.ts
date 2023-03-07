import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { PipRX, USER_CL } from '../../eos-rest';
import { KEY_RIGHT_TECH, IKeyRightTech } from '../../app/consts/permission.consts';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { AccessParamsServiceLib } from '../../eos-rest/addons/accessPrams.service';

@Injectable()
export class SystemParamsGuard implements CanActivate {
    private _userProfile: USER_CL;
    constructor(
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
        private _apCtx: AppContext,
        private _route: Router,
        private _accessExtensions: AccessParamsServiceLib,
    ) { }
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const urlSegment: UrlSegment = _route.url[0];
        const url: string = urlSegment.path;
        const conf: IKeyRightTech = this._getConf(url);
        return this._getContext()
            .then((user: USER_CL[]) => {
                this._userProfile = user[0];
                const access: boolean = this._accessExtensions.getCanActivate(this._userProfile, conf);
                if (this._apCtx.cbBase) {
                    if (
                        this._userProfile.TECH_RIGHTS && !!+this._userProfile.TECH_RIGHTS[0]
                        && this._apCtx.limitCardsUser.length <= 0
                        && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)]
                    ) {
                        if (state.url === '/parameters/authentication') {
                            return true;
                        }
                        this._route.navigate(['/parameters/authentication']);
                        return undefined;
                    } else if (
                        this._userProfile.TECH_RIGHTS && ((!!+this._userProfile.TECH_RIGHTS[0] && this._apCtx.limitCardsUser.length > 0 && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)])
                            || !!!+this._userProfile.TECH_RIGHTS[0] && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)]
                        )
                    ) {
                        return false;
                    } else {
                        if (!access) {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение:',
                                msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                            });
                        }
                        return access;
                    }
                }
                if (!access) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `У Вас нет права изменять параметры модуля "${conf.name}"`
                    });
                    return access;
                }
                return access;
            })
            .catch(() => false);
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
