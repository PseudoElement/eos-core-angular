import { Injectable } from '@angular/core';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { Router } from '@angular/router';
@Injectable()
export class ErrorHelperServices {
    constructor(
        private _msgSrv: EosMessageService,
        private _router: Router,
    ) {

    }
    errorHandler(error) {
        const code = error.code;
        if (code) {
            switch (String(code)) {
                case '2000':
                    this.sendMessage('warning', 'Предупреждение', error.message);
                    break;
                case '434':
                    this.razLogin();
                    break;
                case '0':
                    this.razLogin();
                    break;
                case '500':
                    this.sendMessage('danger', 'Ошибка', 'ошибка сохранения пароля');
                    break;
                default:
                    this.sendMessage('danger', 'Ошибка', error.message);
                    break;
            }
        } else {
            this.sendMessage('danger', 'Ошибка', 'Сервер недоступен');
        }
    }
 private   sendMessage(type: string, tittle: string, msg: string) {
        this._msgSrv.addNewMessage({
            type: type as any,
            title: tittle,
            msg: msg,
        });
    }

 private   razLogin() {
        this._router.navigate(['login'], {
            queryParams: {
                returnUrl: this._router.url
            }
        });
    }
}
