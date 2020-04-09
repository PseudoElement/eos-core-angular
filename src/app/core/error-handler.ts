import { ErrorHandler, Injectable } from '@angular/core';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { RestError } from 'eos-rest/core/rest-error';

@Injectable()
export class EosErrorHandler implements ErrorHandler {

    constructor(private _msgSrv: EosMessageService) { }

    handleError(error: Error) {
        /* tslint:disable:no-console */
        console.error('Unhandled error', error);
        try {
            if (error['rejection'] && error['rejection'] instanceof RestError) {
                if (error['rejection']['code'] && +error['rejection']['code'] === 434) {
                    document.location.assign('../login.aspx');
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
