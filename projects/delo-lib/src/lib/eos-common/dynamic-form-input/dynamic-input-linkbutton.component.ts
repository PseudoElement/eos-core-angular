import { Component, Input } from '@angular/core';
import { DynamicInputBaseDirective } from './dynamic-input-base';

@Component({
    selector: 'eos-dynamic-input-linkbutton',
    templateUrl: 'dynamic-input-linkbutton.component.html'
})
export class DynamicInputLinkButtonComponent extends DynamicInputBaseDirective {
    @Input() buttonClick: Function;
    @Input() buttonClickRemove: Function;
    @Input() iconForElem: string;
    @Input() visibleDeletElem: boolean;
    get textType(): string {
        if (this.input.password) {
            return 'password';
        }
        return 'text';
    }

    get label(): string {

        return this.input.groupLabel && this.isGroup ? this.input.groupLabel : this.input.label;
    }
    get newClass(): string {
        return 'eos-adm-icon small ' + (this.iconForElem ? this.iconForElem : '');
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
            if (this.viewOpts.events.getTitle) {
                return this.viewOpts.events.getTitle(this);
            }
        }
        return '...';
    }

    setExtValue(value: any, data: any) {
        if (!this.input.options || !this.input.options.length) {
            this.input.options = [{value: value }];
        }
        this.input.options[0].rec = data;
        this.control.setValue(value);
    }

    enRemoveButton(): boolean {
        return this.viewOpts && this.viewOpts.enRemoveButton && (this.visibleDeletElem || !this.iconForElem);
    }

    ignoreKeyDown(event) { // IE backspace
        event.preventDefault();
    }
}
