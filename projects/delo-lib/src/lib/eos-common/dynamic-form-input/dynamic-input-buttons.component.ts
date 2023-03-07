import { Component } from '@angular/core';
import { DynamicInputSelectComponent } from './dynamic-input-select.component';
import { ISelectOption } from '../interfaces';

@Component({
    selector: 'eos-dynamic-input-buttons',
    templateUrl: 'dynamic-input-buttons.component.html'
})
export class DynamicInputButtonsComponent extends DynamicInputSelectComponent {
    get buttons(): ISelectOption[] {
        if (this.input && this.input.options) {
            return this.input.options.filter((item) => item.value !== null);
        } else {
            return [];
        }
    }

    switchTo(option: ISelectOption) {
        if (this.control) {
            this.control.setValue(option.value);
        }
    }

    optIsDisabled(opt: any): boolean {
        return (this.disabled || opt['disabled']);
    }
}
