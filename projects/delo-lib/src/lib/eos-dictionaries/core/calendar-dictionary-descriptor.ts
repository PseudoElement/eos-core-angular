import { IDictionaryDescriptor } from '../../eos-dictionaries/interfaces';
import { DictionaryDescriptor } from './dictionary-descriptor';
import { PipRX } from '../../eos-rest';

export class CalendarDictionaryDescriptor extends DictionaryDescriptor {

    title: 'Ведение Справочников';

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
    }

    _initRecord() {

    }
}
