import {IQuickSrchObj} from './../dictionary-search/dictionary-search.component';
import {TOOLTIP_DELAY_VALUE} from './../../eos-common/services/eos-message.service';
import {DEPARTMENTS_DICT} from './../consts/dictionaries/department.consts';
import {AdvCardRKEditComponent} from './../adv-card/adv-card-rk.component';
import {AfterViewInit, Component, DoCheck, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';


import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import {ConfirmWindowService} from 'eos-common/confirm-window/confirm-window.service';
import {CONFIRM_NODE_DELETE, CONFIRM_NODES_DELETE, CONFIRM_SUBNODES_RESTORE} from 'app/consts/confirms.const';
import {IConfirmWindow} from 'eos-common/core/confirm-window.interface';

import {EosDictService} from '../services/eos-dict.service';
import {EosDictionary} from '../core/eos-dictionary';
import {E_DICT_TYPE, E_RECORD_ACTIONS, IActionEvent, IDictionaryViewParameters} from 'eos-dictionaries/interfaces';
import {EosDictionaryNode} from '../core/eos-dictionary-node';
import {EosMessageService} from 'eos-common/services/eos-message.service';
import {EosStorageService} from 'app/services/eos-storage.service';
import {EosSandwichService} from '../services/eos-sandwich.service';
import {EosBreadcrumbsService} from '../../app/services/eos-breadcrumbs.service';

import {
    DANGER_ACCESS_DENIED_DICT,
    DANGER_DEPART_IS_LDELETED,
    DANGER_DEPART_NO_NUMCREATION,
    DANGER_EDIT_DELETED_ERROR,
    DANGER_EDIT_DICT_NOTALLOWED,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_HAVE_NO_ELEMENTS,
    DANGER_LOGICALY_RESTORE_ELEMENT,
    WARN_EDIT_ERROR,
    WARN_ELEMENT_DELETED,
    WARN_ELEMENT_PROTECTED,
    WARN_LOGIC_CLOSE,
    WARN_LOGIC_DELETE,
    WARN_LOGIC_OPEN,
    WARN_SELECT_NODE,
} from '../consts/messages.consts';

import {RECENT_URL} from 'app/consts/common.consts';
import {NodeListComponent} from '../node-list/node-list.component';
import {CreateNodeComponent} from '../create-node/create-node.component';
import {IPaginationConfig} from '../node-list-pagination/node-list-pagination.interfaces';
import {CreateNodeBroadcastChannelComponent} from '../create-node-broadcast-channel/create-node-broadcast-channel.component';
import {CounterNpEditComponent, E_COUNTER_TYPE} from '../counter-np-edit/counter-np-edit.component';
import {CustomTreeNode} from '../tree2/custom-tree.component';
import {APS_DICT_GRANT, EosAccessPermissionsService} from 'eos-dictionaries/services/eos-access-permissions.service';
import {DID_NOMENKL_CL} from 'eos-dictionaries/consts/dictionaries/nomenkl.const';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit {
    @ViewChild('nodeList') nodeList: NodeListComponent;
    @ViewChild('tree') treeEl;
    @ViewChild('custom-tree') customTreeEl;
    @ViewChild('selectedWrapper') selectedEl;
    @ViewChild('quickSearchCtl') quickSearchCtl;
    @ViewChild('searchCtl') searchCtl;

    tooltipDelay = TOOLTIP_DELAY_VALUE;
    dictionary: EosDictionary;
    listDictionary: EosDictionary;

    dictionaryName: string;
    dictionaryId: string;

    params: IDictionaryViewParameters;
    treeNode: EosDictionaryNode;
    title: string;

    SLICE_LEN = 110;
    customTreeData: CustomTreeNode[];

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
        if (this.title.length >= this.SLICE_LEN) {
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

    searchStartFlag = false; // flag begin search
    fastSearch = false;

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
        _bcSrv: EosBreadcrumbsService,
    ) {
        this.accessDenied = false;
        _route.params.subscribe((params) => {
            if (params) {

                this.dictionaryId = params.dictionaryId;
                if (this._eaps.isAccessGrantedForDictionary(this.dictionaryId, null) === APS_DICT_GRANT.denied) {
                    this.accessDenied = true;
                    this._msgSrv.addNewMessage(DANGER_ACCESS_DENIED_DICT);
                    return;
                }
                this.accessDenied = false;
                this._nodeId = params.nodeId;
                if (this.dictionaryId) {
                    this._dictSrv.openDictionary(this.dictionaryId)
                        .then(() => {
                            if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.custom) {
                                this.dictionary.root.children = null;
                                const n: CustomTreeNode = this._dictSrv.currentDictionary.descriptor.setRootNode(this._nodeId);
                                if (n) {
                                    this.title = n.title;
                                }
                                this._dictSrv.setCustomNodeId(this._nodeId);
                                this._dictSrv.selectCustomTreeNode().then ((data) => {
                                });
                            } else if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.linear) {
                                if (this._nodeId === '0.' ) {
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
            .subscribe((state: boolean[]) => this.currentState = state);

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
                    this.params = Object.assign({}, this.params, {userSort: this._dictSrv.userOrdered});
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
            .subscribe((viewParameters: IDictionaryViewParameters) => this.params = viewParameters);

        _bcSrv._eventFromBc$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((action: IActionEvent) => this.doAction(action));
    }

    ngOnDestroy() {
        this._sandwichSrv.treeScrollTop = this._treeScrollTop;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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

    doAction(evt: IActionEvent) {
        switch (evt.action) {
            case E_RECORD_ACTIONS.navigateDown:
                this.nodeList.openNodeNavigate(false);
                break;

            case E_RECORD_ACTIONS.navigateUp:
                this.nodeList.openNodeNavigate(true);
                break;

            case E_RECORD_ACTIONS.edit:
                this._editNode();
                break;

            case E_RECORD_ACTIONS.showDeleted:
                this._dictSrv.toggleDeleted();
                break;

            case E_RECORD_ACTIONS.userOrder:
                this._dictSrv.toggleWeightOrder();
                break;

            case E_RECORD_ACTIONS.moveUp:
                this.nodeList.moveUp();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this.nodeList.moveDown();
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
                this.physicallyDelete();
                break;

            case E_RECORD_ACTIONS.add:
                this._openCreate(evt.params);
                break;

            case E_RECORD_ACTIONS.restore:
                this._restoreItems();
                break;
            case E_RECORD_ACTIONS.showAllSubnodes:
                this._dictSrv.toggleAllSubnodes();
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
                this._editCounter(E_COUNTER_TYPE.counterDepartmentMain);
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
                this._openCopyProperties();
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
            default:
                console.warn('unhandled action', E_RECORD_ACTIONS[evt.action]);
        }
    }


    resetSearch() {
        this._dictSrv.resetSearch();
        this._dictSrv.updateViewParameters({searchResults: false });
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
            this.fastSearch = false;
        }
    }

    onCloseFastSrch(event) {
        this.forcedCloseFastSrch();
    }

    switchFastSearch(val: IQuickSrchObj) {
        if (this.quickSearchCtl && this.quickSearchCtl.srchString && this.quickSearchCtl.srchString !== '') {
            this.quickSearchCtl.quickSearch({ keyCode: 13 });
        } else {
            val.isOpenQuick = !val.isOpenQuick;
            this.fastSearch = val.isOpenQuick;
        }
    }

    /**
     * Physical delete marked elements on page
     */
    physicallyDelete(): void {
        const titles = this.nodeList.getMarkedTitles();

        if (titles.length < 1) {
            this._msgSrv.addNewMessage(DANGER_HAVE_NO_ELEMENTS);
            return;
        } else {
            let message;
            if (titles.length === 1) {
                message = Object.assign({}, CONFIRM_NODE_DELETE);
            } else {
                message = Object.assign({}, CONFIRM_NODES_DELETE);
            }
            message.body = message.body.replace('{{name}}', titles.join(', '));
            this._callDelWindow(message);
        }
    }

    @HostListener('window:resize')
    resize(): void {
        this._sandwichSrv.resize();
    }

    isDictModeEnabled (mode: number): boolean {
        const dict = this._dictSrv.dictionaryByMode(mode).id;
        return this._eaps.isAccessGrantedForDictionary(dict, null) !== APS_DICT_GRANT.denied;
    }
    setDictMode(mode: number) {
        if (mode === 0 && this.treeNode.isDeleted) {
            this._msgSrv.addNewMessage(DANGER_DEPART_IS_LDELETED);
        } else {
            this._dictSrv.setDictMode(mode);
            this.nodeList.updateViewFields([]);
        }
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
            (this.dictionaryId === DEPARTMENTS_DICT.id && this.dictMode === 0) ) {
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

    private _callDelWindow(_confrm: IConfirmWindow): void {
        this._confirmSrv.confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    return this._dictSrv.deleteMarked();
                }
            });
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
        data = dictionary.getNewNode({rec: recParams}, this.treeNode);

        const createWarning = dictionary.descriptor.preCreateCheck(this);
        if (createWarning) {
            this._msgSrv.addNewMessage(createWarning);
            return;
        }

        if (dictionary.descriptor.id === 'broadcast-channel') {
            this.modalWindow = this._modalSrv.show(CreateNodeBroadcastChannelComponent, {class: 'creating-modal'});
        } else {
            this.modalWindow = this._modalSrv.show(CreateNodeComponent, {class: 'creating-modal'});
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

    /**
     * Logic delete marked elements on page
     */
    private _deleteItems(): void {
        let delCount = 0, allCount = 0;
        this._dictSrv.getMarkedNodes().forEach((node) => {
            if (node.isMarked) {
                allCount++;
            }
            if (node.isMarked && node.isDeleted) {
                delCount++;
            }
            if (node.isMarked && node.isProtected) {
                node.isMarked = false;
                const warn = Object.assign({}, WARN_ELEMENT_PROTECTED);
                warn.msg = warn.msg.replace('{{elem}}', node.title);
                this._msgSrv.addNewMessage(warn);
            }
        });
        if (delCount === allCount) {
            this._msgSrv.addNewMessage(WARN_LOGIC_DELETE);
        }
        this._dictSrv.setFlagForMarked('DELETED', true, true);
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
            this.modalWindow = this._modalSrv.show(CounterNpEditComponent, {class: 'counter-np-modal modal-lg'});
            this.modalWindow.content.initByNodeData(type, null);
        } else {
            const node = this._dictSrv.listNode;
            if (node) {
                if (node.data.PROTECTED) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
                } else if (type === E_COUNTER_TYPE.counterDepartment && node.data.rec['NUMCREATION_FLAG'] !== 1) {
                        this._msgSrv.addNewMessage(DANGER_DEPART_NO_NUMCREATION);
                } else {
                    this.modalWindow = this._modalSrv.show(CounterNpEditComponent, {class: 'counter-np-modal modal-lg'});
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
            } else if (node.isDeleted) {
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

    private _restoreItems(): void {
        const childrenTitles: string[] = [];
        let hasFolding = false;
        let p: Promise<any> = Promise.resolve(false);

        this._dictSrv.getMarkedNodes(false).forEach((node) => {
            if (node.parent && node.parent.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
                node.isMarked = false;
            } else {
                if (node.isNode) {
                    hasFolding = true;
                    childrenTitles.push(node.title);
                }
                // if (node.children && node.children.length) {
                //     childrenTitles.push(node.title);
                // }
            }
        });

        if (childrenTitles.length || hasFolding) {
            const _confrm = Object.assign({}, CONFIRM_SUBNODES_RESTORE);
            _confrm.body = _confrm.body.replace('{{name}}', childrenTitles.join(', '));

            p = this._confirmSrv
                .confirm(_confrm);
        }
        p.then((confirmed: boolean) => this._dictSrv.setFlagForMarked('DELETED', confirmed, false));
    }

    private _openAdditionalFields() {
        const node = this._dictSrv.listNode;
        if (node) {
            this.nodeList.openAdditionalFields(node);
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private _openAdvancedCardRK () {

        this.modalWindow = null;
        const node = this._dictSrv.listNode;
        if (node) {
            if (node.data.PROTECTED) {
                this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
            } else {
                this.modalWindow = this._modalSrv.show(AdvCardRKEditComponent, {class: 'adv-card-rk-modal modal-lg'});
                this.modalWindow.content.initByNodeData(node.data.rec);
            }
        } else {
            this._msgSrv.addNewMessage(WARN_EDIT_ERROR);
        }

        if (this.modalWindow) {
            const subscription = this.modalWindow.content.onChoose.subscribe(() => {
                subscription.unsubscribe();
            });
        }
    }

    private _openPrjDefaultValues() {
        const node = this._dictSrv.listNode;
        if (node) {
            this.nodeList.openPrjDefaultValues(node);
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private _openCopyProperties(fromParent = false) {
        const node = this._dictSrv.listNode;
        if (node) {
            this.nodeList.openCopyProperties(node, fromParent);
        } else {
            this._msgSrv.addNewMessage(WARN_SELECT_NODE);
        }
    }

    private _copyNodesToBuffer() {
        this._dictSrv.fillBufferNodes();
    }

    private _openCopyNode() {
        this.nodeList.openCopyNode(this._dictSrv.bufferNodes);
    }

}
