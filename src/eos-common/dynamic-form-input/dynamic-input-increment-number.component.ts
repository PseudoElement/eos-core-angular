import { Component } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-increment-number',
    templateUrl: 'dynamic-input-increment-number.component.html'
})
export class DynamicInputNumberIncrementComponent extends DynamicInputBase {
    onIncrease() {
        if (this.control.enabled) {
            this.control.patchValue(String(+this.control.value + 1));
            this.control.markAsDirty();
        }
    }
    onDecrease() {
        if (this.control.enabled) {
            this.control.patchValue(String(+this.control.value - 1));
            this.control.markAsDirty();
        }
    }
}
