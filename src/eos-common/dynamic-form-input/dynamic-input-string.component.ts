import {Component, OnChanges, SimpleChanges} from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-string',
    templateUrl: 'dynamic-input-string.component.html'
})
export class DynamicInputStringComponent extends DynamicInputBase implements OnChanges {

    get textType(): string {
        if (this.input.password) {
            return 'password';
        }
        return 'text';
    }

    get label(): string {

        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }

    ngOnChanges(changes: SimpleChanges) {
        const control = this.control;
        this.input.dib = this;
        if (control) {
            setTimeout(() => {
                this.toggleTooltip();
            });

            this.ngOnDestroy();
            this.subscriptions.push(control.statusChanges.subscribe(() => {
                if (this.inputTooltip.force) {
                    this.updateMessage();
                    this.inputTooltip.visible = true;
                    this.inputTooltip.force = false;
                } else {
                    this.inputTooltip.visible = (this.inputTooltip.visible && control.invalid && control.dirty);
                }
            }));
        }
    }
}
