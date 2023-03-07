import { IEnt, SEV_ASSOCIATION } from '../../eos-rest';
import { _ES } from '../../eos-rest/core/consts';

export class SevIndexHelper {

    static CompositePrimaryKey(id: string | number, typeName: string) {
        let key = id + ' ' + typeName;
        if (typeof id === 'number') {
            key = 'ISN#' + key;
        }
        return key;
    }

    static PrepareForSave(rec: SEV_ASSOCIATION, owner: IEnt): boolean {
        // удаление СЕВ ИНДЕКС
        if ((rec.GLOBAL_ID === null) || (rec.GLOBAL_ID.trim() === '')) {
            if (rec._State === _ES.Stub) {
                return false;
            }
            rec._State = _ES.Deleted;
        } else if (rec._State === _ES.Stub) {
            // Добавление - превращаем Stub в Added
            rec._State = _ES.Added;
            rec.OBJECT_ID = owner['DUE'] || ('ISN#' + owner['ISN_LCLASSIF']);
            rec.OBJECT_NAME = owner.__metadata.__type;
        }
        return true;
    }
}
