import {
    E_DICT_TYPE,
    E_FIELD_SET,
    E_FIELD_TYPE,
    E_RECORD_ACTIONS,
    IOrderBy,
    IRecordOperationResult,
    ISearchSettings,
    SEARCH_MODES,
    IFieldView,
} from '../../eos-dictionaries/interfaces';
import { AbstractDictionaryDescriptor, IDictionaryDescriptorRelatedInfo } from './abstract-dictionary-descriptor';
import { EosDictionaryNode } from './eos-dictionary-node';

import { DictionaryDescriptorService } from '../../eos-dictionaries/core/dictionary-descriptor.service';
import { OrganizationDictionaryDescriptor } from '../../eos-dictionaries/core/organization-dictionary-descriptor';
import { DocgroupDictionaryDescriptor } from '../../eos-dictionaries/core/docgroup-dictionary-descriptor';
import { EosUtils } from '../../eos-common/core/utils';
import { ISelectOption } from '../../eos-common/interfaces';
import { SECURITY_DICT } from '../../eos-dictionaries/consts/dictionaries/security.consts';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { ICONS_CONTAINER_SEV } from '../../eos-dictionaries/consts/dictionaries/_common';
import { _ES } from '../../eos-rest/core/consts';
import { EntityHelper } from '../../eos-rest/core/entity-helper';
import { PipRX } from '../../eos-rest';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

export const CUSTOM_SORT_FIELD = 'WEIGHT';
// import { CABINET_FOLDERS } from '../consts/dictionaries/cabinet.consts';

export class EosDictionary {
    descriptor: AbstractDictionaryDescriptor;
    root: EosDictionaryNode;
    private _nodes: Map<string, EosDictionaryNode>;

    private _orderBy: IOrderBy;
    private _showDeleted: boolean;
    private _dictionaries: { [key: string]: EosDictionary };

    get showDeleted(): boolean {
        return this._showDeleted;
    }

    set showDeleted(value: boolean) {
        this._showDeleted = value;
        this._nodes.forEach((node) => node.updateExpandable(value));
    }

    get id(): string {
        return this.descriptor.id;
    }

    get title(): string {
        return this.descriptor.title;
    }

    get nodes(): Map<string, EosDictionaryNode> {
        return this._nodes;
    }

    set orderBy(order: IOrderBy) {
        this._orderBy = order;
    }

    get orderBy() {
        return this._orderBy;
    }

    get canMarkItems(): boolean {
        return this.descriptor.record.canDo(E_RECORD_ACTIONS.markRecords);
    }
    get getAllOwners() {
        return this.descriptor.getAllOwners();
    }

    constructor(dictId: string, private dictDescrSrv: DictionaryDescriptorService) {
        const descriptor = dictDescrSrv.getDescriptorClass(dictId);
        if (descriptor) {
            this.descriptor = descriptor;
            this._nodes = new Map<string, EosDictionaryNode>();
            this._dictionaries = {};
            this.orderSetDefault();
            return this;
        } else {
            throw new Error('Словарь не поддерживается');
        }
    }

    public orderSetDefault() {
        this._orderBy = this.orderDefault();
    }

    public orderDefault() {
        return {
            ascend: true,
            fieldKey: this.descriptor.defaultOrder,
        };
    }

    isTreeType(): any {
        return this.descriptor.dictionaryType === E_DICT_TYPE.custom ||
            this.descriptor.dictionaryType === E_DICT_TYPE.tree ||
            this.descriptor.dictionaryType === E_DICT_TYPE.department;
    }


    unbindOrganization() {
        // todo: решить с data.__relfield
    }

    bindOrganization(orgDue: string): Promise<any> {
        if (orgDue && (this.descriptor.type === E_DICT_TYPE.department ||
            this.descriptor.id === E_DICTIONARY_ID.PARTICIPANT_SEV)) {
            const dOrganization = <OrganizationDictionaryDescriptor>this.dictDescrSrv.getDescriptorClass(E_DICTIONARY_ID.ORGANIZ);
            return dOrganization.getData([orgDue])
                .then(([organization]) => organization);
        } else {
            return Promise.resolve(null);
        }
    }

    bindDocGroups(dues: string): Promise<any> {
        const CRIT = PipRX.criteries({ 'DUE': dues});
        const DESCRIPTOR = <DocgroupDictionaryDescriptor>this.dictDescrSrv.getDescriptorClass('docgroup');
        return DESCRIPTOR.getData(CRIT).then(resp => resp);
    }

    unbindDocGroups() {
        // todo: решить с data.__relfield
    }

    canDo(action: E_RECORD_ACTIONS): boolean {
        return this.descriptor.record.canDo(action);
    }

    createRepresentative(newContacts: any[], node: EosDictionaryNode): Promise<IRecordOperationResult[]> {
        const orgDUE = node.data['organization']['DUE'];
        if (orgDUE) {
            const dOrganization = <OrganizationDictionaryDescriptor>this.dictDescrSrv.getDescriptorClass(E_DICTIONARY_ID.ORGANIZ);
            return dOrganization.addContacts(newContacts, orgDUE);
        } else {
            return Promise.resolve([<IRecordOperationResult>{
                record: newContacts[0],
                success: false,
                error: { message: 'Нет связанной организации.' }
            }]);
        }
    }

    getBoss(nodeData: any, parent: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (!parent) {
            parent = this.getNode(nodeData.rec.PARENT_DUE);
        }
        if (parent) {
            const boss = parent.children.find((chld) => !chld.isNode && chld.data.rec.POST_H === 1);
            return Promise.resolve(boss);
        } else {
            return this.descriptor.getBoss(nodeData.rec.PARENT_DUE)
                .then((boss) => {
                    if (boss) {
                        return new EosDictionaryNode(this, boss);
                    } else {
                        return null;
                    }
                });
        }
    }

    init(): Promise<EosDictionaryNode> {
        this._nodes.clear();
        return this.descriptor.getRoot()
            .then((data: any[]) => {
                this.updateNodes(data, true);
                return this.root;
            });
    }

    expandNode(nodeId: string): Promise<EosDictionaryNode> {
        const node = this._nodes.get(nodeId);
        if (node) {
            return this.descriptor.getSubtree(node.data.rec)
                .then((nodes) => {
                    this.updateNodes(nodes, true);
                    return node;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    updateNodeData(node: EosDictionaryNode, data: any, appendToChanges: any = null): Promise<IRecordOperationResult[]> {
        if (data) {
            return this.descriptor.updateRecord(node.data, data, appendToChanges)
                .then((_resp) => {
                    node.relatedLoaded = false;
                    node.updateData(data.rec);
                    return _resp;
                });
        } else {
            return Promise.resolve([]);
        }
    }

    updateNodes(data: any[], updateTree = false): EosDictionaryNode[] {
        const nodeIds: string[] = [];
        data.forEach((nodeData) => {
            if (nodeData) {
                const nodeId = nodeData[this.descriptor.record.keyField.foreignKey] + '';
                let _node = this._nodes.get(nodeId);
                if (_node) {
                    _node.relatedLoaded = false;
                    _node.updateData(nodeData);
                } else {
                    _node = new EosDictionaryNode(this, nodeData);
                    if (_node) {
                        this._nodes.set(_node.id, _node);
                    }
                }
                if (_node && nodeIds.findIndex((id) => id === _node.id) === -1) {
                    nodeIds.push(_node.id);
                }
            }
        });

        const nodes = nodeIds.map((id) => this._nodes.get(id))
            .filter((node) => !!node);

        if (updateTree /*|| this.id === 'docgroup'*/) {
            this._updateTree(nodes);
        }
        return nodes;
    }

    getFullNodeInfo(nodeId: string, refresh: boolean = false): Promise<EosDictionaryNode> {
        // TODO: обьеденить концепции getNodeRelatedData и loadRelatedFieldsOptions
        // const infoFields = this.descriptor.record.getInfoView({});
        // const updatefields = [].concat(infoFields);
        // const existNode = this.getNode(nodeId);
        // return this.loadRelatedFieldsOptions(updatefields, [existNode], false).then (() => {
        //     return existNode;
        // });

        const existNode = this.getNode(nodeId);
        if (!existNode || !existNode.relatedLoaded) {
            return this.getNodeByNodeId(nodeId)
                .then((node) => this.getNodeRelatedData(node, refresh));
        } else {
            // чтобы не грузить заново данные , перезаписываю _orig
            if (existNode.data.hasOwnProperty('sev')) {
                if (!existNode.data.sev.hasOwnProperty('_orig')) {
                    const sev = existNode.data.sev;
                    if (sev._State !== _ES.Added) {
                        sev._orig = EntityHelper.clone(sev);
                    }
                }
            }
            return Promise.resolve(existNode);
        }
        /*
        return this.getNodeByNodeId(nodeId)
            .then((node) => this.getNodeRelatedData(node));
        */

    }

    getNodeByNodeId(nodeId: string): Promise<EosDictionaryNode> {
        let id: any = nodeId;

        if (this.descriptor.record.keyField.type === E_FIELD_TYPE.number) {
            id = id * 1;
        }

        return this.descriptor.getRecord(id)
            .then((records) => {
                this.updateNodes(records, true);
                return this._nodes.get(nodeId);
            });
    }

    getNode(nodeId: string): /*Promise<*/EosDictionaryNode/*>*/ {
        const node = this._nodes.get(nodeId);
        /*
            if (this.descriptor.type !== E_DICT_TYPE.linear) {
                this.descriptor.getChildren(node.data.rec)
                    .then((nodes) => {
                        this.updateNodes(nodes, true);
                })
            }
        */
        // console.log('get node', this.id, nodeId, this._nodes, _res);
        return node;
    }

    addNode(node: EosDictionaryNode, parentId?: string): boolean {
        // console.log('createNewNode does nothing yet because newNode.id === undefined ');
        let _result = false;

        // check that node with specified id does not exist in this instance
        if (!this._nodes.has(node.id)) {
            this._nodes.set(node.id, node);
            if (!parentId) {
                const _parent: EosDictionaryNode = this._nodes.get(parentId); // ??

                if (_parent) {
                    _parent.addChild(node);
                    _result = true;
                }
            } else {
                if (node.parent) {
                    node.parent.addChild(node);
                } else {
                    this._nodes.get(parentId).addChild(node);
                }
            }
        }
        return _result;
    }

    /**
     * @description Set flag for marked records
     * @param fieldName db column, ec 'DELETED'
     * @param recursive do cascade operation, default false
     * @param value mark as 1 (true), unmarkmark as 0 (false)
     */
    setFlagForMarked(fieldName: string, recursive = false, value = true): Promise<any> {
        let flagReq = recursive;
        if (fieldName === 'DELETED' && (this.id === E_DICTIONARY_ID.DEPARTMENTS ||
            this.id === E_DICTIONARY_ID.RUBRICATOR ||
            this.id === E_DICTIONARY_ID.DOCGROUP)) {
                flagReq = false;
        }
        const nodeSet = this._getMarkedRecords(flagReq);
        // 1 - mark deleted
        // 0 - unmark deleted
        return this.descriptor.markBooleanData(nodeSet, fieldName, +value, recursive)
            .then(() => {
                // update nodes to reduce server req
                const marked = this.getMarkedNodes(value || recursive);
                if (marked) {
                    marked.forEach((node) => {
                        node.data.rec.DELETED = (+value);
                        node.data.rec._orig.DELETED = (+value); // force DELETED flag, because reload may doesn't referesh it
                    });
                }
                // return this._resetMarked();
            });
    }

    getAllChildren(node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        const layer = node.originalId.toString().split('.').length - 1;
        const critery = {
            [node._descriptor.keyField.foreignKey]: node.originalId + '%',
            ['LAYER']: layer + ':Null'
        };
        return this.search([critery]);
    }

    getChildren(node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        if (node) {
            return this.descriptor.getChildren(node.data.rec)
                .then((nodes) => {
                    const res = this.updateNodes(nodes, true);
                    node.updating = false;
                    return Promise.all(res);
                });
        } else {
            return Promise.resolve([]);
        }
    }

    getMarkedNodes(recursive = false): EosDictionaryNode[] {
        const nodes: EosDictionaryNode[] = [];
        this._nodes.forEach((node) => {
            if (node.isMarked) {
                nodes.push(node);
                if (recursive) {
                    node.getAllChildren().forEach((chld) => nodes.push(chld));
                }
            }
        });
        return nodes;
    }

    /**
     * @description Delete marked records from DB
     */
    deleteMarked(): Promise<IRecordOperationResult[]> {
        const records = this._getMarkedRecords();
        return this.descriptor.deleteRecords(records).then(r => {
            this._nodes.forEach((node) => {
                if (node.isMarked) {
                    if (node.children && node.children.length) {
                        const children = node.getAllChildren();
                        children.forEach((chNode) => {
                            chNode.delete();
                            this._nodes.delete(chNode.id);
                        });
                    }
                    node.delete();
                    this._nodes.delete(node.id);
                }
            });
            // this._resetMarked();
            return Promise.resolve(r);
        });
    }

    getDictionaryIdByMode(mode: number): EosDictionary {
        const dictId = this.descriptor.getIdByDictionaryMode(mode);
        if (!this._dictionaries[dictId]) {
            this._dictionaries[dictId] = new EosDictionary(dictId, this.dictDescrSrv);
        }
        return this._dictionaries[dictId];
    }


    search(criteries: any[]): Promise<EosDictionaryNode[]> {
        return this.descriptor
            .search(criteries)
            .then((data) => {
                const nodes = this.updateNodes(data, true);
                return Promise.all(nodes);
            });
    }

    searchByParentData(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        if (dictionary.id === E_DICTIONARY_ID.DEPARTMENTS) {
            const critery = {
                'DUE': node.id ? node.id : ''
            };
            return this.search([critery]);
        }
        return Promise.resolve([]);
    }

    getSearchCriteries(search: string, params: ISearchSettings, selectedNode?: EosDictionaryNode): any[] {
        if (this.id === E_DICTIONARY_ID.DEPARTMENTS || this.id === E_DICTIONARY_ID.RUBRICATOR) {
            const _criteries = [];
            const _crit: any = {
                'CL_SEARCH.Contents': search
            };
            this._extendCritery(_crit, params, selectedNode);
            _criteries.push(_crit);
            return _criteries;
        } else {
            const _searchFields = this.descriptor.record.getFieldSet(E_FIELD_SET.search);
            const _criteries = _searchFields.map((fld) => {
                const _crit: any = {
                    // [fld.foreignKey]: '%' + search + '%'
                    [fld.foreignKey]: String(search).replace(/ /g, '_'),
                };
                this._extendCritery(_crit, params, selectedNode);
                return _crit;
            });
            return _criteries;
        }
    }

    getFullsearchCriteries(data: any, params: ISearchSettings, selectedNode?: EosDictionaryNode): any {
        const _criteries = this.descriptor.getFullSearchCriteries(data);
        this._extendCritery(_criteries, params, selectedNode);
        return _criteries;
    }


    // getNodeUserOrder(nodeId: string): string[] {
    //     if (this._userOrder && this._userOrder[nodeId]) {
    //         return this._userOrder[nodeId];
    //     }
    //     return null;
    // }


    loadRelatedFieldsOptions(updatefields: IFieldView[], nodes: EosDictionaryNode[], loadAll: boolean): Promise<any> {
        const tablelist = updatefields.filter(i => i.dictionaryId)
            .map(i => i.dictionaryId ? <IDictionaryDescriptorRelatedInfo>{ table: i.dictionaryId, order: i.dictionaryOrder } : null);
        const tablesUniq = Array.from(new Set(tablelist));
        if (Features.cfg.SEV.isIndexesEnable && updatefields.findIndex(f => f.key === ICONS_CONTAINER_SEV) !== -1 && this.id !== 'organization') {
            tablesUniq.push(<IDictionaryDescriptorRelatedInfo>{ table: 'SEV_ASSOCIATION', data: { req: { OBJECT_NAME: this.descriptor.apiInstance } } });
        }

        return this.descriptor.getRelatedFields2(tablesUniq, nodes, loadAll)
            .then((related) => {
                const t = this.descriptor.getMetadata();
                updatefields.forEach((field) => {
                    if ((field.dictionaryId !== undefined)) {
                        field.options.splice(0, field.options.length);
                        // Есть таблицы с PK integer и FK string (Nomencl_cl.security)
                        const type_fk = field.dictionaryLink ? t.properties[field.dictionaryLink.fk] : null;
                        const fn = (field.dictionaryLink ? field.dictionaryLink.pk : 'ISN_LCLASSIF');
                        const ln = (field.dictionaryLink ? field.dictionaryLink.label : 'CLASSIF_NAME');

                        if (related && related[field.dictionaryId]) {
                            related[field.dictionaryId].forEach((rel) => {
                                const el: ISelectOption = { value: rel[fn], title: rel[ln], disabled: !!rel['DELETED'] };
                                if (type_fk === 's') {
                                    el.value = String(el.value);
                                }
                                el.data = related[field.dictionaryId];

                                field.options.push(el);
                            });
                        }
                    } else if (Features.cfg.SEV.isIndexesEnable && field.key === ICONS_CONTAINER_SEV && nodes.length) {
                        if (nodes && nodes.length && related && related['SEV_ASSOCIATION']) {
                            // this.descriptor.getRelatedSev(node.data.rec)
                            nodes.forEach(node => {
                                const id = node.data.rec['DUE'] || ('ISN#' + node.data.rec['ISN_LCLASSIF']);
                                const sev = related['SEV_ASSOCIATION'].find(s => s['OBJECT_ID'] === id);
                                if (sev) {
                                    node.data.sev = sev;
                                } else if (node.data.sev) {
                                    delete node.data.sev;
                                }
                            });

                        } else if(this.id === 'organization') {
                            nodes.forEach(node => {
                                node.data.sev = node.data.rec.sev;
                            })
                        }
                    }
                });
            });
    }

    getListViewWithRelated(customFields: IFieldView[], nodes: EosDictionaryNode[]): Promise<any> {
        const fields = this.descriptor.record.getListView({});
        const infoFields = this.descriptor.record.getInfoView({});
        const updatefields = fields.concat(customFields).concat(infoFields);
        return this.loadRelatedFieldsOptions(updatefields, nodes, false).then(() => {
            return fields;
        });
    }

    getEditDescriptor(): {} {
        return this.descriptor.record.getEditFieldDescription();
    }

    getNewNode(preSetData: {}, parent?: EosDictionaryNode): {} {
        const nodeData = this.descriptor.getNewRecord(preSetData, parent);

        if (this.descriptor.dictionaryType === E_DICT_TYPE.department && parent) {
            if (nodeData['rec']['IS_NODE'] === 0) {
                EosUtils.setValueByPath(nodeData, 'rec.DEPARTMENT_INDEX', parent.getParentData('DEPARTMENT_INDEX', 'rec'));
            } else {
                EosUtils.setValueByPath(nodeData, 'printInfo.GENDER', null);
            }
            EosUtils.setValueByPath(nodeData, 'rec.START_DATE', parent.getParentData('START_DATE', 'rec'));
            EosUtils.setValueByPath(nodeData, 'rec.END_DATE', parent.getParentData('END_DATE', 'rec'));
        } else if (this.descriptor.id === E_DICTIONARY_ID.CABINET && parent) {
            // fill cabinet related records with initial data
            EosUtils.setValueByPath(nodeData, 'rec.DUE', parent.data.rec['DUE']);
            EosUtils.setValueByPath(nodeData, 'department', parent.data.rec);
        }

        return nodeData;
    }

    reorderList(nodes: EosDictionaryNode[], subnodesCtrl: boolean, parentId?: string): EosDictionaryNode[] {
        this.treeResort();
        return this.orderNodesByField(nodes);
    }


    treeResort(): any {
        if (this.nodes && this.root) {

            const order = { fieldKey: CUSTOM_SORT_FIELD, ascend: true };
            if (this.orderBy.fieldKey !== CUSTOM_SORT_FIELD) {
                return;
                // const treeOrderKey = this.root.getTreeView()[0];
                // order.fieldKey = treeOrderKey.foreignKey;
            }

            // this.treeResort();
            // this.nodes.forEach((node) => {
            //     if (treeOrderKey && node.children && node.children.length > 0) {
            //         node.children = this.orderNodesByField(node.children, { fieldKey: /*treeOrderKey.foreignKey*/ 'WEIGTH', ascend: true });
            //     }
            // });

            this.nodes.forEach(n => {
                this.nodeChildResort(n, order);
            });
        }
    }

    nodeChildResort(n: EosDictionaryNode, orderBy?: IOrderBy): any {
        if (n.children && n.children.length) {
            n.children = this.orderNodesByField(n.children, orderBy);
            n.children.forEach(c => this.nodeChildResort(c));
        }
    }

    setVisibleTitleRoot() {
        this.root.title = this.descriptor.title;
        this.root.data.rec['DELETED'] = false;
        this.root.isExpanded = true;
    }

    public sortRegion(a: EosDictionaryNode, b: EosDictionaryNode, ask: boolean) {
        return String(a.data.rec._region ? a.data.rec._region['CLASSIF_NAME'] : '').localeCompare(b.data.rec._region ? b.data.rec._region['CLASSIF_NAME'] : '') * (ask ? 1 : -1);
    }
    public orderNodesByField(nodes: EosDictionaryNode[], orderBy?: IOrderBy): EosDictionaryNode[] {
        const _orderBy = orderBy || this._orderBy; // DON'T USE THIS IN COMPARE FUNC!!! IT'S OTHER THIS!!!
        let key: string = _orderBy.fieldKey;
        if (key === 'NOM_NUMBER' && this.id === E_DICTIONARY_ID.DID_NOMENKL_CL) {
            key = 'NOM_NUMBER_SORT';
        }
        return nodes.sort((a: EosDictionaryNode, b: EosDictionaryNode) => {
            if (_orderBy.fieldKey === 'DUE_REGION') {
                return this.sortRegion(a, b, _orderBy.ascend);
            }
            let _a = a.getFieldValueByName(key) || 0; // /*|| Number(a.id)*/ || '';
            let _b = b.getFieldValueByName(key) || 0; // /*|| Number(b.id)*/ || '';


            // if (_a === null) { _a = ''; }
            // if (_b === null) { _b = ''; }
            if (typeof _a !== typeof _b) {
                _a = _a || '';
                _b = _b || '';
            }
            if (_a === _b) {
                _a = Number(a.id) || a.id;
                _b = Number(b.id) || b.id;
            }

            let res = 0;
            switch (typeof _a) {
                case 'number':
                    res = // _a < 0 ?
                        // ((_a < _b && 1) || (_a > _b && -1) || 0) :
                        ((_a < _b && -1) || (_a > _b && 1) || 0);
                    break;
                case 'string':
                    if (!_a && !_b) {
                        res = 0;
                    } else if (!_a) {
                        res = 1;
                    } else if (!_b) {
                        res = -1;
                    } else {
                        res = _a.localeCompare(_b); // (_a < _b && -1) || (_a > _b && 1) || 0;
                    }
                    break;
            }

            return (res) * (_orderBy.ascend ? 1 : -1);
        });
    }
    private _updateTree(nodes: EosDictionaryNode[]) {
        /* build tree */
        nodes.forEach((_node) => {
            if (_node.parentId && _node.parentId !== _node.id) {
                const parent = this._nodes.get(_node.parentId);
                if (parent) {
                    parent.addChild(_node);
                }
            }
        });

        /* find root */
        if (!this.root) {
            let rootNode: EosDictionaryNode;
            // && this.id !== 'sev-collisions' добавил для справочника коллизии , так как справочник не иерархический и не определить id родителя стандартным способом
            if (this.descriptor.dictionaryType !== E_DICT_TYPE.linear && this.id !== E_DICTIONARY_ID.COLLISIONS_SEV) {
                rootNode = nodes.find((node) => node.parentId === null || node.parentId === undefined || node.id === node.parentId);
            }

            /* fallback if root undefined */
            if (!rootNode) {
                rootNode = new EosDictionaryNode(this, { IS_NODE: 0, POTECTED: 1 });
                rootNode.children = [];
                this._nodes.set(rootNode.id, rootNode);
            }

            this.root = rootNode;
        }
        /* force set title and visible for root */
        this.setVisibleTitleRoot();

        nodes.forEach((node) => {
            if (!node.parent && node !== this.root) {
                this.root.addChild(node);
            }
        });

        // const treeOrderKey = this.root.getTreeView()[0];
        this.treeResort();
        // this.nodes.forEach((node) => {
        //     if (treeOrderKey && node.children && node.children.length > 0) {
        //         node.children = this.orderNodesByField(node.children, { fieldKey: /*treeOrderKey.foreignKey*/ 'WEIGTH', ascend: true });
        //     }
        // });
        this._nodes.forEach((node) => node.updateExpandable(this._showDeleted));
    }

    /**
     * @description Prepare array of marked records for group operation
     * @param recursive if true adds all loaded children into array
     */
    private _getMarkedRecords(recursive = false): any[] {
        const records: any[] = [];

        this._nodes.forEach((node) => {
            if (node.isMarked) {
                if (recursive) {
                    node.getAllChildren().forEach((chld) => records.push(chld.data.rec));
                }
                records.push(node.data.rec);
            }
        });
        return records;
    }

    // private _resetMarked() {
    //     this._nodes.forEach((node) => {
    //         if (node.isMarked) {
    //             node.isMarked = false;
    //         }
    //     });
    // }

    private _extendCritery(critery: any, params: ISearchSettings, selectedNode?: EosDictionaryNode) {
        switch (this.descriptor.type) {
            case E_DICT_TYPE.department:
            case E_DICT_TYPE.organiz:
            case E_DICT_TYPE.tree: {
                if (params.mode === SEARCH_MODES.totalDictionary) {
                    // critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId.toString().split('.')[0] + '.%';
                    // Добавить критерий, чтобы не вытягивать "системных" ДЛ
                    // у которых DUE не "0."
                    if (this.id === E_DICTIONARY_ID.DEPARTMENTS) {
                        critery.LAYER = '1:null';
                        if (!critery.DUE) {
                            critery.DUE = '0.%';
                        }
                    }
                } else if (params.mode === SEARCH_MODES.onlyCurrentBranch) {
                    critery['ISN_HIGH_NODE'] = selectedNode.data.rec['ISN_NODE'] + '';
                } else if (params.mode === SEARCH_MODES.currentAndSubbranch) {
                    const layer = selectedNode.originalId.toString().split('.').length - 1;
                    critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId + '%';
                    critery['LAYER'] = layer + ':Null';
                }
                break;
            }
            case E_DICT_TYPE.linear:
                if (this.id === E_DICTIONARY_ID.CITIZENS) {
                    this.descriptor.extendCritery(critery, params, selectedNode);
                }
                break;
            case E_DICT_TYPE.custom: {
                this.descriptor.extendCritery(critery, params, selectedNode);
                break;
            }
        }
    }



    private getNodeRelatedData(node: EosDictionaryNode, refresh: boolean = false): Promise<EosDictionaryNode> {
        if (node && !node.relatedLoaded) {
            switch (this.descriptor.id) {
                case E_DICTIONARY_ID.RESOL_CATEGORY:
                case E_DICTIONARY_ID.STATUS_REPLY:
                case E_DICTIONARY_ID.REGION:
                return this.descriptor.getRelatedSev(node.data.rec).then((sev) => {
                    node.data = Object.assign(node.data, { sev: sev });
                    node.relatedLoaded = true;
                    return node;
                });
                case E_DICTIONARY_ID.DEPARTMENTS:
                    // const orgDUE = node.getParentData('DUE_LINK_ORGANIZ', 'rec');
                    const orgDUE = node.data.rec.DUE_LINK_ORGANIZ;
                    return Promise.all([
                        this.descriptor.getRelated(node.data.rec, orgDUE, refresh),
                        this.descriptor.getRelatedSev(node.data.rec)
                    ]).then(([related, sev]) => {
                        node.data = Object.assign(node.data, related, { sev: sev });
                        node.relatedLoaded = true;
                        return node;
                    });
                case SECURITY_DICT.id:
                case E_DICTIONARY_ID.RUBRICATOR:
                    return this.descriptor.getRelatedSev(node.data.rec)
                        .then((sev) => {
                            node.data = Object.assign(node.data, { sev: sev });
                            node.relatedLoaded = true;
                            return node;
                        });
                case E_DICTIONARY_ID.LINK:
                    return Promise.all([
                        this.descriptor.getRelated(node.data.rec, orgDUE),
                        this.descriptor.getRelatedSev(node.data.rec)
                    ]).then(([related, sev]) => {
                        node.data = Object.assign(node.data, { PARE_LINK_Ref: related['PARE_LINK_Ref'][0] }, { sev: sev });
                        node.relatedLoaded = true;
                        return node;
                    });
                case E_DICTIONARY_ID.PARTICIPANT_SEV:
                    return Promise.all([this.descriptor.getRelated(node.data.rec)]).then(([related]) => {
                        node.data = Object.assign(node.data, related);
                        node.relatedLoaded = true;
                        return node;
                    });

                default:
                    return this.descriptor.getRelated(node.data.rec)
                        .then((related) => {
                            // if (node.dictionaryId === 'link') {

                            //     node.data = Object.assign(node.data, {PARE_LINK_Ref: related['PARE_LINK_Ref'][0]});
                            // } else {
                            node.data = Object.assign(node.data, related);
                            node.data.allOwner = this.getAllOwners;
                            // }
                            node.relatedLoaded = true;
                            return node;
                        });
            }
        } else {
            return Promise.resolve(node);
        }
    }
}
