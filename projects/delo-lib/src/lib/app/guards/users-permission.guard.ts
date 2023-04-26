import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { PipRX, USER_CL } from '../../eos-rest';
import { KEY_RIGHT_TECH, IKeyRightTech } from '../../app/consts/permission.consts';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { RestError } from '../../eos-rest/core/rest-error';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { ERROR_LOGIN } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { RETURN_URL, URL_LOGIN } from '../../app/consts/common.consts';

@Injectable()
export class UsersPermissionGuard implements CanActivate {
    private _userProfile: USER_CL;
    constructor(
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
        private _apCtx: AppContext,
        private _confirmSrv: ConfirmWindowService,
    ) { }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const urlSegment: UrlSegment = _route.url[0];
        const url: string = urlSegment.path;
        const conf: IKeyRightTech = this._getConf(url);
        return this._getContext().then((user: USER_CL[]) => {
            this._userProfile = user[0];
            // если это пользовательские настройки с шестеренки, то ок
            if (state.url.indexOf('/user_param/current-settings') !== -1) {
                return true;
            }
            const access: boolean = conf.key === 1 && this._userProfile.TECH_RIGHTS[0] === '1';
            if (this._apCtx.cbBase) {
                if (!access) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                    });
                }
                return access;
            } else  {
                if (!access) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                    });
                }
                return access;
            }

        }).catch((err) => {
            if (err instanceof RestError && (err.code === 401 || err.code === 0)) {
                // если нас открыли с настроек пользователя, то редиректим на завершение сессии
                if (state.url.indexOf('/user_param/current-settings') !== -1) {
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
                        }
                    });
                } else {
                    document.location.assign('../');
                }

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
