import { InputBase } from './input-base';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export class StringInput extends InputBase<string> {
    controlType = E_FIELD_TYPE.string;
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
