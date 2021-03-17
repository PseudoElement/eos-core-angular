import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, Router } from '@angular/router';
import { PipRX, USER_CL } from 'eos-rest';
import { KEY_RIGHT_TECH, IKeyRightTech } from 'app/consts/permission.consts';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { AppContext } from '../../eos-rest/services/appContext.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    private _userProfile: USER_CL;
    constructor(
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
        private _apCtx: AppContext,
        private _route: Router,
    ) { }
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const urlSegment: UrlSegment = _route.url[0];
        const url: string = urlSegment.path;
        const conf: IKeyRightTech = this._getConf(url);
        return this._getContext()
            .then((user: USER_CL[]) => {
                this._userProfile = user[0];
                const access: boolean = (this._userProfile.IS_SECUR_ADM === 1 && conf.name !== 'Параметры системы') ||
                    (this._userProfile.TECH_RIGHTS && (!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)] || !!+this._userProfile.TECH_RIGHTS[29] || !!+this._userProfile.TECH_RIGHTS[1]));
                if (this._apCtx.cbBase) {
                    if (
                        conf.name === 'Параметры системы'
                        && this._userProfile.TECH_RIGHTS && !!+this._userProfile.TECH_RIGHTS[0]
                        && this._apCtx.limitCardsUser.length <= 0
                        && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)]
                    ) {
                        if (state.url === '/parameters/authentication') {
                            return true;
                        }
                        this._route.navigate(['/parameters/authentication']);
                        return undefined;
                    } else if (
                        conf.name === 'Параметры системы'
                        && this._userProfile.TECH_RIGHTS && ((!!+this._userProfile.TECH_RIGHTS[0] && this._apCtx.limitCardsUser.length > 0 && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)])
                            || !!!+this._userProfile.TECH_RIGHTS[0] && !!!+this._userProfile.TECH_RIGHTS[(conf.key - 1)]
                        )
                    ) {
                        return false;
                    } else {
                        // если это пользовательские настройки с шестеренки, то ок
                        if (state.url.indexOf('/user_param/current-settings') !== -1) {
                            return true;
                        }
                        if (!access) {
                            this._msgSrv.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение:',
                                msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                            });
                        }
                        return access;
                    }

                } else {
                    // если это пользовательские настройки с шестеренки, то ок
                    if (state.url.indexOf('/user_param/current-settings') !== -1) {
                        return true;
                    }
                    if (!access) {
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: 'Предупреждение:',
                            msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                        });
                    }
                    return access;
                }

            })
            .catch((err) => {
                if (err instanceof RestError && (err.code === 434 || err.code === 0)) {
                    document.location.assign('../');
                    return undefined;
                }
                return false;
            });
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
