import { Injectable, } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmWindowComponent, IConfirmWindow, IConfirmWindowContent } from './confirm-window.component';
import { IConfirmWindow2, ConfirmWindow2Component, IConfirmWindow2Content, IConfirmButton } from './confirm-window2.component';
import { Subscription } from 'rxjs';

@Injectable()
export class ConfirmWindowService {

    private subscr1: Subscription;
    private subscr2: Subscription;

    constructor(private _bsModalSrv: BsModalService) { }

    confirm(content: IConfirmWindow): Promise<boolean> { // TODO unsubscribe, memory leak
        const bsModalRef: BsModalRef = this._bsModalSrv.show(ConfirmWindowComponent);
        const _wnd: IConfirmWindowContent = bsModalRef.content;

        Object.assign(_wnd, content);

        return new Promise((res, _rej) => {
            this.subscr1 = this._bsModalSrv.onHide.subscribe(reason => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    res(false);
                }
            });
            this.subscr2 = _wnd.confirmEvt.subscribe((confirm: boolean) => {
                if (confirm !== undefined) {
                    res(confirm);
                }
            });
        });
    }

    confirm2(content: IConfirmWindow2): Promise<IConfirmButton> { // TODO unsubscribe, memory leak
        const bsModalRef: BsModalRef = this._bsModalSrv.show(ConfirmWindow2Component);
        const _wnd: IConfirmWindow2Content = bsModalRef.content;

        Object.assign(_wnd, content);

        return new Promise((res, _rej) => {

            this.subscr1 = this._bsModalSrv.onHide.subscribe(reason => {
                if (reason === 'backdrop-click' || reason === 'esc') {
                    this.unsubscribe();
                    res(null);
                }
            });

            this.subscr2 = _wnd.confirmEvent.subscribe((confirm: IConfirmButton) => {
                this.unsubscribe();
                res(confirm);
            });
        });
    }

    private unsubscribe() {
        if (this.subscr1) { this.subscr1.unsubscribe(); }
        if (this.subscr2) { this.subscr1.unsubscribe(); }
    }



}
