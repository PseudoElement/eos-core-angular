import {DictionaryDescriptor} from './dictionary-descriptor';
import {RESOLVE_DESCRIPTIONS} from '../consts/dictionaries/sev-collisions';

export class SevCollisionsDictionaryDescriptor extends DictionaryDescriptor {

    protected prepareForEdit(records: any[]): any[] {
        const result = super.prepareForEdit(records);
        if (result) {
            for (let i = 0; i < result.length; i++) {
                const description = RESOLVE_DESCRIPTIONS.filter(val => val.type === result[i]['RESOLVE_TYPE']);
                if (description.length > 0) {
                    result[i]['resolve_text'] = description[0]['text'];
                }
            }
        }
        return result;
    }
}
