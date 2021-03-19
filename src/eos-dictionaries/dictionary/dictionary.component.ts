import { DEPARTMENTS_DICT } from './../consts/dictionaries/department.consts';
import { AdvCardRKEditComponent } from './../adv-card/adv-card-rk.component';
import {
    AfterViewInit,
    Component,
    DoCheck,
    HostListener,
    OnDestroy,
    ViewChild,
    OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import {
    CONFIRM_SUBNODES_RESTORE, WARNING_LIST_MAXCOUNT, CONFIRM_OPERATION_LOGICDELETE,
    CONFIRM_OPERATION_RESTORE, CONFIRM_OPERATION_HARDDELETE,
    CONFIRM_COMBINE_NODES, CONFIRM_SEV_DEFAULT,
    CONFIRM_OPERATION_NOMENKL_CLOSED
} from 'app/consts/confirms.const';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { E_DICT_TYPE, E_RECORD_ACTIONS, IActionEvent, IDictionaryViewParameters, IRecordOperationResult, SearchFormSettings, SEARCHTYPE } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosStorageService } from 'app/services/eos-storage.service';
import { EosSandwichService } from '../services/eos-sandwich.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { RECENT_URL } from 'app/consts/common.consts';
import { NodeListComponent } from '../node-list/node-list.component';
import { CreateNodeComponent } from '../create-node/create-node.component';
import { IPaginationConfig } from '../node-list-pagination/node-list-pagination.interfaces';
import { CounterNpEditComponent, E_COUNTER_TYPE } from '../counter-np-edit/counter-np-edit.component';
import { CustomTreeNode } from '../tree2/custom-tree.component';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import { DID_NOMENKL_CL, NOMENKL_DICT } from 'eos-dictionaries/consts/dictionaries/nomenkl.const';
import { takeUntil } from 'rxjs/operators';

import {
    DANGER_ACCESS_DENIED_DICT,
    DANGER_DEPART_NO_NUMCREATION,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_EDIT_DICT_NOTALLOWED,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_LOGICALY_RESTORE_ELEMENT,
    DANGER_EMPTY_FILE,
    DANGER_ERROR_FILE,
    WARN_EDIT_ERROR,
    WARN_ELEMENT_DELETED,
    WARN_ELEMENT_PROTECTED,
    WARN_LOGIC_CLOSE,
    WARN_LOGIC_OPEN,
    WARN_SELECT_NODE,
    INFO_OPERATION_COMPLETE,
    SEARCH_NOT_DONE,
    SUCCESS_SAVE,
    WARN_SAVE_FAILED,
    INFO_NOTHING_CHANGES,
    WARN_ELEMENT_CLOSED,
} from '../consts/messages.consts';
import { CABINET_DICT } from 'eos-dictionaries/consts/dictionaries/cabinet.consts';
import { PrjDefaultValuesComponent } from 'eos-dictionaries/prj-default-values/prj-default-values.component';
import { CA_CATEGORY_CL } from 'eos-dictionaries/consts/dictionaries/ca-category.consts';
import { TOOLTIP_DELAY_VALUE, EosTooltipService } from 'eos-common/services/eos-tooltip.service';
import { IConfirmWindow2, IConfirmButton } from 'eos-common/confirm-window/confirm-window2.component';
import { IMessage, IOpenClassifParams } from 'eos-common/interfaces';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { EdsImportComponent } from 'eos-dictionaries/eds-import/eds-import.component';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { CopyPropertiesComponent } from 'eos-dictionaries/copy-properties/copy-properties.component';
import { CreateNodeBroadcastChannelComponent } from 'eos-dictionaries/create-node-broadcast-channel/create-node-broadcast-channel.component';
import { ORGANIZ_CL } from 'eos-rest';
import { COLLISIONS_SEV_DICT } from 'eos-dictionaries/consts/dictionaries/sev/sev-collisions';
import { CheckIndexNomenclaturComponent } from 'eos-dictionaries/check-index-nomenclatur/check-index-nomenclatur.component';
import { DictionaryPasteComponent } from 'eos-dictionaries/dictionary-paste/dictionary-paste.component';
import { PrintTemplateComponent } from 'eos-dictionaries/print-template/print-template.component';
import { Templates } from '../consts/dictionaries/templates.consts';

@Component({
    templateUrl: 'dictionary.component.html',
})


export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit, OnInit {
    @ViewChild('nodeList') nodeList: NodeListComponent;
    @ViewChild('tree') treeEl;
    @ViewChild('custom-tree') customTreeEl;
    @ViewChild('selectedWrapper') selectedEl;
    @ViewChild('quickSearchCtl') quickSearchCtl;
    @ViewChild('searchCtl') searchCtl;

    tooltipDelay = TOOLTIP_DELAY_VALUE;
    dictionary: EosDictionary;
    listDictionary: EosDictionary;

    featuresDep = Features.cfg.departments;

    dictionaryName: string;
    dictionaryId: string;

    params: IDictionaryViewParameters;
    treeNode: EosDictionaryNode;
    title: string;

    stylesFlex = 'none';
    SLICE_LEN = 110;
    customTreeData: CustomTreeNode[];
    protocolWindow: Window;
    filterDate;
    filterDateNomenkl;

    get sliced_title(): string {
        if (this.isTitleSliced) {
            let sliced = this.title.slice(0, this.SLICE_LEN).trim();
            const pos = sliced.lastIndexOf(' ');
            sliced = sliced.slice(0, pos);
            sliced += '...';
            return sliced;
        } else {
            return this.title;
        }
    }

    get isTitleSliced(): boolean {
        if (this.title && this.title.length >= this.SLICE_LEN) {
            return true;
        }
        return false;
    }

    treeNodes: EosDictionaryNode[] = [];
    paginationConfig: IPaginationConfig; // Pagination configuration, use for count node

    currentState: boolean[]; // State sanwiches

    hasParent: boolean;

    modalWindow: BsModalRef;

    treeIsBlocked = false;
    _treeScrollTop = 0;

    dictTypes = E_DICT_TYPE;

    dictMode = 1;

    searchInProgress = false; // flag begin search
    fastSearch = false;
    searchSettings: SearchFormSettings;

    hasCustomTable: boolean;
    hasCustomTree: boolean;

    accessDenied: boolean;


    fonConf = {
        width: 0 + 'px',
        height: 0 + 'px',
        top: 0 + 'px'
    };

    get hideTree() {
        return this._sandwichSrv.treeIsBlocked;
    }

    private _nodeId: string;

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _route: ActivatedRoute,
        private _router: Router,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _storageSrv: EosStorageService,
        private _modalSrv: BsModalService,
        private _confirmSrv: ConfirmWindowService,
        private _eaps: EosAccessPermissionsService,
        private _sandwichSrv: EosSandwichService,
        private _waitClassif: WaitClassifService,
        _bcSrv: EosBreadcrumbsService,
        _tltp: EosTooltipService,
    ) {
        this.accessDenied = false;

        this.searchSettings = this._dictSrv.getStoredSearchSettings();
        this.fastSearch = this.searchSettings.lastSearch === SEARCHTYPE.quick;

        this._dictSrv.openNode('');
        _route.params.subscribe((params) => {
            if (params) {
                this.dictionaryId = params.dictionaryId;


                if (this._eaps.isAccessGrantedForDictionary(this.dictionaryId, null) === APS_DICT_GRANT.denied) {
                    this.accessDenied = true;
                    this._msgSrv.addNewMessage(DANGER_ACCESS_DENIED_DICT);
                    return;
                }
                this.accessDenied = false;
                if (this._nodeId && this._nodeId !== params.nodeId) {
                    this.clearFindSettings();
                }
                this._nodeId = params.nodeId;
                if (this.dictionaryId) {
                    this._dictSrv.openDictionary(this.dictionaryId)
                        .then(() => {

                            if (this.searchSettings.entity_dict !== this._dictSrv.currentDictionary.id) {
                                this.clearFindSettings();
                            }

                            this._dictSrv.setMarkAllNone();
                            if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.custom) {
                                if (this.dictionary.id === 'templates') {
                                    this.dictionary.descriptor['top'] = this._nodeId;
                                }
                                this.dictionary.root.children = null;
                                const n: CustomTreeNode = this._dictSrv.currentDictionary.descriptor.setRootNode(this._nodeId);
                                if (n) {
                                    this.title = n.title;
                                }
                                this._dictSrv.setCustomNodeId(this._nodeId);
                                this._dictSrv.selectCustomTreeNode(this._nodeId).then(() => {
                                });
                            } else if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.linear) {
                                if (this._nodeId === '0.') {
                                    this._nodeId = '';
                                }
                                this._dictSrv.selectTreeNode(this._nodeId);
                            } else {
                                this._dictSrv.selectTreeNode(this._nodeId);
                            }
                        });
                }
            }
        });

        _sandwichSrv.currentDictState$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean[]) => {
                if (this.selectedEl) {
                    setTimeout(() => {
                        this.setStyles();
                    }, 250);
                }
                this.currentState = state;
            });

        _dictSrv.dictionary$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    if (this.params !== undefined) {
                        this.params.hideTopMenu = dictionary.descriptor.hideTopMenu === true;
                    }
                    this.dictionary = dictionary;
                    this.dictionaryId = dictionary.id;
                    this.hasCustomTree = dictionary.descriptor.hasCustomTree();
                    if (dictionary.root) {
                        this.dictionaryName = dictionary.root.title;
                        this.treeNodes = [dictionary.root];
                    }
                    if (this.hasCustomTree) {
                        dictionary.descriptor.getCustomTreeData().then((d) => {
                            const n = this.dictionary.descriptor.getActive();
                            if (n) { this.title = n.title; }
                            this.customTreeData = d;
                        });
                    }
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.listDictionary$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    this.dictMode = this._dictSrv.dictMode;
                    const setParams = this.params === undefined;
                    this.params = Object.assign({}, this.params, { userSort: this._dictSrv.userOrdered });
                    this.params.markItems = dictionary.canDo(E_RECORD_ACTIONS.markRecords);
                    if (setParams) {
                        this.params.hideTopMenu = dictionary.descriptor.hideTopMenu;
                    }
                    this.hasCustomTable = dictionary.canDo(E_RECORD_ACTIONS.tableCustomization);
                }
            });

        _dictSrv.treeNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((node: EosDictionaryNode) => {
                if (node) {
                    this.title = node.getTreeView().map((fld) => fld.value).join(' ');
                    this.hasParent = !!node.parent;
                    const url = this._router.url;
                    this._storageSrv.setItem(RECENT_URL, url);
                }
                if (node !== this.treeNode) {
                    this.treeNode = node;
                }
            });

        _dictSrv.paginationConfig$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((config: IPaginationConfig) => {
                if (config) {
                    this.paginationConfig = config;
                }
            });

        _dictSrv.viewParameters$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((viewParameters: IDictionaryViewParameters) => {
                this.params = viewParameters;
                if (this.params.searchResults) {
                    if ((this._dictSrv.currentDictionary.isTreeType() || this._dictSrv.currentDictionary.id === CABINET_DICT.id)
                        && this._dictSrv.isSearchEnabled()) {
                        if (this._dictSrv.isSearchFullDictionary() || this._dictSrv.currentDictionary.id === CABINET_DICT.id) {
                            this.title = 'Поиск во всем справочнике';
                            this.hasParent = false;
                            return;
                        }
                    }
                }

                if (!viewParameters.updatingList && this.treeNode) {
                    if (this.dictionaryId === NOMENKL_DICT.id || this.dictionaryId === COLLISIONS_SEV_DICT.id || this.dictionaryId === Templates.id ) {
                        const n = this.dictionary.descriptor.getActive();
                        if (n) { this.title = n.title; }
                    } else {
                        this.title = this.treeNode.title;
                        this.hasParent = !!this.treeNode.parent;
                    }
                }

            });

        _dictSrv.openedNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
            });

        _bcSrv._eventFromBc$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((action: IActionEvent) => {
                if ((action.params && action.params.outside)) {
                    this.openClassifFromdepartment();
                } else {
                    this.doAction(action);
                }
            });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.setStyles();
        }, 250);
        // удаляем данные которые относятся к копированию/вырезанию данных
        this._storageSrv.removeItem('markedNodes');
    }

    ngOnDestroy() {
        if (this.modalWindow) {
            this.modalWindow.hide();
        }
        if (this.protocolWindow) {
            this.protocolWindow.close();
        }
        this._sandwichSrv.treeScrollTop = this._treeScrollTop;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    getFilterDate($event) {
        setTimeout(() => {
            this.filterDate = $event;
        }, 0);
    }
    getFilterNomenkl($event) {
        this.filterDateNomenkl = $event;
    }

    onSetActiveNode($event) {
        // reset pagination custom tree
        this._dictSrv.resetPagination();
    }

    clearFindSettings() {
        this.searchSettings = new SearchFormSettings;
        this.fastSearch = false;
        this._dictSrv.emitResetSearch();
        this._dictSrv.setStoredSearchSettings(this.searchSettings);
    }

    ngAfterViewInit() {
        this._treeScrollTop = this._sandwichSrv.treeScrollTop;
        this.treeEl.nativeElement.scrollTop = this._treeScrollTop;
        this.nodeList.updateScrollTop();
    }

    ngDoCheck() {
        this._treeScrollTop = this.treeEl.nativeElement.scrollTop;
    }

    transitionEnd() {
        // this._countColumnWidth();
    }

    isPaginationVisible(): boolean {
        return this._dictSrv.isPaginationVisible();
    }

    doAction(evt: IActionEvent) {
        switch (evt.action) {
            case E_RECORD_ACTIONS.navigateDown:
                this.nodeList.openNodeNavigate(false);
                break;

            case E_RECORD_ACTIONS.navigateUp:
                this.nodeList.openNodeNavigate(true);
                break;

            case E_RECORD_ACTIONS.edit:
                if (this._checkDictionaryId()) {
                    this._openPageCitizens(false, evt.params);
                } else {
                    this._editNode();
                }
                break;

            case E_RECORD_ACTIONS.showDeleted:
                this._dictSrv.toggleDeleted();
                this.params.showDeleted = this.nodeList.params.showDeleted;
                break;

            case E_RECORD_ACTIONS.showAllSubnodes:
                if (this.params.userOrdered) {
                    this._dictSrv.toggleWeightOrder();
                }
                this._dictSrv.toggleAllSubnodes();
                break;

            case E_RECORD_ACTIONS.userOrder:
                if (this.params.showAllSubnodes) {
                    this._dictSrv.toggleAllSubnodes();
                }
                this._dictSrv.toggleWeightOrder();
                break;

            case E_RECORD_ACTIONS.moveUp:
                this.nodeList.moveUp();
                this.dictionary.treeResort();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this.nodeList.moveDown();
                this.dictionary.treeResort();
                break;

            case E_RECORD_ACTIONS.export:
                this.nodeList.export(this.dictionaryId);
                break;

            case E_RECORD_ACTIONS.import:
                this.nodeList.import(this.dictionaryId, this._nodeId);
                break;

            case E_RECORD_ACTIONS.remove:
                this._deleteItems();
                break;

            case E_RECORD_ACTIONS.removeHard:
                if (this.dictionaryId === 'nomenkl') {
                    this._physicallyDeleteNomenkl();
                    return;
                }
                this._physicallyDelete();
                break;

            case E_RECORD_ACTIONS.add:
                if (this._checkDictionaryId()) {
                    this._openPageCitizens(true, evt.params);
                } else {
                    this._openCreate(evt.params);
                }
                break;

            case E_RECORD_ACTIONS.restore:
                this._restoreItems();
                break;
            case E_RECORD_ACTIONS.createRepresentative:
                this._createRepresentative();
                break;
            case E_RECORD_ACTIONS.tableCustomization:
                this.nodeList.configColumns();
                break;
            case E_RECORD_ACTIONS.additionalFields:
                this._openAdditionalFields();
                break;
            case E_RECORD_ACTIONS.AdvancedCardRK:
                this._openAdvancedCardRK();
                break;
            case E_RECORD_ACTIONS.counterDepartmentMain:
                if (this.featuresDep.numcreation) {
                    this._editCounter(E_COUNTER_TYPE.counterDepartmentMain);
                }
                break;
            case E_RECORD_ACTIONS.counterDepartment:
                this._editCounter(E_COUNTER_TYPE.counterDepartment);
                break;
            case E_RECORD_ACTIONS.counterDepartmentRK:
                this._editCounter(E_COUNTER_TYPE.counterDepartmentRK);
                break;
            case E_RECORD_ACTIONS.counterDepartmentRKPD:
                this._editCounter(E_COUNTER_TYPE.counterDepartmentRKPD);
                break;
            case E_RECORD_ACTIONS.counterDocgroup:
                this._editCounter(E_COUNTER_TYPE.counterDocgroup);
                break;
            case E_RECORD_ACTIONS.counterDocgroupRKPD:
                this._editCounter(E_COUNTER_TYPE.counterDocgroupRKPD);
                break;
            case E_RECORD_ACTIONS.CloseSelected:
                this._closeItems();
                break;
            case E_RECORD_ACTIONS.OpenSelected:
                this._openItems();
                break;
            case E_RECORD_ACTIONS.prjDefaultValues:
                this._openPrjDefaultValues();
                break;
            case E_RECORD_ACTIONS.copyProperties:
                this._openCopyProperties(false);
                break;
            case E_RECORD_ACTIONS.copyPropertiesFromParent:
                this._openCopyProperties(true);
                break;
            case E_RECORD_ACTIONS.copyNodes:
                this._copyNodesToBuffer();
                break;
            case E_RECORD_ACTIONS.pasteNodes:
                this._openCopyNode();
                break;
            case E_RECORD_ACTIONS.certifUC:
                this._navigateToUC();
                break;
            case E_RECORD_ACTIONS.downloadFile:
                this._downloadDocTemplates();
                break;
            case E_RECORD_ACTIONS.importEDS:
                this._openModalWindow();
                break;
            case E_RECORD_ACTIONS.cut:
                this._cutNode();
                break;
            case E_RECORD_ACTIONS.combine:
                this._combine();
                break;
            case E_RECORD_ACTIONS.paste:
                this._copy();
                break;
            case E_RECORD_ACTIONS.copy:
                this._cutNode();
                break;
            case E_RECORD_ACTIONS.uncheckNewEntry:
                this._uncheckNewEntry();
                break;
            case E_RECORD_ACTIONS.dopRequisites:
                this._openDopRequisetes();
                break;
            case E_RECORD_ACTIONS.defaultCollision:
                this._defaultSettingsCollision();
                break;
            case E_RECORD_ACTIONS.protViewSecurity:
                this._openProtocolSecyrity();
                break;
            case E_RECORD_ACTIONS.uniqueIndexDel:
                this.uniqueIndex();
                break;
            case E_RECORD_ACTIONS.printNomenc:
                this._printNomenc();
                break;
            default:
                console.warn('unhandled action', E_RECORD_ACTIONS[evt.action]);
        }
    }
    _downloadDocTemplates() {
        this._dictSrv.getMarkedNodes().forEach(
            (node) => {
                this.dictionary.descriptor.downloadFile(node)
                    .then(info => {
                        if (!info) {
                            const msg = Object.assign({}, DANGER_EMPTY_FILE);
                            msg.msg = 'Шаблон ' + node.title + ' в базе отсутствует';
                            this._msgSrv.addNewMessage(msg);
                        }
                    })
                    .catch(() => {
                        this._msgSrv.addNewMessage(DANGER_ERROR_FILE);
                    });
            });
    }
    _navigateToUC(): any {
        const url = this._router.url;
        this._storageSrv.setItem(RECENT_URL, url);
        const _path = [
            'spravochniki',
            CA_CATEGORY_CL.id,
            '0.'
        ];

        this._router.navigate(_path);
    }


    resetSearch() {
        this.clearFindSettings();
        this._dictSrv.updateViewParameters({ searchResults: false });
        this._dictSrv.resetSearch();
        this.forcedCloseFastSrch();
    }

    userOrdered(nodes: EosDictionaryNode[]) {
        this._dictSrv.setUserOrder(nodes);
    }

    goUp() {
        if (this.treeNode && this.treeNode.parent) {
            const path = this.treeNode.parent.getPath();
            // console.log(path);
            this._router.navigate(path);
        }
    }

    forcedCloseFastSrch() {
        if (this.quickSearchCtl) {
            if (this.searchCtl) {
                this.searchCtl.close();
            }
            this.clearFindSettings();
        }
    }

    onCloseFastSrch() {
        this.fastSearch = false;
        // this.forcedCloseFastSrch();
    }

    onRunFullSrch(search: SearchFormSettings) {
        if (!this.searchInProgress) {
            this.searchInProgress = true;
            this._dictSrv.setMarkAllNone();
            this._dictSrv.fullSearch(search.full.data, search.opts)
                .then(() => {
                    this.searchInProgress = false;
                }).catch(() => {
                    this.searchInProgress = false;
                });
        } else {
            this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
        }
    }

    onRunFastSrch(search: SearchFormSettings) {
        if (!this.searchInProgress) {
            search.quick.data = (search.quick.data) ? search.quick.data.trim() : '';
            if (search.quick) {
                this.searchInProgress = true;
                this._dictSrv.setMarkAllNone();
                search.lastSearch = SEARCHTYPE.quick;
                search.opts.deleted = this._dictSrv.viewParameters.showDeleted;
                this.searchSettings = search;
                this.searchSettings.entity_dict = this._dictSrv.currentDictionary.id;
                this._dictSrv.setStoredSearchSettings(this.searchSettings);
                this._dictSrv.quickSearch(this.searchSettings)
                    .then(() => {
                        this.searchInProgress = false;
                    }).catch(() => {
                        this.searchInProgress = false;
                    });
            }
        } else {
            this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
        }
    }

    switchFastSearch(val: boolean) {
        if (this.quickSearchCtl && this.searchSettings.quick.data) {
            this.quickSearchCtl.quickSearch({ keyCode: 13 });
        } else {
            this.fastSearch = !this.fastSearch;
        }
    }

    @HostListener('window:resize')
    resize(): void {
        this.setStyles();
        this._sandwichSrv.resize();
    }
    setStyles() {
        if (this.selectedEl.nativeElement.offsetWidth < 655 && this.selectedEl.nativeElement.offsetWidth > 510) {
            this.stylesFlex = 'xl';
        } else if (this.selectedEl.nativeElement.offsetWidth <= 510) {
            this.stylesFlex = 'xs';
        } else {
            this.stylesFlex = 'none';
        }
    }

    isDictModeEnabled(mode: number): boolean {
        const dict = this._dictSrv.dictionaryByMode(mode).id;
        return this._eaps.isAccessGrantedForDictionary(dict, null) !== APS_DICT_GRANT.denied;
    }
    setDictMode(mode: number) {
        this._dictSrv.setDictMode(mode);
        this.params.searchResults = false;
        this.clearFindSettings();
        this.nodeList.updateViewFields([], []);
    }
    uniqueIndex() {
        const config = { ignoreBackdropClick: true };
        this.modalWindow = this._modalSrv.show(CheckIndexNomenclaturComponent, config);
        this.modalWindow.content.onHide.subscribe(() => {
            this._dictSrv.reload();
            this.modalWindow.hide();
        });
    }
    nlHeightType() {
        let res = 1;
        if (this.hasFilter()) {
            res++;
        }
        if (this.fastSearch) {
            res++;
        }
        return res;
    }

    hasFilter() {
        if (this.dictionaryId === DID_NOMENKL_CL ||
            (this.dictionaryId === DEPARTMENTS_DICT.id && this.dictMode === 0)) {
            return true;
        }
        return false;
    }

    markedCounter(): number {
        return this._dictSrv.getMarkedNodes().length;
    }
    /**
     * @description convert selected persons to list of organization representatives,
     * add it to department organization if it exists upwards to tree
     */
    private _createRepresentative() {
        if (this.dictionaryId === 'departments') {
            this._dictSrv.createRepresentative()
                .then((results) => {
                    results.forEach((result) => {
                        this._msgSrv.addNewMessage({
                            type: result.success ? 'success' : 'warning',
                            title: result.record['SURNAME'],
                            msg: result.success ? 'Контакт создан' : result.error.message
                        });
                    });
                });
        }
    }

    /**
     * @description Open modal with CreateNodeComponent, fullfill CreateNodeComponent data
     */
    private _openCreate(recParams: any) {
        let data: {};
        let editDescr: {};
        let dictionary: EosDictionary;
        dictionary = this._dictSrv.currentDictionary;
        editDescr = dictionary.getEditDescriptor();
        data = dictionary.getNewNode({ rec: recParams }, this.treeNode);

        this._dictSrv.setMarkAllNone();
        const createWarning = dictionary.descriptor.preCreateCheck(this);
        if (createWarning) {
            this._msgSrv.addNewMessage(createWarning);
            return;
        }

        const config = { class: 'creating-modal', ignoreBackdropClick: true };

        if (dictionary.descriptor.id === 'broadcast-channel') {
            this.modalWindow = this._modalSrv.show(CreateNodeBroadcastChannelComponent, config);
        } else {
            this.modalWindow = this._modalSrv.show(CreateNodeComponent, config);
        }

        this._dictSrv.clearCurrentNode();

        this.modalWindow.content.fieldsDescription = editDescr;
        this.modalWindow.content.dictionaryId = dictionary.id;
        this.modalWindow.content.isNewRecord = true;
        this.modalWindow.content.nodeData = data;

        this.modalWindow.content.onHide.subscribe(() => {
            this.modalWindow.hide();
        });
        this.modalWindow.content.onOpen.subscribe(() => {
            this._openCreate(recParams);
        });
    }
    private _openPageCitizens(openEdit: boolean, params) {
        if (this.dictionaryId === 'organization') {
            if (params && params.IS_NODE && openEdit) {
                this.openClassifGopRc(openEdit, params);
                return;
            } else if (params && !params.IS_NODE && openEdit) {
                this._openCreate(params);
                return;
            } else if (!params && !openEdit) {
                if (this._dictSrv.listNode.isNode) {
                    this._editNode();
                    return;
                } else {
                    this.openClassifGopRc(openEdit, params);
                    return;
                }
                return;
            }
        }
        this.openClassifGopRc(openEdit, params);

    }
    private openClassifGopRc(openEdit, params) {
        const node = this._dictSrv.listNode;
        const config: IOpenClassifParams = this._dictSrv.currentDictionary.descriptor.getConfigOpenGopRc(openEdit, node, this._nodeId, params);
        this._waitClassif.openClassif(config).then(() => {
            this.updateRigthFields(node);
            this._dictSrv.setMarkAllNone();
            this._dictSrv.reload();
        }).catch((e) => {
            this.updateRigthFields(node);
            this._dictSrv.setMarkAllNone();
            this._dictSrv.reload();
        });
    }
    private openClassifFromdepartment(params?) {
        const list: ORGANIZ_CL = this._dictSrv.listNode.data.organization;
        const config: IOpenClassifParams = {
            classif: 'gop_rc',
            id: 'ORGANIZ_dict',
            user_id: list.ISN_NODE,
            folder_due: list.PARENT_DUE,
            due: list.DUE
        };

        this._waitClassif.openClassif(config).then(() => {
            this.updateRigthFields(this._dictSrv.listNode, true);
            this._dictSrv.reload();
        }).catch((e) => {
            this.updateRigthFields(this._dictSrv.listNode, true);
            this._dictSrv.reload();
        });
    }
    private updateRigthFields(node: EosDictionaryNode, refresh: boolean = false): Promise<any> {
        if (node) {
            node.relatedLoaded = false;
            return this._dictSrv.currentDictionary.getFullNodeInfo(node.id, refresh).then(() => {
                this._dictSrv.updateRigth.next(null);
            });
        }
        return Promise.resolve(null);
    }
    private _confirmMarkedItems(selectedNodes: any[], confirm: IConfirmWindow2): Promise<IConfirmButton> {
        const list = [];
        // const selectedNodes = this._dictSrv.getMarkedNodes();
        selectedNodes.forEach((node) => {
            if (list.length < WARNING_LIST_MAXCOUNT) {
                if (list.length === WARNING_LIST_MAXCOUNT - 1) {
                    list.push('... всего ' + selectedNodes.length + ' записей');
                } else {
                    list.push(node.title);
                }
            }
        });

        confirm.bodyList = list;
        return this._confirmSrv.confirm2(confirm).then((button) => {
            return button;
        });
    }

    private _restoreItems(): void {
        let hasFolding = false;

        this._dictSrv.getMarkedNodes().filter(n => !n.isDeleted).forEach(n => n.isMarked = false);

        const selectedNodes = this._dictSrv.getMarkedNodes().filter(n => n.isDeleted);

        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];
            if (node.parent && node.parent.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
                node.isMarked = false;
                return;
            } else {
                if (node.isNode) {
                    hasFolding = true;
                }
            }
        }

        const confirmRestore: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_RESTORE);

        this._confirmMarkedItems(selectedNodes, confirmRestore).then((button: IConfirmButton) => {
            if (button && button.result === 2) {

                let p: Promise<any> = Promise.resolve(CONFIRM_SUBNODES_RESTORE.buttons.find(b => b.result === 1));

                if (hasFolding) {
                    const _confrm = Object.assign({}, CONFIRM_SUBNODES_RESTORE);
                    _confrm.body = _confrm.body.replace('{{name}}', confirmRestore.bodyList.join(', '));
                    p = this._confirmSrv.confirm2(_confrm);
                }
                return p.then((confirmed: IConfirmButton) => {
                    if (confirmed) {
                        const needInclude = confirmed.result === 2;
                        this._dictSrv.setFlagForMarked('DELETED', needInclude, false)
                            .then(() => {
                                this._dictSrv.setMarkAllNone();
                                const message: IMessage = Object.assign({}, INFO_OPERATION_COMPLETE);
                                message.msg = message.msg
                                    .replace('{{RECS}}', confirmRestore.bodyList.join(', '))
                                    .replace('{{OPERATION}}', 'восстановлены.');
                                this._msgSrv.addNewMessage(message);
                            });
                    } else {
                        this._dictSrv.getMarkedNodes().forEach(n => n.isMarked = false);
                        this._dictSrv.reload();
                    }
                });
            } else {
                this._dictSrv.getMarkedNodes().forEach(n => n.isMarked = false);
                this._dictSrv.reload();
            }
            return Promise.resolve(null);
        });

    }


    /**
     * Physical delete marked elements on page
     */
    private _physicallyDelete(slicedNode?): Promise<any> {
        let selectedNodes;
        if (slicedNode) {
            selectedNodes = slicedNode;
        } else {
            selectedNodes = this._dictSrv.getMarkedNodes();
        }
        if (selectedNodes.length === 0) {
            // this._msgSrv.addNewMessage(DANGER_HAVE_NO_ELEMENTS);
            return;
        }

        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];

            if (node.isProtected) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
                return;
            }
        }

        const confirmDelete: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_HARDDELETE);
        if (slicedNode) {
            confirmDelete.body = 'Вы действительно хотите навсегда удалить копируемые записи:';
        }

        if (this.dictionaryId === 'sev-rules') {
            return this._dictSrv.readSevRule(selectedNodes).then(data => {
                if (data.length) {
                    const part = data.filter((p) => p.PARTICIPANT.length > 0);
                    if (part.length) {
                        const records = part.map((rec) => rec.RULE_TITLE).join(', ');
                        const tab = part.map((rec) => rec.PARTICIPANT.map((t) => t.CLASSIF_NAME).join(',')).join(',');
                        const tables = tab.split(',').filter((item, pos) => tab.split(',').indexOf(item) === pos);
                        this._msgSrv.addNewMessage({
                            type: 'warning',
                            title: 'Внимание',
                            msg: `Записи "${records}" удалить нельзя. Записи используются "${tables.join(', ')}"`
                        });
                    }
                    const r = data.map((node) => {
                        if (!node.PARTICIPANT.length) {
                            return node.RULE_ID;
                        }
                    });
                    const actualNodes = selectedNodes.filter((el) => r.indexOf(el.id) !== -1);
                    if (actualNodes.length) {
                        this._getConfirmMarkedItems(actualNodes, confirmDelete);
                    }
                    return;
                }
                return this._getConfirmMarkedItems(selectedNodes, confirmDelete);
            });
        } else {
            return this._getConfirmMarkedItems(selectedNodes, confirmDelete);
        }
    }

    private _getConfirmMarkedItems(selectedNodes, confirmDelete): Promise<any> {
        const titleId = selectedNodes[0].nodeTitleid;
        return this._confirmMarkedItems(selectedNodes, confirmDelete)
            .then((button: IConfirmButton) => {
                if (button && button.result === 2) {
                    return this._dictSrv.deleteMarked().then((results: IRecordOperationResult[]) => {
                        const deletedList = results.filter(r => !r.error)
                            .map(r => r.record[titleId] || r.record['CLASSIF_NAME']);
                        if (deletedList && deletedList.length) {
                            const message: IMessage = Object.assign({}, INFO_OPERATION_COMPLETE);
                            message.msg = message.msg
                                .replace('{{RECS}}', deletedList.join(', '))
                                .replace('{{OPERATION}}', 'удалены навсегда.');

                            this._msgSrv.addNewMessage(message);
                        }
                    });
                }
                return Promise.resolve(null);
            });
    }

    private _physicallyDeleteNomenkl() {
        const selectedNodes = this._dictSrv.getMarkedNodes();

        if (selectedNodes.length === 0) {
            return;
        }

        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];

            if (node.isProtected) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
                return;
            }
        }
        const confirmClosed: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_NOMENKL_CLOSED);
        this._dictSrv.checkRelatedNomenkl(selectedNodes, 'checkClosed').then(result => {
            if (result.closed.length) {
                this._confirmMarkedItems(result.closed, confirmClosed).then(button => {
                    result.closed.forEach(l => l.isMarked = false);
                    if (button && button.result === 2) {
                        this._dictSrv.checkRelatedNomenkl(result.closed, 'closed').then(data => {
                            this._physicallyDelete();
                        }).catch(e => console.log(e));
                    } else {
                        this._physicallyDelete();
                    }
                });
            } else {
                if (result.oldClosed.length) {
                    const warn = Object.assign({}, WARN_ELEMENT_CLOSED);
                    warn.msg = warn.msg.replace('{{elem}}', result.oldClosed.map((n: EosDictionaryNode) => n.data.rec.CLASSIF_NAME).join(', '));
                    this._msgSrv.addNewMessage(warn);
                }
                this._physicallyDelete();
            }
        }).catch(e => {
            console.log(e);
        });
    }

    /**
     * Logic delete marked elements on page
     */
    private _deleteItems(): void {

        // let delCount = 0, allCount = 0;
        let selectedNodes = this._dictSrv.getMarkedNodes().filter(n => !n.isDeleted);

        if (selectedNodes.length === 0) {
            // this._msgSrv.addNewMessage(WARN_LOGIC_DELETE);
            return;
        }
        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];

            if (node.isProtected) {
                this._dictSrv.setMarkForNode(node , false, true);
                // node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);

                return;
            }
        }
        this._dictSrv.checkPreDelete(selectedNodes).then(({ continueDelete, selectdNodeWitwoutDate }) => {
            if (!continueDelete) {
                return;
            } else {
                if (selectdNodeWitwoutDate) {
                    selectedNodes = selectdNodeWitwoutDate;
                }
                const confirmDelete: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_LOGICDELETE);

                return this._confirmMarkedItems(selectedNodes, confirmDelete).then((button: IConfirmButton) => {
                    if (button && button.result === 2) {
                        const message: IMessage = Object.assign({}, INFO_OPERATION_COMPLETE);
                        message.msg = message.msg
                            .replace('{{RECS}}', confirmDelete.bodyList.join(', '))
                            .replace('{{OPERATION}}', 'удалены логически.');

                        return this._dictSrv.setFlagForMarked('DELETED', true, true).then((flag) => {
                            this._dictSrv.setMarkAllNone();
                            this._msgSrv.addNewMessage(message);
                        });
                    }
                    return Promise.resolve(null);
                });
            }
        });
    }

    /**
     * Mark selected 'CLOSE' to 1 (Nomenklature Action)
     */
    private _closeItems(): void {
        const fieldName = 'CLOSED';
        let rdyCount = 0, allCount = 0;
        this._dictSrv.getMarkedNodes().forEach((node) => {
            if (node.isMarked) {
                allCount++;
            }
            if (node.isMarked && node.data.rec[fieldName]) {
                rdyCount++;
            }
            if (node.isMarked && node.isDeleted) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_DELETED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
            }
        });
        if (rdyCount === allCount) {
            this._msgSrv.addNewMessage(WARN_LOGIC_CLOSE);
        }
        this._dictSrv.setFlagForMarked(fieldName, false, true);
    }

    /**
     * Mark selected 'CLOSE' to 0 (Nomenklature Action)
     */
    private _openItems(): void {
        const fieldName = 'CLOSED';
        let rdyCount = 0, allCount = 0;
        this._dictSrv.getMarkedNodes().forEach((node) => {
            if (node.isMarked) {
                allCount++;
            }
            if (node.isMarked && !node.data.rec[fieldName]) {
                rdyCount++;
            }
            if (node.isMarked && node.isDeleted) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_DELETED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
            }
        });
        if (rdyCount === allCount) {
            this._msgSrv.addNewMessage(WARN_LOGIC_OPEN);
        }
        this._dictSrv.setFlagForMarked(fieldName, false, false);
    }

    private _editCounter(type: E_COUNTER_TYPE) {
        if (this.dictionaryId !== 'departments' && this.dictionaryId !== 'docgroup') {
            this._msgSrv.addNewMessage(DANGER_EDIT_DICT_NOTALLOWED);
            return;
        }
        this.modalWindow = null;
        if (type === E_COUNTER_TYPE.counterDepartmentMain) {
            this.modalWindow = this._modalSrv.show(CounterNpEditComponent, { class: 'counter-np-modal modal-lg', animated: false });
            this.modalWindow.content.initByNodeData(type, null);
        } else {
            const node = this._dictSrv.listNode;
            if (node) {
                if (node.data.PROTECTED) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
                } else if (type === E_COUNTER_TYPE.counterDepartment && node.data.rec['NUMCREATION_FLAG'] !== 1) {
                    this._msgSrv.addNewMessage(DANGER_DEPART_NO_NUMCREATION);
                } else {
                    this.modalWindow = this._modalSrv.show(CounterNpEditComponent, { class: 'counter-np-modal modal-lg', animated: false });
                    this.modalWindow.content.initByNodeData(type, node.data.rec);
                }
            } else {
                this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
            }
        }

        if (this.modalWindow) {
            const subscription = this.modalWindow.content.onChoose.subscribe(() => {
                subscription.unsubscribe();
            });
        }


    }

    private _editNode() {
        const node = this._dictSrv.listNode;
        if (node) {
            if (node.data.PROTECTED) {
                this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else if (node.isDeleted && !Features.cfg.canEditLogicDeleted) {
                this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
            } else /*(!node.data.PROTECTED && !node.isDeleted) */ {
                const url = this._router.url;
                this._storageSrv.setItem(RECENT_URL, url);
                const _path = node.getPath();
                _path.push('edit');
                this._router.navigate(_path);
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }
    }



    private _openAdditionalFields() {
        const node = this._dictSrv.listNode;
        if (node) {
            this.nodeList.openAdditionalFields(node);
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private _openPrjDefaultValues() {
        this.modalWindow = null;
        const node = this._dictSrv.listNode;
        if (node) {
            this.modalWindow = this._modalSrv.show(PrjDefaultValuesComponent, {
                class: 'prj-default-values-modal moodal-lg', backdrop: true, ignoreBackdropClick: true
            });
            const content = {
                nodeDescription: node.title,
                isnNode: node.data.rec['ISN_NODE'],
            };
            this.modalWindow.content.init(content);
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private _openAdvancedCardRK() {
        this.modalWindow = null;
        const node = this._dictSrv.listNode;
        if (node) {
            if (node.data.PROTECTED) {
                this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else {
                this.modalWindow = this._modalSrv.show(AdvCardRKEditComponent, { class: 'adv-card-rk-modal modal-lg', backdrop: true, ignoreBackdropClick: true });
                this.modalWindow.content.initByNodeData(node.data.rec);
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }

        // if (this.modalWindow) {
        //     const subscription = this.modalWindow.content.onChoose.subscribe(() => {
        //         subscription.unsubscribe();
        //     });
        // }
    }

    private _openCopyProperties(renewChilds = false) {
        const node = this._dictSrv.listNode;
        if (node) {
            Promise.resolve(null).then(() => {
                if (renewChilds) {
                    return node.id;
                } else {
                    // return '0.2U9.'; // for debug
                    return this._waitClassif.chooseDocGroup();
                }
            }).then((from_due) => {
                if (from_due) {
                    this.__openCopyProperties(node, from_due, renewChilds);
                } else {
                    // this._msgSrv.addNewMessage(WARN_SELECT_NODE);
                }
            });
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private __openCopyProperties(node: EosDictionaryNode, from_due: string, renewChilds: boolean) {
        this.modalWindow = this._modalSrv.show(CopyPropertiesComponent, {
            class: 'copy-properties-modal moodal-lg'
        });
        (<CopyPropertiesComponent>this.modalWindow.content).init(node.data.rec, from_due, renewChilds);
        const subscriptionClose = this.modalWindow.content.onClose.subscribe(() => {
            this.modalWindow = null;
            if (node) {
                node.relatedLoaded = false;
                this._dictSrv.rereadNode(node.id).then((data) => {
                    node.relatedLoaded = false;
                    this._dictSrv.setMarkAllNone();
                });
            }
            subscriptionClose.unsubscribe();
        });
    }


    private _openModalWindow() {
        this.modalWindow = null;
        const node = this._dictSrv.listNode;
        if (node) {
            if (node.data.PROTECTED) {
                //  this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else {
                this.modalWindow = this._modalSrv.show(EdsImportComponent, { class: 'adv-card-rk-modal modal-lg' });
                this.modalWindow.content.node = node;
            }
        }
    }
    private _checkDeletNode(slicedNode: EosDictionaryNode[]) {
        let countAll = 0;
        let countDel = 0;
        slicedNode.forEach(el => {
            countAll++;
            if (el.isDeleted) {
                countDel++;
            }
            el.children.forEach(child => {
                countAll++;
                if (child.isDeleted) {
                    countDel++;
                }
            });
        });
        if (countDel > 0) {
            if (countAll === countDel) {
                return -1;
            }
            return 1;
        } else {
            return 0;
        }
    }
    // MoveClassif?dueTo=0.2VK.&type=RUBRIC_CL&dues=0.2EYD3.2EZEN.%2C0.2EYD3.2EZEP.%2C0.2EYD3.2EZER.&weight=1 HTTP/1.1
    // dueTo=0.2VK. => где мы находимся
    // type=RUBRIC_CL => таблица где происходит копирование
    // dues= записи которые переносим через запятую
    // weight = пока не знаю чему он должен быть равен
    //
    private pasteNode(slicedNode: any[], dueTo, whenCopy?) {
        this._dictSrv.updateViewParameters({ updatingList: true });
        this._dictSrv.paste(slicedNode, dueTo, whenCopy)
            .then(elem => {
                if (this.dictionaryId === 'departments') {
                    this._dictSrv.getMarkedNodes().forEach(node => {
                        node.isMarked = false;
                    });
                    slicedNode.forEach(node => {
                        node.isMarked = true;
                    });
                    this._physicallyDelete(slicedNode).then(() => {
                        // обновляем полностью справочник после операции вставки
                        this.updateAfterPaste();
                    });
                }   else {
                    // обновляем полностью справочник после операции вставки
                    this.updateAfterPaste();
                }

                //  this._ch.detectChanges();
            })
            .catch(er => {
                console.log('er', er);
            });
    }
    private updateAfterPaste() {
        const id = this.dictionaryId;
        if (this._dictSrv['_srchCriteries']) {
            this._storageSrv.setItem('searchCriteries', this._dictSrv['_srchCriteries']);
        }
        this._dictSrv.closeDictionary();
        this._dictSrv.openDictionary(id).then(() => {
            if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.custom) {
                if (this.dictionary.id === 'templates') {
                    this.dictionary.descriptor['top'] = this._nodeId;
                }
                this.dictionary.root.children = null;
                const n: CustomTreeNode = this._dictSrv.currentDictionary.descriptor.setRootNode(this._nodeId);
                if (n) {
                    this.title = n.title;
                }
                this._dictSrv.setCustomNodeId(this._nodeId);
                this._dictSrv.selectCustomTreeNode(this._nodeId).then(() => {
                    this._dictSrv.reload();
                    this._storageSrv.removeItem('searchCriteries');
                });
            } else if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.linear) {
                if (this._nodeId === '0.') {
                    this._nodeId = '';
                }
                this._dictSrv.selectTreeNode(this._nodeId).then(() => {
                    this._dictSrv.reload();
                    this._storageSrv.removeItem('searchCriteries');
                });
            } else {
                this._dictSrv.selectTreeNode(this._nodeId).then(() => {
                    this._dictSrv.reload();
                    this._storageSrv.removeItem('searchCriteries');

                });
            }
        });
    }
    private _copy(): void {
        // то что вырезано и записано
        const slicedNode: EosDictionaryNode[] = this._storageSrv.getItem('markedNodes');
        // хранится то куда будем вставлять данные
        const dueTo = this._router.url.split('/').pop();
        // скорее всего нужно ещё и откуда передать
        const deletNode = this._checkDeletNode(slicedNode);
        if (deletNode !== 0 && this.dictionaryId === 'departments') {
            this.modalWindow = this._modalSrv.show(DictionaryPasteComponent);
            if (deletNode === -1) {
                this.modalWindow.content.disabledFirst = true;
                this.modalWindow.content.whenCopyNode = 1;
            }
            this.modalWindow.content.closeWindowCheck.subscribe((ans) => {
                if (!ans['cancel']) {
                    this.pasteNode(slicedNode, dueTo, ans['whenCopy']);
                }
                this.modalWindow.hide();
            });
        } else {
            this.pasteNode(slicedNode, dueTo);
        }
    }

    // status-reply Состояния исполнения (исполнитель)
    // status-exec Состояния исполнения (поручение)
    // reprj-priority Приоритеты проектов резолюций
    // citizens Граждане
    private _cutNode(): void {
        // Для объединения можно выбирать только карточки организаций. Или если по другому листья но не папки
        switch (this.dictionaryId) {
            /* case 'region':
                message = 'Для объединения можно выбирать только регионы.';
                break; */
            case 'organization':
                const checkNode = this._dictSrv.getMarkedNodes().every((node: EosDictionaryNode) => {
                    return !node.isNode;
                });
                if (!checkNode) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: 'Для объединения можно выбирать только карточки организаций.'
                    });
                    return;
                }
                break;
            /* case 'rubricator':
                message = 'Для объединения можно выбирать только карточки рубрикаторов.';
                break; */
        }
        this._dictSrv.cutNode();
    }
    private _combine() {
        const slicedNode: EosDictionaryNode[] = this._storageSrv.getItem('markedNodes'); // this.nodeList.nodes.filter((node: EosDictionaryNode) => node.isSliced);
        const markedNode: EosDictionaryNode[] = this.nodeList.nodes.filter((node: EosDictionaryNode) => {
            if (this.dictionaryId === 'organization') {
                if (node.isNode) {
                    node.isMarked = false;
                }
                return node.isMarked && !node.isSliced && !node.isNode;
            } else {
                return node.isMarked && !node.isSliced;
            }
        });
        if (slicedNode.length && markedNode.length === 1) {
            this._confirmSrv.confirm(CONFIRM_COMBINE_NODES).then(resp => {
                if (resp) {
                    this._dictSrv.combine(slicedNode, markedNode);
                }
            });
        } else {
            this._msgSrv.addNewMessage({ type: 'warning', title: 'Предупреждение', msg: 'Для объединения должна быть выбрана одна запись' });
        }
    }
    private _uncheckNewEntry() {
        this._dictSrv.uncheckNewEntry();
    }
    private _openDopRequisetes() {
        const config: IOpenClassifParams = {
            classif: 'AR_EDITOR',
        };
        config.id = this.dictionary.id !== 'citizens' ? 'organiz_cl' : 'citizen';
        this._waitClassif.openClassif(config).then(() => {
            this._dictSrv.updateDopRec();
        }).catch(e => {
            this._dictSrv.updateDopRec();
            console.warn(e);
        });
    }

    private _copyNodesToBuffer() {
        this._dictSrv.fillBufferNodes();
    }

    private _openCopyNode() {
        this.nodeList.openCopyNode(this._dictSrv.bufferNodes);
    }
    private _checkDictionaryId(): boolean {
        return ['citizens', 'organization'].some(id => {
            return id === this.dictionaryId;
        });
    }
    private _defaultSettingsCollision() {
        const body1 = 'Применить значения по умолчанию для всех групп';
        let body = 'Применить значения по умолчанию для коллизий группы:';
        let mess;
        if (this.title === 'Коллизии СЭВ') {
            mess = body1;
        } else {
            mess = body += ' ' + this.title;
        }

        CONFIRM_SEV_DEFAULT.body = mess;
        this._confirmSrv.confirm(CONFIRM_SEV_DEFAULT).then(d => {
            if (d) {
                this.dictionary.descriptor.updateDefaultValues(this.nodeList.nodes).then((h) => {
                    if (h) {
                        this._dictSrv.reload();
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    } else {
                        this._msgSrv.addNewMessage(INFO_NOTHING_CHANGES);
                    }
                }).catch(e => {
                    this._msgSrv.addNewMessage(WARN_SAVE_FAILED);
                });
            }
        });
    }
    private _openProtocolSecyrity() {
        const node = this.nodeList;
        if (this.protocolWindow && !this.protocolWindow.closed) {
            this.protocolWindow.close();
            this.protocolWindow = window.open(`../Pages/Rc/ProtView.aspx?ref_isn=${node.markedInfo.nodes[0].id}&tableName=SECURITY_CL&pkName=SECURLEVEL`, '_blank', 'width=900,height=700');
        } else {
            this.protocolWindow = window.open(`../Pages/Rc/ProtView.aspx?ref_isn=${node.markedInfo.nodes[0].id}&tableName=SECURITY_CL&pkName=SECURLEVEL`, '_blank', 'width=900,height=700');
        }
    }
    /* проверка есть ли вложенные подразделения */
    private _checkIncludeDepartment(dues: string): boolean {
        let flag = false;
        this.customTreeData[0]['children'].forEach(element => {
            if (element['id'] === dues && element['children'].length > 0) {
                flag = true;
            }
        });
        return flag;
    }
    /* открытие окна выбора шаблона для подразделения */
    private _openPrintTemplate(dues, checkYear, d) {
        const config = { ignoreBackdropClick: true };
        this.modalWindow = this._modalSrv.show(PrintTemplateComponent, config);
        this.modalWindow.content.checkIncludeDir = d;
        this.modalWindow.content.onHide.subscribe((template) => {
            if (template) {
                this._dictSrv.printNomencTemplate(dues, '' + template['item']['ISN_TEMPLATE'], checkYear, template['printIncludeDir']);
            }
            this.modalWindow.hide();
        });
    }
    /* выполнение открытия окна в разных условиях */
    private _printNomenc() {
        const url = this._router.url;
        const dues: string = url.split('/').pop();
        const checkYear = this._dictSrv.getFilterValue('YEAR');
        this._openPrintTemplate(dues, checkYear, this._checkIncludeDepartment(dues));
    }

}
