import { InputBase } from './input-base';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { ISelectOption } from '../../interfaces';

export class RadioInput extends InputBase<string> {
    controlType = E_FIELD_TYPE.radio;
    disabled: boolean;
    options: ISelectOption[] = [];

    constructor(options: {} = {}) {
        super(options);
        this.options = options['options'] || [];

    }
}
