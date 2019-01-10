import { Component, OnChanges } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';
import { Validators } from '@angular/forms';

@Component({
    selector: 'eos-dynamic-input-increment-number',
    templateUrl: 'dynamic-input-increment-number.component.html'
})
export class DynamicInputNumberIncrementComponent extends DynamicInputBase  implements OnChanges {
    onIncrease() {
        if (this.control.enabled) {
            if (!isNaN(this.control.value)) {
                this.control.patchValue(String(this.checkMaxValue()));
            } else {
                this.control.patchValue(this.input.minValue ? String(this.input.minValue) : '0');
            }
            this.control.markAsDirty();
        }
    }
    onDecrease() {
        if (this.control.enabled) {
            if (!isNaN(this.control.value)) {
                this.control.patchValue(String(this.checkMinValue()));
            } else {
                this.control.patchValue(this.input.minValue ? String(this.input.minValue) : '0');
            }
            this.control.markAsDirty();
        }
    }
    ngOnChanges() {
           if ( !this.input.pattern) {
                 this.control.setValidators(Validators.pattern(/^\d{0,5}$/));
           }
    }

    checkMinValue() {
        if ((this.input.minValue && (+this.control.value - 1) !== 0) || !this.input.minValue) {
            return +this.control.value - 1;
        } else {
            return +this.input.minValue;
        }
    }
    checkMaxValue() {
        if ((this.input.maxValue && (+this.control.value + 1) !== this.input.maxValue) || !this.input.minValue) {
            return +this.control.value + 1;
        } else {
            return +this.input.maxValue;
        }
    }

}
