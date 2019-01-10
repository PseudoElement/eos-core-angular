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
                this.control.patchValue(String(+this.control.value + 1));
            } else {
                this.control.patchValue('0');
            }
            this.control.markAsDirty();
        }
    }
    onDecrease() {
        if (this.control.enabled) {
            if (!isNaN(this.control.value)) {
                this.control.patchValue(String(+this.control.value - 1));
            } else {
                this.control.patchValue('0');
            }
            this.control.markAsDirty();
        }
    }
    ngOnChanges() {
           if ( !this.input.pattern && this.input.key !== 'rec.HILITE_PRJ_RC_INCREMENT' && this.input.key !== 'rec.HILITE_RESOLUTION_INCREMENT') {
                 this.control.setValidators(Validators.pattern(/^\d{0,5}$/));
           }
    }

}
