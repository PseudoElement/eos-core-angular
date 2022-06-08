import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { EosUserProfileService } from '../services/eos-user-profile.service';
import { ERROR_LOGIN } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService,
                private inject: Injector) { }

    get _userParms() {
        return this.inject.get(EosUserProfileService);
    }
    get _confirmSrv() {
        return this.inject.get(ConfirmWindowService);
    }
    handleError(error: Error) {
        console.error('Unhandled error', error);
        try {
            if (error['rejection'] && error['rejection'] instanceof RestError) {
                if (error['rejection']['code'] && +error['rejection']['code'] === 434) {
                    // console.log('this._router', this._router);
                    this._confirmSrv
                    .confirm2(ERROR_LOGIN)
                    .then((confirmed) => {
                        if (confirmed) {
                            document.location.assign('../CoreHost/auth/login?ReturnUrl=' + document.location.href);
                        }
                    });
                    // если нас открыли с настроек пользователя, то редиректим на завершение сессии или из дела
                    /* if (this._userParms.openWithCurrentUserSettings || !sessionStorage.getItem('fromclassif')) {
                        document.location.assign('../login.aspx?ReturnUrl=classif/#/spravochniki/citizens/0.');
                    } else {
                        document.location.assign('../login.aspx?ReturnUrl=classif/#/spravochniki/citizens/0.');
                    } */
                }
            } else {
                if (error && error.message &&  !/^.*instance\s.*NULL$/i.test(error.message)) {
                    this._msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка приложения!',
                        msg: error.message ? error.message : '',
                        // dismissOnTimeout: 30000
                    });
                }
            }

        } catch (e) {
            console.error('addNewMessage failed', e);
        }
        /*tslint:enable:no-console*/
    }
}
