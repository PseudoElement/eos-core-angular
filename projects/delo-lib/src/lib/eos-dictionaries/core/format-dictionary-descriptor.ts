import { IDictionaryDescriptor, IRecordOperationResult } from '../../eos-dictionaries/interfaces';
import { PipRX } from '../../eos-rest';
import { DictionaryDescriptor } from './dictionary-descriptor';


export class FormatDictionaryDescriptor extends DictionaryDescriptor {
    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
    }
    /*
    * В случае если было изменение параметра PRIORITET и будет установлен новый приоритет, добавляем снятие приоритета со старой записи
    * и добавление приоритета изменённой записи
    */
    updateRecord(originalData: any, updates: any, appendToChanges: any = null): Promise<IRecordOperationResult[]> {
        if (updates.rec['PRIORITET'] === 1 && updates.rec._orig['PRIORITET'] === 0) {
            return this.apiSrv.read({
                FORMAT_CL: {
                    criteries: {
                        PRIORITET: 1,
                    }
                }
            })
            .then((data) => {
                const query = this.updatePrioritet(data);
                if (query) {
                    appendToChanges = query;
                }
                return super.updateRecord(originalData, updates, appendToChanges);
            });
        } else {
            return super.updateRecord(originalData, updates, appendToChanges);
        }
    }
    /*
    * При добавлении записи с установление приоритета снимаем приоритете со старой записи и добавляем его новой
    */
    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        if (data.rec['PRIORITET'] === 1) {
            return this.apiSrv.read({
                FORMAT_CL: {
                    criteries: {
                        PRIORITET: 1,
                    }
                }
            })
            .then((data_prior) => {
                const query = this.updatePrioritet(data_prior);
                if (query) {
                    appendToChanges = query;
                }
                return super.addRecord(data, _useless, appendToChanges, isProtected = false, isDeleted = false);
            });
        } else {
            return super.addRecord(data, _useless, appendToChanges = null, isProtected = false, isDeleted = false);
        }
    }
    updatePrioritet(data): any {
        if (data[0]) {
            return {
                method: 'MERGE',
                requestUri: `FORMAT_CL(${data[0]['ISN_LCLASSIF']})`,
                data: {
                    PRIORITET: 0
                }
            };
        }
        return false;
    }
}
