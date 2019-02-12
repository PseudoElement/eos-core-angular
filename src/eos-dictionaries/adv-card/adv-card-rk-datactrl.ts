import { ALL_ROWS } from 'eos-rest/core/consts';
import { RKDefaultFields, TDefaultField, TDFSelectOption } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL, DOC_DEFAULT_VALUE } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';

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
        private _msgSrv: EosMessageService,
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
    readDictLinkValue(el: TDefaultField, value: any, updateLink: Function = null): Promise<any> {
        const dict = el.dict;
        if (dict) {
            let query: any; // {criteries: {[NUM_YEAR_NAME]: String(this.editValueYear)}};
            if (el.dict.criteries) {
                query = { criteries: el.dict.criteries};
            } else {
                query = { criteries: {}};
            }
            query.criteries[dict.dictKey] = value;


            const req = {[el.dict.dictId]: query};

            return this._apiSrv.read(req).then((data) => {
                const opts: TDFSelectOption[] = [];
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    opts.push ({value: element[el.dict.dictKey], title: element[el.dict.dictKeyTitle]});
                }

                if (updateLink) {
                    updateLink(el, opts, data);
                }
                el.options = opts;
                // el.dict._cache = data;
                this.loadedDicts[el.dict.dictId] = opts;
                return data;
            });

        }
        return Promise.resolve(null);
    }

    loadDictsOptions (group: ACRK_GROUP, values: any, updateLink: Function = null): Promise<any> {
        const reqs = [];
        const fields = this.getDescriptions(group);

        for (let i = 0; i < fields.length; i++) {
            const el: TDefaultField = fields[i];
            if (!el.dict) {
                continue;
            }
            if (el.type === E_FIELD_TYPE.dictLink) {
                reqs.push(this.readDictLinkValue(el, values.rec[el.key], updateLink));
            } else if (el.type === E_FIELD_TYPE.select) {
                if (this.loadedDicts[el.dict.dictId] &&
                    this.loadedDicts[el.dict.dictId]._idptr &&
                    this.loadedDicts[el.dict.dictId]._idptr === el.dict) {
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
                        this.loadedDicts[el.dict.dictId]._idptr = el.dict;
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

    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
    }

    save(isn_node: number, inputs: any[] ): void {
        this._apiSrv
            .read<DOCGROUP_CL>({
                DOCGROUP_CL: PipRX.criteries({'ISN_NODE': String(isn_node)}),
                expand: DEFAULTS_LIST_NAME,
                foredit: true,
            })
            .then(([docGroup]) => {
                this._apiSrv.entityHelper.prepareForEdit(docGroup);

                this.keys(inputs).forEach((key) => {
                    const input = inputs[key];
                    const path = key.split('.');
                    let value = input.value;
                    const g = docGroup[DEFAULTS_LIST_NAME].find (f => f.DEFAULT_ID === path[1]);
                    if (g) {
                        if (value === true) {
                            value = '1';
                        }
                        if (g.VALUE !== value) {
                            g.VALUE = value;
                            g._State = 'MERGE';
                        }
                    } else if (value) {
                        const newd = <DOC_DEFAULT_VALUE> {
                            _State: 'POST',
                            VALUE: value,
                            DEFAULT_ID : key,
                            // DUE: docGroup['DUE'],
                            // CompositePrimaryKey: g['DUE'] + ' ' + key,
                        };
                        // Object.assign(newd, this._nodes.get(isn_node.toString()).data);
                        docGroup[DEFAULTS_LIST_NAME].push(newd);
                    }
                });

                const changes = this._apiSrv.changeList([docGroup]);
                console.log(changes);
                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    })
                    .catch((err) => {
                        this._msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка записи'});
                    });
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
