import { InputBase } from './input-base';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export class ToggleInput extends InputBase<boolean> {
    controlType = E_FIELD_TYPE.toggle;
    disabled: boolean;
    constructor(options: {} = {}) {
        super(options);
        this.value = !!this.value;
    }

}
