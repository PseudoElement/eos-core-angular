import { DICTIONARIES } from '../../eos-dictionaries/consts/dictionaries.consts';
import { DEPARTMENTS_DICT } from './../consts/dictionaries/department.consts';
import { DOCGROUP_DICT } from './../consts/dictionaries/docgroup.consts';
import { Injectable, } from '@angular/core';
// import {Router} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { EosDictionary, CUSTOM_SORT_FIELD } from '../core/eos-dictionary';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import {
    E_DICT_TYPE,
    IDictionaryDescriptor,
    IDictionaryViewParameters,
    IFieldView,
    IOrderBy,
    IRecordOperationResult,
    SEARCH_MODES,
    SearchFormSettings,
    ISearchSettings,
} from '../../eos-dictionaries/interfaces';
import { EosUtils } from '../../eos-common/core/utils';
import { FieldsDecline } from '../../eos-dictionaries/interfaces/fields-decline.inerface';
import { IPaginationConfig } from '../../eos-common/interfaces/interfaces';
import { IImage } from '../../eos-dictionaries/interfaces/image.interface';
import { LS_PAGE_LENGTH, PAGES } from '../node-list-pagination/node-list-pagination.consts';
import {
    WARN_NO_ORGANIZATION,
    WARN_NOT_ELEMENTS_FOR_REPRESENTATIVE,
} from '../consts/messages.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
// import { EosDepartmentsService } from './eos-department-service';
import { RestError } from '../../eos-rest/core/rest-error';
import { DictionaryDescriptorService } from '../../eos-dictionaries/core/dictionary-descriptor.service';
import { IAppCfg } from '../../eos-common/interfaces';
import { CabinetDictionaryDescriptor } from '../core/cabinet-dictionary-descriptor';
// import { CONFIRM_CHANGE_BOSS } from '../consts/confirm.consts';
// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { ReestrtypeDictionaryDescriptor } from '../core/reestrtype-dictionary-descriptor';
import { _ES, ALL_ROWS } from '../../eos-rest/core/consts';
import { EosAccessPermissionsService, APS_DICT_GRANT } from './eos-access-permissions.service';
import { PARTICIPANT_SEV_DICT } from '../../eos-dictionaries/consts/dictionaries/sev/sev-participant';
import { CABINET_DICT } from '../../eos-dictionaries/consts/dictionaries/cabinet.consts';
import { NOMENKL_DICT } from '../../eos-dictionaries/consts/dictionaries/nomenkl.const';
import { DictionaryOverrideService, NpCounterOverrideService, PipRX, SaveExtensionsOverrideService } from '../../eos-rest';
import { RETURN_URL, STORAGE_WEIGHTORDER, URL_LOGIN } from '../../app/consts/common.consts';
import { SEV_DICTIONARIES } from '../../eos-dictionaries/consts/dictionaries/sev/folder-sev.consts';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';
import { ERROR_LOGIN } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

export const SORT_USE_WEIGHT = true;
export const SEARCH_INCORRECT_SYMBOLS = new RegExp('["|\'!]', 'g');

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
    public updateRigth = new BehaviorSubject(null);
    public redactNodeId;
    // private dictionary: EosDictionary;
    sevClearIdentCodesSubject: Subject<boolean> = new Subject<boolean>();
    sevClearIdentCodesSubscription: Observable<boolean> = this.sevClearIdentCodesSubject.asObservable();

    parentIdForPasteOperation: string = '';

    private paginationConfig: IPaginationConfig;
    private _treeNode: EosDictionaryNode; // record selected in tree
    private _listNode: EosDictionaryNode; // record selected in list
    private _currentList: EosDictionaryNode[];
    private _visibleListNodes: EosDictionaryNode[];
    private _bufferNodes: EosDictionaryNode[];
    private _dictionary$: BehaviorSubject<EosDictionary>;
    private _treeNode$: BehaviorSubject<EosDictionaryNode>;
    private _listNode$: BehaviorSubject<EosDictionaryNode>;
    private _currentList$: BehaviorSubject<EosDictionaryNode[]>;
    private _visibleList$: BehaviorSubject<EosDictionaryNode[]>;
    private _markInfo$: BehaviorSubject<MarkedInformation>;
    private _searchInfo$: BehaviorSubject<any>;
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
    private _reloadDopRecvizites$: Subject<any>;
    private _resetSerch$: Subject<any>;
    private _setNomenklFilterClose$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _userOrderCutMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    /* Observable dictionary for subscribing on updates in components */
    get nomenklFilterClose$(): Observable<boolean> {
        return this._setNomenklFilterClose$.asObservable();
    }
    set setNomenklFilterClose$(value: boolean) {
        this._setNomenklFilterClose$.next(value);
    }
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

    get searchInfo$(): Observable<EosDictionary> {
        return this._searchInfo$.asObservable();
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
    get reloadDopRec$(): Observable<any> {
        return this._reloadDopRecvizites$.asObservable();
    }

    get resetSerchError$(): Observable<any> {
        return this._resetSerch$.asObservable();
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
    get treeNode(): any {
        return this._treeNode;
    }

    get order() {
        return this.currentDictionary.orderBy;
    }

    get dictionaryTitle(): string {
        return this._dictionaries[0].title;
    }

    get userOrderCutMode$(): Observable<boolean> {
        return this._userOrderCutMode$.asObservable();
    }
    get getPaginationConfig(): IPaginationConfig {
        return this.paginationConfig;
    }
    get customFields(): IFieldView[] {
        let _storageData = this._storageSrv.getItem('customFieldsList');
        if (_storageData && !_storageData[this.currentDictionary.id] && this.currentDictionary.descriptor.fieldDefault) {
            _storageData[this.currentDictionary.id] = this.currentDictionary.descriptor.fieldDefault;
            this._storageSrv.setItem('customFieldsList', _storageData, true);
        } else if (!_storageData && this.currentDictionary.descriptor.fieldDefault) {
            _storageData = {[this.currentDictionary.id]: this.currentDictionary.descriptor.fieldDefault};
            this._storageSrv.setItem('customFieldsList', _storageData, true);
        }

        const dictionary = this.currentDictionary;
        if (_storageData && dictionary) {
            this._customFields = _storageData;
            const stored: [] = this._customFields[dictionary.id];
            if (stored && stored.length) {
                const allList = dictionary.descriptor.record.getCustomListView({});
                const fies = stored.map(s => allList.find(a => a.key === s)).filter(s => !!s);
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
    get currentList() {
        return this._currentList;
    }

    constructor(
        public dictionatyOverrideSrv: DictionaryOverrideService,
        public npOverrideSrv: NpCounterOverrideService,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _descrSrv: DictionaryDescriptorService,
        private _eaps: EosAccessPermissionsService,
        private _apiSrv: PipRX,
        private _errorHelper: ErrorHelperServices,
        private _confirmSrv: ConfirmWindowService,
        private _eosOverridesSrv: EosCommonOverriveService,
        public _extSrvSave: SaveExtensionsOverrideService,
    ) {
        this._initViewParameters();
        this._dictionaries = [];
        this._treeNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._listNode$ = new BehaviorSubject<EosDictionaryNode>(null);
        this._dictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._listDictionary$ = new BehaviorSubject<EosDictionary>(null);
        this._searchInfo$ = new BehaviorSubject<any>(null);
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
        this._reloadDopRecvizites$ = new Subject();
        this._resetSerch$ = new Subject();
    }
    getShowAllSubnodesQueryes(data?) {
        const layer = this._treeNode.originalId.toString().split('.').length - 1;
        const critery = {
            [this._treeNode._descriptor.keyField.foreignKey]: this._treeNode.originalId + '%',
            ['LAYER']: layer + ':Null'
        };
        if (!this.viewParameters.showDeleted) {
            critery['DELETED'] = '0';
        }
        return critery;
    }
    getChildrenQuery(data?) {
        let q;
        if (this.viewParameters.showDeleted) {
            q = {
                ISN_HIGH_NODE: data.data.rec.ISN_NODE + ''
            }
        } else {
            q = {
                ISN_HIGH_NODE: data.data.rec.ISN_NODE + '',
                DELETED: 0
            }
        }
        return q;
    }
    getDescr(dictionaryId: string): IDictionaryDescriptor {
        for (let i = 0; i < DICTIONARIES.length; i++) {
            const dict = DICTIONARIES[i];
            if (dict.id === dictionaryId) {
                return dict;
            }
        }
        if (this._eosOverridesSrv.overrideDictionaries) {
            for (let i = 0; i < this._eosOverridesSrv.overrideDictionaries.length; i++) {
                const dict = this._eosOverridesSrv.overrideDictionaries[i];
                if (dict.id === dictionaryId) {
                    return dict;
                }
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
                changes.push({
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

    getDueForNode(node: EosDictionaryNode): string {
        if (node && node.dictionary) {
            const id = node.dictionary.id;
            switch (id) {
                case CABINET_DICT.id:
                    return node.data && node.data.department && node.data.department['DUE'];
                case DEPARTMENTS_DICT.id:
                    return node.parentId;
                case NOMENKL_DICT.id:
                    return node.data && node.data.rec['DUE'];
                default:
                    if (node.dictionary.isTreeType()) {
                        return node.parentId;
                    }
            }
        }
        return null;


        // if (!node || !node.dictionary.isTreeType()) {
        //     return null;
        // }
        // const id = node.dictionary.id;
        // if (id === CABINET_DICT.id) {
        //     return node.data.department['DUE'];
        // } else if (id === DEPARTMENTS_DICT.id) {
        //     return node.parentId;
        // } else if (id === NOMENKL_DICT.id) {
        //     return node.data.rec['DUE'];
        // } else {
        //     return node.parentId;
        // }
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

    unbindOrganization() {
        this.currentDictionary.unbindOrganization();
    }

    bindOrganization(orgDue: string) {
        if (orgDue && this.currentDictionary) {
            return this.currentDictionary.bindOrganization(orgDue);
        } else {
            return Promise.resolve(null);
        }
    }

    bindDocGroups(dues: string) {
        if (dues && this.currentDictionary) {
            return this.currentDictionary.bindDocGroups(dues);
        } else {
            return Promise.resolve(null);
        }
    }

    createRepresentative(): Promise<IRecordOperationResult[]> {
        const dictionary = this.currentDictionary;
        if (dictionary && this._treeNode) {
            this.updateViewParameters({ updatingList: true });

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
                    this.updateViewParameters({ updatingList: false });
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
    printNomencTemplate(dues, template, printYear, printWithSecondary) {
        const url = `CreateNomenklatura?dues=${dues}&templateISN=${template}&printYear=${printYear}&printWithSecondary=${printWithSecondary}`;
        this._apiSrv.read({
            [url]: ALL_ROWS
        })
            .then(ans => {
                this._apiSrv.read({
                    REF_FILE: {
                        criteries: {
                            ISN_REF_DOC: ans
                        }
                    }
                })
                    .then(fileDownload => {
                        window.open(`../CoreHost/FOP/GetFile/${fileDownload[0]['ISN_REF_FILE']}`);
                    });
            })
            .catch(er => {
                this._errHandler(er);
            });
    }
    getCabinetOwners(departmentDue: string, cabinet: number): Promise<{owners: any[], allOwners: any[]}> {
        return this.getDictionaryById(E_DICTIONARY_ID.CABINET)
            .then((dictionary) => {
                const descriptor: CabinetDictionaryDescriptor = <CabinetDictionaryDescriptor>dictionary.descriptor;
                return descriptor.getOwners(departmentDue, cabinet)
                .then((owners) => {
                    return Promise.resolve({owners: owners, allOwners: descriptor.getAllOwners()});
                });
            })
            .catch((err) => this._errHandler(err));
    }

    getFilterValue(filterName: string): any {
        // изменил null на undefined чтобы можно было понять когда параметр стал пустым а когда он не существовал
        return this.filters.hasOwnProperty(filterName) ? this.filters[filterName] : undefined;
    }

    getMarkedNodes(recursive = false): EosDictionaryNode[] {
        if (!this.currentDictionary) {
            return [];
        }
        if (recursive) {
            return this.currentDictionary.getMarkedNodes(recursive);
        } else {
            return this._visibleListNodes?.filter(n => n.isMarked) || [];
        }
    }

    setMarkAllVisible(emit: boolean = true): void {
        this._currentMarkInfo.nodes = this._visibleListNodes;
        this._currentMarkInfo.nodes.forEach(n => n.isMarked = true);
        if (emit) {
            this.updateMarked(false);
        }
    }

    setMarkAllNone(emit: boolean = true): void {
        if (this._currentList) {
            this._currentList.forEach(n => { n.isMarked = false; /* n.isSliced = false; */ });
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
                this.openNode(selectedCount ? this._currentMarkInfo.nodes[0].id : '').then(() => { });
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
        if (updates && updates.hasOwnProperty('userOrdered')) {
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
            allDicts = allDicts.concat(this._eosOverridesSrv.visibleDictionaries());
            allDicts = allDicts.concat(this._descrSrv.visibleSevDictionaries());
        }
        return Promise.resolve(allDicts);
    }

    getDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._descrSrv.visibleDictionaries());
    }

    getAddonDictionariesList(): Promise<IDictionaryDescriptor[]> {
        return Promise.resolve(this._eosOverridesSrv.visibleDictionaries());
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
            this.updateViewParameters({ showDeleted: false });
            if (this._dictionaries[0]) {
                this.closeDictionary();
            }
            return this._openDictionary(dictionaryId);
        }
    }

    expandNode(nodeId: string): Promise<EosDictionaryNode> {
        if (this._treeNode.id === nodeId) {
            this.updateViewParameters({ updatingList: true });
        }
        return this._dictionaries[0].expandNode(nodeId)
            .then((val) => {
                this.updateViewParameters({ updatingList: false });
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
        if (this.viewParameters) {
            this.viewParameters.showAllSubnodes = false;
            this.viewParameters.searchResults = false;
        }
        let p = Promise.resolve(this._treeNode);
        if (nodeId) {
            if (!this._treeNode || this._treeNode.id !== nodeId) {
                this.updateViewParameters({ updatingList: true });
                p = this.getTreeNode(nodeId);
            }
        } else {
            const dictionary = this._dictionaries[0];
            if (dictionary && dictionary.root) {
                this.updateViewParameters({ updatingList: true });
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
                        this.updateViewParameters({ updatingList: false });
                    });
                } else {
                    this.updateViewParameters({ updatingList: false });
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
            this.updateViewParameters({ updatingList: true });
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
                    this.updateViewParameters({ updatingList: false });
                });
                return n;
            })
            .catch(err => this._errHandler(err));
    }

    selectTemplateNode(treeNodes, id) {
        if (this.currentDictionary.descriptor['top'] !== id) {
            this._srchCriteries = null;
        }
        this.currentDictionary.descriptor['top'] = id;
        const dictionary = this._dictionaries[0];
        this._selectTreeNode(dictionary.root);
        this._reloadList().then(() => {
            this.updateViewParameters({ updatingList: false });
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
                this.updateViewParameters({ updatingInfo: false });
                this.redactNodeId = nodeId;
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
                        return this._updateUserDepartment(node.data.rec, node.dictionaryId)
                            .then(chenge => {
                                if (!appendChanges && chenge) {
                                    appendChanges = chenge;
                                } else if (chenge) {
                                    appendChanges.push(chenge);
                                }
                                return dictionary.updateNodeData(node, data, appendChanges);
                            });
                    })
                    .then(async (results) => {
                        await this._extSrvSave.saveExtensions(dictionary, data, results, node);
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
                //   this._errHandler(err);
                return Promise.reject(err);
            });
    }

    rememberNewNode(results): void {
        if (results) {
            if (typeof results === 'number') {
                this._storageSrv.setItem('newNode', results, true);
            } else if (Array.isArray(results)) {
                if (results[0] && results[0].record && results[0].record.data && results[0].record.data.rec.ISN_LCLASSIF) {
                    this._storageSrv.setItem('newNode', results[0].record.data.rec.ISN_LCLASSIF, true);
                } else if (results[0] && typeof results[0].record === 'number') {
                    this._storageSrv.setItem('newNode', results[0].record, true);
                } else if (results[0] && results[0].record && results[0].record.ISN_NODE) {
                    this._storageSrv.setItem('newNode', results[0].record.ISN_NODE, true);
                }
            }
        }
    }

    addNode(data: any): Promise<EosDictionaryNode> {
        const dictionary = this.currentDictionary;
        if (this._treeNode) {
            return this._preSave(dictionary, data, true)
                .then((appendChanges) => {
                    return dictionary.descriptor.addRecord(data, this._treeNode.data, appendChanges);
                })
                .then((results) => {
                    this.rememberNewNode(results);
                    this.updateViewParameters({ updatingList: true });
                    return this._reloadList(true)
                        .then(async() => {
                            await this._extSrvSave.saveExtensions(dictionary, data, results, this._treeNode.data, true);
                            /** обновляем дерево после добавления записи */
                            if (dictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                                await dictionary.getRoot();
                                /* this._treeNode.children = newTree.children;
                                this._treeNode$.next(this._treeNode); */
                            }
                            this.updateViewParameters({ updatingList: false });
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
                    } else if (err && (err.error instanceof RestError || err instanceof RestError)) {
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
                this.updateViewParameters({ updatingList: false });
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
            this.updateViewParameters({ updatingList: true });
            return this.currentDictionary.setFlagForMarked(fieldName, recursive, value)
                .then(() => this._reloadList())
                .then(() => {
                    this.updateViewParameters({ updatingList: false });
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
    deleteMarked(title?: string): Promise<IRecordOperationResult[]> {
        if (this.currentDictionary) {
            this.updateViewParameters({ updatingList: true });
            return this.currentDictionary.deleteMarked()
                .then((results) => {
                    // let success = true;
                    results.forEach((result) => {
                        if (result && result.error) {
                            if (result.error.code !== 401) {
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
                            const deletedList = results.filter(r => {
                                return r && !r.error;
                             })
                                .map(r => r.record[title] || r.record['CLASSIF_NAME']);
                            this.deleteCutedNodes(title, deletedList);
                            this.updateViewParameters({ updatingList: false });
                            return results;
                        });
                })
                .catch((err) => this._errHandler(err));
        } else {
            return Promise.resolve(null);
        }
    }
    deleteCutedNodes(title: string, deletedList: any[]) {
        let cuted: Array<EosDictionaryNode> = this._storageSrv.getItem('markedNodes');
        if (cuted) {
            this._storageSrv.removeItem('markedNodes');
            cuted = cuted.filter((_n) => {
                const titlei = _n.data.rec[title] || _n.data.rec['CLASSIF_NAME'];
                return !deletedList.some((dt) => dt === titlei);
            });
            this._storageSrv.setItem('markedNodes', cuted);
        }
    }

    emitResetSearch() {
        this._searchInfo$.next(null);
    }

    resetSearch(): Promise<any> {
        this._srchCriteries = null;
        this.setMarkAllNone();
        this.emitResetSearch();
        return this._reloadList();
    }

    isSearchEnabled(): boolean {
        return !!this._srchCriteries;
    }

    isSearchFullDictionary(): boolean {
        return this._srchParams ? this._srchParams.mode === SEARCH_MODES.totalDictionary : false;
    }

    quickSearch(settings: SearchFormSettings): Promise<EosDictionaryNode[]> {
        const dictionary = this.currentDictionary;
        let fixedString;
        // для полнотекстового поиска кавычки не убираем, экранируем
        const dictionaryID: string[] = [E_DICTIONARY_ID.DEPARTMENTS, E_DICTIONARY_ID.RUBRICATOR, E_DICTIONARY_ID.DOCGROUP, E_DICTIONARY_ID.CABINET];
        if (dictionaryID.indexOf(this.currentDictionary.id) !== -1) {
            fixedString = settings.quick.data.replace(/^%*$/, '');
        }   else {
            fixedString = settings.quick.data.replace(SEARCH_INCORRECT_SYMBOLS, '').replace(/^%*$/, '');
        }
        if (fixedString !== '') {
            this._srchCriteries = dictionary.getSearchCriteries(fixedString, settings.opts, this._treeNode);
            if (this.currentDictionary.id !== E_DICTIONARY_ID.ORGANIZ) {
                this._srchParams = settings.opts;
            } else {
                this._srchParams = settings.opts[0];
            }
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

    async fullSearch(data: any, params: ISearchSettings) {
        try {
            data.srchMode === 'common' ? this.fixSearchSymbols(data.common) : null;
        } catch (e) {
            console.error('Error: ', e)
        }
        const dictionary = this.currentDictionary;
        if (data.srchMode === 'person') {
            this._srchCriteries = [dictionary.getFullsearchCriteries(data, params, this._treeNode)];

            const phone = data.person['PHONE_LOCAL'];
            if (phone) {
                const dataDiffPhone = JSON.parse(JSON.stringify(data));
                delete dataDiffPhone.person['PHONE_LOCAL'];
                dataDiffPhone.person['PHONE'] = phone;
                this._srchCriteries.push(dictionary.getFullsearchCriteries(dataDiffPhone, params, this._treeNode));
            } else {
                this._srchCriteries.push(dictionary.getFullsearchCriteries(data, params, this._treeNode));
            }
            return this._search(params.deleted);
        } else {
            this._srchCriteries = [dictionary.getFullsearchCriteries(data, params, this._treeNode)];
            const answer = await this._search(params.deleted);
            return answer;
        }
    }

    fixSearchSymbols(data: any): any {
        for (const key in data) {
            if (key !== 'srchMode' && 
                data.hasOwnProperty(key) && 
                key !== 'DOP_REC' && 
                !data[key].hasOwnProperty('DOP_REC') && 
                !data['RULE_KIND']
            ) {
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
    deleteDict(mode: number): void { // удаляю справочник с подразделениеями из массива для корректроного перехода по ссылке на владельза кабинета , из правого стакана.
        if (this._dictionaries.length > 1 && this._dictionaries[1].id === E_DICTIONARY_ID.CABINET) {
            this._dictionaries.shift();
        }
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

        this._dictionaries.forEach((dict) => dict.showDeleted = this.viewParameters.showDeleted);

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
                    if ((this.currentDictionary.id === this._treeNode.dictionaryId) && this.currentDictionary.id !== E_DICTIONARY_ID.CABINET) {
                        records = this._treeNode.children;
                    } else {
                        // cabinet costyl
                        records = Array.from(this.currentDictionary.nodes.values());
                        const due = this._treeNode.id;
                        records = records.filter(r => r.data.rec['DUE'] === due);
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
        return valid ? null : { 'isUnique': !valid };
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
    // по идее нужно сюда передать нужные данные
    // flag пока думаю использовать как показатель вырезать = true  копировать = false
    public paste(slicedNodes: EosDictionaryNode[], dueTo: string, whenCopy?): Promise<any> {
        return this.currentDictionary.descriptor.paste(slicedNodes, dueTo, whenCopy)
            .then(() => {
                this._storageSrv.removeItem('markedNodes');
            //    this.reload();
            })
            .catch(er => {
                if (er) {
                    this._errorHelper.errorHandler(er);
                }
                // this._msgSrv.addNewMessage({ type: 'danger', title: 'Ошибка', msg: er.message });
            });
    }
    public cutNode(): any { // справочник граждане - action ВЫРЕЗАТЬ -->
        const markedNodes: EosDictionaryNode[] = this.getMarkedNodes();
        const storageNode = [];
        // убираем выделение
        this._currentList.forEach((node: EosDictionaryNode) => {
            node.isSliced = false;
        });
        // добавляем выделение для вырезаных/копированных
        markedNodes.forEach((node: EosDictionaryNode) => {
            node.isSliced = true; // !node.isSliced;
            storageNode.push(node);
        });
        this._storageSrv.setItem('markedNodes', storageNode);
    }
    public combine(slicedNodes, markedNodes): Promise<any> {
        return this.currentDictionary.descriptor.combine(slicedNodes, markedNodes).then(() => {
            this._msgSrv.addNewMessage({ type: 'success', title: 'Сообщение', msg: 'Объединение завершено' });
            slicedNodes.forEach(node => {
                node.delete();
                this.currentDictionary.nodes.delete(node.id);
            });
            this._storageSrv.removeItem('markedNodes');
            this.reload();
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
            // this._msgSrv.addNewMessage({ type: 'danger', title: 'Ошибка', msg: e.message });
        });
    }
    public uncheckNewEntry() {
        this.currentDictionary.descriptor.updateUncheckCitizen(this.getMarkedNodes()).then(() => {
            this._reloadList();
        });

    }

    readSevRule(selectedNodes: EosDictionaryNode[]): Promise<any> {
        const ruleIsn = selectedNodes.map((node) => node.id);
        return this._apiSrv
            .read({
                SEV_PARTICIPANT_RULE: PipRX.criteries({ 'ISN_RULE': ruleIsn.join('|') }),
            })
            .then((data: any) => {
                if (data.length) {
                    const parIsn = data.map((el) => el.ISN_PARTICIPANT);
                    return this._apiSrv
                        .read({
                            SEV_PARTICIPANT: PipRX.criteries({ 'ISN_LCLASSIF': parIsn.join('|') }),
                        })
                        .then((participant: any) => {
                            const result = selectedNodes.map((node): any[] => {
                                const matchParIsn = data.map((p) => {
                                    if (p.ISN_RULE.toString() === node.id) {
                                        return p.ISN_PARTICIPANT;
                                    }
                                });
                                const obj: any = {
                                    RULE_TITLE: node.title,
                                    RULE_ID: node.id,
                                    PARTICIPANT_ID: matchParIsn,
                                    PARTICIPANT: participant.filter((pp: any) => matchParIsn.indexOf(pp.ISN_LCLASSIF) !== -1)
                                };
                                return obj;
                            });
                            return Promise.resolve(result);
                        });
                }
                return Promise.resolve([]);
            })
            .catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
    }


    rereadNode(nodeId: any): Promise<any> {
        return this._apiSrv
            .read({
                DOCGROUP_CL: PipRX.criteries({ 'DUE': nodeId }),
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
    public updateNameDepartment(newName: string): Promise<any> {
            return this._apiSrv.batch([{
                method: 'MERGE',
                requestUri: 'DEPARTMENT(\'0.\')',
                data: {
                    CARD_NAME: newName
                }
            }], '');
    }
    public getCardName(): string | undefined {
        const node = this.currentDictionary.nodes.get('0.');
        const cardName = node ? node.data['rec']['CARD_NAME'] : undefined;
        return cardName;
    }
    public setCardName(cardName: string) {
        const node = this.currentDictionary.nodes.get('0.');
        if (node) {
            node.data['rec']['CARD_NAME'] = cardName.trim();
        }
    }
    public checkPreDelete(selectedNodes: EosDictionaryNode[]): Promise<any> {
        return this.currentDictionary.descriptor.checkPreDelete(selectedNodes);
    }

    public getStoredSearchSettings(): SearchFormSettings {
        const res = this._storageSrv.getItem('lastSearchSetting');
        return res ? res : new SearchFormSettings;
    }

    public setStoredSearchSettings(data: SearchFormSettings) {
        this._storageSrv.setItem('lastSearchSetting', data);
    }
    public async reload() {
        if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
            await this.currentDictionary.descriptor.updatSev('ORGANIZ_CL');
            this._updateVisibleNodes();
        } else {
            this._reloadList();
        }
    }
    public resetPagination() {
        this._initPaginationConfig();
    }

    public checkRelatedNomenkl(nodes: EosDictionaryNode[], param: string): Promise<any> {
        if (param === 'checkClosed') {
            return this.currentDictionary.descriptor.updateDefaultValues(nodes, 'check');
        } else {
            return this.currentDictionary.descriptor.updateDefaultValues(nodes, 'closed').then((result) => {
                return this._reloadList()
                    .then(() => {
                        this.updateViewParameters({ updatingList: false });
                        return result;
                    });
            });
        }

    }
    public async loadChildrenPagination(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode[]> {
        const by = this.currentDictionary.orderBy['ascend'] ? 'asc' : 'desc';
        const order = this.currentDictionary.orderBy['fieldKey'];
        const skip = (this.paginationConfig.current - 1) * this.paginationConfig.length;
        const top = this.paginationConfig.current === this.paginationConfig.start ? this.paginationConfig.length : this.paginationConfig.length + ((this.paginationConfig.current - this.paginationConfig.start) * this.paginationConfig.length) ;
        let q = this.getChildrenQuery(node);
        if (this.viewParameters.showAllSubnodes) {
            q = this.getShowAllSubnodesQueryes();
        }
        if (this._srchCriteries) {
            this._srchCriteries['DELETED'] = this.viewParameters.showDeleted;
            return await dictionary.search(this._srchCriteries, order + ' ' + by, top, skip)
            .then((el) => {
                return el;
            })
        } else {
            return await dictionary.getChildren(node, order + ' ' + by, top, skip, q)
            .then((el) => {
                return el;
            })
            .catch((err) => this._errHandler(err));
        }
    }
    public findNewNodePages(id: number): EosDictionaryNode {
        let indexNewNode: number;
        let list = [];
        if (!this.viewParameters.showDeleted && this._currentList) {
            list = this._currentList.filter((node) => node.isVisible(this.viewParameters.showDeleted));
        }
        list = list.filter((node) => node.filterBy(this.filters));
        const isnName = list.length ? (list[0].data.rec.ISN_LCLASSIF ? 'ISN_LCLASSIF' : 'ISN_NODE') : null;
        const nodeT = list.filter((_n, i, nodes) => {
            if (+_n.data.rec[isnName] === +id) {
                indexNewNode = i;
                return true;
            }
        })[0];
        if (list.length > 10 && nodeT) {
            const pages = Math.ceil(list.length / this.paginationConfig.length);
            let start = 0;
            let end;
            for (let i = 1; i <= pages; i += 1) {
                end = start + this.paginationConfig.length - 1;
                if (indexNewNode >= start && indexNewNode <= end) {
                    if (this.paginationConfig.current === i) {
                        this._storageSrv.removeItem('newNode');
                        return nodeT;
                    } else {
                        this.changePagination({ current: i, start: i, length: this.paginationConfig.length, itemsQty: this.paginationConfig.itemsQty });
                    }
                }
                start = end + 1;
            }
        } else {
            this._storageSrv.removeItem('newNode');
        }
        return nodeT;
    }
    public updateDopRec(): void {
        this._reloadDopRecvizites$.next(null);
    }
    public updateResetSerch(): void {
        this._resetSerch$.next(null);
    }

    changeUserOrderCutMode(param: boolean): void {
        this._userOrderCutMode$.next(param);
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
        if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) { // this.currentDictionary.descriptor['totalRecords'] !== undefined
            this.paginationConfig.itemsQty = this.currentDictionary.descriptor['totalRecords'] || 0;
        } else {
            this.paginationConfig.itemsQty = this._getListLength();
        }
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
    private _initPaginationConfig(update = false, param?: string) {
        this.paginationConfig = Object.assign(this.paginationConfig || { start: 1, current: 1 }, {
            length: this._storageSrv.getItem(LS_PAGE_LENGTH) || PAGES[0].value,
            itemsQty: this._getListLength()
        });

        if (update && this.currentDictionary.id !== E_DICTIONARY_ID.ORGANIZ) {
            this._updateVisibleNodes(param);
            // this._fixCurrentPage();
        } else {
            this.paginationConfig.current = 1;
            this.paginationConfig.start = 1;
            this._paginationConfig$.next(this.paginationConfig);
        }
    }
    private async loadChildren(dictionary: EosDictionary, node: EosDictionaryNode): Promise<EosDictionaryNode> {
        if (dictionary) {
            const query = []
            /** тут тоже идёт обновление дерева и ничего более */
            if (dictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                query.push(Promise.resolve([]));
            } else {
                query.push(dictionary.getChildren(node));
            }
            return await Promise.all(query)
                .then((ans) => {
                    const el = ans[0];
                    // теперь будем обновлять данные а не просто делать запрос
                    if (dictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                        node.children = node.children.concat(el);
                    } else {
                        node.children = el;
                    }
                    return node;
                })
                .then(() => {
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
                this.updateViewParameters({ updatingList: true });
                _p = this._dictionaries[0].init()
                    .then(() => {
                        this._initViewParameters();
                        this._initPaginationConfig();
                        this.updateViewParameters({
                            // userOrdered: this._storageSrv.getUserOrderState(this._dictionaries[0].id),
                            userOrdered: this.userOrdered,
                            markItems: this._dictionaries[0].canMarkItems,
                            updatingList: false,
                            showDeleted: this.currentDictionary.descriptor.showDeleted
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
                _p = Promise.reject({ message: 'Unknown dictionary "' + dictionaryId + '"' });
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
                if (!isNewRecord) {
                    return this.currentDictionary.descriptor['UpdateSaveParticipantRule'](data);
                }
            }

            if (!isNewRecord && dictionary.id === DOCGROUP_DICT.id) {
                return Promise.resolve(data._appendChanges || null);
            }

            // if (dictionary.id === DEPARTMENTS_DICT.id && data.rec.IS_NODE) {
            //     this.departmentsSrv.addDuty(data.rec.DUTY);
            //     this.departmentsSrv.addFullname(data.rec.FULLNAME);
            //     if (1 * data.rec.POST_H === 1) {
            //         let parent: EosDictionaryNode = null;
            //         if (this._treeNode && ((!data.rec.PARENT_DUE) || (this._treeNode.id === data.rec.PARENT_DUE))) {
            //             parent = this._treeNode;
            //         }
            //         return dictionary.getBoss(data, parent)
            //             .then((boss) => {
            //                 if (boss && boss.id !== data.rec.DUE) {
            //                     const changeBoss = Object.assign({}, CONFIRM_CHANGE_BOSS);
            //                     const CLASSIF_NAME = data.rec['SURNAME'] + ' - ' + data.rec['DUTY'];
            //                     changeBoss.body = changeBoss.body.replace('{{persone}}', boss.data.rec['CLASSIF_NAME']);
            //                     changeBoss.body = changeBoss.body.replace('{{newPersone}}', CLASSIF_NAME);

            //                     return this.confirmSrv.confirm(changeBoss)
            //                         .then((confirm: boolean) => {
            //                             if (confirm) {
            //                                 boss.data.rec['POST_H'] = 0;
            //                                 return Promise.resolve(this._apiSrv.changeList([boss.data.rec]));
            //                             } else {
            //                                 data.rec['POST_H'] = 0;
            //                                 return Promise.reject('cancel');
            //                             }
            //                         });
            //                 }
            //             });
            //     }
            // }

            // if (dictionary.id === 'region') {
            //     const params = { deleted: true, mode: SEARCH_MODES.totalDictionary };
            //     const _srchCriteries = dictionary.getSearchCriteries(data.rec['CLASSIF_NAME'], params, this._treeNode);

            //     return dictionary.descriptor.search(_srchCriteries)
            //         .then((nodes: any[]) =>
            //             nodes.find((el: any) =>
            //                 el['CLASSIF_NAME'].toString().toLowerCase() === data.rec.CLASSIF_NAME.toString().toLowerCase()
            //                 && data.rec.DUE !== el.DUE))
            //         .then((node: EosDictionaryNode) => {
            //             if (node) {
            //                 return Promise.reject('Запись с этим именем уже существует!');
            //             } else {
            //                 return null;
            //             }
            //         });
            // }
            if (dictionary.id === E_DICTIONARY_ID.REESTRTYPE) {
                if (!data.rec._orig || (data.rec['ISN_DELIVERY'] === String(data.rec._orig['ISN_DELIVERY']))) {
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
                            __metadata: { __type: 'REESTR_NEW' },
                            _State: _ES.Modified,
                            _orig: {
                                'ISN_REESTR': recs[i]['ISN_REESTR'],
                                'ISN_DELIVERY': recs[i]['ISN_DELIVERY'],
                                __metadata: { __type: 'REESTR_NEW' }
                            }
                        });
                    }
                });
            }
        }
        return Promise.resolve(null);
    }

    private _updateUserDepartment(data, dictionaryId): Promise<any> {
        if (dictionaryId === E_DICTIONARY_ID.DEPARTMENTS &&
            data._orig['IS_NODE'] === 1 &&
            data._orig['SURNAME'] !== data['SURNAME']) {
            return this._apiSrv.read({
                USER_CL: {
                    criteries: {
                        DUE_DEP: data._orig['DUE']
                    },
                }
            })
                .then((ans: any[]) => {
                    if (ans.length > 0 && ans[0]['SURNAME_PATRON'] === data._orig['SURNAME']) {
                        return Promise.resolve([{
                            method: 'MERGE',
                            requestUri: `USER_CL(${ans[0]['ISN_LCLASSIF']})`,
                            data: {
                                SURNAME_PATRON: data['SURNAME']
                            }
                        }]);
                    } else {
                        return Promise.resolve(null);
                    }
                })
                .catch(er => {
                    this._errHandler(er);
                });
        } else {
            return Promise.resolve(null);
        }
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
        const markedNodes: EosDictionaryNode[] = this._storageSrv.getItem('markedNodes');
        nodes.forEach((node: EosDictionaryNode) => {
            // filter вместо find из-за IE
            if (markedNodes && markedNodes.filter(mark => mark.id === node.id).length > 0) {
                node.isSliced = true;
            } else {
                node.isSliced = false;
            }
        });
        this._currentList = nodes || [];
        if (dictionary) {
            // remove duplicates
            this._currentList = this._currentList.filter((item, index) => this._currentList.lastIndexOf(item) === index);
            // hide root node
            if (dictionary.root) {
                this._currentList = this._currentList.filter((item) => item.id !== dictionary.root.id);
            }
        }
        this._initPaginationConfig(update, 'notUpdate');
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

    private async _updateVisibleNodes(reorder?) {
        if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
            /* if (!Boolean(this._srchCriteries)) { */
            this.updateViewParameters({ updatingList: true });
            try {
                const newElem = await this.loadChildrenPagination(this.currentDictionary, this._treeNode);
                if (newElem.length > 0) {
                    this._currentList = newElem;
                }
                this._visibleListNodes = this._currentList;
                this._fixCurrentPage();
                this._visibleList$.next(newElem);
                this.updateMarked(true);
                this.updateViewParameters({ updatingList: false });
                if (this._currentMarkInfo.nodes && this._currentMarkInfo.nodes.length === 0) {
                    this.openNode('');
                }
                return;
            } catch (error) {
                this._visibleListNodes = [];
                this._visibleList$.next([]);
                this._errHandler(error);
            }
        }
        this._visibleListNodes = this._currentList;
        if (this._visibleListNodes) {
            if (!this.viewParameters.showDeleted) {
                this._visibleListNodes = this._visibleListNodes.filter((node) => node.isVisible(this.viewParameters.showDeleted));
            }

            this._visibleListNodes = this._visibleListNodes.filter((node) => node.filterBy(this.filters));
            this._fixCurrentPage();
            const page = this.paginationConfig;
            const pageList = (page.length > 0) && this.currentDictionary.id !== E_DICTIONARY_ID.ORGANIZ ? this._visibleListNodes.slice((page.start - 1) * page.length, page.current * page.length) : this._visibleListNodes;
            const lastTimeMarked = pageList.find(n => n === this._listNode);
            if (!lastTimeMarked || !lastTimeMarked.isMarked) {
                const firstMarkedIndex = pageList.findIndex((node) => node.isMarked);
                if (firstMarkedIndex < 0) {
                    this._openNode(null);
                } else {
                    this._openNode(pageList[firstMarkedIndex]);
                }
            }
            this._visibleListNodes = pageList;
            if (!reorder) {
                this._visibleList$.next(pageList);
                this.updateMarked(true);
            }

        }
        this.updateViewParameters({ updatingList: false });
    }



    private _openNode(node: EosDictionaryNode) {
        if (this._listNode !== node) {
            this._listNode = node;
            this._listNode$.next(node);
        }
    }

    private _reloadList(afterAdd = false): Promise<any> {
        let pResult = Promise.resolve([]);
        this.updateViewParameters({ updatingList: true });
        const dictionary = this.currentDictionary;
        if (dictionary) {
            if (this._srchCriteries) {
                if (!afterAdd) {
                    let by;
                    let order;
                    let skip;
                    let limit;
                    if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                        by = this.currentDictionary.orderBy['ascend'] ? 'asc' : 'desc';
                        order = this.currentDictionary.orderBy['fieldKey'];
                        skip = (this.paginationConfig.current - 1) * this.paginationConfig.length;
                        limit = this.paginationConfig.current === this.paginationConfig.start ? this.paginationConfig.length : this.paginationConfig.length + ((this.paginationConfig.current - this.paginationConfig.start) * this.paginationConfig.length);
                    }
                    pResult = dictionary.search(this._srchCriteries, order + ' ' + by, limit, skip);
                } else {
                    pResult = Promise.resolve(this._currentList);
                }
            } else if (this._dictMode !== 0) {
                pResult = dictionary.searchByParentData(this._dictionaries[0], this._treeNode);
            } else if (this.viewParameters.showAllSubnodes) {
                if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                    const by = this.currentDictionary.orderBy['ascend'] ? 'asc' : 'desc';
                    const order = this.currentDictionary.orderBy['fieldKey'];
                    const skip = (this.paginationConfig.current - 1) * this.paginationConfig.length;
                    const limit = this.paginationConfig.current === this.paginationConfig.start ? this.paginationConfig.length : this.paginationConfig.length + ((this.paginationConfig.current - this.paginationConfig.start) * this.paginationConfig.length);
                    const critery = this.getShowAllSubnodesQueryes(this._treeNode);
                    pResult = dictionary.getChildren(this._treeNode, order + ' ' + by, limit, skip, critery);
                } else {
                    pResult = dictionary.getAllChildren(this._treeNode);
                }
            } else {
                if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
                    const by = this.currentDictionary.orderBy['ascend'] ? 'asc' : 'desc';
                    const order = this.currentDictionary.orderBy['fieldKey'];
                    const skip = (this.paginationConfig.current - 1) * this.paginationConfig.length;
                    const limit = this.paginationConfig.current === this.paginationConfig.start ? this.paginationConfig.length : this.paginationConfig.length + ((this.paginationConfig.current - this.paginationConfig.start) * this.paginationConfig.length);
                    this.viewParameters.searchResults = false;
                    const q = this.getChildrenQuery(this._treeNode);
                    pResult = dictionary.getChildren(this._treeNode, order + ' ' + by, limit, skip, q);
                } else {
                    this.viewParameters.searchResults = false;
                    pResult = dictionary.getChildren(this._treeNode);
                }
            }
        }

        return pResult
            .then((list) => {
                this.updateViewParameters({ updatingList: false });
                return this._setCurrentList(dictionary, list, true)
            })
            .catch((err) => {
                this.updateViewParameters({ updatingList: false });
                if (err.code !== 401) {
                    this.updateResetSerch(); // если произошла ошибка при использовании фильтра то сбрасываем фильтр
                }
                this._errHandler(err);
            });
    }

    private _selectTreeNode(node: EosDictionaryNode) {
        if (this._treeNode !== node) {
            this._srchCriteries = null;
            // костыль, после операции вставки paste в режиме поиска нужно запомнить поиск, т.к обновляется весь справочник и поиск сбрасывается.
            if ( this._storageSrv.getItem('searchCriteries')) {
                this._srchCriteries =  this._storageSrv.getItem('searchCriteries');
            }
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

    private async _search(showDeleted = false): Promise<EosDictionaryNode[]> {
        this._openNode(null);
        this.updateViewParameters({
            updatingList: true
        });
        let by;
        let order;
        let skip;
        let limit;
        if (this.currentDictionary.id === E_DICTIONARY_ID.ORGANIZ) {
            by = this.currentDictionary.orderBy['ascend'] ? 'asc' : 'desc';
            order = this.currentDictionary.orderBy['fieldKey'];
            skip = (this.paginationConfig.current - 1) * this.paginationConfig.length;
            limit = this.paginationConfig.length + skip;
            this._srchCriteries['DELETED'] = showDeleted;
        }
        const dictionary = this.currentDictionary;
        return dictionary.search(this._srchCriteries, order + ' ' + by, limit, skip)
            .then((nodes: any[]) => {
                if (!nodes || nodes.length < 1) {
                //    this._msgSrv.addNewMessage(WARN_SEARCH_NOTFOUND);
                } else {
                    this.viewParameters.showDeleted = showDeleted;
                    this._dictionaries.forEach((dict) => dict.showDeleted = this.viewParameters.showDeleted);
                }
                // this._treeNode['TotalRecords'] = nodes['TotalRecords'] || 20;
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
        if (err instanceof RestError && (err.code === 401 || err.code === 0)) {
            // this._router.navigate(['login'], {
            //     queryParams: {
            //         returnUrl: this._router.url
            //     }
            // });
            /* let url = document.location.href.split('#')[0];
            url = url.slice(0, url.lastIndexOf('Classif')) + 'login.aspx'; */
            this._confirmSrv
            .confirm2(ERROR_LOGIN)
            .then((confirmed) => {
                if (confirmed) {
                    document.location.assign(URL_LOGIN + RETURN_URL + document.location.href);
                }
            });

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

