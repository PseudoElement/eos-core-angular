import { InputBase } from './input-base';

export class StringInput extends InputBase<string> {
    controlType = 'string';
    type: string;

    constructor(options: {} = {}) {
        super(options);
        this.type = options['type'] || '';
    }
}
