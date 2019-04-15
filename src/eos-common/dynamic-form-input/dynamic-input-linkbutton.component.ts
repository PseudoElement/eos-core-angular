import { Component, Input } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-linkbutton',
    templateUrl: 'dynamic-input-linkbutton.component.html'
})
export class DynamicInputLinkButtonComponent extends DynamicInputBase {
    @Input() buttonClick: Function;
    @Input() buttonClickRemove: Function;

    get textType(): string {
        if (this.input.password) {
            return 'password';
        }
        return 'text';
    }

    get label(): string {

        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }

    onButtonClick1 () {
        if (this.viewOpts && this.viewOpts.events && this.viewOpts.events.select) {
            this.viewOpts.events.select(this);
        }
    }
    onButtonClick2 () {
        this.control.setValue(null);
        if (this.viewOpts && this.viewOpts.events && this.viewOpts.events.remove) {
            this.viewOpts.events.remove(this);
        }

    }

    getDisplayValue () {
        if (this.hasValue()) {
            if (this.currentValue['title']) {
                return this.currentValue['title'];
            }
        }
        if (this.input.options) {
            return this.input.options[0]['title'];
        }
        return '...';
    }

    setExtValue(value: any, gettitle: (d: any) => Promise<any>) {
        this.control.setValue(value);
        gettitle(this).then(title => {
            this.input.options[0]['title'] = title;
        });
    }

    enRemoveButton (): boolean {
        return this.viewOpts && this.viewOpts.enRemoveButton;
    }

}
