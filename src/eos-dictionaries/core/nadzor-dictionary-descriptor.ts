import {TreeDictionaryDescriptor} from './tree-dictionary-descriptor';
import {DictionaryDescriptor} from './dictionary-descriptor';

export class NadzorTreeDictionaryDescriptor extends TreeDictionaryDescriptor {
    // record: RecordDescriptor;
    getParentDictionaryId(): string {
        return 'nadzor';
    }
}

export class NadzorLinearDictionaryDescriptor extends DictionaryDescriptor {
    // record: RecordDescriptor;
    getParentDictionaryId(): string {
        return 'nadzor';
    }
}
