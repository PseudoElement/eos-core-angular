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
    @Input() event1: Function;

    types = E_FIELD_TYPE;
    tooltip: ErrorTooltip = new ErrorTooltip;
}
