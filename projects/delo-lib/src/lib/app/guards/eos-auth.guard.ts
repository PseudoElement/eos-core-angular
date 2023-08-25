import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot/* , Router  */} from '@angular/router';
import { EosUserProfileService } from '../services/eos-user-profile.service';
// import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
// import { LoginFormComponent } from '../login-form/login-form.component';
import { ERROR_LOGIN } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { RETURN_URL, URL_LOGIN } from '../../app/consts/common.consts';

@Injectable()
export class AuthorizedGuard implements CanActivate {
    public modalRef: BsModalRef;

    constructor(
        private _profileSrv: EosUserProfileService,
        // private _router: Router,
        // private _modalSrv: BsModalService,
        private _confirmSrv: ConfirmWindowService,
    ) { }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {
        // нас открыли с настроек пользователя меняем флаг для редиректов
        if (state.url.indexOf('/user_param/current-settings') !== -1) {
            this._profileSrv.openWithCurrentUserSettings = true;
        }
        return this._profileSrv.checkAuth()
            .then((auth) => {
                if (!auth) {
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
                        }
                        return auth;
                    });
                    // если нас открыли с настроек пользователя, то редиректим на завершение сессии или из дела
                    /* if (this._profileSrv.openWithCurrentUserSettings ||  !sessionStorage.getItem('fromclassif')) {
                        document.location.assign('../terminate.aspx');
                        return auth;
                    }
                    if (!this._profileSrv.shortName) {
                        this._router.navigate(['login'], { queryParams: { returnUrl: state.url } });
                    } else {
                        this.modalRef = this._modalSrv.show(LoginFormComponent, {
                            keyboard: false,
                            backdrop: true,
                            ignoreBackdropClick: true
                        });
                        this.modalRef.content.logged.subscribe((success) => {
                            if (success) {
                                this.modalRef.hide();
                            }
                        });
                    } */
                }
                return auth;
            });
    }
}

@Injectable()
export class UnauthorizedGuard implements CanActivate {
    constructor(private _profileSrv: EosUserProfileService) { }

    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | Promise<boolean> {
        return this._profileSrv.checkAuth()
            .then((auth) => {
                if (auth) {
                    return this._profileSrv.logout()
                        .then(() => true);
                    /*
                    let _returnUrl = '/desk/system';

                    if (route.queryParams['returnUrl']) {
                        _returnUrl = route.queryParams['returnUrl']
                    }
                    this._router.navigateByUrl(_returnUrl);
                    */
                } else {
                    return true;
                }
            });
    }
}
