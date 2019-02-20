import { Component } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-select',
    templateUrl: 'dynamic-input-select.component.html'
})
export class DynamicInputSelectComponent extends DynamicInputBase {
    get currentValue(): string {
        let value = '...'; // ..this.input.label;
        const ctrl = this.control;
        if (ctrl) {
            let optValue = this.input.options.find((option) => option.value === ctrl.value);
            if (!optValue && typeof ctrl.value === 'string') {
                optValue = this.input.options.find((option) => option.value.toString() === ctrl.value);
            }
            if (optValue) {
                value = optValue.title;
            }
        }
        return value;
    }

    selectClick(evt: Event) {
        if (this.readonly) {
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }
}
