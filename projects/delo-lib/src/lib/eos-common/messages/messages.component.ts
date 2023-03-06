import { Component, OnDestroy } from '@angular/core';

import { EosMessageService } from '../services/eos-message.service';
import { IMessage } from '../core/message.interface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'eos-messages',
    templateUrl: 'messages.component.html',
})
export class MessagesComponent implements OnDestroy {
    messages: IMessage[];
    private _subscription: Subscription;

    constructor(private _msgSrv: EosMessageService) {
        this._subscription = _msgSrv.messages$.subscribe((messages) => this.messages = messages.filter(v => !v.authMsg));
    }

    onClose(message: IMessage) {
        this._msgSrv.removeMessage(message);
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}
