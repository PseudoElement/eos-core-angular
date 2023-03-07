import { InputBase } from './input-base';
import { ISelectOption, ISelectInput } from '../../interfaces';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export class ButtonsInput extends InputBase<string | number> {
    controlType = E_FIELD_TYPE.buttons;
    options: ISelectOption[] = [];

    constructor(options: ISelectInput) {
        super(options);
        this.options = options['options'] || [];
    }
}
