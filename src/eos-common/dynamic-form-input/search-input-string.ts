import { DynamicInputStringComponent } from './dynamic-input-string.component';
import { ErrorTooltip } from './dynamic-input.component';
import { OnChanges, OnDestroy, SimpleChanges, Component } from '@angular/core';

@Component({
    selector: 'eos-search-input-string',
    templateUrl: 'search-input-string.html'
})
export class SearchInputStringComponent extends DynamicInputStringComponent implements OnChanges, OnDestroy {

    public inputTooltip: ErrorTooltip = {
        visible: false,
        message: '',
        placement: 'bottom',
        class: 'tooltip-error',
        container: '',
        force: false
    };

    onFocus() {
        this.isFocused = true;
        this.onControlFocus.emit(this);
    }

    onBlur() {
        this.isFocused = false;
        this.updateMessage();
        this.onControlBlur.emit(this);
    }
    ngOnChanges(changes: SimpleChanges) {
        const control = this.control;
        if (control) {
            this.ngOnDestroy();
            this.subscriptions.push(control.statusChanges.subscribe(() => {
                if (this.inputTooltip.force) {
                    this.updateMessage();
                    this.inputTooltip.visible = control.invalid ;
                    this.inputTooltip.force = false;
                } else {
                    this.inputTooltip.visible = (this.inputTooltip.visible && control.invalid);
                }
            }));
        }
    }

}
