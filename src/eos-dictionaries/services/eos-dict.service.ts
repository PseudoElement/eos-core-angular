import { DICTIONARIES } from 'eos-dictionaries/consts/dictionaries.consts';
import { DEPARTMENTS_DICT } from './../consts/dictionaries/department.consts';
import { DOCGROUP_DICT } from './../consts/dictionaries/docgroup.consts';
import { Injectable, } from '@angular/core';
// import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

import {EosDictionary, CUSTOM_SORT_FIELD} from '../core/eos-dictionary';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {
    E_DICT_TYPE,
    IDictionaryDescriptor,
    IDictionaryViewParameters,
    IFieldView,
    IOrderBy,
    IRecordOperationResult,
    // ISearchSettings,
    SEARCH_MODES,
    SearchFormSettings,
    ISearchSettings,
} from 'eos-dictionaries/interfaces';
import {EosUtils} from 'eos-common/core/utils';
import {FieldsDecline} from 'eos-dictionaries/interfaces/fields-decline.inerface';
import {IPaginationConfig} from '../node-list-pagination/node-list-pagination.interfaces';
import {IImage} from 'eos-dictionaries/interfaces/image.interface';
import {LS_PAGE_LENGTH, PAGES} from '../node-list-pagination/node-list-pagination.consts';
import {WARN_NO_ORGANIZATION, WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE, WARN_SEARCH_NOTFOUND} from '../consts/messages.consts';
import {EosMessageService} from 'eos-common/services/eos-message.service';
import {EosStorageService} from 'app/services/eos-storage.service';
import {EosDepartmentsService} from './eos-department-service';
import {RestError} from 'eos-rest/core/rest-error';
import {DictionaryDescriptorService} from 'eos-dictionaries/core/dictionary-descriptor.service';
import {IAppCfg} from 'eos-common/interfaces';
import {CabinetDictionaryDescriptor} from '../core/cabinet-dictionary-descriptor';
import { CONFIRM_CHANGE_BOSS } from '../consts/confirm.consts';
import {ConfirmWindowService} from 'eos-common/confirm-window/confirm-window.service';
import { ReestrtypeDictionaryDescriptor } from '../core/reestrtype-dictionary-descriptor';
import { _ES } from '../../eos-rest/core/consts';
import { EosAccessPermissionsService, APS_DICT_GRANT } from './eos-access-permissions.service';
import { PARTICIPANT_SEV_DICT } from 'eos-dictionaries/consts/dictionaries/sev/sev-participant';
import { CABINET_DICT } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';
import { NOMENKL_DICT } from 'eos-dictionaries/consts/dictionaries/nomenkl.const';
import { PipRX } from 'eos-rest';
import { NADZOR_DICTIONARIES } from 'eos-dictionaries/consts/dictionaries/nadzor.consts';
import { STORAGE_WEIGHTORDER } from 'app/consts/common.consts';
import { SEV_DICTIONARIES } from 'eos-dictionaries/consts/dictionaries/sev/folder-sev.consts';

export const SORT_USE_WEIGHT = true;
export const SEARCH_INCORRECT_SYMBOLS = new RegExp('["|\']', 'g');

export class MarkedInformation {
    get anyMarked(): boolean { return (this.nodes && this.nodes.length > 0); }
    get allUnMarked(): boolean { return (this.nodes && this.nodes.length === 0); }
    // allOnPageMarked: boolean = false;
    nodes: EosDictionaryNode[] = [];
    clear(): any {
        this.nodes = [];
        // this.allOnPageMarked = false;
    }
}

@Injectable()
export class EosDictService {
    viewParameters: IDictionaryViewParameters;
    currentNode: EosDictionaryNode;
    currentTab: number;

    public editFromForm: boolean;
    // private dictionary: EosDictionary;
    private _treeNode: EosDictionaryNode; // record selected in tree
    private _listNode: EosDictionaryNode; // record selected in list
    private _currentList: EosDictionaryNode[];
    private _visibleListNodes: EosDictionaryNode[];
    private _bufferNodes: EosDictionaryNode[];
    private paginationConfig: IPaginationConfig;
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _treeNode$: BehaviorSubject<EosDictionaryNode>;
    private _listNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _visibleList$: BehaviorSubject<EosDictionaryNode[]>;
    private _markInfo$: BehaviorSubject<MarkedInformation>;
    private _viewParameters$: BehaviorSubject<IDictionaryViewParameters>;
    private _paginationConfig$: BehaviorSubject<IPaginationConfig>;
    private _mDictionaryPromise: Map<string, Promise<EosDictionary>>;
    private _srchCriteries: any[];
    private _srchParams: ISearchSettings;
    private _customFields: any;
    private _customTitles: any;
    private _dictMode = 0;
    private _dictMode$: BehaviorSubject<number>;
    private _dictionaries: EosDictionary[];
    private _listDictionary$: BehaviorSubject<EosDictionary>;
    private filters: any = {};
    private _cDue: string;
    private _currentScrollTop = 0;
    private _weightOrdered: boolean;
    private _currentMarkInfo: MarkedInformation = new MarkedInformation();
    private _treeNodeId: string;


    /* Observable dictionary for subscribing on updates in components */
    get dictionary$(): Observable<EosDictionary> {
        return this._dictionary$.asObservable();
    }

    get dictMode$(): Observable<number> {
        return this._dictMode$.asObservable();
    }

    get listNode(): EosDictionaryNode {
        return this._listNode;
    }

    get listDictionary$(): Observable<EosDictionary> {
        return this._listDictionary$.asObservable();
    }

    /* Observable treeNode for subscribing on updates in components */
    get treeNode$(): Observable<EosDictionaryNode> {
        return this._treeNode$.asObservable();
    }

    /* Observable openNode for subscribing on updates in components */
    get openedNode$(): Observable<EosDictionaryNode> {
        return this._listNode$.asObservable();
    }

    get currentList$(): Observable<EosDictionaryNode[]> {
        return this._currentList$.asObservable();
    }

    get viewParameters$(): Observable<IDictionaryViewParameters> {
        return this._viewParameters$.asObservable();
    }

    get paginationConfig$(): Observable<IPaginationConfig> {
        return this._paginationConfig$.asObservable();
    }

    get visibleList$(): Observable<EosDictionaryNode[]> {
        return this._visibleList$.asObservable();
    }

    get markInfo$(): Observable<MarkedInformation> {
        return this._markInfo$.asObservable();
    }

    get userOrdered(): boolean {
        return this._weightOrdered;
        // return this.currentDictionary && this.currentDictionary.weightOrdered;
    }

    set userOrdered(value: boolean) {
        this._weightOrdered = value;
    }

    get treeNodeTitle(): any {
        return this._treeNode.title;
    }

    get order() {
        return this.currentDictionary.orderBy;
    }

    get dictionaryTitle(): string {
        return this._dictionaries[0].title;
    }

    get customFields(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customFieldsList');
        const dictionary = this.currentDictionary;
        if (_storageData && dictionary) {
            this._customFields = _storageData;
            const stored: [] = this._customFields[dictionary.id];
            if (stored && stored.length) {
                const allList = dictionary.descriptor.record.getCustomListView({});
                const fies = stored.map( s => allList.find( a => a.key === s)).filter( s => !!s);
                return fies;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    get customTitles(): IFieldView[] {
        const _storageData = this._storageSrv.getItem('customTitles');
        const dictionary = this.currentDictionary;
        if (_storageData && dictionary) {
            this._customTitles = _storageData;
            if (this._customTitles[dictionary.id]) {
                return this._customTitles[dictionary.id];
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    get currentScrollTop(): number {
        return this._currentScrollTop;
    }

    set currentScrollTop(mode: number) {
        this._currentScrollTop = mode;
    }

    set customFields(val: IFieldView[]) {
        const dictionary = this.currentDictionary;
        if (!this._customFields) {
            this._customFields = {};
        }
        this._customFields[dictionary.id] = val.map((record) => record.key);
        this._storageSrv.setItem('customFieldsList', this._customFields, true);
    }

    set customTitles(val: IFieldView[]) {
        const dictionary = this.currentDictionary;
        if (!this._customTitles) {
            this._customTitles = {};
        }
        this._customTitles[dictionary.id] = val;
        this._storageSrv.setItem('customTitles', this._customTitles, true);
    }

    get dictMode(): number {
        return this._dictMode;
    }

    get currentDictionary(): EosDictionary {
        return this._dictionaries[this._dictMode];
    }

    get bufferNodes(): EosDictionaryNode[] {
        return this._bufferNodes;
    }


    constructor(
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _descrSrv: DictionaryDescriptorService,
        private departmentsSrv: EosDepartmentsService,
        private confirmSrv: ConfirmWindowService,
        private _eaps: EosAccessPermissionsService,
        private _apiSrv: PipRX,
    ) {
        this._initViewParameters();
        this._dictionaries = [];
        this._treeNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._listNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._listDictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._mDictionaryPromise = new Map<string, Promise<EosDictionary>>();
        this._currentList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._viewParameters$ = new BehaviorSubject<IDictionaryViewParameters>(this.viewParameters);
        this._paginationConfig$ = new BehaviorSubject<IPaginationConfig>(null);
        this._visibleList$ = new BehaviorSubject<EosDictionaryNode[]>([]);
        this._markInfo$ = new BehaviorSubject<MarkedInformation>(this._currentMarkInfo);
        this._dictMode = 0;
        this._dictMode$ = new BehaviorSubject<number>(this._dictMode);
        this._initPaginationConfig();
        this._weightOrdered = !!this._storageSrv.getItem(STORAGE_WEIGHTORDER);
    }

    getDescr(dictionaryId: string): IDictionaryDescriptor {
        for (let i = 0; i < DICTIONARIES.length; i++) {
            const dict = DICTIONARIES[i];
            if (dict.id === dictionaryId) {
                return dict;
            }
        }
        for (let i = 0; i < NADZOR_DICTIONARIES.length; i++) {
            const dict = NADZOR_DICTIONARIES[i];
            if (dict.id === dictionaryId) {
                return dict;
            }
        }

        for (let i = 0; i < SEV_DICTIONARIES.length; i++) {
            const dict = SEV_DICTIONARIES[i];
            if (dict.id === dictionaryId) {
                return dict;
            }
        }

        return null;
    }

    storeDBWeights(dict: EosDictionary, changeList: {}): Promise<any> {

        const changes = [];

        const weightField = /* dict.id === CABINET_DICT.id ? 'ORDER_NUM' :*/ 'WEIGHT';

        for (const id in changeList) {
            if (changeList.hasOwnProperty(id)) {
                const value = changeList[id];
                const key = dict.descriptor.PKForEntity(id);
                changes.push ({
                    method: 'MERGE',
                    data: { [weightField]: String(value) },
                    requestUri: key,
                });
            }
        }

        if (changes && changes.length) {

            return this._apiSrv.batch(changes, '')
                .then(() => {
                    // this._msgSrv.addNewMessage(SUCCESS_SAVE);
                })
                .catch((err) => {
                    this._msgSrv.addNewMessage({ msg: err.message, type: 'danger', title: 'Ошибка записи' });
                });
        }

        return Promise.resolve(null);
    }

    getDueForNode (node: EosDictionaryNode): string {
        if (!node || !node.dictionary.isTreeType()) {
            return null;
        }
        const id = node.dictionary.id;
        if (id === CABINET_DICT.id) {
            return node.data.department['DUE'];
        } else if (id === DEPARTMENTS_DICT.id) {
            return node.parentId;
        } else if (id === NOMENKL_DICT.id) {
            return node.data.rec['DUE'];
        } else {
            return node.parentId;
        }

        // Variation for node grant is included
        // if (id === CABINET_DICT.id) {
        //     return node.data.department['DUE'];
        // } else if (id === DEPARTMENTS_DICT.id) {
        //     return node.id;
        // } else if (id === NOMENKL_DICT.id) {
        //     return node.data.rec['DUE'];
        // }
        // return null;

    }

    getDueForTree(dictid: string) {
        if (!this._treeNode) {
            return null;
        }
        if (dictid === CABINET_DICT.id) {
            return this._treeNode.id;
        } else if (dictid === DEPARTMENTS_DICT.id) {
            return this._treeNode.id;
        } else if (dictid === NOMENKL_DICT.id) {
            return this.getCustomNodeId();
        } else {
            return this._treeNode.id;
        }
        return null;
    }

    clearCurrentNode() {
        this.currentNode = null;
    }

    unbindOrganization () {
        this.currentDictionary.unbindOrganization();
    }

    bindOrganization(orgDue: string) {
        if (orgDue && this.currentDictionary) {
            return this.currentDictionary.bindOrganization(orgDue);
        } else {
            return Promise.resolve(null);
        }
    }

    createRepresentative(): Promise<IRecordOperationResult[]> {
        const dictionary = this.currentDictionary;
        if (dictionary && this._treeNode) {
            this.updateViewParameters({updatingList: true});

            return dictionary.getFullNodeInfo(this._treeNode.id)
                .then((_fullData) => {
                    const _represData: any[] = [];
                    if (_fullData && _fullData.data && _fullData.data.organization['ISN_NODE']) {
                        this._visibleListNodes.forEach((_node) => {
                            if (_node.isMarked && _node.data.rec['IS_NODE']) {
                                _represData.push({
                                    SURNAME: _node.data.rec['SURNAME'],
                                    DUTY: _node.data.rec['DUTY'],
                                    PHONE: _node.data.rec['PHONE'],
                                    PHONE_LOCAL: _node.data.rec['PHONE_LOCAL'],
                                    E_MAIL: _node.data.rec['E_MAIL'],
                                    SEV: _node.data.sev ? _node.data.sev['GLOBAL_ID'] : null, // not sure
                                    ISN_ORGANIZ: _fullData.data.organization['ISN_NODE'],
                                    DEPARTMENT: _fullData.data.rec['CLASSIF_NAME']
                                });
                            }
                        });
                    } else {
                        this._msgSrv.addNewMessage(WARN_NO_ORGANIZATION);
                    }
                    return _represData;
                })
                .then((represData) => {
                    if (represData.length) {
                        return dictionary.createRepresentative(represData, this._treeNode);
                    } else {
                        this._msgSrv.addNewMessage(WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE);
                        return [];
                    }
                })
                .then((res) => {
                    this.updateViewParameters({updatingList: false});
                    return res;
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve([]);
        }
    }

    getApiConfig(): IAppCfg {
        const dictionary = this.currentDictionary;
        if (dictionary) {
            return dictionary.descriptor.getApiConfig();
        } else {
            return null;
        }
    }

    getCabinetOwners(departmentDue: string): Promise<any[]> {
        return this.getDictionaryById('cabinet')
            .then((dictionary) => {
                const descriptor: CabinetDictionaryDescriptor = <CabinetDictionaryDescriptor>dictionary.descriptor;
                return descriptor.getOwners(departmentDue);
            })
            .catch((err) => this._errHandler(err));
    }

    getFilterValue(filterName: string): any {
        return this.filters.hasOwnProperty(filterName) ? this.filters[filterName] : null;
    }

    getMarkedNodes(recursive = false): EosDictionaryNode[] {
        if (!this.currentDictionary) {
            return [];
        }
        if (recursive) {
            return this.currentDictionary.getMarkedNodes(recursive);
        } else {
            return this._visibleListNodes.filter( n => n.isMarked);
        }
    }

    setMarkAllVisible(emit: boolean = true): void {
        this._currentMarkInfo.nodes = this._visibleListNodes;
        this._currentMarkInfo.nodes.forEach( n => n.isMarked = true);
        if (emit) {
            this.updateMarked(false);
        }
    }

    setMarkAllNone(emit: boolean = true): void {
        if (this._currentList) {
            this._currentList.forEach( n => {n.isMarked = false; n.isSliced = false; } );
        }
        this._currentMarkInfo.nodes = [];

        if (emit) {
            this.updateMarked(false);
        }

    }

    setMarkForNode(item: EosDictionaryNode, isMarked: boolean, emit: boolean): void {
        if (item.isMarked === isMarked) {
            return;
        }

        item.isMarked = isMarked;

        this._currentMarkInfo.nodes = this.getMarkedNodes(false);

        if (emit) {
            // todo: to info component
            if (isMarked) {
                this.openNode(item.id).then(() => {
                });
            } else {
                const selectedCount = this._currentMarkInfo.nodes.length;
                this.openNode(selectedCount ? this._currentMarkInfo.nodes[0].id : '').then(() => {});
            }
            this.updateMarked();
        }
    }

    updateMarked(recalcMarked: boolean = false): void {
        if (recalcMarked) {
            this._currentMarkInfo.nodes = this.getMarkedNodes();
        }
        this._markInfo$.next(this._currentMarkInfo);
    }

    isDataChanged(data: any, original: any): boolean {
        const dictionary = this._dictionaries[this._dictMode];
        if (dictionary) {
            return dictionary.descriptor.isDiffer(data, original);
        }
        return false;
    }

    // May be need used always instead this._viewParameters$.next();
    // Because this.viewParametrs is and may be changed from other classes need way for share state
    updateViewParameters(updates?: any) {
        if ( updates && updates.hasOwnProperty('userOrdered') ) {
            this.userOrdered = updates.userOrdered;
            const dictionary = this.currentDictionary;
            if (dictionary) {
                if (this.userOrdered) {
                    dictionary.orderBy = {
                        fieldKey: CUSTOM_SORT_FIELD,
                        ascend: true,
                    };
                } else {
                    dictionary.orderSetDefault();
                }
            }
        }

        let changes = false;
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                const value = updates[key];
                if (value !== this.viewParameters[key]) {
                    this.viewParameters[key] = value;
                    changes = true;
                }
            }
        }
        // Object.assign(this.viewParameters, updates);
        if (changes) {
            this._viewParameters$.next(this.viewParameters);
        }
    }

    /**
     * Change pagination configuration and share state
     * @param config configuration pagination
     */
    changePagination(config: IPaginationConfig) {
        Object.assign(this.paginationConfig, config);
        this.setMarkAllNone(true);
        this._updateVisibleNodes();
        this._paginationConfig$.next(this.paginationConfig);
    }

    getAllDictionariesList(deskId): Promise<IDictionaryDescriptor[]> {
        let allDicts = this._descrSrv.visibleDictionaries();
        if (deskId !== 'system') {
            allDicts = allDicts.concat(this._descrSrv.visibleNadzorDictionaries());
            allDicts = allDicts.concat(this._descrSrv.visibleSevDictionaries());
        }
        return Promise.resolve(allDicts);
    }

    getDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._descrSrv.visibleDictionaries());
    }

    getNadzorDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._descrSrv.visibleNadzorDictionaries());
    }

    getSevDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._descrSrv.visibleSevDictionaries());
    }

    defaultOrder() {
        this.currentDictionary.orderSetDefault();
        this._reorderList(this.currentDictionary);
    }

    closeDictionary() {
        this._treeNode = this._listNode = this._srchCriteries = null;
        this._initViewParameters();
        this._dictMode = 0;
        this._dictMode$.next(0);
        this._dictionaries = [];
        this._viewParameters$.next(this.viewParameters);
        this._currentList = [];
        this._currentList$.next([]);
        this._visibleList$.next([]);
        this._currentMarkInfo.clear();
        this._markInfo$.next(this._currentMarkInfo);
        this._listNode$.next(null);
        this._treeNode$.next(null);
        this._dictionary$.next(null);
        this._listDictionary$.next(null);
        this.currentNode = null;
        this.filters = {};
    }

    dictionaryByMode(mode: number): EosDictionary {
        return this._dictionaries[0].getDictionaryIdByMode(mode);
    }

    openDictionary(dictionaryId: string): Promise<EosDictionary> {
        if (this._dictionaries[0] && this._dictionaries[0].id === dictionaryId) {
            return Promise.resolve(this._dictionaries[0]);
        } else {
            this.updateViewParameters({showDeleted: false});
            if (this._dictionaries[0]) {
                this.closeDictionary();
            }
            return this._openDictionary(dictionaryId);
        }
    }

    expandNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this._treeNode.id === nodeId) {
            this.updateViewParameters({updatingList: true});
        }
        return this._dictionaries[0].expandNode(nodeId)
            .then((val) => {
                this.updateViewParameters({updatingList: false});
                return val;
            })
            .catch((err) => this._errHandler(err));
    }

    /**
     * @description Mark node selected in tree, updale current list
     * @param nodeId node ID to be selected
     * @returns selected node in current dictionary
     */

    selectTreeNode(nodeId: string): Promise<EosDictionaryNode> {
        let p = Promise.resolve(this._treeNode);
        if (nodeId) {
            if (!this._treeNode || this._treeNode.id !== nodeId) {
                this.updateViewParameters({updatingList: true});
                p = this.getTreeNode(nodeId);
            }
        } else {
            const dictionary = this._dictionaries[0];
            if (dictionary && dictionary.root) {
                this.updateViewParameters({updatingList: true});
                p = this.loadChildren(dictionary, dictionary.root);
            } else {
                p = Promise.resolve(null);
            }
        }
        return p
            .then((node) => {
                if (node) {
                    let parent = node.parent;
                    while (parent) {
                        parent.isExpanded = true;
                        parent = parent.parent;
                    }
                }
                this._selectTreeNode(node);
                return node;
            }).then((n) => {
                if (this.dictMode !== 0) {
                    this._reloadList().then(() => {
                        this.updateViewParameters({updatingList: false});
                    });
                } else {
                    this.updateViewParameters({updatingList: false});
                }
                return n;
            })
            .catch(err => this._errHandler(err));
    }

    // temporary fix
    selectCustomTreeNode(nodeId: string): Promise<EosDictionaryNode> {
        let p;
        const dictionary = this._dictionaries[0];
        if (dictionary && dictionary.root) {
            this.updateViewParameters({updatingList: true});
            p = Promise.resolve(dictionary.root);
        } else {
            p = Promise.resolve(null);
        }
        return p
            .then((node) => {
                if (this._treeNodeId !== nodeId) {
                    // this.resetSearch();
                    this._srchCriteries = null;
                    this._treeNodeId = nodeId;
                }
                if (node) {
                    let parent = node.parent;
                    while (parent) {
                        parent.isExpanded = true;
                        parent = parent.parent;
                    }
                }


                this._selectTreeNode(node);
                return node;
            }).then((n) => {
                // this._setCurrentList(dictionary, n, true);
                this._reloadList().then(() => {
                    this.updateViewParameters({updatingList: false});
                });
                return n;
            })
            .catch(err => this._errHandler(err));
    }

    selectTemplateNode() {
        const dictionary = this._dictionaries[0];
        this._selectTreeNode(dictionary.root);
        this._reloadList().then(() => {
            this.updateViewParameters({updatingList: false});
        });
        return Promise.resolve();
    }

    openNode(nodeId: string): Promise<EosDictionaryNode> {
        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (nodeId === '') {
                this._openNode(null);
                return Promise.resolve(null);
            }
            if (!this._listNode || this._listNode.id !== nodeId) {
                this.updateViewParameters({updatingInfo: false});
                return dictionary.getFullNodeInfo(nodeId).then((node) => {
                    if (node) {
                        this._openNode(node);
                    }
                    return Promise.resolve(node);
                }).catch(error => {
                    this._errHandler(error);
                    return Promise.resolve(this._listNode);
                });
            } else {
                return Promise.resolve(this._listNode);
            }
        } else {
            return Promise.resolve(null);
        }
    }

    isRoot(nodeId: string): boolean {
        const dictionary = this.currentDictionary;
        return dictionary.root && dictionary.root.id === nodeId;
    }

    updateNode(node: EosDictionaryNode, data: any): Promise<any> {
        return this.getDictionaryById(node.dictionaryId)
            .then((dictionary) => {
                let resNode: EosDictionaryNode = null;
                return this._preSave(dictionary, data, false)
                    .then((appendChanges) => {
                        return dictionary.updateNodeData(node, data, appendChanges);
                    })
                    .then((results) => {
                        const keyFld = dictionary.descriptor.record.keyField.foreignKey;
                        results.forEach((res) => {
                            res.record = dictionary.getNode(res.record[keyFld] + '');
                            if (!res.success) {
                                this._msgSrv.addNewMessage({
                                    type: 'warning',
                                    title: res.record.title,
                                    msg: res.error.message
                                });
                            } else {
                                resNode = dictionary.getNode(node.id);
                            }
                        });
                    })
                    .then(() => this._reloadList())
                    .then(() => resNode);
            })
            .catch((err) => {
                if (err === 'cancel') {
                    return Promise.reject('cancel');
                } else if (err && err.error instanceof RestError) {
                    return Promise.reject(err);
                }
                this._errHandler(err);
                return Promise.reject(err);
            });
    }

    addNode(data: any): Promise<EosDictionaryNode> {
        const dictionary = this.currentDictionary;

        if (this._treeNode) {
            return this._preSave(dictionary, data, true)
                .then((appendChanges) => {
                    return dictionary.descriptor.addRecord(data, this._treeNode.data, appendChanges);
                })
                .then((results) => {
                    this.updateViewParameters({updatingList: true});
                    return this._reloadList(true)
                        .then(() => {
                            this.updateViewParameters({updatingList: false});
                            if (dictionary.descriptor.type !== E_DICT_TYPE.linear &&
                                dictionary.descriptor.type !== E_DICT_TYPE.custom) {
                                this._treeNode$.next(this._treeNode);
                                const keyFld = dictionary.descriptor.record.keyField.foreignKey;

                                results.forEach((res) => {
                                    res.record = dictionary.getNode(res.record[keyFld] + '');
                                    if (!res.success) {
                                        this._msgSrv.addNewMessage({
                                            type: 'warning',
                                            title: res.record ? res.record.title : '',
                                            msg: res.error.message
                                        });
                                    }
                                });
                                if (results[0] && results[0].success) {
                                    return results[0].record;
                                } else {
                                    return null;
                                }
                            }
                        });
                })
                .catch((err) => {
                    if (err === 'cancel') {
                        return Promise.reject('cancel');
                    } else if (err && err.error instanceof RestError) {
                        return Promise.reject(err);
                    }
                    this._errHandler(err);
                    return Promise.reject(err);
                });
        } else {
            return Promise.reject('No selected node');
        }
    }

    errHandler(err: RestError | any) {
        return this._errHandler(err);
    }

    toggleAllSubnodes(): Promise<EosDictionaryNode[]> {
        this.updateViewParameters({
            updatingList: true,
            showAllSubnodes: !this.viewParameters.showAllSubnodes,
            searchResults: false
        });


        this.setMarkAllNone();
        this._srchCriteries = null;
        return this._reloadList()
            .then((val) => {
                this.updateViewParameters({updatingList: false});
                return val;
            })
            .catch(err => this._errHandler(err));
    }

    /**
     * @description Marks or unmarks record as deleted
     * @param fieldName db column for mark, ec 'DELETED'
     * @param recursive true if need to delete with children, default false
     * @param value true - mark as 1, false - unmark as 0
     * @returns Promise<boolean>
     */
    setFlagForMarked(fieldName: string, recursive = false, value = true): Promise<boolean> {
        if (this.currentDictionary) {
            this.updateViewParameters({updatingList: true});
            return this.currentDictionary.setFlagForMarked(fieldName, recursive, value)
                .then(() => this._reloadList())
                .then(() => {
                    this.updateViewParameters({updatingList: false});
                    this.setMarkAllNone();
                    this.openNode('');
                    return true;
                })
                .catch((err) => this._reloadList().then(() => this._errHandler(err)));
        } else {
            return Promise.resolve(false);
        }
    }

    /**
     * @description Delete marked nodes from dictionary
     */
    deleteMarked(): Promise<IRecordOperationResult[]> {
        if (this.currentDictionary) {
            this.updateViewParameters({updatingList: true});
            return this.currentDictionary.deleteMarked()
                .then((results) => {
                    // let success = true;
                    results.forEach((result) => {
                        if (result.error) {
                            if (result.error.code !== 434) {
                                this._msgSrv.addNewMessage({
                                    type: 'warning',
                                    title: 'Ошибка удаления "' + result.record['CLASSIF_NAME'] + '"',
                                    msg: result.error.message
                                });
                                // success = false;
                            } else {
                                throw result.error;
                            }
                        }
                    });
                    return this._reloadList()
                        .then(() => {
                            this.updateViewParameters({updatingList: false});
                            return results;
                        });
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }


    resetSearch(): Promise<any> {
        this._srchCriteries = null;
        this.setMarkAllNone();
        return this._reloadList();
    }

    isSearchEnabled(): boolean {
        return !!this._srchCriteries;
    }

    isSearchFullDictionary(): boolean {
        return this._srchParams ? this._srchParams.mode === SEARCH_MODES.totalDictionary : false;
    }

    quickSearch (settings: SearchFormSettings): Promise<EosDictionaryNode[]> {
        const dictionary = this.currentDictionary;
        const fixedString = settings.quick.data.replace(SEARCH_INCORRECT_SYMBOLS, '');
        if (fixedString !== '') {
            this._srchCriteries = dictionary.getSearchCriteries(fixedString, settings.opts, this._treeNode);
            this._srchParams = settings.opts;
            return this._search(settings.opts.deleted);
        } else {
            return Promise.resolve(null);
        }
    }

    setFilter(filter: any) {
        if (filter) {
            Object.assign(this.filters, filter);
            this._updateVisibleNodes();
            // this._reloadList();
        }
    }

    fullSearch(data: any, params: ISearchSettings) {

        try {
            this.fixSearchSymbols(data);
        } catch (e) {
        }


        const dictionary = this.currentDictionary;
        if (data.srchMode === 'person') {
            this._srchCriteries = [dictionary.getFullsearchCriteries(data, params, this._treeNode)];
            this._srchCriteries.push(dictionary.getFullsearchCriteries(data, params, this._treeNode));
            return this._search(params.deleted);
        } else {
            this._srchCriteries = [dictionary.getFullsearchCriteries(data, params, this._treeNode)];
            return this._search(params.deleted);
        }
    }

    fixSearchSymbols(data: any): any {
        for (const key in data) {
            if (key !== 'srchMode' && data.hasOwnProperty(key)) {
                const list = data[key];
                if (typeof list === 'string') {
                    data[key] = list.replace(SEARCH_INCORRECT_SYMBOLS, '');
                } else {
                    for (const k in list) {
                        if (list.hasOwnProperty(k)) {
                            const fixed = list[k] && list[k].replace(SEARCH_INCORRECT_SYMBOLS, '');
                            list[k] = fixed;
                        }
                    }
                }
            }
        }
    }

    getFullNode(dictionaryId: string, nodeId: string): Promise<EosDictionaryNode> {
        return this.getDictionaryById(dictionaryId)
            .then((dictionary) => dictionary.getFullNodeInfo(nodeId))
            .then((node) => this.currentNode = node)
            .catch((err) => this._errHandler(err));
    }

    orderBy(orderBy: IOrderBy, clearUserOrder = true) {

        if (this.currentDictionary) {
            this.currentDictionary.orderBy = orderBy;
            if (clearUserOrder) {
                if (this.viewParameters.userOrdered) {
                    this.toggleWeightOrder(false);
                    this.currentDictionary.orderBy = orderBy;
                }
            }
            this._reorderList(this.currentDictionary);
        }
    }

    toggleWeightOrder(value?: boolean) {
        this.setMarkAllNone();

        this.updateViewParameters({
            userOrdered: (value === undefined) ? !this.viewParameters.userOrdered : value
        });

        this._storageSrv.setItem(STORAGE_WEIGHTORDER, !!this.viewParameters.userOrdered, true);

        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (this.viewParameters.userOrdered) {
                dictionary.orderBy = {
                    fieldKey: CUSTOM_SORT_FIELD,
                    ascend: true,
                };
            } else {
                dictionary.orderSetDefault();
            }
        }
        this._reorderList(dictionary);
    }

    setDictMode(mode: number): boolean {
        const dictId = this._dictionaries[0].getDictionaryIdByMode(mode).id;

        const access = this._eaps.isAccessGrantedForDictionary(dictId, null) !== APS_DICT_GRANT.denied;

        if (access) {
            this._dictMode = mode;
            this._srchCriteries = null;
            if (!this._dictionaries[mode]) {
                this._dictionaries[mode] = this._dictionaries[0].getDictionaryIdByMode(mode);
            }
            this._dictMode$.next(this._dictMode);
            this._reloadList();
            this.toggleWeightOrder(this._weightOrdered);
        }
        return access;
    }


    setUserOrder(ordered: EosDictionaryNode[]) {

        const _original = [];
        const _move = {};

        this._currentList.forEach((node) => {
            const _oNode = ordered.find((item) => item.id === node.id);
            if (_oNode) {
                _original.push(node);
            }
        });

        _original.forEach((node, idx) => {
            _move[node.id] = ordered[idx];
        });

        this._reorderList(this.currentDictionary);
    }

    toggleDeleted() {
        this.setMarkAllNone();

        this.viewParameters.showDeleted = !this.viewParameters.showDeleted;

        if (this.currentDictionary) {
            this.currentDictionary.showDeleted = this.viewParameters.showDeleted;
        }

        if (!this.viewParameters.showDeleted) {
            this._currentList.forEach((node) => {
                if (node.isDeleted) {
                    node.isMarked = false;
                }
            });
        }
        this._updateVisibleNodes();
        this.updateViewParameters();
    }

    isUnique(val: string, path: string, inDict = false): { [key: string]: any } {
        let records: EosDictionaryNode[] = [];
        let valid = true;
        if ('string' === typeof val) {
            val = val.trim().toLowerCase();
        }
        if (val) {
            if (inDict) {
                records = Array.from(this.currentDictionary.nodes.values());
            } else {
                if (this._treeNode) {
                    if ((this.currentDictionary.id === this._treeNode.dictionaryId) && this.currentDictionary.id !== 'cabinet') {
                        records = this._treeNode.children;
                    } else {
                        // cabinet costyl
                        records = Array.from(this.currentDictionary.nodes.values());
                        const due = this._treeNode.id;
                        records = records.filter(r => r.data.rec['DUE'] === due );
                    }
                } else if (this.currentNode) {
                    records = this.currentNode.neighbors;
                }
            }

            records = records.filter((node) => !this.currentNode || node.id !== this.currentNode.id);

            valid = records.findIndex((node) => {
                let recVal = EosUtils.getValueByPath(node.data, path);
                if ('string' === typeof recVal) {
                    recVal = recVal.trim().toLowerCase();
                }
                return recVal === val;
            }) === -1;
        }
        return valid ? null : {'isUnique': !valid};
    }

    uploadImg(img: IImage): Promise<number> {
        return this.currentDictionary.descriptor.addBlob(img.extension, img.data)
            .catch(err => this._errHandler(err));
    }

    inclineFields(fields: FieldsDecline): Promise<any[]> {
        return this._dictionaries[0].descriptor.onPreparePrintInfo(fields)
            .catch((err) => this._errHandler(err));
    }

    setCustomNodeId(_nodeId: string) {
        this._cDue = _nodeId;
    }

    getCustomNodeId() {
        return this._cDue;
    }

    fillBufferNodes() {
        this._bufferNodes = this.getMarkedNodes(false);
    }

    updateVisibleList(): any {
        this.changePagination(this.paginationConfig);
    }

    isPaginationVisible(): boolean {
        return this.paginationConfig && this.paginationConfig.itemsQty > 10;
    }
    public cutNode(): any { // справочник граждане - action ВЫРЕЗАТЬ -->
        const markedNodes: EosDictionaryNode[] =  this.getMarkedNodes();
        markedNodes.forEach((node: EosDictionaryNode) => {
            node.isSliced = !node.isSliced;
        });
    }
    public combine(slicedNodes, markedNodes): Promise<any> {
        return this.currentDictionary.descriptor.combine(slicedNodes, markedNodes).then(() => {
            this._msgSrv.addNewMessage({ type: 'success', title: 'Сообщение', msg: 'Объединение завершенно' });
            this.reload();
        }).catch(e => {
            this._msgSrv.addNewMessage({ type: 'danger', title: 'Ошибка', msg: e.message });
        });
    }
    public uncheckNewEntry() {
        this.currentDictionary.descriptor.updateUncheckCitizen(this.getMarkedNodes()).then(() => {
            this._reloadList();
        });

    }


    rereadNode(nodeId: any): Promise<any>  {
        return this._apiSrv
        .read({
            DOCGROUP_CL: PipRX.criteries({'DUE': nodeId}),
            foredit: true,
        })
        .then(([]) => {



        // return this.descriptor.getRecord(nodeId)
            // .then((records) => {
                // this.updateNodes(records, true);
                // return this._nodes.get(nodeId);
            // });
        });
    }

    public checkPreDelete(selectedNodes: EosDictionaryNode[]): Promise<boolean> {
        return this.currentDictionary.descriptor.checkPreDelete(selectedNodes);
    }

    public getStoredSearchSettings(): SearchFormSettings {
        const res = this._storageSrv.getItem('lastSearchSetting');
        return res ? res : new SearchFormSettings;
    }

    public setStoredSearchSettings(data: SearchFormSettings) {
        this._storageSrv.setItem('lastSearchSetting', data);
    }
    public reload() {
        this._reloadList();
    }

    private getDictionaryById(id: string): Promise<EosDictionary> {
        const existDict = this._dictionaries.find((dictionary) => dictionary && dictionary.id === id);
        if (existDict) {
            return Promise.resolve(existDict);
        } else {
            return this.openDictionary(id);
        }
    }

    private _fixCurrentPage() {
        // this.paginationConfig.itemsQty = this._getAllListLength();
        this.paginationConfig.itemsQty = this._getListLength();
        const maxPage = Math.max(1, Math.ceil(this.paginationConfig.itemsQty / this.paginationConfig.length));
        this.paginationConfig.start = Math.min(this.paginationConfig.start, maxPage);
        this.paginationConfig.current = Math.min(this.paginationConfig.current, maxPage);
        this._paginationConfig$.next(this.paginationConfig);
    }

    private _getListLength(): number {
        return (this._visibleListNodes) ? this._visibleListNodes.length : 0;
    }

    private _initViewParameters() {
        this.viewParameters = {
            showAllSubnodes: false,
            showDeleted: false,
            userOrdered: false,
            markItems: false,
            searchResults: false,
            updatingInfo: false,
            updatingList: false,
            hideTopMenu: false,
            tableCustomization: false,
        };
        this._bufferNodes = [];
    }

    /**
     * Initial pagination configuration
     */
    private _initPaginationConfig(update = false) {
        this.paginationConfig = Object.assign(this.paginationConfig || {start: 1, current: 1}, {
            length: this._storageSrv.getItem(LS_PAGE_LENGTH) || PAGES[0].value,
            itemsQty: this._getListLength()
        });

        if (update) {
            this._updateVisibleNodes();
            // this._fixCurrentPage();
        } else {
            this.paginationConfig.current = 1;
            this.paginationConfig.start = 1;
            this._paginationConfig$.next(this.paginationConfig);
        }
    }

    private loadChildren(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (dictionary) {
            return dictionary.getChildren(node)
                .then(() => node)
                .then (() => {
                    return node;
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }

    private _openDictionary(dictionaryId: string): Promise<EosDictionary> {
        let _p: Promise<EosDictionary> = this._mDictionaryPromise.get(dictionaryId);
        if (!_p) {
            // this._dictMode = 0;
            try {
                this._dictionaries[0] = new EosDictionary(dictionaryId, this._descrSrv);
            } catch (e) {
                return Promise.reject(e);
            }
            if (this._dictionaries[0]) {
                this.updateViewParameters({updatingList: true});
                _p = this._dictionaries[0].init()
                    .then(() => {
                        this._initViewParameters();
                        this._initPaginationConfig();
                        this.updateViewParameters({
                            // userOrdered: this._storageSrv.getUserOrderState(this._dictionaries[0].id),
                            userOrdered: this.userOrdered,
                            markItems: this._dictionaries[0].canMarkItems,
                            updatingList: false,
                            // tableCustomization: true,
                        });
                        // this._dictionaries[0].initUserOrder(
                        //     this.viewParameters.userOrdered,
                        //     this._storageSrv.getUserOrder(this._dictionaries[0].id)
                        // );
                        this._mDictionaryPromise.delete(dictionaryId);
                        this._dictionary$.next(this._dictionaries[0]);
                        return this._dictionaries[0];
                    })
                    .catch((err) => {
                        this.closeDictionary();
                        this._mDictionaryPromise.delete(dictionaryId);
                        return this._errHandler(err);
                    });
                this._mDictionaryPromise.set(dictionaryId, _p);
            } else {
                _p = Promise.reject({message: 'Unknown dictionary "' + dictionaryId + '"'});
            }
        }
        return _p;
    }


    private _preSave(dictionary: EosDictionary, data: any, isNewRecord: boolean): Promise<any> {
        if (data && data.sev) {
            // console.log("TCL: data.sev", data.sev)
        }

        if (data && data.rec) {
            if (dictionary.id === PARTICIPANT_SEV_DICT.id) {

            }

            if (!isNewRecord && dictionary.id === DOCGROUP_DICT.id) {
                return Promise.resolve(data._appendChanges || null);
            }

            if (dictionary.id === DEPARTMENTS_DICT.id && data.rec.IS_NODE) {
                this.departmentsSrv.addDuty(data.rec.DUTY);
                this.departmentsSrv.addFullname(data.rec.FULLNAME);
                if (1 * data.rec.POST_H === 1) {
                    let parent: EosDictionaryNode = null ;
                    if (this._treeNode && ((!data.rec.PARENT_DUE) || (this._treeNode.id === data.rec.PARENT_DUE))) {
                        parent = this._treeNode;
                    }
                    return dictionary.getBoss(data, parent)
                        .then((boss) => {
                            if (boss && boss.id !== data.rec.DUE) {
                                const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
                                const CLASSIF_NAME = data.rec['SURNAME'] + ' - ' + data.rec['DUTY'];
                                changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['CLASSIF_NAME']);
                                changeBoss.body = changeBoss.body.replace('{{newPersone}}', CLASSIF_NAME);

                                return this.confirmSrv.confirm(changeBoss)
                                    .then((confirm: boolean) => {
                                        if (confirm) {
                                            boss.data.rec['POST_H'] = 0;
                                            return Promise.resolve(this._apiSrv.changeList([boss.data.rec]));
                                        } else {
                                            data.rec['POST_H'] = 0;
                                            return Promise.reject('cancel');
                                        }
                                    });
                            }
                        });
                }
            }

            if (dictionary.id === 'region') {
                const params = {deleted: true, mode: SEARCH_MODES.totalDictionary};
                const _srchCriteries = dictionary.getSearchCriteries(data.rec['CLASSIF_NAME'], params, this._treeNode);

                return dictionary.descriptor.search(_srchCriteries)
                    .then((nodes: any[]) =>
                        nodes.find((el: any) =>
                            el['CLASSIF_NAME'].toString().toLowerCase() === data.rec.CLASSIF_NAME.toString().toLowerCase()
                            && data.rec.DUE !== el.DUE))
                    .then((node: EosDictionaryNode) => {
                        if (node) {
                            return Promise.reject('Запись с этим именем уже существует!');
                        } else {
                            return null;
                        }
                    });
            }
            if (dictionary.id === 'reestrtype') {
                if (!data.rec._orig || (data.rec['ISN_DELIVERY'] === data.rec._orig['ISN_DELIVERY'].toString())) {
                    return Promise.resolve(null);
                }
                const reestrDesriptor = dictionary.descriptor as ReestrtypeDictionaryDescriptor;
                return reestrDesriptor.getDependentRecords(data.rec).then(recs => {
                    if (!recs || recs.length === 0) {
                        return Promise.resolve(null);
                    }
                    data['REESTR_NEW'] = [];
                    for (let i = 0; i < recs.length; i++) {
                        data['REESTR_NEW'].push({
                            'ISN_REESTR': recs[i]['ISN_REESTR'],
                            'ISN_DELIVERY': data.rec['ISN_DELIVERY'],
                            __metadata: {__type: 'REESTR_NEW'},
                            _State: _ES.Modified,
                            _orig: {
                                'ISN_REESTR': recs[i]['ISN_REESTR'],
                                'ISN_DELIVERY': recs[i]['ISN_DELIVERY'],
                                __metadata: {__type: 'REESTR_NEW'}
                            }
                        });
                    }
                });
            }
        }
        return Promise.resolve(null);
    }

    private getTreeNode(nodeId: string): Promise<EosDictionaryNode> {
        const dictionary = this._dictionaries[0];
        if (dictionary) {
            const _node = dictionary.getNode(nodeId);
            let p: Promise<EosDictionaryNode>;
            if (_node) {
                p = this.loadChildren(dictionary, _node);
            } else {
                p = dictionary.getNodeByNodeId(nodeId)
                    .then((node) => this.loadChildren(dictionary, node));
            }
            return p.catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }

    private _setCurrentList(dictionary: EosDictionary, nodes: EosDictionaryNode[], update = false) {
        this._currentList = nodes || [];
        if (dictionary) {
            // remove duplicates
            this._currentList = this._currentList.filter((item, index) => this._currentList.lastIndexOf(item) === index);
            // hide root node
            if (dictionary.root) {
                this._currentList = this._currentList.filter((item) => item.id !== dictionary.root.id);
            }
        }
        this._initPaginationConfig(update);
        this._emitListDictionary();
        this._reorderList(dictionary);
    }

    private _reorderList(dictionary: EosDictionary) {
        if (dictionary) {
            if (/* !this.viewParameters.searchResults && */ this.viewParameters.userOrdered && this._treeNode) {
                this._currentList = dictionary.reorderList(this._currentList, this.viewParameters.showAllSubnodes, this._treeNode.id);
            } else {
                this._currentList = dictionary.reorderList(this._currentList, this.viewParameters.showAllSubnodes);
            }
        }
        this._currentList$.next(this._currentList);
        this._updateVisibleNodes();
    }

    private _updateVisibleNodes() {
        this._visibleListNodes = this._currentList;
        if (this._visibleListNodes) {
            if (!this.viewParameters.showDeleted) {
                this._visibleListNodes = this._visibleListNodes.filter((node) => node.isVisible(this.viewParameters.showDeleted));
            }

            this._visibleListNodes = this._visibleListNodes.filter((node) => node.filterBy(this.filters));

            this._fixCurrentPage();

            const page = this.paginationConfig;
            const pageList = this._visibleListNodes.slice((page.start - 1) * page.length, page.current * page.length);
            const lastTimeMarked = pageList.find( n => n === this._listNode);
            if (!lastTimeMarked || !lastTimeMarked.isMarked) {
                const firstMarkedIndex = pageList.findIndex((node) => node.isMarked);
                if (firstMarkedIndex < 0) {
                    this._openNode(null);
                } else {
                    this._openNode(pageList[firstMarkedIndex]);
                }
            }
            this._visibleListNodes = pageList;
            this._visibleList$.next(pageList);
            this.updateMarked(true);
        }
    }



    private _openNode(node: EosDictionaryNode) {
        if (this._listNode !== node) {
            this._listNode = node;
            this._listNode$.next(node);
        }
    }

    private _reloadList(afterAdd = false): Promise<any> {
        let pResult = Promise.resolve([]);
        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (this._srchCriteries) {
                if (!afterAdd) {
                    pResult = dictionary.search(this._srchCriteries);
                } else {
                    pResult = Promise.resolve(this._currentList);
                }
            } else if (this._dictMode !== 0) {
                pResult = dictionary.searchByParentData(this._dictionaries[0], this._treeNode);
            } else if (this.viewParameters.showAllSubnodes) {
                pResult = dictionary.getAllChildren(this._treeNode);
            } else {
                this.viewParameters.searchResults = false;
                pResult = dictionary.getChildren(this._treeNode);
            }
        }

        return pResult
            .then((list) => this._setCurrentList(dictionary, list, true))
            .catch((err) => this._errHandler(err));
    }

    private _selectTreeNode(node: EosDictionaryNode) {
        if (this._treeNode !== node) {
            this._srchCriteries = null;

            if (this._treeNode) {
                if (this._treeNode.children) {
                    this._treeNode.children.forEach((child) => child.isMarked = false);
                }
                this._treeNode.isActive = false;
            }
            this._treeNode = node;
            if (node) {
                node.isActive = true;
                this._setCurrentList(this.currentDictionary, node.children);
            }
            this._openNode(null);
            this._treeNode$.next(node);
            this.updateViewParameters({
                showAllSubnodes: false,
                searchResults: false
            });
        }
        if (this._currentList === undefined) {
            if (node) {
                this._setCurrentList(this.currentDictionary, node.children);
            } else {
                this._setCurrentList(this.currentDictionary, []);
            }
        }
    }

    /*
    private selectTreeRoot(): EosDictionaryNode {
        let node: EosDictionaryNode = null;
        const dictionary = this._dictionaries[0];
        if (dictionary && dictionary.root) {
            node = dictionary.root;
        }
        this._selectTreeNode(node);
        return node;
    }
    */

    private _search(showDeleted = false): Promise<EosDictionaryNode[]> {
        this._openNode(null);
        this.updateViewParameters({
            updatingList: true
        });
        const dictionary = this.currentDictionary;
        return dictionary.search(this._srchCriteries)
            .then((nodes: any[]) => {
                if (!nodes || nodes.length < 1) {
                    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    this.viewParameters.showDeleted = showDeleted;
                }
                this._setCurrentList(dictionary, nodes);

                // if (dictionary.id === DEPARTMENTS_DICT.id) {
                for (let i = 0; i < nodes.length; i++) {
                    const n = nodes[i];
                    if (!n.parent && n.parentId) {
                        n.parent = dictionary.getNode(n.parentId);
                    }

                }
                // }

                this.updateViewParameters({
                    updatingList: false,
                    searchResults: true
                });
                return this._currentList;
            })
            .catch((err) => this._errHandler(err));
    }

    private _errHandler(err: RestError | any) {
        this.updateViewParameters({
            updatingInfo: false,
            updatingList: false,
        });
        if (err instanceof RestError && (err.code === 434 || err.code === 0)) {
            // this._router.navigate(['login'], {
            //     queryParams: {
            //         returnUrl: this._router.url
            //     }
            // });
            let url = document.location.href.split('#')[0];
            url = url.slice(0, url.lastIndexOf('Classif')) + 'login.aspx';
            document.location.assign(url);

            return undefined;
        } else {
            const errMessage = err.message ? err.message : err;
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка обработки. Ответ сервера:',
                msg: errMessage
            });
            return null;
        }
    }

    private _emitListDictionary() {
        this._listDictionary$.next(this.currentDictionary);
    }


}

