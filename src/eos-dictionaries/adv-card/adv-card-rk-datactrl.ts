import { ALL_ROWS } from 'eos-rest/core/consts';
import { RKDefaultFields, TDefaultField, TDFSelectOption, RKFilesConstraints, RKFictControls, RKFilesConstraintsFields } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SUCCESS_SAVE } from 'eos-dictionaries/consts/messages.consts';
import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { NgZone } from '@angular/core';

const DOCGROUP_TABLE = 'DOCGROUP_CL';
const DOCGROUP_UID_NAME = 'ISN_NODE';
export const DEFAULTS_LIST_NAME = 'DOC_DEFAULT_VALUE_List';
export const FILE_CONSTRAINT_LIST_NAME = 'DG_FILE_CONSTRAINT_List';
export const FICT_CONTROLS_LIST_NAME = 'fict';

export class IUpdateDictEvent {
    path: string;
    options: TDFSelectOption[];
    el: TDefaultField;
    data?: any;
}

export class ICashedDict {
    hash: string;
    dict: any[] = [];
    forceReload?: boolean;
    promise: Promise<any>;
}

export class AdvCardRKDataCtrl {


    name: string;
    private _cachedDicts: ICashedDict[];

    private _descr = {
        [DEFAULTS_LIST_NAME]:  RKDefaultFields,
        [FILE_CONSTRAINT_LIST_NAME]: RKFilesConstraints,
        [FICT_CONTROLS_LIST_NAME]: RKFictControls,
    };

    constructor (
        public zone: NgZone,
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _dictSrv: EosDictService,
    ) {
        this._cachedDicts = [];
    }

    getApiConfig() {
        return this._dictSrv.getApiConfig();
    }

    getDescriptions(): any {
        return this._descr;
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


    public save(isn_node: number, data: any): Promise<any> {
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


    public readDictLinkValue(el: TDefaultField, value: any, callback: (event: IUpdateDictEvent) => void = null): Promise<any> {
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

                if (callback) {
                    callback ({
                        path: el.key,
                        options: opts,
                        el: el,
                        data: data,
                    });
                }
                el.options = opts;
                return data;
            });

        }
        return Promise.resolve(null);
    }

    public markCacheForDirty(filter: string) {
        const fields = this.getDescriptions();
        Object.keys(fields).forEach ((key) => {
            for (let i = 0; i < fields[key].length; i++) {
                const el: TDefaultField = fields[key][i];
                if (!el.dict) { continue; }
                if (el.dict.dictId !== filter) {
                    continue;
                }
                const hash = this.calcHash(el.dict);
                if (!this._cachedDicts[hash]) {
                    this._cachedDicts[hash] = new ICashedDict;
                }
                this._cachedDicts[hash].forceReload = true;
            }
        });
    }

    public cashedReadDict(el: TDefaultField, callback: (event: IUpdateDictEvent) => void = null): Promise<any> {
        const dict = el.dict;
        const hash = this.calcHash(dict);
        let cache: ICashedDict = this._cachedDicts[hash];

        if (cache && !cache.forceReload) {
            el.options = cache.dict;
            return cache.promise.then( () => {
                callback ({ path: el.key, options: el.options, el: el });
                return el.options;
            });
        } else {
            if (!cache) {
                cache = new ICashedDict;
                this._cachedDicts[hash] = cache;
            }

            cache.forceReload = false;

            let query: any;
            if (el.dict.criteries) {
                query = { criteries: el.dict.criteries};
            } else {
                query = ALL_ROWS;
            }
            const req = {[el.dict.dictId]: query};

            cache.promise = this._apiSrv.read(req).then((data) => {
                cache.dict.length = 0;

                const opts_ptr: TDFSelectOption[] = cache.dict;
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    const value = element[el.dict.dictKey];
                    const title = element[el.dict.dictKeyTitle];
                    const deleted = element['DELETED'];
                    if (deleted) {
                        opts_ptr.push ({value: value, title: title, disabled: true});
                    } else {
                        opts_ptr.push ({value: value, title: title });
                    }

                }
                console.log ('promise done');
                callback ({ path: el.key, options: opts_ptr, el: el });
                el.options = opts_ptr;

                return opts_ptr;
            });

            return cache.promise;
        }
    }

    public updateDictsOptions(filter: string, linkValues: any, callback: (event: IUpdateDictEvent) => void = null): Promise<any> {
        const reqs = [];
        const fields = this.getDescriptions();

        Object.keys(fields).forEach ((key) => {
            for (let i = 0; i < fields[key].length; i++) {

                const el: TDefaultField = fields[key][i];

                if (!el.dict) { continue; }
                if (filter && el.dict.dictId !== filter) { continue; }

                if (el.type === E_FIELD_TYPE.dictLink) {
                    reqs.push(this.readDictLinkValue(el, linkValues[key][el.key], (event: IUpdateDictEvent) => {
                        event.path = key + '.' + el.key;
                        callback(event);
                    }));
                }

                if (el.type !== E_FIELD_TYPE.select)  { continue; }

                reqs.push(this.cashedReadDict(el, callback));
            }
        });

        return Promise.all(reqs).then((responses) => {
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
            let hasChanges = false;
            for (const sk in RKFilesConstraintsFields) {
                if (RKFilesConstraintsFields.hasOwnProperty(sk)) {

                    const f = RKFilesConstraintsFields[sk];
                    const spath = key + '.' + f;
                    const field = fields[FILE_CONSTRAINT_LIST_NAME].find(i => i.key === spath);
                    const type: E_FIELD_TYPE = field.type;
                    const t1 = newData[FILE_CONSTRAINT_LIST_NAME];
                    const t2 = t1[key];
                    const savedValue = this.fixDBValueByType(savedData[f], type);
                    const formValue = this.fixDBValueByType(t2[f], type);
                    if (savedValue !== formValue) {
                        hasChanges = true;
                        break;
                    }
                }
            }

            const updatevalues = {};
            for (const sk in RKFilesConstraintsFields) {

                if (RKFilesConstraintsFields.hasOwnProperty(sk)) {
                    const f = RKFilesConstraintsFields[sk];
                    const spath = key + '.' + f;
                    const field = fields[FILE_CONSTRAINT_LIST_NAME].find(i => i.key === spath);
                    const type: E_FIELD_TYPE = field.type;
                    const t1 = newData[FILE_CONSTRAINT_LIST_NAME];
                    const t2 = t1[key];
                    updatevalues[f] = this.fixDBValueByType(t2[f], type);
                }
            }
            if (updatevalues['ONE_FILE'] === null) {
                updatevalues['ONE_FILE'] = '0';
            }

            if (hasChanges) {
                if (savedData) {

                    changes.push (
                        {
                            method: 'MERGE',
                            data: updatevalues,
                            requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DG_FILE_CONSTRAINT_List(\''
                                + docGroup['DUE'] + ' ' + key + '\')'
                        }
                    );
                } else {
                    updatevalues['CATEGORY'] = key;
                    changes.push (
                        {
                            method: 'POST',
                            data: updatevalues,
                            requestUri: 'DOCGROUP_CL(\'' + docGroup['DUE'] + '\')/DG_FILE_CONSTRAINT_List'
                        }
                    );
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
