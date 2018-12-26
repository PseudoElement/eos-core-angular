import {AfterViewInit, Component, DoCheck, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

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
    DANGER_EDIT_DELETED_ERROR,
    DANGER_EDIT_ROOT_ERROR,
    DANGER_HAVE_NO_ELEMENTS,
    DANGER_LOGICALY_RESTORE_ELEMENT,
    WARN_EDIT_ERROR,
    WARN_ELEMENT_PROTECTED,
    WARN_LOGIC_DELETE,
    DANGER_EDIT_ONLY_DEPARTMENTS_ALLOWED,
    WARN_SELECT_NODE,
    WARN_ELEMENT_DELETED,
    WARN_LOGIC_CLOSE,
    WARN_LOGIC_OPEN,
} from '../consts/messages.consts';

import {RECENT_URL} from 'app/consts/common.consts';
import {NodeListComponent} from '../node-list/node-list.component';
import {CreateNodeComponent} from '../create-node/create-node.component';
import {IPaginationConfig} from '../node-list-pagination/node-list-pagination.interfaces';
import {CreateNodeBroadcastChannelComponent} from '../create-node-broadcast-channel/create-node-broadcast-channel.component';
import {CounterNpEditComponent, NUMCREATION_MAIN_NODE_ID} from '../counter-np-edit/counter-np-edit.component';
import {CustomTreeNode} from '../tree2/custom-tree.component';

@Component({
    templateUrl: 'dictionary.component.html',
})
export class DictionaryComponent implements OnDestroy, DoCheck, AfterViewInit {
    @ViewChild('nodeList') nodeList: NodeListComponent;
    @ViewChild('tree') treeEl;
    @ViewChild('custom-tree') customTreeEl;
    @ViewChild('selectedWrapper') selectedEl;

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
        private _sandwichSrv: EosSandwichService,
        _bcSrv: EosBreadcrumbsService,
    ) {
        _route.params.subscribe((params) => {
            if (params) {

                this.dictionaryId = params.dictionaryId;
                this._nodeId = params.nodeId;
                if (this.dictionaryId) {
                    this._dictSrv.openDictionary(this.dictionaryId)
                        .then(() => {
                            if (this._dictSrv.currentDictionary.descriptor.dictionaryType === E_DICT_TYPE.custom) {
                                this.dictionary.root.children = null;
                                this._dictSrv.currentDictionary.descriptor.setRootNode(this._nodeId);
                                this._dictSrv.selectCustomTreeNode();
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

        _sandwichSrv.currentDictState$.takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean[]) => this.currentState = state);

        _dictSrv.dictionary$.takeUntil(this.ngUnsubscribe)
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
                            this.customTreeData = d;
                        });
                    }
                } else {
                    this.treeNodes = [];
                }
            });

        _dictSrv.listDictionary$.takeUntil(this.ngUnsubscribe)
            .subscribe((dictionary: EosDictionary) => {
                if (dictionary) {
                    this.dictMode = this._dictSrv.dictMode;
                    const setParams = this.params === undefined;
                    this.params = Object.assign({}, this.params, {userSort: dictionary.userOrdered});
                    this.params.markItems = dictionary.canDo(E_RECORD_ACTIONS.markRecords);
                    if (setParams) {
                        this.params.hideTopMenu = dictionary.descriptor.hideTopMenu;
                    }
                    this.hasCustomTable = dictionary.canDo(E_RECORD_ACTIONS.tableCustomization);
                }
            });

        _dictSrv.treeNode$.takeUntil(this.ngUnsubscribe)
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

        _dictSrv.paginationConfig$.takeUntil(this.ngUnsubscribe)
            .subscribe((config: IPaginationConfig) => {
                if (config) {
                    this.paginationConfig = config;
                }
            });

        _dictSrv.viewParameters$.takeUntil(this.ngUnsubscribe)
            .subscribe((viewParameters: IDictionaryViewParameters) => this.params = viewParameters);

        _bcSrv._eventFromBc$
            .takeUntil(this.ngUnsubscribe)
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
                this._dictSrv.toggleUserOrder();
                break;

            case E_RECORD_ACTIONS.moveUp:
                this.nodeList.moveUp();
                break;

            case E_RECORD_ACTIONS.moveDown:
                this.nodeList.moveDown();
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
            case E_RECORD_ACTIONS.CounterNPMain:
                this._editCounterNP(true);
                break;
            case E_RECORD_ACTIONS.CounterNP:
                this._editCounterNP(false);
                break;
            case E_RECORD_ACTIONS.CloseSelected:
                this._closeItems();
                break;
            case E_RECORD_ACTIONS.OpenSelected:
                this._openItems();
                break;
            default:
                console.warn('unhandled action', E_RECORD_ACTIONS[evt.action]);
        }
    }


    resetSearch() {
        this._dictSrv.resetSearch();
        this._dictSrv.updateViewParameters({searchResults: false });
    }

    userOrdered(nodes: EosDictionaryNode[]) {
        this._dictSrv.setUserOrder(nodes);
    }

    goUp() {
        if (this.treeNode && this.treeNode.parent) {
            const path = this.treeNode.parent.getPath();
            this._router.navigate(path);
        }
    }

    switchFastSearch(val: boolean) {
        this.fastSearch = val;
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

    setDictMode(mode: number) {
        this._dictSrv.setDictMode(mode);
        this.nodeList.updateViewFields([]);
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
        const createWarning = this.dictionary.descriptor.preCreateCheck(this);
        if (createWarning) {
            this._msgSrv.addNewMessage(createWarning);
            return;
        }

        if (this.dictionary.descriptor.id === 'broadcast-channel') {
            this.modalWindow = this._modalSrv.show(CreateNodeBroadcastChannelComponent, {class: 'creating-modal'});
        } else {
            this.modalWindow = this._modalSrv.show(CreateNodeComponent, {class: 'creating-modal'});
        }
        dictionary = this._dictSrv.currentDictionary;
        editDescr = dictionary.getEditDescriptor();
        data = dictionary.getNewNode({rec: recParams}, this.treeNode);

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
            if (node.marked) {
                allCount++;
            }
            if (node.marked && node.isDeleted) {
                delCount++;
            }
            if (node.marked && node.isProtected) {
                node.marked = false;
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
            if (node.marked) {
                allCount++;
            }
            if (node.marked && node.data.rec[fieldName]) {
                rdyCount++;
            }
            if (node.marked && node.isDeleted) {
                node.marked = false;
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
            if (node.marked) {
                allCount++;
            }
            if (node.marked && !node.data.rec[fieldName]) {
                rdyCount++;
            }
            if (node.marked && node.isDeleted) {
                node.marked = false;
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

    private _editCounterNP(isMainNP: boolean) {
        if (this.dictionaryId !== 'departments') {
            this._msgSrv.addNewMessage(DANGER_EDIT_ONLY_DEPARTMENTS_ALLOWED);
            return;
        }
        this.modalWindow = null;
        if (isMainNP) {
            this.modalWindow = this._modalSrv.show(CounterNpEditComponent, {class: 'counter-np-modal modal-lg'});
            this.modalWindow.content.init(NUMCREATION_MAIN_NODE_ID);

        } else {
            const node = this._dictSrv.listNode;
            if (node) {
                if (node.data.PROTECTED) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_ROOT_ERROR);
                } else if (node.isDeleted) {
                    this._msgSrv.addNewMessage(DANGER_EDIT_DELETED_ERROR);
                } else {
                    this.modalWindow = this._modalSrv.show(CounterNpEditComponent, {class: 'counter-np-modal modal-lg'});
                    this.modalWindow.content.init(node.id);
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
        let p: Promise<any> = Promise.resolve(false);

        this._dictSrv.getMarkedNodes().forEach((node) => {
            if (node.parent && node.parent.isDeleted) {
                this._msgSrv.addNewMessage(DANGER_LOGICALY_RESTORE_ELEMENT);
                node.marked = false;
            } else {
                if (node.children && node.children.length) {
                    childrenTitles.push(node.title);
                }
            }
        });

        if (childrenTitles.length) {
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
}
