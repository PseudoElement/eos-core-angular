import { RecordDescriptor } from './record-descriptor';
import {DictionaryDescriptor} from './dictionary-descriptor';

export class NadzorDictionaryDescriptor extends DictionaryDescriptor {
    record: RecordDescriptor;

    getParentDictionaryId(): string {
        return 'nadzor';
    }




}
