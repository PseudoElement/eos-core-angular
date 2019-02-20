import { ALL_ROWS } from 'eos-rest/core/consts';
import { RKDefaultFields, TDefaultField, TDFSelectOption, RKFilesConstraints } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';

const DOCGROUP_TABLE = 'DOCGROUP_CL';
const DOCGROUP_UID_NAME = 'ISN_NODE';
export const DEFAULTS_LIST_NAME = 'DOC_DEFAULT_VALUE_List';
export const FILE_CONSTRAINT_LIST_NAME = 'DG_FILE_CONSTRAINT_List';

// export enum ACRK_GROUP {
//     defaultRKValues,
// }

export class AdvCardRKDataCtrl {
    name: string;
    loadedDicts: any;

    constructor (
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService,
    ) {
        this.loadedDicts = {};
    }


    getDescriptions(): any {
        return {
            [DEFAULTS_LIST_NAME]:  RKDefaultFields,
            [FILE_CONSTRAINT_LIST_NAME]: RKFilesConstraints,
        };
    }


    readValues(uid: number): Promise<any> {
        // http://91.236.200.124/NP23/OData.svc/DOCGROUP_CL?criteries={%22ISN_NODE%22:%223670%22}&$expand=DOC_DEFAULT_VALUE_List

        const query = {
            criteries: { [DOCGROUP_UID_NAME]: String(uid) },
        };

        const req: any = {
            [DOCGROUP_TABLE]: query,
            expand: DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_LIST_NAME,
            foredit: true,
        };

        return this._apiSrv.read<DOCGROUP_CL>(req).then((data) => {
            return data;
        });
    }

    _calcChangesFor(docGroup: any, data: any ): any {
        const changes = [];
        // , [DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME]
        this.keys(data[DEFAULTS_LIST_NAME]).forEach((key) => {
            const value = data[DEFAULTS_LIST_NAME][key];
            // const discrs = this.getDescriptions()[key];
            const g = docGroup[DEFAULTS_LIST_NAME].find (f => f.DEFAULT_ID === key);
            if (g) {
                if (g['DEFAULT_ID'] === 'RUB_M') {
                    console.log('1');
                }

                if (g.VALUE !== String(value)) {
                    if (value === null) {
                        changes.push (
                            {
                                method: 'DELETE',
                                data: '',
                                requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
                                    + docGroup['DUE'] + ' ' + g['DEFAULT_ID'] + '\')'
                            }
                        );
                    } else {
                        changes.push (
                            {
                                method: 'MERGE',
                                data: {VALUE: String(value) },
                                requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
                                    + docGroup['DUE'] + ' ' + g['DEFAULT_ID'] + '\')'
                            }
                        );
                    }
                }
            } else if (value) {
                if (key === 'RUB_M') {
                    console.log('2');
                }
                changes.push (
                    {
                        method: 'MERGE',
                        data: { VALUE: String(value) },
                        requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
                            + docGroup['DUE'] + '\ ' + key + '\')'
                    }
                );
            }
        });
        return changes;
    }

    save(isn_node: number, inputs: any[], data: any): void {
        this.readValues(isn_node)
            .then(([docGroup]) => {
                this._apiSrv.entityHelper.prepareForEdit(docGroup);
                const changes = this._calcChangesFor(docGroup, data);

                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    })
                    .catch((err) => {
                        this._msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка записи'});
                    });
            });
    }

    readDictLinkValue(el: TDefaultField, value: any, updateLink: Function = null): Promise<any> {
        const dict = el.dict;
        if (dict) {
            let query: any;
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

    loadDictsOptions (values: any, updateLink: Function = null): Promise<any> {
        const reqs = [];
        const fields = this.getDescriptions();

        Object.keys(fields).forEach ((key) => {
            for (let i = 0; i < fields[key].length; i++) {
                const el: TDefaultField = fields[key][i];
                if (!el.dict) {
                    continue;
                }
                if (el.type === E_FIELD_TYPE.dictLink) {
                    reqs.push(this.readDictLinkValue(el, values[key][el.key], updateLink));
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
                            opts.push ({value: '', title: '...'});
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
        });

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
}
