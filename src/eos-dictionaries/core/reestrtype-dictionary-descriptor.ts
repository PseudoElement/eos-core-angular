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
    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        const res = super.getData(query, order, limit);
        return res.then(d => {
            for (let i1 = 0; i1 < d.length; i1++) {
                const e1 = d[i1];
                e1['IS_UNIQUE'] = 1;
            }
            if (d.length > 1) {
                    for (let i1 = 0; i1 < (d.length - 1); i1++) {
                    const e1 = d[i1];
                    for (let i2 = i1 + 1; i2 < d.length; i2++) {
                        const e2 = d[i2];
                        if (e1['ISN_DELIVERY'] === e2['ISN_DELIVERY']) {
                            e1['IS_UNIQUE'] = 0;
                            e2['IS_UNIQUE'] = 0;
                        }
                    }
                }
            }
            return d;
        });
    }
}
