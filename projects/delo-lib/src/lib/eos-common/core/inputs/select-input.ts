import { InputBase } from './input-base';
import { ISelectOption, ISelectInput } from '../../interfaces';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export class DropdownInput extends InputBase<string | number> {
    controlType = E_FIELD_TYPE.select;
    options: ISelectOption[] = [];

    constructor(options: ISelectInput) {
        super(options);
        this.options = options['options'] || [];
    }
}
