import { Component, Input } from '@angular/core';
import { InputBase } from '../core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

@Component({
    selector: 'eos-dynamic-input',
    templateUrl: 'dynamic-input.component.html'
})
export class DynamicInputComponent {
    @Input() input: InputBase<any>;
    @Input() form: FormGroup;
    @Input() readonly: boolean;
    @Input() disabled: boolean;


    types = E_FIELD_TYPE;

    tooltip: any = {
        visible: false,
        message: '',
        placement: 'bottom',
        class: 'tooltip-error',
        container: ''
    };
}
