import { ALL_ROWS } from 'eos-rest/core/consts';
import { RKDefaultFields, TDefaultField, TDFSelectOption } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL } from 'eos-rest';

const DOCGROUP_TABLE = 'DOCGROUP_CL';
const DOCGROUP_UID_NAME = 'ISN_NODE';
export const DEFAULTS_LIST_NAME = 'DOC_DEFAULT_VALUE_List';

export enum ACRK_GROUP {
    defaultRKValues,
}

export class AdvCardRKDataCtrl {
    name: string;
    loadedDicts: any;
    constructor (
        private _apiSrv: PipRX,
    ) {
        this.loadedDicts = {};
    }


    getDescriptions(group: ACRK_GROUP): any {
        switch (group) {
            case ACRK_GROUP.defaultRKValues:
                return RKDefaultFields;
            default:
                break;
        }
    }

    getValues(group: ACRK_GROUP): any {
        switch (group) {
            case ACRK_GROUP.defaultRKValues:
                return this.readValues();
            default:
                break;
        }
    }
    readValues() {
        const res = {};
        res['rec'] = {};
        res['rec']['FIELD_1'] = '1';
        return res;
    }

    readValues1(uid: number): Promise<any> {
        // http://91.236.200.124/NP23/OData.svc/DOCGROUP_CL?criteries={%22ISN_NODE%22:%223670%22}&$expand=DOC_DEFAULT_VALUE_List
        const query = {
            criteries: { [DOCGROUP_UID_NAME]: String(uid) },
        };

        const req: any = {
            [DOCGROUP_TABLE]: query,
            expand: DEFAULTS_LIST_NAME,
        };

        // const query = ALL_ROWS;
        // const req = {[DEFAULTS_TABLE_NAME]: query};

        // this._apiSrv
        // .read<DOCGROUP_CL>({
        //     DOCGROUP_CL: PipRX.criteries({'ISN_NODE': this.data.rec['ISN_NODE'].toString()}),
        //     expand: 'AR_DOCGROUP_List',
        //     foredit: true,

        return this._apiSrv.read<DOCGROUP_CL>(req).then((data) => {
        //     // const opts: TDFSelectOption[] = [];
        //     // for (let index = 0; index < data.length; index++) {
        //     //     const element = data[index];
        //     //     opts.push ({value: element[el.dict.dictKey], title: element[el.dict.dictKeyTitle]});
        //     // }
        //     // el.options = opts;
        //     // this.loadedDicts[el.dict.dictId] = opts;
            return data;
        });


        // return Promise.resolve(null);

        // const res = {};
        // res['rec'] = {};
        // res['rec']['FIELD_1'] = '1';

    }

    // getRelatedFields(tables: string[]): Promise<any> {
    //     const reqs = [];
    //     tables.forEach( t => {
    //         if (t) {
    //             const md = this.metadata.relations.find( rel => t === rel.__type);
    //             if (md) {
    //                 reqs.push(this.apiSrv
    //                     .read({[t]: []}));
    //             }
    //         }
    //     });

    //     return Promise.all(reqs)
    //         .then((responses) => {
    //             return this.associateRelationType(tables, responses);
    //         });
    // }

    loadDictsOptions (group: ACRK_GROUP): Promise<any> {
        const reqs = [];
        const fields = this.getDescriptions(group);

        for (let i = 0; i < fields.length; i++) {
            const el: TDefaultField = fields[i];
            if (el.type !== E_FIELD_TYPE.select) {
                continue;
            }

            if (el.dict) {
                if (this.loadedDicts[el.dict.dictId]) {
                    el.options = this.loadedDicts[el.dict.dictId];
                } else {
                    let query: any; // {criteries: {[NUM_YEAR_NAME]: String(this.editValueYear)}};
                    if (el.dict.criteries) {
                        query = { criteries: el.dict.criteries};
                    } else {
                        query = ALL_ROWS;
                    }

                    const req = {[el.dict.dictId]: query};

                    reqs.push(this._apiSrv.read(req).then((data) => {
                        const opts: TDFSelectOption[] = [];
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            opts.push ({value: element[el.dict.dictKey], title: element[el.dict.dictKeyTitle]});
                        }
                        el.options = opts;
                        this.loadedDicts[el.dict.dictId] = opts;
                        return data;
                    }));
                }
            }
        }
        return Promise.all(reqs)
            .then((responses) => {
            return responses;
        });


    }


    // getObjectInputFields(fields) {
    //     const inputs: any = { _list: [], rec: {} };
    //     fields.forEach(field => {
    //         this.fieldsType[field.key] = field.type;
    //         inputs._list.push(field.key);
    //         inputs.rec[field.key] = {
    //             title: field.title,
    //             type: E_FIELD_TYPE[field.type],
    //             foreignKey: field.key,
    //             pattern: field.pattern,
    //             length: field.length,
    //             options: field.options,
    //             readonly: !!field.readonly,
    //             formatDbBinary: !!field.formatDbBinary
    //         };
    //     });
    //     return inputs;
    // }
}
