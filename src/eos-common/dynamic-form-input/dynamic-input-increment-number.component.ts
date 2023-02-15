import { Component, OnChanges, SimpleChanges } from '@angular/core';

import { Validators } from '@angular/forms';
import { DynamicInputBaseDirective } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-increment-number',
    templateUrl: 'dynamic-input-increment-number.component.html'
})
export class DynamicInputNumberIncrementComponent extends DynamicInputBaseDirective  implements OnChanges {

    onIncrease() {
        if (this.control.enabled) {
            if (!isNaN(parseInt(this.control.value, 10))) {
                this.control.patchValue(String(this.checkMaxValue()));
            } else {
                this.control.patchValue(this.input.minValue ? String(this.input.minValue) : '0');
            }
            this.control.markAsDirty();
        }
    }
    onDecrease() {
        if (this.control.enabled) {
            if (!isNaN(parseInt(this.control.value, 10))) {
                this.control.patchValue(String(this.checkMinValue()));
            } else {
                this.control.patchValue(this.input.minValue ? String(this.input.minValue) : '0');
            }
            this.control.markAsDirty();
        }
    }

    onInput(event) {
        event.stopPropagation();
    }

    ngOnChanges(changes: SimpleChanges) {
        // super.ngOnChanges(changes);
        const control = this.control;
        this.input.dib = this;
        if (control) {
            setTimeout(() => {
                this.toggleTooltip();
            });
        }

        if (!this.input.pattern) {
            this.control.setValidators(Validators.pattern(/^\d{0,5}$/));
        }
        this.subscriptions.push(control.statusChanges.subscribe(() => {
            if (this.inputTooltip.force) {
                this.updateMessage();
                setTimeout(() => { // похоже тут рассинхрон, имя не успевает обновиться и если меняется с ошибки на ошибку, то имя ангулар не меняет
                    this.inputTooltip.visible = true;
                    this.inputTooltip.force = false;
                }, 0);
            } else {
                this.inputTooltip.visible = (this.inputTooltip.visible && control.invalid && control.dirty);
            }
        }));
    }

    checkMinValue() {
        if ((this.input.minValue && (+this.control.value - 1) >= this.input.minValue) || !this.input.minValue) {
            return +this.control.value - 1;
        } else {
            return +this.input.minValue;
        }
    }
    checkMaxValue() {
        if ((this.input.maxValue && (+this.control.value + 1) <= this.input.maxValue) || !this.input.maxValue) {
            return +this.control.value + 1;
        } else {
            return +this.input.maxValue;
        }
    }

    inputCheck(e) {
        if (e.metaKey || e.ctrlKey || e.altKey) {
            return true;
        }
        return !(/^[А-Яа-яA-Za-z ]$/.test(e.key));
    }

    patchValidNums($event) {
        if (this.control.invalid) {
            if (this.control.dirty && !this.inputTooltip.visible) {
                this.delayedTooltip();
            }
        } else {
            this.inputTooltip.visible = false;
        }
    }
}
