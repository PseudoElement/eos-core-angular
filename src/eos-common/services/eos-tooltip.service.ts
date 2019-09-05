import { Injectable } from '@angular/core';

import { parseTriggers, TooltipDirective, TooltipContainerComponent } from 'ngx-bootstrap';

export const TOOLTIP_DELAY_VALUE = 1000;

@Injectable()
export class EosTooltipService {

    constructor() {
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
               for (let i = 0; i < _tooltipCancelShowFn1.length; i++) {
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
               };

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
}
