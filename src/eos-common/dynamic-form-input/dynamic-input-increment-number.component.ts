import { Component } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-increment-number',
    templateUrl: 'dynamic-input-increment-number.component.html'
})
export class DynamicInputNumberIncrementComponent extends DynamicInputBase {
    onIncrease(input) {
        this.control.setValue(String(+this.control.value + 1));
    }
    onDecrease(input) {
        this.control.setValue(String(+this.control.value - 1));
    }
}
