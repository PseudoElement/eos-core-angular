import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs/';

import { IMessage , DEFAULT_DISMISS_TIMEOUT, DANGER_DISMISS_TIMEOUT, WARN_DISMISS_TIMEOUT } from '../core/message.interface';
import { parseTriggers, TooltipDirective, TooltipContainerComponent, TooltipConfig } from 'ngx-bootstrap';

export const TOOLTIP_DELAY_VALUE = 1000;
@Injectable()
export class EosMessageService {
    messages: IMessage[];

    private _messages$: BehaviorSubject<IMessage[]>;

    constructor() {
        this.messages = [];
        this._messages$ = new BehaviorSubject<IMessage[]>(this.messages);

        // Исправленный баг ngx-bootstrap TooltipDirective - show tooltip with delay and multiple triggers
        // Вероятно, убрать при исправлении в самом ngx-bootstrap и апдейте проекта.

        TooltipDirective.prototype.show = function () {
           const _this = this;
           if (this.isOpen ||
               this.isDisabled ||
               this._delayTimeoutId ||
               !this.tooltip) {
               return;
           }
           /** @type {?} */
           const showTooltip = function () {
               if (_this._delayTimeoutId) {
                   _this._delayTimeoutId = undefined;
               }
               _this._tooltip
                   .attach(TooltipContainerComponent)
                   .to(_this.container)
                   .position({ attachment: _this.placement })
                   .show({
                   content: _this.tooltip,
                   placement: _this.placement,
                   containerClass: _this.containerClass,
                   id: _this.ariaDescribedby
               });
           };
           /** @type {?} */
           let _tooltipCancelShowFn1: Function [] = [];

           const cancelDelayedTooltipShowing = function () {
               if (_this._tooltipCancelShowFn) {
                   _this._tooltipCancelShowFn();
               }
               for (let i = 0; i <_tooltipCancelShowFn1.length; i++) {
                   _tooltipCancelShowFn1[i]();
               }
           };

           if (this.delay) {
                const _timer_1 = setTimeout(() => {
                   showTooltip();
                   cancelDelayedTooltipShowing();
               }, this.delay);

               const _closeEventAction = function () {
                   clearTimeout(_timer_1);
                   cancelDelayedTooltipShowing();
               }

               if (this.triggers) {
                    const triggers = parseTriggers(this.triggers);
                   _tooltipCancelShowFn1 = [];
                   for (let i = 0; i < triggers.length; i++) {
                       _tooltipCancelShowFn1.push(this._renderer.listen(this._elementRef.nativeElement, triggers[i].close, _closeEventAction));
                   }
               }
           } else {
               showTooltip();
           }
       };
    }

    get messages$(): Observable<IMessage[]> {
        return this._messages$.asObservable();
    }

    public addNewMessage(message: IMessage) {
        /*tslint:disable:no-console*/
        if (message.dismissOnTimeout === undefined) {
            switch (message.type) {
                case 'danger':
                    message.dismissOnTimeout = DANGER_DISMISS_TIMEOUT;
                    console.error(message);
                    break;
                case 'warning':
                    message.dismissOnTimeout = WARN_DISMISS_TIMEOUT;
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
