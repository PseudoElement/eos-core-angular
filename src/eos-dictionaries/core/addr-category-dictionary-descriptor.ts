import { DictionaryDescriptor } from './dictionary-descriptor';
import { _ES } from 'eos-rest/core/consts';

export class AddrCategoryDictionaryDescriptor extends DictionaryDescriptor {

    getData(...params): Promise<any[]> {
        return super.getData(params).then ( data => {
            return data.filter(d => d.ISN_LCLASSIF && d.ISN_LCLASSIF > 0);
        });
    }
}
