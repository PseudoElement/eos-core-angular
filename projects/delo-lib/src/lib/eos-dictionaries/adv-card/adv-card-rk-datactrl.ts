import { RKDefaultFields, TDefaultField, TDFSelectOption, RKFilesConstraints, RKFictControls, RKFilesConstraintsFields, RKPDDefaultFields } from './rk-default-values/rk-default-const';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { PipRX, DOCGROUP_CL } from '../../eos-rest';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SUCCESS_SAVE } from '../../eos-dictionaries/consts/messages.consts';
import { ALL_ROWS } from '../../eos-rest/core/consts';
import { NgZone, Injector } from '@angular/core';

const DOCGROUP_TABLE = 'DOCGROUP_CL';
const DOCGROUP_UID_NAME = 'ISN_NODE';
export const DEFAULTS_LIST_NAME = 'DOC_DEFAULT_VALUE_List';
export const PRJ_DEFAULTS_LIST_NAME = 'PRJ_DEFAULT_VALUE_List';
export const FILE_CONSTRAINT_LIST_NAME = 'DG_FILE_CONSTRAINT_List';
export const AR_DOCGROUP_LIST_NAME = 'AR_DOCGROUP_List';

export const FICT_CONTROLS_LIST_NAME = 'fict';


export class IUpdateDictEvent {
    path: string;
    key: string;
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
    public zone: NgZone;
    private _cachedDicts: ICashedDict[];

    private _descr = {
        [DEFAULTS_LIST_NAME]:  RKDefaultFields,
        [FILE_CONSTRAINT_LIST_NAME]: RKFilesConstraints,
        [FICT_CONTROLS_LIST_NAME]: RKFictControls,
        // [PRJ_DEFAULTS_LIST_NAME]: RKPDDefaultFields,
    };
    private _descrRKPD = {
        [PRJ_DEFAULTS_LIST_NAME]: RKPDDefaultFields,
    };

    private _apiSrv: PipRX;
    private _msgSrv: EosMessageService;

    constructor (
        injector: Injector,
    ) {
        this._cachedDicts = [];
        this.zone = injector.get(NgZone);
        this._apiSrv = injector.get(PipRX);
        this._msgSrv = injector.get(EosMessageService);
    }

    getApiConfig() {
        return this._apiSrv.getConfig();
    }

    getDescriptionsRK(): any {
        return this._descr;
    }

    getDescriptionsRKPD(): any {
        return this._descrRKPD;
    }


    readDGValuesDUE(due: string): Promise<any> {

        const query = {
            criteries: { DUE: String(due) },
        };

        const req: any = {
            [DOCGROUP_TABLE]: query,
            expand: DEFAULTS_LIST_NAME + ',' + FILE_CONSTRAINT_LIST_NAME + ',' + PRJ_DEFAULTS_LIST_NAME + ',' + AR_DOCGROUP_LIST_NAME,
            foredit: true,
        };

        return this._apiSrv.read<DOCGROUP_CL>(req).then((data) => {
            return data;
        });
    }

    readDGValues(uid: number): Promise<any> {

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
        return this.readDGValues(isn_node)
            .then(([docGroup]) => {
                this.saveDDGDefaultRK(docGroup, data);
            });
    }


    public saveDDGDefaultRK(docGroup: any, data: any) {
        this._apiSrv.entityHelper.prepareForEdit(docGroup);
        const changes = this._calcChangesFor(docGroup, data);
        if (changes) {
            this._apiSrv.batch(changes, '')
                .then(() => {
                    this._msgSrv.addNewMessage(SUCCESS_SAVE);
                })
                .catch((err) => {
                    this._msgSrv.addNewMessage({ msg: err.message, type: 'danger', title: 'Ошибка записи' });
                });
        }
    }

    public readDictLinkValue(el: TDefaultField, value: any, callback: (event: IUpdateDictEvent) => void = null): Promise<any> {
        const dict = el.dict;
        if (!value) {
            return Promise.resolve(null);
        }
        if (dict) {
            let query: any;
            if (el.dict.criteries) {
                query = { criteries: el.dict.criteries, orderby: 'WEIGHT'};
            } else {
                query = { criteries: {}, orderby: 'WEIGHT'};
            }
            query.criteries[dict.dictKey] = value;

            const req = {[el.dict.dictId]: query};

            return this._apiSrv.read(req).then((data) => {
                const opts: TDFSelectOption[] = [];
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    opts.push ({value: element[el.dict.dictKey], title: element[el.dict.dictKeyTitle], rec: element });
                }

                if (callback) {
                    callback ({
                        path: el.key,
                        key: '',
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

    _appendListInfo(dict: TDefaultField, data: any[]): Promise<any> {
        const listreqs = [];

        for (let i = 0; i < data.length; i++) {
            const el = data[i];

            const query = { args: { isn: el.value } };
            const req = { ValidateUserList4DefaultValues: query};
            listreqs.push(
                this._apiSrv.read(req).then((response) => {
                    if (String(response) === 'ok') {

                    } else {
                    const opt = dict.options.find((dopt) => dopt.value === el.value);
                        if (opt) {
                            if (String(response) === 'LIST_IS_EMPTY') {
                                opt.isEmpty = true;
                            } else if (String(response) === 'LIST_CONTAINS_DELETED') {
                                opt.hasDeleted = true;
                            }
                        }
                    }
                })
            );
        }

        return Promise.all(listreqs)
        .then((responses) => {
            return responses;
        });
    }

    public markCacheForDirty(filter: string) {
        const fields = this.getDescriptionsRK();
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
                callback ({ path: el.key, key: '', options: el.options, el: el });
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
            if (el.dict.orderby) {
                req['orderby'] = el.dict.orderby;
            }


            cache.promise = this._apiSrv.read(req).then((data) => {
                cache.dict.length = 0;

                const opts_ptr: TDFSelectOption[] = cache.dict;
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    const value = element[el.dict.dictKey];
                    const title = element[el.dict.dictKeyTitle];
                    const deleted = element['DELETED'];
                    const DSP = element['CONFIDENTIONAL'];
                    if (deleted) {
                        opts_ptr.push (Object.assign({}, {value: value, title: title, disabled: true}, DSP ? {confidentional: 1, style: {color: 'red'}} : {style: {color: 'black'}}));
                    } else {
                        opts_ptr.push (Object.assign({}, {value: value, title: title}, DSP ? {confidentional: 1, style: {color: 'red'}} : {style: {color: 'black'}}));
                    }

                }
                // console.log ('promise done');

                return opts_ptr;
            }).then((opts_ptr) => {
                if (el.dict.dictId === 'USER_LISTS') {
                    el.options = opts_ptr;
                    return this._appendListInfo(el, opts_ptr).then (d => {
                        callback ({ key: '', path: el.key, options: opts_ptr, el: el });
                        return opts_ptr;
                    });
                } else {
                    callback ({ key: '', path: el.key, options: opts_ptr, el: el });
                    el.options = opts_ptr;

                    return opts_ptr;
                }

            });

            return cache.promise;
        }
    }

    public updateDictsOptions(fields: any, filter: string, linkValues: any, callback: (event: IUpdateDictEvent) => void = null): Promise<any> {
        const reqs = [];
        // const fields = this.getDescriptions();

        Object.keys(fields).forEach ((key) => {
            for (let i = 0; i < fields[key].length; i++) {

                const el: TDefaultField = fields[key][i];

                if (!el.dict) { continue; }
                if (filter && el.dict.dictId !== filter) { continue; }

                if (el.type === E_FIELD_TYPE.dictLink) {
                    reqs.push(this.readDictLinkValue(el, linkValues[key] ? linkValues[key][el.key] : null, (event: IUpdateDictEvent) => {
                        event.path = key + '.' + el.key;
                        event.key = key;
                        callback(event);
                    }));
                    continue;
                } if (el.type !== E_FIELD_TYPE.select)  {
                    continue;
                } else {
                    reqs.push(this.cashedReadDict(el, (event: IUpdateDictEvent) => {
                        event.path = key + '.' + el.key;
                        event.key = key;
                        callback(event);
                    }));
                }
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

    doCorrectsRKToDG(data: any): Promise<any> {

        const id = data.rec ? data.rec['ISN_NODE'] : null;
        if (!id) {
            return Promise.reject({ message: 'Ошибка проверки умолчаний РК'});
        }

        return this.readDGValues(id).then(dgSaved => {
            const dg = data.rec;
            const dgsList = this.arrayToDotList(dgSaved[0][DEFAULTS_LIST_NAME], DEFAULTS_LIST_NAME, 'DEFAULT_ID', 'VALUE');
            const chlist = {};
            const changes = {
                fixE: {},
                fixRCTYPE: {},
                fixRCTYPE_d: {},
            };
            const isEDoc = dg['E_DOCUMENT'];
            changes.fixE[DEFAULTS_LIST_NAME] = {};
            chlist[DEFAULTS_LIST_NAME] = {};

            if (!isEDoc) {
                if (!dgsList['DOC_DEFAULT_VALUE_List.SPECIMEN']) {
                    chlist[DEFAULTS_LIST_NAME]['SPECIMEN'] = '1';
                }
            } else {
                if (dgsList['DOC_DEFAULT_VALUE_List.SPECIMEN']) {
                    chlist[DEFAULTS_LIST_NAME]['SPECIMEN'] = null;
                }
            }

            changes.fixE = this._calcChangesFor(dgSaved[0], chlist);

            // изменения для вида РК

            const rk_type = dg['RC_TYPE'];
            const rk_type_saved = dgSaved[0]['RC_TYPE'];
            if (rk_type !== rk_type_saved) {
                const descrs = this.getDescriptionsRK()[DEFAULTS_LIST_NAME];
                const saved = dgSaved[0][DEFAULTS_LIST_NAME];
                const rec = saved.map( (s) => {
                    return {
                        descriptor: descrs.find(d => d.key === s.DEFAULT_ID),
                        value: s,
                    };
                });
                const chlist1 = {[DEFAULTS_LIST_NAME]: {}};
                rec.forEach(e => {
                    chlist1[DEFAULTS_LIST_NAME][e.descriptor.key] = null;
                });
                changes.fixRCTYPE = this._calcChangesFor(dgSaved[0], chlist1);
                changes.fixRCTYPE_d = rec;

            }

            return changes;
        });
    }

    public arrayToDotList(arr: any[], path: string, field: string, value: string) {
        const res = {};
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];

            res[path + '.' + element[field]] = element[value];
        }
        return res;
    }

    private _calcChangesFor(docGroup: any, newData: any ): any {
        const fields = this.getDescriptionsRK();
        const changes = [];
        if (!newData) {
            return null;
        }
        this.keys(newData[FILE_CONSTRAINT_LIST_NAME]).forEach((key) => {
            const savedData = docGroup[FILE_CONSTRAINT_LIST_NAME].find (f => f.CATEGORY === key);
            let hasChanges = false;
            if (!savedData) {
                hasChanges = true;
            } else {
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
