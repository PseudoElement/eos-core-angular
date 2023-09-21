import {
    E_DICT_TYPE,
    IDictionaryDescriptor,
    E_FIELD_SET,
    IRecordOperationResult,
    E_FIELD_TYPE,
    ISearchSettings
} from '../../eos-dictionaries/interfaces';
import {RecordDescriptor} from '../../eos-dictionaries/core/record-descriptor';

import {commonMergeMeta} from '../../eos-rest/common/initMetaData';
import {FieldsDecline} from '../../eos-dictionaries/interfaces/fields-decline.inerface';
import {PipRX} from '../../eos-rest/services/pipRX.service';
import {ALL_ROWS, _ES, _T} from '../../eos-rest/core/consts';
import {ITypeDef, IEnt, DELO_BLOB} from '../../eos-rest';
import {SevIndexHelper} from '../../eos-rest/services/sevIndex-helper';
import {PrintInfoHelper} from '../../eos-rest/services/printInfo-helper';
import {DEPARTMENT, SEV_ASSOCIATION} from '../../eos-rest/interfaces/structures';
import {IAppCfg, IMessage} from '../../eos-common/interfaces';
import {EosUtils} from '../../eos-common/core/utils';
import {ContactHelper} from '../../eos-rest/services/contact-helper';
import {CustomTreeNode} from '../tree2/custom-tree.component';
import {EosDictionaryNode} from '../../eos-dictionaries/core/eos-dictionary-node';
import type {DictionaryComponent} from '../../eos-dictionaries/dictionary/dictionary.component';
import { RestError } from '../../eos-rest/core/rest-error';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import {IConfirmWindow2 } from '../../eos-common/confirm-window/confirm-window2.component';
import {WARN_ELEMENTS_ARE_RELATED, WARN_ELEMENTS_COPY_DELETE_LOGICK } from '../../eos-dictionaries/consts/confirm.consts';
import { GraphQLService } from 'eos-dictionaries/services/graphQL.service';


export interface IDictionaryDescriptorRelatedInfo {
    table: string;
    order?: string;
    data?: any; /* additional data */
}
export abstract class AbstractDictionaryDescriptor {

    /**
     * decription of dictionary fields
     */
    relatedData: {};
    abstract record: RecordDescriptor;
    editOnlyNodes = false;
    readonly id: string;
    readonly title: string;
    readonly type: E_DICT_TYPE;
    readonly apiInstance: string;
    readonly hideTopMenu?: boolean;
    readonly showDeleted?: boolean;
    readonly fieldDefault?: string[];
    /**
     * rest metadata. can be used for loading related dictionaries
     */
    protected metadata: ITypeDef;
    /**
     * api service endpoint
     */
    protected apiSrv: PipRX;

    private _defaultOrder: string;
    private _allMetadata: any;


    get defaultOrder(): string {
        return this._defaultOrder || 'CLASSIF_NAME';
    }

    get dictionaryType(): E_DICT_TYPE {
        return this.type;
    }

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
        public graphQl?: GraphQLService,
    ) {
        if (descriptor) {
            this.id = descriptor.id;
            this.title = descriptor.title;
            this.type = descriptor.dictType;
            this.apiInstance = descriptor.apiInstance;
            this._defaultOrder = descriptor.defaultOrder;
            this.hideTopMenu = descriptor.hideTopMenu;
            this.editOnlyNodes = descriptor.editOnlyNodes;
            this.showDeleted = descriptor.showDeleted ? true : false;
            this.apiSrv = apiSrv;
            this.fieldDefault = descriptor.fieldDefault;
            commonMergeMeta(this);
            this._initRecord(descriptor);
        } else {
            return undefined;
        }
    }

    abstract addRecord(...params): Promise<IRecordOperationResult[]>;
    /** query: Запрос, order?: Сортировка, limit?: Сколько записей получить, skip?: Сколько записей пропустить */
    abstract getChildren(...params): Promise<any[]>;

    abstract getRoot(extension?): Promise<any[]>;

    abstract getSubtree(...params): Promise<any[]>;

    abstract onPreparePrintInfo(dec: FieldsDecline): Promise<any[]>;

    public async updatSev(str: string) {
        return await this.apiSrv.read<any>({SEV_ASSOCIATION: PipRX.criteries({ 'OBJECT_NAME': str })}); 
    }

    /** Получить все записи которые лежать внутри вершины дерева */
    getAllNodesInParents(departmentDue: string): Promise<any> {
        return Promise.resolve();
    }
    deleteTempRc() {
        throw new Error('Method not implemented.');
    }
    downloadFile(node: any): Promise<any> {
        return Promise.resolve();
    }
    getParentFor(arg0: any): any {
        return null;
    }
    getAllOwners() {
        return undefined;
    }
    public PKForEntity(v: string): string {
        const et = this.metadata;
        return this.apiInstance + ((et.properties[et.pk] === _T.s) ? ('(\'' + v + '\')') : ('(' + v + ')'));
    }
    getMetadata(): any {
        return this.metadata;
    }

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

        PipRX.invokeSop(chl, 'DELO_BLOB_SetDataContent', content, 'POST', false);

        return this.apiSrv.batchVariant(chl, '')
            .then((ids) => (ids[0] ? ids[0] : null));

    }



    deleteRecords(records: IEnt[]): Promise<IRecordOperationResult[]> {
        let result = Promise.resolve(null);
        const pDelete = records.map((record) => {
            result = result.then((ans) => {
                return this.deleteRecord(record);
            });
            return result;
        });
        return Promise.all(pDelete);
    }

    getTempISN(): number {
        return this.apiSrv.sequenceMap.GetTempISN();
    }

    getApiConfig(): IAppCfg {
        return this.apiSrv.getConfig();
    }

    merge(metadata: any) {
        this._allMetadata = metadata;
        this.metadata = metadata[this.apiInstance];
    }

    getBoss(departmentDUE: string): Promise<any> {
        return Promise.resolve(null);
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
                if(fld.foreignKey === "FROM"
                    || fld.foreignKey === "TO"
                    || fld.foreignKey === "OPERATION"
                    || fld.foreignKey === "USER_ISN") {
                    _criteries[fld.foreignKey] = data[fld.foreignKey];
                } else
                if (fld.foreignKey !== 'CODE' &&
                    fld.foreignKey !== 'DOP_REC' &&
                    fld.foreignKey !== 'DUE_DOCGROUP' &&
                    fld.foreignKey !== 'RULE_KIND' &&
                    fld.foreignKey !== 'ISN_CHANNEL' &&
                    fld.foreignKey !== 'SEV_PARTICIPANT_RULE.ISN_RULE') {
                    _criteries[fld.foreignKey] = '"' + data[fld.foreignKey].trim() + '"';
                } else if (fld.foreignKey === 'SEV_PARTICIPANT_RULE.ISN_RULE') {
                    _criteries[fld.foreignKey] = data[fld.foreignKey];
                } else {
                    _criteries[fld.foreignKey] = data[fld.foreignKey].trim();
                }
            }
        });
        return _criteries;
    }

    getNewRecord(preSetData: {}, parentNode?: EosDictionaryNode): {} {
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

    getRelated(rec: any, ..._args): Promise<any> {
        const reqs = [];
        this.metadata.relations.forEach((relation) => {
            if ((rec[relation.sf] || (relation.__type === 'DOCVID_CL' && typeof(rec[relation.sf]) === 'number')) && !relation.noDirectRead) {
                reqs.push(this.apiSrv
                    .read({
                        [relation.__type]: PipRX.criteries({[relation.tf]: rec[relation.sf] + ''})
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

    markBooleanData(records: any[], fieldName: string, boolValue, cascade = false): Promise<any[]> {
        records.forEach((record) => record[fieldName] = +boolValue);
        const changes = this.apiSrv.changeList(records);
        if (+boolValue === 0 && cascade) {
            /* const types = Array.from(new Set(records.map (r => r.__metadata.__type)).values()); */
            for (let i = 0; i < records.length; i++) {
                const element = records[i].__metadata.__type;
                if (element === 'DEPARTMENT') {
                    PipRX.invokeSop(changes, 'DepartmentCascade_TRule', {'due' : records[i]['DUE'], 'Dates': 0,  [fieldName]: +cascade});
                } else {
                    PipRX.invokeSop(changes, 'ClassifCascade_TRule', {'due' : records[i]['DUE'], 'type': records[i].__metadata.__type,  [fieldName]: +cascade});
                }
            }
        }
        return this.apiSrv.batch(changes, '');
    }

    search(criteries: any[], order?: string, limit?: number, skip?: number): Promise<any[]> {
        const _search = criteries.map((critery) => this.getData(PipRX.criteries(critery)));
        return Promise.all(_search)
            .then((results) => {
                return [].concat(...results)
            });
    }

    checkPreDelete(selectedNodes: EosDictionaryNode[]): Promise<any> {
        return Promise.resolve({continueDelete: true});
    }

    /**
     * @description Post chages from all conected dictionaries
     * @param originalData data before changes
     * @param updates changes
     * @returns Promise<any[]>
     */
    updateRecord(originalData: any, updates: any, appendToChanges: any = null): Promise<IRecordOperationResult[]> {
        const changeData = [];
        let pSev: Promise<boolean> = Promise.resolve(true);
        const results: IRecordOperationResult[] = [];
        Object.keys(updates).forEach((key) => {
            if (updates[key]) {
                const data = EosUtils.deepUpdate(originalData[key], updates[key]);
                switch (key) {
                    case 'sev': // do nothing handle sev later
                        pSev = this.presaveSevRoutine(data, originalData.rec, changeData, results);
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
                    case 'replace':
                        if (data && data['DUE']) {
                            if (!data._orig || !data._orig['DUE'] || data._State === _ES.Stub) {
                                data._State = _ES.Added;
                            }
                            changeData.push(data);
                        }
                        break;
                    case 'rec':
                        // if (data['CONTACT_List']) {
                        //     delete data['CONTACT_List'];
                        // }
                        changeData.push(data);
                        break;
                    case 'REESTR_NEW':
                        for (let i = 0; i < updates[key].length; i++) {
                            changeData.push(updates[key][i]);
                        }
                        break;
                    default: // do nothing

                }
            }
        });
        const record = EosUtils.deepUpdate(originalData.rec, updates.rec);
        return pSev.then((continueSave) => {
            let changes = this.apiSrv.changeList(changeData);
            if (appendToChanges) {
                changes = changes.concat(appendToChanges);
            }
            if (changes.length) {
                return this.apiSrv.batch(changes, '')
                    .then(() => {
                        results.push({success: true, record: record});
                        return results;
                    });
            } else {
                return results;
            }
        });
    }

    confirmSave(nodeData: EosDictionaryNode, confirmSrv, isNewRecord: boolean): Promise<boolean> {
        return Promise.resolve(true);
    }

    // getFullRelated(): Promise<any> {
    //     const reqs = [];
    //     this.metadata.relations.forEach((relation) => {
    //         reqs.push(this.apiSrv
    //             .read({[relation.__type]: []}));
    //     });
    //     return Promise.all(reqs)
    //         .then((responses) => {
    //             return this.associateRelationType(responses);
    //         });
    // }

    getRelatedFields2(tables: IDictionaryDescriptorRelatedInfo[], nodes: EosDictionaryNode[], loadAll: boolean, ignoreMetadata = false): Promise<any> {
        const reqs = [];
        const tablesWReq = [];
        tables.forEach( trec => {
            if (trec && trec.table) {
                if (loadAll) {
                    const md = this.metadata.relations.find( rel => trec.table === rel.__type);

                    if (md || ignoreMetadata) {
                        tablesWReq.push(trec.table);
                        const req: any = {[trec.table]: []};
                        if (trec.order) {
                            req.orderby = trec.order;
                        }
                        reqs.push(this.apiSrv
                            .read(req));
                    }
                } else if (nodes && nodes.length) {
                    const md = this.metadata.relations.find( rel => trec.table === rel.__type);
                    if (md) {
                        const pktype = this._allMetadata[md.__type].properties[md.tf];
                        const idset = new Set();
                        nodes.forEach ( node => {
                            const i = node.data.rec[md.sf];
                            if (i !== undefined && i !== null) {
                                if (pktype === 'i') {
                                    idset.add(Number(node.data.rec[md.sf]));
                                } else {
                                    idset.add(String(node.data.rec[md.sf]));
                                }
                            }
                        });
                        if (idset.size > 0) {
                            const uniq_ids = Array.from(idset);
                            tablesWReq.push(trec.table);
                            reqs.push(this.apiSrv
                                .read({[trec.table]: uniq_ids}));
                        }
                    }
                }
                if (trec.data && trec.data.req) /* table in table */{
                    // по ключам пока не умеем загружать.
                    const sev =  this.apiSrv.read<SEV_ASSOCIATION>({[trec.table]: PipRX.criteries(trec.data.req)});
                    tablesWReq.push(trec.table);
                    reqs.push(sev);
                }
            }
        });
        return Promise.all(reqs)
            .then((responses) => {
                if (tablesWReq.length) {
                    return this.associateRelationType(tablesWReq, responses);
                } else {
                    return [];
                }
            });
    }
    paste(slicedNodes: EosDictionaryNode[], dueTo: string, whenCopy?: string): Promise<any> {
        const change = [];
        let paramsSop = '';

        slicedNodes.forEach((node, i) => {
            i !== slicedNodes.length - 1 ? paramsSop += `${node.id},` : paramsSop += `${node.id}`;
        });
        const whenCopyCheck = this.apiInstance === 'DEPARTMENT' && whenCopy ? whenCopy : 'no_copy';
        PipRX.invokeSop(change, 'MoveClassif', { 'dueTo': dueTo, 'type': this.apiInstance, 'dues': paramsSop, 'weight': 1, 'whenCopy': whenCopyCheck}, 'POST', false);
        return this.apiSrv.batch(change, '');
    }

    combine(slicedNodes: EosDictionaryNode[], markedNodes: EosDictionaryNode[]): Promise<any> {
        const preSave = [];
        let paramsSop = '';
        let change: Array<any> = [{
            method: 'MERGE',
            requestUri: `${this.apiInstance}(${isNaN(markedNodes[0].id) ? '\'' + String(markedNodes[0].id) + '\'' : markedNodes[0].id})`,
            data: {
                DELETED: 1
            }
        }];
        slicedNodes.forEach((node, i) => {
            if (this.apiInstance !== 'RUBRIC_CL' && this.apiInstance !== 'REGION_CL') {
                preSave.push({
                    method: 'DELETE',
                    requestUri: `${this.apiInstance}(${isNaN(node.id) ? '\'' + String(node.id) + '\'' : node.id})`
                });
            }
            i !== slicedNodes.length - 1 ? paramsSop += `${node.id},` : paramsSop += `${node.id}`;
        });
        PipRX.invokeSop(change, 'ClassifJoin_TRule', { 'pk': markedNodes[0].id, 'type': this.apiInstance, 'ids': paramsSop }, 'POST', false);
        if (markedNodes[0].data['rec']['DELETED'] === 0) {
            preSave.push({
                method: 'MERGE',
                requestUri: `${this.apiInstance}(${isNaN(markedNodes[0].id) ? '\'' + String(markedNodes[0].id) + '\'' : markedNodes[0].id})`,
                data: {
                    DELETED: 0
                }
            });
        }
        change = change.concat(preSave);
        return this.apiSrv.batch(change, '');
    }
    getConfigOpenGopRc(flag: boolean, node: EosDictionaryNode, nodeId: string, mode?) {
        return null;
    }

    findTreeParent(data: CustomTreeNode[], id: any): any {
        return null;
    }
    checkNodesBeforeDeletion(selectedNodes, confirmSrv): Promise<any[]> {
        const sopData = {
            type: null,
            id: null,
        };
        selectedNodes.forEach((node) => {
            sopData.id = sopData.id ? `${sopData.id}|${node.id}` : node.id;
            if (!sopData.type) {
                try {
                    sopData.type = node.data.rec.__metadata.__type || sopData.type;
                } catch (e) {
                    sopData.type = null;
                }
            }
        });
        if (sopData.id && sopData.type) {
            const changes = [];
            PipRX.invokeSop(changes, 'IsClassifUse', sopData, 'POST', false);
            return this.apiSrv.batch(changes, '')
                .then((response: any) => {
                    if (response) {
                        const responseValue = response.length ? response[0].value : response.value;
                        const relatedDictionaries = responseValue && responseValue.length ? responseValue.split('|') : [];
                        if (relatedDictionaries.length) {
                            const deletingNodes = [];
                            const list = [];
                            selectedNodes.forEach((node, index) => {
                                if (relatedDictionaries[index]) {
                                    list.push(`${node.title} используется в ${relatedDictionaries[index]}`);
                                    node.isMarked = false;
                                } else {
                                    deletingNodes.push(node);
                                }
                            });
                            if (list.length) {
                                const warnDeletion: IConfirmWindow2 = Object.assign({}, WARN_ELEMENTS_ARE_RELATED, { bodyList: list });
                                return confirmSrv.confirm2(warnDeletion).then(() => {
                                    return deletingNodes;
                                });
                            }
                        }
                    }
                    return selectedNodes;
                });
        }
        return Promise.resolve(selectedNodes);
    }

    checknodeAfterPaste(selectedNodes, confirmSrv, dueTo?): Promise<{deletingNodes: any, warnDeletion: IConfirmWindow2}> {
        const sopData = {
            type: null,
            id: null,
        };
        selectedNodes.forEach((node) => {
            sopData.id = sopData.id ? `${sopData.id}|${node.id}` : node.id;
            if (!sopData.type) {
                try {
                    sopData.type = node.data.rec.__metadata.__type || sopData.type;
                } catch (e) {
                    sopData.type = null;
                }
            }
        });
        if (sopData.id && sopData.type) {
            const changes = [];
            PipRX.invokeSop(changes, 'IsClassifUse', sopData, 'POST', false);
            return this.apiSrv.batch(changes, '')
                .then((response: any) => {
                    if (response) {
                        const responseValue = response.length ? response[0].value : response.value;
                        const relatedDictionaries = responseValue && responseValue.length ? responseValue.split('|') : [];
                        if (relatedDictionaries.length) {
                            const deletingNodes = [];
                            const logicalDeletion = [];
                            const list = [];
                            selectedNodes.forEach((node, index) => {
                                if (relatedDictionaries[index]) {
                                    list.push(`${node.title} используется в ${relatedDictionaries[index]}`);
                                    logicalDeletion.push(node.data.rec);
                                    node.isMarked = false;
                                } else {
                                    deletingNodes.push(node);
                                }
                            });
                            if (list.length /* && (this.id !== 'departments' || dueTo !== selectedNodes[0]['parentId']) */) {
                                const warnDeletion: IConfirmWindow2 = Object.assign({}, WARN_ELEMENTS_COPY_DELETE_LOGICK, { bodyList: list });
                                if (logicalDeletion.length) {
                                    this.markBooleanData(logicalDeletion, 'DELETED', true, true).then(() => {
                                    });
                                }
                                return {deletingNodes: deletingNodes, warnDeletion: warnDeletion};
                            } else {
                                return {deletingNodes: selectedNodes, warnDeletion: undefined};
                            }
                        } else {
                            return {deletingNodes: selectedNodes, warnDeletion: undefined};
                        }
                    }
                    return {deletingNodes: selectedNodes, warnDeletion: undefined};
                }).catch(e => {
                    console.warn(e);
                    return {deletingNodes: selectedNodes, warnDeletion: undefined};
                });
        }
        return Promise.resolve(selectedNodes);
    }

    hasCustomTree() {
        return false;
    }

    getCustomTreeData(): Promise<CustomTreeNode[]> {
        return Promise.resolve(null);
    }

    getActive(): CustomTreeNode {
        return null;
    }

    // method for custom tree
    setRootNode(_nodeId: string): any {
    }

    extendCritery(critery: any, params: ISearchSettings, selectedNode: EosDictionaryNode) {
    }

    preCreateCheck(dict: DictionaryComponent): IMessage {
        return null;
    }

    defaultTreePath(data: CustomTreeNode[]): any {
        return null;
    }
    updateUncheckCitizen(node?: EosDictionaryNode[]): Promise<any> {
        return Promise.resolve();
    }
    loadNames(type, data): Promise<any> {
        return null;
    }
    readUserLists(query): Promise<any> {
        return null;
    }
    readDepartmentLists(query): Promise<any> {
        return null;
    }
    readCabinetLists(query): Promise<any> {
        return null;
    }
    /**
     * @method: setDepOrganiz
     * Необходим для СЭВ
     */
    setDepOrganiz(departments: DEPARTMENT[]): void {}

    presaveSevRoutine(sevData: SEV_ASSOCIATION, record: any, changeData: any[], results: IRecordOperationResult[]): Promise<boolean> {
        if (!Features.cfg.SEV.isIndexesEnable) {
            return Promise.resolve(true);
        }

        return this.checkSevIndexNew(sevData, record).then (sevResult => {
            if (sevResult) {
                if (sevResult.success) {
                    changeData.push(sevResult.record);
                    return Promise.resolve(true);
                } else {
                    sevResult.record = record;
                    results.push(sevResult);
                    return Promise.reject(sevResult);
                }
            }
            return Promise.resolve(true);
        });
    }
    updateDefaultValues(nodes: EosDictionaryNode[], closed?: string): Promise<any> {
        return Promise.resolve(null);
    }
    public ar_Descript(): Promise<any> {
        return Promise.resolve();
    }

    protected checkSevIndexNew(sevData: SEV_ASSOCIATION, record: any): Promise<IRecordOperationResult> {
        return this.apiSrv.read<SEV_ASSOCIATION>({SEV_ASSOCIATION: PipRX.criteries({OBJECT_NAME: this.apiInstance})})
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
                    const exist = sevs.find((existSev) => {
                        const existGlobSevId = existSev.GLOBAL_ID && existSev.GLOBAL_ID.trim().toUpperCase();
                        const newGlobSevId = sevData.GLOBAL_ID && sevData.GLOBAL_ID.trim().toUpperCase();
                        const existObjSevId = existSev.OBJECT_ID && existSev.OBJECT_ID.trim();
                        const newObjSevId = sevData.OBJECT_ID && sevData.OBJECT_ID.trim();

                        return existObjSevId !== newObjSevId && newGlobSevId === existGlobSevId;
                    });
                    if (exist) {
                        result.success = false;
                        result.error = new RestError({
                            isLogicException: true,
                            message: 'Для данного справочника уже существует индекс СЭВ с таким значением.'
                        });
                    }
                } else {
                    result = null;
                }
                return result;
            });
    }
    protected _postChanges(data: any, updates: any, appendToChanges: any = null ): Promise<any[]> {
        // console.log('_postChanges', data, updates);
        Object.assign(data, updates);
        let changes = this.apiSrv.changeList([data]);
        if (appendToChanges && appendToChanges.length) {
            changes = changes.concat(appendToChanges);
        }

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

    protected associateRelationType(tables: string[], responses: any[]): any {
        const related = {};
        tables.forEach((tab, idx) => {
            related[tab] = responses[idx];
        });

        this.relatedData = related;
        return related;
    }

}
