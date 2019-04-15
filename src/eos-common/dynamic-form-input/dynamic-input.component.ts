import { Component, Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';


export class ErrorTooltip {
    visible = false;
    message = '';
    placement = 'bottom';
    class = 'tooltip-error';
    container = '';
    force = false;
}
export class IDynamicInputEvents {
    select?: Function;
    remove?: Function;
}
export class IDynamicInputOptions {
    hideLabel?: boolean; // default: false;
    selEmptyEn?: boolean; // default: false;
    defaultValue?: { value: string, title: string };
    enRemoveButton?: boolean; // for dictlink second button
    events?: IDynamicInputEvents;
    // selEmptyValDis?: boolean; // default: false;
}
@Component({
    selector: 'eos-dynamic-input',
    templateUrl: 'dynamic-input.component.html'
})

export class DynamicInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;
    @Input() isGroup: boolean;
    @Input() hideLabel: boolean;
    @Input() viewOpts: IDynamicInputOptions;

    types = E_FIELD_TYPE;
    tooltip: ErrorTooltip = new ErrorTooltip;
    constructor () {
        if (!this.viewOpts) {
            this.viewOpts = <IDynamicInputOptions> {};
        }
    }
}
