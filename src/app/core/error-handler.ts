import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';
import { EosUserProfileService } from '../services/eos-user-profile.service';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService,
                private inject: Injector) { }

    get _userParms() {
        return this.inject.get(EosUserProfileService);
    }

    handleError(error: Error) {
        /* tslint:disable:no-console */
        console.error('Unhandled error', error);
        try {
            if (error['rejection'] && error['rejection'] instanceof RestError) {
                if (error['rejection']['code'] && +error['rejection']['code'] === 434) {
                    // если нас открыли с настроек пользователя, то редиректим на завершение сессии
                    if (this._userParms.openWithCurrentUserSettings) {
                        document.location.assign('../terminate.aspx');
                    } else {
                        document.location.assign('../login.aspx');
                    }
                }
            }

            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка приложения!',
                msg: '',
                // dismissOnTimeout: 30000
            });
        } catch (e) {
            console.error('addNewMessage failed', e);
        }
        /*tslint:enable:no-console*/
    }
}
