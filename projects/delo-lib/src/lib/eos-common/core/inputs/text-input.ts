import { InputBase } from './input-base';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export class TextInput extends InputBase<string> {
    controlType = E_FIELD_TYPE.text;
    type: string;
    height: number;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
        this.height = options['height'] || null;
    }
}
