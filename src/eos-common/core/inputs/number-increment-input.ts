import { InputBase } from './input-base';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export class NumberIncrementInput extends InputBase<number> {
    controlType = E_FIELD_TYPE.numberIncrement;
    disabled: boolean;
    constructor(options: {} = {}) {
        super(options);
    }
}
