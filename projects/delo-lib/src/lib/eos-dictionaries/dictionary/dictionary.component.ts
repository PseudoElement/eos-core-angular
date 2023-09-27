import { DEPARTMENTS_DICT } from './../consts/dictionaries/department.consts';
import { AdvCardRKEditComponent } from './../adv-card/adv-card-rk.component';
import {
    AfterViewInit,
    Component,
    DoCheck,
    HostListener,
    OnDestroy,
    ViewChild,
    OnInit,
    TemplateRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import {
    CONFIRM_SUBNODES_RESTORE, WARNING_LIST_MAXCOUNT, CONFIRM_OPERATION_LOGICDELETE,
    CONFIRM_OPERATION_RESTORE, CONFIRM_OPERATION_HARDDELETE,
    CONFIRM_COMBINE_NODES, CONFIRM_SEV_DEFAULT,
    CONFIRM_OPERATION_NOMENKL_CLOSED
} from '../../app/consts/confirms.const';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import { E_DICT_TYPE, E_RECORD_ACTIONS, IActionEvent, IDictionaryViewParameters, IRecordOperationResult, SearchFormSettings, SEARCHTYPE } from '../../eos-dictionaries/interfaces';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { EosSandwichService } from '../services/eos-sandwich.service';
import { EosBreadcrumbsService } from '../../app/services/eos-breadcrumbs.service';
import { RECENT_URL } from '../../app/consts/common.consts';
import { NodeListComponent } from '../node-list/node-list.component';
import { CreateNodeComponent } from '../create-node/create-node.component';
import { IPaginationConfig } from '../../eos-common/interfaces/interfaces';
import { CounterNpEditComponent, E_COUNTER_TYPE } from '../counter-np-edit/counter-np-edit.component';
import { CustomTreeNode } from '../tree2/custom-tree.component';
import { EosAccessPermissionsService, APS_DICT_GRANT } from '../../eos-dictionaries/services/eos-access-permissions.service';
import { NOMENKL_DICT } from '../../eos-dictionaries/consts/dictionaries/nomenkl.const';
import { takeUntil } from 'rxjs/operators';
import { SevSyncDictsComponent } from '../sev-modals/sev-sync-dicts/sync-dicts.component';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { SEV_CLEAR_IDENT_CODES } from '../../eos-dictionaries/consts/messages.consts';

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
import { CABINET_DICT } from '../../eos-dictionaries/consts/dictionaries/cabinet.consts';
import { PrjDefaultValuesComponent } from '../../eos-dictionaries/prj-default-values/prj-default-values.component';
import { CA_CATEGORY_CL } from '../../eos-dictionaries/consts/dictionaries/ca-category.consts';
import { TOOLTIP_DELAY_VALUE, EosTooltipService } from '../../eos-common/services/eos-tooltip.service';
import { IConfirmWindow2, IConfirmButton } from '../../eos-common/confirm-window/confirm-window2.component';
import { IMessage, IOpenClassifParams } from '../../eos-common/interfaces';
import { WaitClassifService } from '../../app/services/waitClassif.service';
import { EdsImportComponent } from '../../eos-dictionaries/eds-import/eds-import.component';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { CopyPropertiesComponent } from '../../eos-dictionaries/copy-properties/copy-properties.component';
import { CreateNodeBroadcastChannelComponent } from '../../eos-dictionaries/create-node-broadcast-channel/create-node-broadcast-channel.component';
import { NpCounterOverrideService, ORGANIZ_CL } from '../../eos-rest';
import { COLLISIONS_SEV_DICT } from '../../eos-dictionaries/consts/dictionaries/sev/sev-collisions';
import { CheckIndexNomenclaturComponent } from '../../eos-dictionaries/check-index-nomenclatur/check-index-nomenclatur.component';
import { DictionaryPasteComponent } from '../../eos-dictionaries/dictionary-paste/dictionary-paste.component';
import { PrintTemplateComponent } from '../../eos-dictionaries/print-template/print-template.component';
import { Templates } from '../consts/dictionaries/templates.consts';
import { ViewProtocolServices } from '../../eos-dictionaries/services/eos-view-prot.services';
import { DictionaryDescriptor } from '../../eos-dictionaries/core/dictionary-descriptor';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { CONFIRM_OPERATION_HARDDELETE_COPY_MASSAGE } from '..';
import { E_TECH_RIGHT } from '../../eos-rest/interfaces/rightName';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Component({
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit, OnInit {
    @ViewChild('nodeList', { static: true }) nodeList: NodeListComponent;
    @ViewChild('tree', { static: true }) treeEl;
    @ViewChild('custom-tree', { static: false }) customTreeEl;
    @ViewChild('selectedWrapper', { static: true }) selectedEl;
    @ViewChild('quickSearchCtl', { static: false }) quickSearchCtl;
    @ViewChild('searchCtl', { static: true }) searchCtl;
    @ViewChild('modalWord', { static: true }) modalWord: TemplateRef<any>;
    isLoading = false;
    modalWordRef: BsModalRef;
    newNameBaseDepartment: string = '';
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

    get disableCollection() {
        return this.newNameBaseDepartment === '' || this.newNameBaseDepartment.length > 64;
    }

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
    sevClearIdentCodesProgress: boolean = false;

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
        private _viewProtocolSrv: ViewProtocolServices,
        private _appContext: AppContext,
        _bcSrv: EosBreadcrumbsService,
        _tltp: EosTooltipService,
        private _npEditCountOverride: NpCounterOverrideService,
        private _api: PipRX
    ) {
        this.accessDenied = false;
        this.isLoading = false;
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

                            if (this._dictSrv.currentDictionary && this.searchSettings.entity_dict !== this._dictSrv.currentDictionary.id) {
                                this.clearFindSettings();
                            }

                            this._dictSrv.setMarkAllNone();
                            if (this._dictSrv.currentDictionary && this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.custom) {
                                if (this.dictionary.id === E_DICTIONARY_ID.TEMPLATES) {
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
                            } else if (this._dictSrv.currentDictionary && this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.linear) {
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
                    setTimeout(() => {
                        this.paginationConfig = config;
                    }, 250);
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
                    if (this.dictionaryId === NOMENKL_DICT.id || this.dictionaryId === COLLISIONS_SEV_DICT.id || this.dictionaryId === Templates.id) {
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

        _dictSrv.resetSerchError$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.resetSearch();
            });
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.setStyles();
            if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
                this._npEditCountOverride.setOrgEditDeny()
                .finally(() => {
                    this.isLoading = true;
                });
            } else {
                this.isLoading = true;
            }
        }, 250);
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

            case E_RECORD_ACTIONS.userOrderCut:
                this.nodeList.userOrderCut();
                this.dictionary.treeResort();
                break;

            case E_RECORD_ACTIONS.userOrderPaste:
                this.nodeList.userOrderPaste(evt.params);
                this.dictionary.treeResort();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this.nodeList.moveDown();
                this.dictionary.treeResort();
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
                if (this.dictionaryId === E_DICTIONARY_ID.DID_NOMENKL_CL) {
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

            case E_RECORD_ACTIONS.renameBaseDepartment:
                this._renameBaseDepartment();
                break;

            case E_RECORD_ACTIONS.sevSyncDicts:
                this._showSyncDictsModal();
                break;

            case E_RECORD_ACTIONS.sevClearIdentityCodes:
                this._clearIdentityCodes();
                break;

            case this._npEditCountOverride.handleAction(evt.action, this):
                break;

            case E_RECORD_ACTIONS.transferDocuments:
                this.transferDocuments();
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
                this.searchCtl.close?.();
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

    switchFastSearch(val: any) {
        if (this.quickSearchCtl && this.searchSettings.quick.data || val === null) {
            this.quickSearchCtl.quickSearch({ keyCode: 13 }, val);
        } else {
            // this.fastSearch = !this.fastSearch;
            this.fastSearch = val;
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
        if (this.dictionaryId === E_DICTIONARY_ID.DID_NOMENKL_CL ||
            (this.dictionaryId === DEPARTMENTS_DICT.id && this.dictMode === 0)) {
            return true;
        }
        return false;
    }

    markedCounter(): number {
        return this._dictSrv.getMarkedNodes().length;
    }

    submitModalWord() {
        if (this.newNameBaseDepartment !== this._dictSrv.getCardName()) {
            this._dictSrv.updateNameDepartment(this.newNameBaseDepartment)
                .then(() => {
                    this._appContext.nameCentralСabinet = this.newNameBaseDepartment;
                    this._dictSrv.setCardName(this.newNameBaseDepartment);
                    this.modalWordRef.hide();
                })
                .catch(() => {
                    this.modalWordRef.hide();
                });
        } else {
            this.modalWordRef.hide();
        }
    }

    cancelModalWord() {
        this.newNameBaseDepartment = this._dictSrv.getCardName();
        this.modalWordRef.hide();
    }

    /**
     * @description convert selected persons to list of organization representatives,
     * add it to department organization if it exists upwards to tree
     */
    private _createRepresentative() {
        if (this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS) {
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

        if (dictionary.descriptor.id === E_DICTIONARY_ID.BROADCAST_CHANNEL) {
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
        if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
            if (params && params.IS_NODE && openEdit) {
                this.openClassifGopRc(openEdit, params);
                return;
            } else if (params && !params.IS_NODE && openEdit) {
                this._openCreate(params);
                return;
            } else if (!params && !openEdit) {
                if (this._dictSrv.getMarkedNodes()[0].isNode) {
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
        const datas: any = {};
        const rc = [];
        const id = [];
        const node = this.dictionary.getNode(this._dictSrv.redactNodeId);
        const config: IOpenClassifParams = this._dictSrv.currentDictionary.descriptor.getConfigOpenGopRc(openEdit, node, this._nodeId, params);
        if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ || this.dictionaryId === E_DICTIONARY_ID.CITIZENS) {
            this.nodeList.nodes.forEach((node) => {
                if (node.data['rec']['IS_NODE'] || this.dictionaryId === E_DICTIONARY_ID.CITIZENS) {
                    id.push(node.id);
                    rc.push(node.data['rec']['ISN_NODE']);
                }
            });
            if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
                datas.rc_id = rc.map((item) => String(item));
                datas.due = id;
            } else {
                datas.rc_id = id.map((item) => String(item));
            }
            config.datas = datas;
        }
        this._waitClassif.openClassif(config).then(() => {
            this.updateRigthFields(node);
            this._dictSrv.setMarkAllNone();
            this._dictSrv.reload();
        }).catch((e) => {
            if (this._dictSrv.currentDictionary && this.dictionary && this._dictSrv.currentDictionary.id === this.dictionary.id) { // обновляем только тот справочник в котором находимся
                this.updateRigthFields(node);
                this._dictSrv.setMarkAllNone();
                this._dictSrv.reload();
            }
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
        if (confirm.buttons.length === 0) {
            return Promise.resolve({'result': 2, title: 'Да'});
        }
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

    private async _restoreItems(): Promise<any> {
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

        const res = await this._dictSrv.dictionatyOverrideSrv.deleteRestoreExtentions(this._dictSrv, selectedNodes.filter(n => n.delete),
            'элемент "{{elem}}" защищен от восстановления! Восстановление невозможно.');
        if (!res) {
            return Promise.resolve(null);
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
                        let deletedLogickItem: string = 'DELETED';
                        if (this.dictionaryId === E_DICTIONARY_ID.FORMAT) {
                            deletedLogickItem = 'DEL_COL';
                        }
                        this._dictSrv.setFlagForMarked(deletedLogickItem, needInclude, false)
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
    private async _physicallyDelete(slicedNode?): Promise<any> {
        let selectedNodes;
        if (slicedNode) {
            selectedNodes = slicedNode;
        } else {
            selectedNodes = this._dictSrv.getMarkedNodes();
        }
        if (selectedNodes.length === 0) {
            // this._msgSrv.addNewMessage(DANGER_HAVE_NO_ELEMENTS);
            return void 0;
        }

        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];

            if (node.isProtected) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
                return void 0;
            }
        }
        const res = await this._dictSrv.dictionatyOverrideSrv.deleteRestoreExtentions(this._dictSrv, selectedNodes,
            'элемент "{{elem}}" защищен от удаления! Удаление невозможно.');
            if (!res) {
                return Promise.resolve(null);
            }

        const confirmDelete: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_HARDDELETE);
        if (this.dictionaryId === E_DICTIONARY_ID.CABINET) {
            confirmDelete.bodyAfterList = '';
        }
        if (slicedNode) {
            confirmDelete.buttons = [];
        }

        if (this.dictionaryId === E_DICTIONARY_ID.RULES_SEV) {
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
                    return void 0;
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
                        const deletedList = results.filter(r => r && !r.error)
                            .map(r => r.record[titleId] || r.record['CLASSIF_NAME']);
                        if (deletedList && deletedList.length) {
                            const message: IMessage = Object.assign({}, INFO_OPERATION_COMPLETE);
                            message.msg = message.msg
                                .replace('{{RECS}}', deletedList.join(', '))
                                .replace('{{OPERATION}}', 'удалены навсегда.');

                            this._msgSrv.addNewMessage(message);
                        }
                        return results;
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
    private async _deleteItems(): Promise<any> {

        // let delCount = 0, allCount = 0;
        let selectedNodes = this._dictSrv.getMarkedNodes().filter(n => !n.isDeleted);

        if (selectedNodes.length === 0) {
            // this._msgSrv.addNewMessage(WARN_LOGIC_DELETE);
            return;
        }
        for (let i = 0; i < selectedNodes.length; i++) {
            const node = selectedNodes[i];

            if (node.isProtected) {
                this._dictSrv.setMarkForNode(node, false, true);
                // node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);

                return;
            }
        }
        const res = await this._dictSrv.dictionatyOverrideSrv.deleteRestoreExtentions(this._dictSrv, selectedNodes,
            'элемент "{{elem}}" защищен от удаления! Удаление невозможно.');
            if (!res) {
                return Promise.resolve(null);
            }
        this._dictSrv.checkPreDelete(selectedNodes).then(({ continueDelete, selectdNodeWitwoutDate }) => {
            if (!continueDelete) {
                return void 0;
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
                        let deletedLogickItem: string = 'DELETED';
                        if (this.dictionaryId === E_DICTIONARY_ID.FORMAT) {
                            deletedLogickItem = 'DEL_COL';
                        }
                        return this._dictSrv.setFlagForMarked(deletedLogickItem, true, true).then((flag) => {
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

    public _editCounter(type: number) {
        if (!this._npEditCountOverride.validateOperation(this, type)) {
            return;
        }
        if (this.dictionaryId !== E_DICTIONARY_ID.DEPARTMENTS && this.dictionaryId !== E_DICTIONARY_ID.DOCGROUP) {
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

    // private _checkDeletNode(slicedNode: EosDictionaryNode[]) {
    //     let countAll = 0;
    //     let countDel = 0;
    //     slicedNode.forEach(el => {
    //         countAll++;
    //         if (el.isDeleted) {
    //             countDel++;
    //         }
    //         el.children.forEach(child => {
    //             countAll++;
    //             if (child.isDeleted) {
    //                 countDel++;
    //             }
    //         });
    //     });
    //     if (countDel > 0) {
    //         if (countAll === countDel) {
    //             return -1;
    //         }
    //         return 1;
    //     } else {
    //         return 0;
    //     }
    // }
    // MoveClassif?dueTo=0.2VK.&type=RUBRIC_CL&dues=0.2EYD3.2EZEN.%2C0.2EYD3.2EZEP.%2C0.2EYD3.2EZER.&weight=1 HTTP/1.1
    // dueTo=0.2VK. => где мы находимся
    // type=RUBRIC_CL => таблица где происходит копирование
    // dues= записи которые переносим через запятую
    // weight = пока не знаю чему он должен быть равен
    //

    private pasteNode(slicedNode: any[], dueTo, whenCopy?) {
        this._dictSrv.updateViewParameters({ updatingList: true });
        this._dictSrv.paste(slicedNode, dueTo, whenCopy)
            .then(async elem => {
                if (this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS) {
                    this._dictSrv.getMarkedNodes().forEach(node => {
                        node.isMarked = false;
                    });
                    const listTodelet = [];
                    slicedNode.forEach(node => {
                        node.isMarked = true;
                        listTodelet.push(`${node.title}`);
                    });
                    const warnDeletion: IConfirmWindow2 = Object.assign({}, CONFIRM_OPERATION_HARDDELETE_COPY_MASSAGE, { bodyList: listTodelet });
                    const button = await this._confirmSrv.confirm2(warnDeletion);
                    if (button && button.result !== 1) {
                        this.updateAfterPaste();
                        return ;
                    }
                    this._dictSrv.currentDictionary.descriptor.checknodeAfterPaste(slicedNode, this._confirmSrv, dueTo).then(async (afterDeleted: {deletingNodes, warnDeletion}) => {
                        if (!afterDeleted.deletingNodes || !afterDeleted.deletingNodes.length) {
                            this.updateAfterPaste();
                        } else {
                            await this._physicallyDelete(afterDeleted.deletingNodes);
                            // обновляем полностью справочник после операции вставки
                            this.updateAfterPaste();
                        }
                        if (afterDeleted.warnDeletion) {
                            this._confirmSrv.confirm2(afterDeleted.warnDeletion);
                        }
                    });
                } else {
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
                if (this.dictionary.id === E_DICTIONARY_ID.TEMPLATES) {
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

    private async _copy(): Promise<void> {
        // то что вырезано и записано
        const slicedNode: EosDictionaryNode[] = this._storageSrv.getItem('markedNodes');
        if (this._npEditCountOverride.checkCopyElementTech(this.dictionaryId, slicedNode)) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Среди копируемых карточек организаций есть карточки, редактирование которых запрещено'
            });
            return;
        }
        // хранится то куда будем вставлять данные
        const dueTo = this._router.url.split('/').pop();
        // скорее всего нужно ещё и откуда передать
        const allParams = [];
        const elementAll = [];
        const elementDelet = [];
        slicedNode.forEach((item) => {
            if (item.isNode) {
                allParams.push(this.dictionary.descriptor.getAllNodesInParents(item.id));
            }
        })
        const element = await Promise.all(allParams);
        if (element[0]) {
            element[0].forEach((item) => {
                elementAll.push(item);
                if (item['DELETED'] === 1) {
                    elementDelet.push(item);
                }
            });
        }
        // const deletNode = this._checkDeletNode(slicedNode);
        if (/* dueTo !== slicedNode[0]['parentId'] &&  */elementDelet.length > 0 && this.dictionaryId === E_DICTIONARY_ID.DEPARTMENTS) {
            this.modalWindow = this._modalSrv.show(DictionaryPasteComponent);
            if (elementAll.length === elementDelet.length) {
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
            case E_DICTIONARY_ID.ORGANIZ:
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
            if (this.dictionaryId === E_DICTIONARY_ID.ORGANIZ) {
                if (node.isNode) {
                    node.isMarked = false;
                }
                return node.isMarked && !node.isSliced && !node.isNode;
            } else {
                return node.isMarked && !node.isSliced;
            }
        });
        if (this._npEditCountOverride.checkCopyElementTech(this.dictionaryId, slicedNode, markedNode)) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Среди объединяемых карточек организаций есть карточки, редактирование которых запрещено'
            });
            return;
        }
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
        config.id = this.dictionary.id !== E_DICTIONARY_ID.CITIZENS ? 'organiz_cl' : E_DICTIONARY_ID.CITIZENS;
        this._waitClassif.openClassif(config).then(() => {
            this._dictSrv.updateDopRec();
            // this.resetSearch();
        }).catch(e => {
            this._dictSrv.updateDopRec();
            // this.resetSearch();
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
        return [
            E_DICTIONARY_ID.CITIZENS,
            E_DICTIONARY_ID.ORGANIZ,
        ].some(id => {
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
                this.dictionary.descriptor.updateDefaultValues(Array.from(this.dictionary.nodes).map(n => n[1]).filter(n => n.id !== null)).then((h) => {
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

    private _openProtocolSecyrity(): void {
        this._viewProtocolSrv.getUrlProtocol(this.dictionary.descriptor as DictionaryDescriptor, this.nodeList.markedInfo.nodes);
    }

    /** проверка есть ли вложенные подразделения */
    private _checkIncludeDepartment(dues: string): boolean {
        let flag = false;
        this.customTreeData[0]['children'].forEach(element => {
            if (element['id'] === dues && element['children'].length > 0) {
                flag = true;
            }
        });
        return flag;
    }

    /** открытие окна выбора шаблона для подразделения */
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

    /** выполнение открытия окна в разных условиях */
    private _printNomenc() {
        const url = this._router.url;
        const dues: string = url.split('/').pop();
        const checkYear = this._dictSrv.getFilterValue('YEAR');
        this._openPrintTemplate(dues, checkYear, this._checkIncludeDepartment(dues));
    }

    /** Меняем имя базового Подразделения */
    private _renameBaseDepartment() {
        this._openModal();
    }

    private _openModal() {
        if (!this.newNameBaseDepartment) {
            this.newNameBaseDepartment = this._dictSrv.getCardName();
        }
        this.modalWordRef = this._modalSrv.show(this.modalWord, { ignoreBackdropClick: true });
    }

    private _showSyncDictsModal() {
        const node = this._dictSrv.listNode;
        if (node) {
            this.modalWindow = null;
            this.modalWindow = this._modalSrv.show(SevSyncDictsComponent, { class: 'sev-sync-dicts modal-lg' });
        }
    }

    private _clearIdentityCodes() {
        const ORGS_DUES_AR = this._dictSrv.getMarkedNodes().map(item => { const rec = item.data.rec; return rec.DUE_ORGANIZ; });
        const ORGS_DUES_STR: string = ORGS_DUES_AR.join('|');
        const urlSop = `../CoreHost/Sev/ClearIdentityCodes/${ORGS_DUES_STR}`;
        this._dictSrv.sevClearIdentCodesSubject.next(true);
        this._api.getHttp_client().get(urlSop, { responseType: 'json' }).toPromise().then((clearedCount: number) => {
            setTimeout(() => {
                this._dictSrv.sevClearIdentCodesSubject.next(false);
                this._msgSrv.addNewMessage({
                    ...SEV_CLEAR_IDENT_CODES,
                    msg: `Количество записей, у которых был удален идентификационный код: ${clearedCount}`,
                });
            }, 3000);
        })
        .then((err) => {
            console.log(err);
        });
    }

    private transferDocuments() {
        const person = this._dictSrv.getMarkedNodes()[0];
        const replacer = person['data']['replace'];
        const currentUser = this._appContext.CurrentUser;
        const dateNow = new Date();
        const dl_from = person['data']['rec']['DUE'];
        let dl_to = '';

        if(
            replacer['DUE_REPLACE'] &&
            !replacer['DELETED_DUE_REPLACE_NAME'] &&
            new Date(replacer['START_DATE']) < dateNow &&
            new Date(replacer['END_DATE']) > dateNow
        ) {
            const dueReplacer = replacer['DUE_REPLACE'].split('.');
            const depReplacer = dueReplacer.slice(0, dueReplacer.length - 2).join('.') + '.';
            const accessTransferReplacerDep = currentUser.USER_TECH_List.findIndex(el => (el['FUNC_NUM'] === E_TECH_RIGHT.ProcPeredachiDocs && el['ALLOWED'] === 1 && el['DUE'] === depReplacer) );
            if (accessTransferReplacerDep > -1) {
                dl_to = replacer['DUE_REPLACE'];
            }
        }

        const config: IOpenClassifParams = {
            classif: 'CHANGE_DL',
            dl_from,
            dl_to,
        };
        this._waitClassif.openClassif(config)
        .catch((er) =>{
            /** при закрытии окна окно возвращает undefined а это воспринимается как ошибка */
            console.log('error', er);
        });
    }

}
