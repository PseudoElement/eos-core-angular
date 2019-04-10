import { Component, Input } from '@angular/core';
import { DynamicInputBase } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-linkbutton',
    templateUrl: 'dynamic-input-linkbutton.component.html'
})
export class DynamicInputLinkButtonComponent extends DynamicInputBase {
    @Input() buttonClick: Function;

    get textType(): string {
        if (this.input.password) {
            return 'password';
        }
        return 'text';
    }

    get label(): string {

        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }

    onButtonClick () {
        if (this.buttonClick) {
            this.buttonClick(this);
        }
        // console.log('1');
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
}
