import { DictionaryDescriptor } from './dictionary-descriptor';
import { PipRX } from '../../eos-rest';

export class ReestrtypeDictionaryDescriptor extends DictionaryDescriptor {

    // updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
    //     return this.hasDependentRecords(originalData).then(hasRecs => {
    //         if (!hasRecs) {
    //             return super.updateRecord(originalData, updates);
    //         }
    //         const answer = window.confirm('У данного типа реестров есть не отправленные реестры. Сменить вид отправки для всех этих реестров?');
    //         if (answer) {
    //             return super.updateRecord(originalData, updates);
    //         }
    //         return Promise.resolve(null);
    //     });
    // }

    getDependentRecords(record): Promise<any> {
        return this.apiSrv.read({'REESTR_NEW': PipRX.criteries({
                'ISN_REESTR_TYPE': record['ISN_LCLASSIF'].toString(),
                'STATUS': '0:2'
            })
        })
            .then(records => {
                return records;
            });
    }
}
