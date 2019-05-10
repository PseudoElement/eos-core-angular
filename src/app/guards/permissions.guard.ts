import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { PipRX, USER_CL } from 'eos-rest';
import { KEY_RIGHT_TECH, IKeyRightTech } from 'app/consts/permission.consts';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';

@Injectable()
export class PermissionsGuard implements CanActivate {
    private _userProfile: USER_CL;
    constructor (
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
    ) {}
    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        const urlSegment: UrlSegment = _route.url[0];
        const url: string = urlSegment.path;
        const conf: IKeyRightTech = this._getConf(url);
        return this._getContext()
            .then((user: USER_CL[]) => {
                this._userProfile = user[0];
                const access: boolean = !!(+this._userProfile.TECH_RIGHTS[(conf.key - 1)]);
                if (!access) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `У Вас нет права изменять параметры модуля "${conf.name}"`,
                    });
                }
                return access;
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
        return this._pipSrv.read<USER_CL>({
            CurrentUser: ALL_ROWS
        });
    }
    private _getConf (url: string): IKeyRightTech {
        return KEY_RIGHT_TECH[url];
    }
}
