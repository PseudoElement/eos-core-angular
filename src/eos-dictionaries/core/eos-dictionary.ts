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
} from 'eos-dictionaries/interfaces';
import {AbstractDictionaryDescriptor} from './abstract-dictionary-descriptor';
import {EosDictionaryNode} from './eos-dictionary-node';

import {DictionaryDescriptorService} from 'eos-dictionaries/core/dictionary-descriptor.service';
import {OrganizationDictionaryDescriptor} from 'eos-dictionaries/core/organization-dictionary-descriptor';
import {EosUtils} from 'eos-common/core/utils';

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
            this.descriptor.id === 'sev-participant')) {
            const dOrganization = <OrganizationDictionaryDescriptor>this.dictDescrSrv.getDescriptorClass('organization');
            return dOrganization.getData([orgDue])
                .then(([organization]) => organization);
        } else {
            return Promise.resolve(null);
        }
    }

    canDo(action: E_RECORD_ACTIONS): boolean {
        return this.descriptor.record.canDo(action);
    }

    createRepresentative(newContacts: any[], node: EosDictionaryNode): Promise<IRecordOperationResult[]> {
        const orgDUE = node.data['organization']['DUE'];
        if (orgDUE) {
            const dOrganization = <OrganizationDictionaryDescriptor>this.dictDescrSrv.getDescriptorClass('organization');
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

        if (updateTree) {
            this._updateTree(nodes);
        }

        return nodes;
    }

    getFullNodeInfo(nodeId: string): Promise<EosDictionaryNode> {
        const existNode = this.getNode(nodeId);
        if (!existNode || !existNode.relatedLoaded) {
            return this.getNodeByNodeId(nodeId)
                .then((node) => this.getNodeRelatedData(node));
        } else {
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
        const nodeSet = this._getMarkedRecords(recursive);
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
                return this._resetMarked();
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
        return this.descriptor.deleteRecords(records).then (r => {
            this._nodes.forEach((node) => {
                if (node.isMarked) {
                    node.delete();
                    this._nodes.delete(node.id);
                }
            });
            this._resetMarked();
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
                const nodes = this.updateNodes(data, false);
                return Promise.all(nodes);
            });
    }

    searchByParentData(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        if (dictionary.id === 'departments') {
            const critery = {
                'DUE': node.id ? node.id : ''
            };
            return this.search([critery]);
        }
        return Promise.resolve([]);
    }

    getSearchCriteries(search: string, params: ISearchSettings, selectedNode?: EosDictionaryNode): any[] {
        if (this.id === 'departments' || this.id === 'rubricator') {
            const _criteries = [];
            const _crit: any = {
                'CL_SEARCH.Contents': '"*' + search + '*"'
            };
            this._extendCritery(_crit, params, selectedNode);
            _criteries.push(_crit);
            return _criteries;
        } else {
            const _searchFields = this.descriptor.record.getFieldSet(E_FIELD_SET.search);
            const _criteries = _searchFields.map((fld) => {
                const _crit: any = {
                    [fld.foreignKey]: '"' + search + '"'
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


    loadRelatedFieldsOptions(updatefields: IFieldView[]): Promise<any> {

        return this.descriptor.getRelatedFields(updatefields.filter(i => i.dictionaryId)
                                .map(i => i.dictionaryId ? i.dictionaryId : null))
            .then((related) => {
                updatefields.forEach((field) => {
                    if ((field.dictionaryId !== undefined)) {
                        field.options.splice(0, field.options.length);
                        const t = this.descriptor.getMetadata();
                        // Есть таблицы с PK integer и FK string (Nomencl_cl.security)
                        const type_fk = field.dictionaryLink ? t.properties[field.dictionaryLink.fk] : null;
                        const fn = (field.dictionaryLink ? field.dictionaryLink.pk : 'ISN_LCLASSIF');
                        const ln = (field.dictionaryLink ? field.dictionaryLink.label : 'CLASSIF_NAME');

                        related[field.dictionaryId].forEach((rel) => {
                            const el = {value: rel[fn], title: rel[ln], disabled: !!rel['DELETED'] };
                            if (type_fk === 's') {
                                el.value = String(el.value);
                            }

                            field.options.push(el);
                        });
                    }
                });
            });
    }

    getListView(customFields: IFieldView[]) {
        const fields = this.descriptor.record.getListView({});
        const infoFields = this.descriptor.record.getInfoView({});
        const updatefields = fields.concat(customFields).concat(infoFields);
        this.loadRelatedFieldsOptions(updatefields);
        return fields;
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
        } else if (this.descriptor.id === 'cabinet' && parent) {
            // fill cabinet related records with initial data
            EosUtils.setValueByPath(nodeData, 'rec.DUE', parent.data.rec['DUE']);
            EosUtils.setValueByPath(nodeData, 'department', parent.data.rec);
        }

        return nodeData;
    }

    reorderList(nodes: EosDictionaryNode[], subnodesCtrl: boolean, parentId?: string): EosDictionaryNode[] {
        return this._orderByField(nodes);
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
            if (this.descriptor.dictionaryType !== E_DICT_TYPE.linear) {
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
        this.root.title = this.descriptor.title;
        this.root.data.rec['DELETED'] = false;
        this.root.isExpanded = true;

        nodes.forEach((node) => {
            if (!node.parent && node !== this.root) {
                this.root.addChild(node);
            }
        });

        const treeOrderKey = this.root.getTreeView()[0];
        this.nodes.forEach((node) => {
            if (treeOrderKey && node.children && node.children.length > 0) {
                node.children = this._orderByField(node.children, { fieldKey: treeOrderKey.foreignKey, ascend: true });
            }
        });
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

    private _resetMarked() {
        this._nodes.forEach((node) => {
            if (node.isMarked) {
                node.isMarked = false;
            }
        });
    }

    private _extendCritery(critery: any, params: ISearchSettings, selectedNode?: EosDictionaryNode) {
        switch (this.descriptor.type) {
            case E_DICT_TYPE.department:
            case E_DICT_TYPE.organiz:
            case E_DICT_TYPE.tree: {
                if (params.mode === SEARCH_MODES.totalDictionary) {
                    // critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId.toString().split('.')[0] + '.%';
                } else if (params.mode === SEARCH_MODES.onlyCurrentBranch) {
                    critery['ISN_HIGH_NODE'] = selectedNode.data.rec['ISN_NODE'] + '';
                } else if (params.mode === SEARCH_MODES.currentAndSubbranch) {
                    const layer = selectedNode.originalId.toString().split('.').length - 1;
                    critery[selectedNode._descriptor.keyField.foreignKey] = selectedNode.originalId + '%';
                    critery['LAYER'] = layer + ':Null';
                }
                break;
            }
            case E_DICT_TYPE.custom: {
                this.descriptor.extendCritery(critery, params, selectedNode);
                break;
            }
        }
    }

    private _orderByField(nodes: EosDictionaryNode[], orderBy?: IOrderBy): EosDictionaryNode[] {
        const _orderBy = orderBy || this._orderBy; // DON'T USE THIS IN COMPARE FUNC!!! IT'S OTHER THIS!!!

        return nodes.sort((a: EosDictionaryNode, b: EosDictionaryNode) => {
            let _a = a.getFieldValueByName(_orderBy.fieldKey); // data.rec[_orderBy.fieldKey];
            let _b = b.getFieldValueByName(_orderBy.fieldKey); // data.rec[_orderBy.fieldKey];

            if (typeof(_a) === 'number' || typeof (_b) === 'number') {
                if (_a > _b) {
                    return _orderBy.ascend ? 1 : -1;
                }
                if (_a < _b) {
                    return _orderBy.ascend ? -1 : 1;
                }
                if (_a === _b) {
                    return 0;
                }
            }

            if (_a !== null && _a !== undefined) {
                _a = (_a + '').trim().toLowerCase();
            } else {
                _a = '';
            }

            if (_b !== null && _b !== undefined) {
                _b = (_b + '').trim().toLowerCase();
            } else {
                _b = '';
            }

            return (_orderBy.ascend ? 1 : -1) * _a.toString().localeCompare(_b.toString());
        });
    }

    private getNodeRelatedData(node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (node && !node.relatedLoaded) {
            switch (this.descriptor.id) {
                case 'departments':
                    // const orgDUE = node.getParentData('DUE_LINK_ORGANIZ', 'rec');
                    const orgDUE = node.data.rec.DUE_LINK_ORGANIZ;
                    return Promise.all([
                        this.descriptor.getRelated(node.data.rec, orgDUE),
                        this.descriptor.getRelatedSev(node.data.rec)
                    ]).then(([related, sev]) => {
                        node.data = Object.assign(node.data, related, { sev: sev });
                        node.relatedLoaded = true;
                        return node;
                    });
                case 'rubricator':
                    return this.descriptor.getRelatedSev(node.data.rec)
                        .then((sev) => {
                            node.data = Object.assign(node.data, { sev: sev });
                            node.relatedLoaded = true;
                            return node;
                        });
                default:
                    return this.descriptor.getRelated(node.data.rec)
                        .then((related) => {
                            if (node.dictionaryId === 'link') {
                                node.data = Object.assign(node.data, {PARE_LINK_Ref: related['PARE_LINK_Ref'][0]});
                            } else {
                                node.data = Object.assign(node.data, related);
                            }
                            node.relatedLoaded = true;
                            return node;
                        });
            }
        } else {
            return Promise.resolve(node);
        }
    }
}
