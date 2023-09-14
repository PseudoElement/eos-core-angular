import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs/';
import { IMessage , DEFAULT_DISMISS_TIMEOUT, DANGER_DISMISS_TIMEOUT, SUCCESS_DISMISS_TIMEOUT } from '../core/message.interface';
import { EosTooltipService } from './eos-tooltip.service';
@Injectable()
export class EosMessageService {
    messages: IMessage[];

    private _messages$: BehaviorSubject<IMessage[]>;

    constructor(
        tooltipPath: EosTooltipService,
    ) {
        this.messages = [];
        this._messages$ = new BehaviorSubject<IMessage[]>(this.messages);
    }

    get messages$(): Observable<IMessage[]> {
        return this._messages$.asObservable();
    }

    public addNewMessage(message: IMessage) {
        /*tslint:disable:no-console*/
        if (message.dismissOnTimeout === undefined) {
            switch (message.type) {
                case 'success':
                    message.dismissOnTimeout = SUCCESS_DISMISS_TIMEOUT;
                    break;
                case 'danger':
                    message.dismissOnTimeout = DANGER_DISMISS_TIMEOUT;
                    console.error(message);
                    break;
                case 'warning':
                    console.warn(message);
                    break;
                default:
                message.dismissOnTimeout = DEFAULT_DISMISS_TIMEOUT;
            }
        }
        /*tslint:enable:no-console*/
        this.messages.push(Object.assign({}, message));
        this._messages$.next(this.messages);
    }

    public removeMessage(removableMessage: IMessage) {
        this.messages = this.messages.filter((message) => message !== removableMessage);
        this._messages$.next(this.messages);
    }
}
