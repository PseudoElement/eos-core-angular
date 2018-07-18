import { Component } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-increment-number',
    templateUrl: 'dynamic-input-increment-number.component.html'
})
export class DynamicInputNumberIncrementComponent extends DynamicInputBase {
    onIncrease(input) {
        // input.value++;
        // this.form.value[this.input.key]++;
        this.control.setValue(String(+this.control.value + 1));
        console.log(
            this.form,
            this.form.value[this.input.key],
            this.control
        );
    }
    onDecrease(input) {
        this.control.setValue(String(+this.control.value - 1));
        // input.value--;
    }
}
