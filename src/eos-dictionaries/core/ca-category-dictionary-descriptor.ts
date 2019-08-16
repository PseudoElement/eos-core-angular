import { DictionaryDescriptor } from './dictionary-descriptor';
import { _ES } from 'eos-rest/core/consts';
import { EDS_CATEGORY_CL } from 'eos-dictionaries/consts/dictionaries/category-eds.consts';

export class CaCategoryDictionaryDescriptor extends DictionaryDescriptor {

    getParentDictionaryId(): string {
        return EDS_CATEGORY_CL.id;
    }

}
