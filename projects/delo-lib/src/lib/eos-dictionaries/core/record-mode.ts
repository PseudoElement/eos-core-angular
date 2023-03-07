import { IRecordMode } from '../../eos-dictionaries/interfaces';
import { FieldDescriptor } from './field-descriptor';
import { RecordDescriptor } from './record-descriptor';

export class ModeFieldSet {
    [mode: string]: FieldDescriptor[];

    constructor(record: RecordDescriptor, data: IRecordMode) {
        Object.keys(data).forEach((mode) => {
            this[mode] = [];
            data[mode].forEach((fldName) => record.addFieldToSet(fldName, this[mode]));
        });
    }
}
