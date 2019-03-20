import { ALL_ROWS } from 'eos-rest/core/consts';
import { RKDefaultFields, TDefaultField, TDFSelectOption, RKFilesConstraints, RKFictControls, RKFilesConstraintsFields } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';

const DOCGROUP_TABLE = 'DOCGROUP_CL';
const DOCGROUP_UID_NAME = 'ISN_NODE';
export const DEFAULTS_LIST_NAME = 'DOC_DEFAULT_VALUE_List';
export const FILE_CONSTRAINT_LIST_NAME = 'DG_FILE_CONSTRAINT_List';
export const FICT_CONTROLS_LIST_NAME = 'fict';

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
            [FICT_CONTROLS_LIST_NAME]: RKFictControls,
        };
    }


    readValues(uid: number): Promise<any> {

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

    public save(isn_node: number, inputs: any[], data: any): Promise<any> {
        return this.readValues(isn_node)
            .then(([docGroup]) => {
                this._apiSrv.entityHelper.prepareForEdit(docGroup);
                const changes = this._calcChangesFor(docGroup, data);
                if (changes) {
                    this._apiSrv.batch(changes, '')
                        .then(() => {
                            this._msgSrv.addNewMessage(SUCCESS_SAVE);
                        })
                        .catch((err) => {
                            this._msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка записи'});
                        });
                }
            });
    }


    public readDictLinkValue(el: TDefaultField, value: any, updateLink: Function = null): Promise<any> {
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
                this.loadedDicts[el.dict.dictId] = opts;
                return data;
            });

        }
        return Promise.resolve(null);
    }

    public loadDictsOptions (values: any, updateLink: Function = null): Promise<any> {
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
                    const hash = this.calcHash(el.dict);
                    if (this.loadedDicts[hash]) {
                        el.options = this.loadedDicts[hash];
                    } else {
                        let query: any;
                        if (el.dict.criteries) {
                            query = { criteries: el.dict.criteries};
                        } else {
                            query = ALL_ROWS;
                        }
                        this.loadedDicts[hash] = [];

                        const req = {[el.dict.dictId]: query};

                        reqs.push(this._apiSrv.read(req).then((data) => {
                            const opts: TDFSelectOption[] = this.loadedDicts[hash];
                            // opts.push ({value: '', title: '...'});
                            for (let index = 0; index < data.length; index++) {
                                const element = data[index];
                                opts.push ({value: element[el.dict.dictKey], title: element[el.dict.dictKeyTitle]});
                            }

                            el.options = opts;
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

    public fixDBValueByType(value: any, type: E_FIELD_TYPE): any {
        if (value === undefined) {
            return null;
        } else if (value === '') {
            return null;
        }
        switch (type) {
            case E_FIELD_TYPE.boolean: {
                if (!value || value === '0') {
                    return null;
                } else {
                    return '1';
                }
            }
            case E_FIELD_TYPE.select: {
                if (value === '') {
                    return null;
                }
                break;
            }
        }
        if (value === 'null') {
            return null;
        }
        return value;
    }


    public calcHash (obj: any): string {
        let res: string = '';

        if (obj) {
            if (obj.dictId) {
                res += obj.dictId + ';';
            }
            if (obj.version) {
                res += obj.version + ';';
            }
            if (obj.criteries) {
                for (const key in obj.criteries) {
                    if (obj.criteries.hasOwnProperty(key)) {
                        const element = obj.criteries[key];
                        res += key + '=' + String(element) + ';';
                    }
                }
            }
        }
        return this.hashFnv32a(res);
    }

    public hashFnv32a(str): string {
        let hash = 0;
        let i = 0;
        const len = str.length;
        while ( i < len ) {
            // tslint:disable-next-line:no-bitwise
            hash  = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
        }

        // tslint:disable-next-line:no-bitwise
        return ('0000000' + (hash >>> 0).toString(16)).substr(-8);
    }

    public keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
    }

    private _calcChangesFor(docGroup: any, newData: any ): any {
        const fields = this.getDescriptions();
        const changes = [];
        if (!newData) {
            return null;
        }
        this.keys(newData[FILE_CONSTRAINT_LIST_NAME]).forEach((key) => {
            const savedData = docGroup[FILE_CONSTRAINT_LIST_NAME].find (f => f.CATEGORY === key);
            for (const sk in RKFilesConstraintsFields) {
                if (RKFilesConstraintsFields.hasOwnProperty(sk)) {
                    const f = RKFilesConstraintsFields[sk];
                    const spath = key + '.' + f;
                    const field = fields[FILE_CONSTRAINT_LIST_NAME].find(i => i.key === spath);
                    const type: E_FIELD_TYPE = field.type;
                    const t1 = newData[FILE_CONSTRAINT_LIST_NAME];
                    const t2 = t1[key];
                    const t3 = t2[f];
                    const newValue = this.fixDBValueByType(t3, type);
                    if (savedData) {
                        const savedValue = this.fixDBValueByType(savedData[f], type);
                        if (savedValue !== newValue) {
                        }
                    } else {

                    }


                }
            }

        });

        this.keys(newData[DEFAULTS_LIST_NAME]).forEach((key) => {
            const savedData = docGroup[DEFAULTS_LIST_NAME].find (f => f.DEFAULT_ID === key);
            const field = fields[DEFAULTS_LIST_NAME].find(i => i.key === key);
            const type: E_FIELD_TYPE = field.type;
            const newValue = this.fixDBValueByType(newData[DEFAULTS_LIST_NAME][key], type);
            if (savedData) {
                const savedValue = this.fixDBValueByType(savedData.VALUE, type);
                if (savedValue !== newValue) {
                    if (!this._isNeedToStoreByType(newValue, type)) {
                        changes.push (
                            {
                                method: 'DELETE',
                                data: '',
                                requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
                                    + docGroup['DUE'] + ' ' + savedData['DEFAULT_ID'] + '\')'
                            }
                        );
                    } else {
                        changes.push (
                            {
                                method: 'MERGE',
                                data: {VALUE: String(newValue) },
                                requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List(\''
                                    + docGroup['DUE'] + ' ' + savedData['DEFAULT_ID'] + '\')'
                            }
                        );
                    }
                }
            } else if (newValue) {
                if (this._isNeedToStoreByType(newValue, type)) {
                    changes.push (
                        {
                            method: 'POST',
                            data: { VALUE: String(newValue), DEFAULT_ID: key },
                            requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DOC_DEFAULT_VALUE_List'
                        }
                    );
                }
            }
        });
        return changes;
    }

    private _isNeedToStoreByType(value: any, type: E_FIELD_TYPE): boolean {
        if (!value) {
            return false;
        }
        switch (type) {
            case E_FIELD_TYPE.boolean: {
                if (!value || value === '0') {
                    return false;
                }
            }
        }
        return true;
    }

}
