import { DictionaryDescriptor } from './dictionary-descriptor';
import { IDictionaryDescriptor, IRecordOperationResult } from '../../eos-dictionaries/interfaces';
import { PipRX } from '../../eos-rest';

export class MedoNodeDictionaryDescriptor extends DictionaryDescriptor {
    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
    }
    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        return super.getData(query, order, limit)
            .then((data) => {
                if (query) {
                    data[0]['PASSWORD'] = '';
                }
                return data;
            });
    }
    updateRecord(originalData: any, updates: any, appendToChanges: any = null): Promise<IRecordOperationResult[]> {
        if (updates.rec['PASSWORD']) {
            appendToChanges = [];
            appendToChanges.push({
                method: 'MERGE',
                requestUri: `MEDO_NODE_CL(${originalData.rec['ISN_LCLASSIF']})`,
                data: {
                    WEIGHT: updates.rec['WEIGHT']
                }
            });
            appendToChanges.push(this.updatePassworld(updates.rec['PASSWORD'], originalData.rec['ISN_LCLASSIF']));
        }
        return super.updateRecord(originalData, updates, appendToChanges);
    }
    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        // данные содержатся в поле data
        if (data.rec['PASSWORD']) {
            data.rec['ISN_LCLASSIF'] = -19999;
            appendToChanges = this.updatePassworld(data.rec['PASSWORD'], data.rec['ISN_LCLASSIF']);
        }
        return super.addRecord(data, _useless, appendToChanges, isProtected = false, isDeleted = false);
    }
    updatePassworld(password, isn?): any {
        if (isn) {
            return {
                method: 'POST',
                requestUri: `MEDO_NODE_CL_TRule?isn=${isn}&setpassword=1&password=${password}`,
            };
        }
        return false;
    }
}
