import {DictionaryDescriptor} from './dictionary-descriptor';
import {ALL_ROWS} from '../../eos-rest/core/consts';
import {IDictionaryDescriptor} from '../interfaces';
import {PipRX} from '../../eos-rest/services/pipRX.service';


export class LinkDictionaryDescriptor extends DictionaryDescriptor {

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        super(descriptor, apiSrv);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        const req = {[this.apiInstance]: query};

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                const newData = [];
                data.forEach((rec) => {
                    if (rec['ISN_LCLASSIF'] <= rec['ISN_PARE_LINK']) {
                        rec['LINK'] = rec['CLASSIF_NAME'];
                        rec['TYPE'] = rec['LINK_TYPE'];
                        data.forEach((pair) => {
                            if (rec['ISN_PARE_LINK'] === pair['ISN_LCLASSIF']) {
                                rec['PAIR_LINK'] = pair['CLASSIF_NAME'];
                                rec['PAIR_NAME'] = pair['CLASSIF_NAME'];
                                rec['PAIR_INDEX'] = pair['LINK_INDEX'];
                                rec['PAIR_TRANSPARENT'] = pair['TRANSPARENT'];
                                rec['PAIR_NOTE'] = pair['NOTE'];
                            }
                        });
                        newData.push(rec);
                    }
                });
                return newData;
            });
    }
}
