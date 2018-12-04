import { E_DICT_TYPE, IDictionaryDescriptor, E_FIELD_SET, IRecordOperationResult, E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { RecordDescriptor } from 'eos-dictionaries/core/record-descriptor';

import { commonMergeMeta } from 'eos-rest/common/initMetaData';
import { FieldsDecline } from 'eos-dictionaries/interfaces/fields-decline.inerface';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';
import { ITypeDef, IEnt, DELO_BLOB } from 'eos-rest';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { PrintInfoHelper } from 'eos-rest/services/printInfo-helper';
import { SEV_ASSOCIATION } from 'eos-rest/interfaces/structures';
import { IAppCfg } from 'eos-common/interfaces';
// import { RestError } from 'eos-rest/core/rest-error';
import { EosUtils } from 'eos-common/core/utils';
import { ContactHelper } from '../../eos-rest/services/contact-helper';

export abstract class AbstractDictionaryDescriptor {
    /**
     * decription of dictionary fields
     */
    abstract record: RecordDescriptor;
    editOnlyNodes = false;
    readonly id: string;
    readonly title: string;
    readonly type: E_DICT_TYPE;
    readonly apiInstance: string;
    readonly hideTopMenu?: boolean;
    /**
     * rest metadata. can be used for loading related dictionaries
     */
    protected metadata: ITypeDef;
    /**
     * api service endpoint
     */
    protected apiSrv: PipRX;

    private _defaultOrder: string;

    get defaultOrder(): string {
        return this._defaultOrder || 'CLASSIF_NAME';
    }

    get dictionaryType(): E_DICT_TYPE {
        return this.type;
    }

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
    ) {
        if (descriptor) {
            this.id = descriptor.id;
            this.title = descriptor.title;
            this.type = descriptor.dictType;
            this.apiInstance = descriptor.apiInstance;
            this._defaultOrder = descriptor.defaultOrder;
            this.hideTopMenu = descriptor.hideTopMenu;
            this.editOnlyNodes = descriptor.editOnlyNodes;

            this.apiSrv = apiSrv;
            commonMergeMeta(this);
            this._initRecord(descriptor);
        } else {
            return undefined;
        }
    }

    abstract addRecord(...params): Promise<IRecordOperationResult[]>;
    abstract getChildren(...params): Promise<any[]>;
    abstract getRoot(): Promise<any[]>;
    abstract getSubtree(...params): Promise<any[]>;
    abstract onPreparePrintInfo(dec: FieldsDecline): Promise<any[]>;

    addBlob(ext: string, blobData: string): Promise<string | number> {
        const delo_blob = this.apiSrv.entityHelper.prepareAdded<DELO_BLOB>({
            ISN_BLOB: this.apiSrv.sequenceMap.GetTempISN(),
            EXTENSION: ext
        }, 'DELO_BLOB');
        const chl = this.apiSrv.changeList([delo_blob]);
        const content = {
            isn_target_blob: delo_blob.ISN_BLOB,
            data: blobData
        };

        PipRX.invokeSop(chl, 'DELO_BLOB_SetDataContent', content);

        return this.apiSrv.batch(chl, '')
            .then((ids) => (ids[0] ? ids[0] : null));

    }

    checkSevIsNew(sevData: SEV_ASSOCIATION, record: any): Promise<IRecordOperationResult> {
        return this.apiSrv.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: PipRX.criteries({ OBJECT_NAME: this.apiInstance }) })
            .then((sevs) => {
                let result: IRecordOperationResult;
                if (!sevData.__metadata) { // if new SEV
                    const sevRec = this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(undefined, 'SEV_ASSOCIATION');
                    sevData = Object.assign(sevRec, sevData);
                }
                result = {
                    record: sevData,
                    success: true
                };
                if (SevIndexHelper.PrepareForSave(sevData, record)) {
                    const exist = sevs.find((existSev) =>
                        (sevData.OBJECT_ID === existSev.OBJECT_ID) && (sevData.GLOBAL_ID === existSev.GLOBAL_ID));

                    if (exist) {
                        result = null;
                        // result.success = false;
                        // result.error = new RestError({
                        //     isLogicException: true,
                        //     message: 'Индекс СЭВ создан ранее!'
                        // });
                    }
                } else {
                    result = null;
                }
                return result;
            });
    }

    deleteRecords(records: IEnt[]): Promise<IRecordOperationResult[]> {
        const pDelete = records.map((record) => this.deleteRecord(record));
        return Promise.all(pDelete);
    }

    getTempISN(): number {
        return this.apiSrv.sequenceMap.GetTempISN();
    }

    getApiConfig(): IAppCfg {
        return this.apiSrv.getConfig();
    }

    merge(metadata: any) {
        this.metadata = metadata[this.apiInstance];
    }

    getBoss(departmentDUE: string): Promise<any> {
        return Promise.resolve(null);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }
        if (this.id === 'organization') {
            req.expand = 'CONTACT_List';
        }
        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                return data;
            });
    }

    getEmpty(): any {
        return this.apiSrv.entityHelper.prepareAdded({}, this.apiInstance);
    }

    getFullSearchCriteries(data: any): any {
        const _searchFields = this.record.getFieldSet(E_FIELD_SET.fullSearch);
        const _criteries = {};
        _searchFields.forEach((fld) => {
            if (data[fld.foreignKey]) {
                _criteries[fld.foreignKey] = '"' + data[fld.foreignKey].trim() + '"';
            }
        });
        return _criteries;
    }

    getNewRecord(preSetData: {}): {} {
        const fields = this.record.getFieldSet(E_FIELD_SET.edit);
        const newRec = {
            rec: {}
        };
        fields.forEach((fld) => {
            if (E_FIELD_TYPE.dictionary === fld.type) {
                newRec[fld.key] = {};
            } else if (E_FIELD_TYPE.array === fld.type) {
                newRec[fld.key] = [];
            }
        });
        if (preSetData) {
            EosUtils.deepUpdate(newRec, preSetData);
        }
        return newRec;
    }

    getParentDictionaryId(): string {
        return null;
    }

    getRelated(rec: any, ..._args): Promise<any> {
        const reqs = [];
        this.metadata.relations.forEach((relation) => {
            if (rec[relation.sf]) {
                reqs.push(this.apiSrv
                    .read({
                        [relation.__type]: PipRX.criteries({ [relation.tf]: rec[relation.sf] + '' })
                    })
                    .then((records) => this.prepareForEdit(records))
                );
            } else {
                reqs.push(Promise.resolve([]));
            }
        });
        return Promise.all(reqs)
            .then((responses) => {
                return this.aRelationsToObject(responses);
            });
    }

    getRecord(nodeId: string | number): Promise<any> {
        return this.getData([nodeId]);
    }

    getIdByDictionaryMode(_mode: number): string {
        return this.id;
    }

    getRelatedSev(rec: any): Promise<SEV_ASSOCIATION> {
        // todo: fix hardcode
        return this.apiSrv
            .read<SEV_ASSOCIATION>({
                SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(rec['DUE'] || rec['ISN_LCLASSIF'], this.apiInstance)]
            })
            .then((sev) => this.apiSrv.entityHelper.prepareForEdit<SEV_ASSOCIATION>(sev[0], 'SEV_ASSOCIATION'));
    }

    isDiffer(data: any, original: any): boolean {
        if (data instanceof Array) {
            return data.findIndex((recItem, idx) => this.isDiffer(recItem, original[idx])) > -1;
        } else if (data instanceof Object) {
            return Object.keys(original)
                .filter((fld) => fld.indexOf('_') !== 0)
                .findIndex((fld) => this.isDiffer(data[fld], original[fld])) > -1;
        } else {
            const hasDiff = (original || data) && original !== data;
            /*
            if (hasDiff) {
                console.warn('difference in ', data, original);
            }
            */
            return hasDiff;
        }
    }

    markDeleted(records: any[], deletedState = 1, cascade = false): Promise<any[]> {
        records.forEach((record) => record.DELETED = deletedState);
        const changes = this.apiSrv.changeList(records);
        if (deletedState === 0 && cascade) {
            PipRX.invokeSop(changes, 'ClassifCascade_TRule', { DELETED: +cascade });
        }
        return this.apiSrv.batch(changes, '');
    }

    search(criteries: any[]): Promise<any[]> {
        // console.log('search critery', criteries);

        const _search = criteries.map((critery) => this.getData(PipRX.criteries(critery)));

        return Promise.all(_search)
            .then((results) => [].concat(...results));
    }

    /**
     * @description Post chages from all conected dictionaries
     * @param originalData data before changes
     * @param updates changes
     * @returns Promise<any[]>
     */
    updateRecord(originalData: any, updates: any): Promise<IRecordOperationResult[]> {
        const changeData = [];
        let pSev: Promise<IRecordOperationResult> = Promise.resolve(null);
        const results: IRecordOperationResult[] = [];
        Object.keys(updates).forEach((key) => {
            if (updates[key]) {
                const data = EosUtils.deepUpdate(originalData[key], updates[key]);
                switch (key) {
                    case 'sev': // do nothing handle sev later
                        pSev = this.checkSevIsNew(data, originalData.rec);
                        break;
                    case 'photo':
                        break;
                    case 'printInfo':
                        if (PrintInfoHelper.PrepareForSave(data, originalData.rec)) {
                            changeData.push(data);
                        }
                        break;
                    case 'contact':
                        for (const contact of data) {
                            if (ContactHelper.PrepareForSave(contact, originalData.rec)) {
                                // for (let contact of data) {
                                // changeData.push(contact);
                                // }
                            }
                        }
                        break;
                    case 'rec':
                        // if (data['CONTACT_List']) {
                        //     delete data['CONTACT_List'];
                        // }
                        changeData.push(data);
                        break;
                    default: // do nothing

                }
            }
        });

        // console.log('originalData', originalData);
        // console.log('changeData', changeData);
        const record = EosUtils.deepUpdate(originalData.rec, updates.rec);
        return pSev
            .then((result) => {
                if (result) {
                    if (result.success) {
                        changeData.push(result.record);
                    } else {
                        result.record = record;
                        results.push(result);
                    }
                }
            })
            .then(() => {
                const changes = this.apiSrv.changeList(changeData);
                if (changes.length) {
                    return this.apiSrv.batch(changes, '')
                        .then(() => {
                            results.push({ success: true, record: record });
                            return results;
                        });
                } else {
                    return results;
                }
            });
    }

    getFullRelated(): Promise<any> {
        const reqs = [];
        this.metadata.relations.forEach((relation) => {
            reqs.push(this.apiSrv
                .read({[relation.__type]: []}));
        });
        return Promise.all(reqs)
            .then((responses) => {
                return this.associateRelationType(responses);
            });
    }

    protected _postChanges(data: any, updates: any): Promise<any[]> {
        // console.log('_postChanges', data, updates);
        Object.assign(data, updates);
        const changes = this.apiSrv.changeList([data]);
        // console.log('changes', changes);
        return this.apiSrv.batch(changes, '');
    }

    protected deleteRecord(record: IEnt): Promise<IRecordOperationResult> {
        record._State = _ES.Deleted;
        const changes = this.apiSrv.changeList([record]);
        return this.apiSrv.batch(changes, '')
            .then(() => {
                return <IRecordOperationResult>{
                    record: record,
                    success: true
                };
            })
            .catch((err) => {
                return <IRecordOperationResult>{
                    record: record,
                    success: false,
                    error: err
                };
            });
    }

    protected dueToChain(due: string): string[] {
        const chain: string[] = due.split('.').filter((elem) => !!elem);
        let prefix = '';
        chain.forEach((elem, idx, arr) => {
            arr[idx] = prefix + elem + '.';
            prefix = arr[idx];
        });
        return chain;
    }

    protected getCachedRecord(query: any): Promise<any> {
        return this.apiSrv.cache
            .read(query)
            .then((items: any[]) => this.apiSrv.entityHelper.prepareForEdit(items[0]));
    }

    protected _initRecord(descriptorData: IDictionaryDescriptor) {
        if (descriptorData.fields) {
            this.record = new RecordDescriptor(this, descriptorData);
        }
    }

    protected prepareForEdit(records: any[]): any[] {
        return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    }

    protected aRelationsToObject(responses: any[]): any {
        const related = {};
        this.metadata.relations.forEach((relation, idx) => {
            related[relation.name] = responses[idx];
        });
        return related;
    }
    protected associateRelationType(responses: any[]): any {
        const related = {};
        this.metadata.relations.forEach((relation, idx) => {
            related[relation.__type] = responses[idx];
        });
        return related;
    }
}
