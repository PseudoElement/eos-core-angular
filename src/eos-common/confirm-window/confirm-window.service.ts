import { Injectable } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowComponent, IConfirmWindow, IConfirmWindowContent } from './confirm-window.component';

@Injectable()
export class ConfirmWindowService {

    constructor(private _bsModalSrv: BsModalService) { }

    confirm(content: IConfirmWindow): Promise<boolean> { // TODO unsubscribe, memory leak
        const bsModalRef: BsModalRef = this._bsModalSrv.show(ConfirmWindowComponent);
        const _wnd: IConfirmWindowContent = bsModalRef.content;

        Object.assign(_wnd, content);

        return new Promise((res, _rej) => {
            this._bsModalSrv.onHide.subscribe(reason => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    res(false);
                }
            });
            _wnd.confirmEvt.subscribe((confirm: boolean) => {
                if (confirm !== undefined) {
                    res(confirm);
                }
            });
        });
    }
}
