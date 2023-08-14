import { Injectable } from '@angular/core';
import { RETURN_URL, URL_LOGIN } from '../../../app/consts/common.consts';
// import { Router } from '@angular/router';
import { ERROR_LOGIN } from '../../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
// import { EosUserProfileService } from '../../../app/services/eos-user-profile.service';
@Injectable()
export class ErrorHelperServices {
    constructor(
        private _msgSrv: EosMessageService,
        // private _router: Router,
        private _confirmSrv: ConfirmWindowService,
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
                case '403':
                case '401': // в appsetting конец сессии это 401 код
                    this.razLogin();
                    break;
                case '0':
                    this.razLogin();
                    break;
                case '500':
                    this.sendMessage('danger', 'Ошибка', error.message);
                    break;
                default:
                    this.sendMessage('danger', 'Ошибка', error.message);
                    break;
            }
        } else {
            this.sendMessage('danger', 'Ошибка', error.message);
        }
    }
 private sendMessage(type: string, tittle: string, msg: string) {
        this._msgSrv.addNewMessage({
            type: type as any,
            title: tittle,
            msg: msg,
        });
    }

 private razLogin() {
     this._confirmSrv
    .confirm2(ERROR_LOGIN)
    .then((confirmed) => {
        if (confirmed) {
            document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
        }
    });
    // если нас открыли с настроек пользователя, то редиректим на завершение сессии или из дела
     /* if (this._userProfiler.openWithCurrentUserSettings ||  !sessionStorage.getItem('fromclassif')) {
        document.location.assign('../login.aspx?returnUrl=classif/#/spravochniki/citizens/0.');
     } else {
         document.location.assign('../login.aspx?returnUrl=classif/#/spravochniki/citizens/0.');
     } */
        /*
        this._router.navigate(['login'], {
            queryParams: {
                returnUrl: this._router.url
            }
        });
        */
    }
}
