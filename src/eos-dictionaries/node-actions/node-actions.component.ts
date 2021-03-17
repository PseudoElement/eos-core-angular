import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs';


import { EosDictService } from '../services/eos-dict.service';
import { EosDictionary } from '../core/eos-dictionary';
import {
    COMMON_ADD_MENU,
    DEPARTMENT_ADD_MENU,
    MORE_RECORD_ACTIONS,
    ORGANIZ_ADD_MENU,
    RECORD_ACTIONS,
    RUBRIC_UNIQ_ADD_MENU
} from '../consts/record-actions.consts';
import {
    E_DICT_TYPE,
    E_RECORD_ACTIONS,
    IAction,
    IActionButton,
    IActionEvent,
    IDictionaryViewParameters,
    IActionUpdateOptions
} from 'eos-dictionaries/interfaces';
import { APS_DICT_GRANT, EosAccessPermissionsService } from 'eos-dictionaries/services/eos-access-permissions.service';
import { takeUntil } from 'rxjs/operators';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { EosStorageService } from 'app/services/eos-storage.service';
import { E_TECH_RIGHT } from 'eos-rest/interfaces/rightName';


@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnDestroy {

    // @Input('params') params: INodeListParams;
    @Output('action') action: EventEmitter<IActionEvent> = new EventEmitter<IActionEvent>();

    tooltipDelay = TOOLTIP_DELAY_VALUE;
    buttons: IActionButton[];
    moreButtons: IActionButton[];

    ADD_ACTION = E_RECORD_ACTIONS.add;
    isTree: boolean;

    addMenu: any;
    rubricUniqMenu: any;

    private dictionary: EosDictionary;
    private _viewParams: IDictionaryViewParameters;
    private _dictSrv: EosDictService;
    private _visibleCount: number;
    private _visibleList: EosDictionaryNode[];
    private _markedNodes: EosDictionaryNode[];
    private _selectedTreeNode: EosDictionaryNode;

    get haveMoreButtons(): boolean {
        let have = false;
        this.moreButtons.forEach((item: IActionButton) => have = have || item.show);
        return have;
    }
    get slicedInfo(): EosDictionaryNode[] {
        return this._visibleList.filter(node => node.isSliced);
    }
    get checkNewCitizen(): EosDictionaryNode[] {
        return this._markedNodes.filter(node => node.data.rec.NEW || node.data.rec.NEW_RECORD);
    }
    get mercedNodesWithoutSliced() {
        return this._markedNodes.filter(node => !node.isSliced);
    }

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _dictSrv: EosDictService,
        private _eaps: EosAccessPermissionsService,
        private _storageSrv: EosStorageService,
    ) {
        this._markedNodes = [];
        this._initButtons();
        this._dictSrv = _dictSrv;
        // _dictSrv.listDictionary$
        //     .pipe(
        //         takeUntil(this.ngUnsubscribe),
        //         combineLatest(_dictSrv.openedNode$, _dictSrv.viewParameters$, _dictSrv.visibleList$)
        //     )
        //     .subscribe(([dict, node, params, list]) => {
        //         this.dictionary = dict;
        //         this._visibleCount = list.length;
        //         this._nodeSelected = !!node;
        //         this._viewParams = params;
        //         this._update();
        //     });

        _dictSrv.openedNode$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((node) => {
                // this._nodeSelected = !!node;
                this._update();
            });

        _dictSrv.listDictionary$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((dict) => {
                this.dictionary = dict;
                this._update();
            });

        _dictSrv.viewParameters$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
            this._viewParams = params;
            this._update();
        });
        _dictSrv.visibleList$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((list) => {
            this._visibleCount = list.length;
            this._visibleList = list;
            this._update();
        });
        _dictSrv.markInfo$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((markInfo) => {
            this._markedNodes = markInfo.nodes;
            this._update();
        });
        _dictSrv.treeNode$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((treenode) => {
            this._selectedTreeNode = treenode;
            this._update();
        });

    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    stopCloseMenu(evt: MouseEvent) {
        evt.stopPropagation();
    }

    doAction(e: MouseEvent, item: IActionButton, params?: any) {
        // запоминаем состояние
        // const tooltip_fix = e.currentTarget['disabled'];
        // принудительно disable для эвента тултипу
        // e.currentTarget['disabled'] = true;

        // делаем то что надо
        if (item.enabled) {
            this.action.emit({action: item.type, params: params});
            this._update();
        } else {
            e.stopPropagation();
        }
        // восстанавливаем состояние
        // e.currentTarget['disabled'] = tooltip_fix;
    }

    menuMng(e: MouseEvent, enabled: boolean, menu: any) {
        enabled ? menu.hide() : e.stopPropagation();
    }

    visibleButtonsCount() {
        return this.buttons.filter (b => b.show).length;
    }

    private _initButtons() {
        const opts: IActionUpdateOptions = this._buttonOptsCreate();
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act, opts));
        this.moreButtons = MORE_RECORD_ACTIONS.map(act => this._actionToButton(act, opts));
    }

    private _update() {
        this.isTree = false;
        if (this.dictionary) {
            this.isTree = this.dictionary && (this.dictionary.descriptor.dictionaryType !== E_DICT_TYPE.linear) &&
                (this.dictionary.descriptor.dictionaryType !== E_DICT_TYPE.custom);
            if (this.dictionary.descriptor.dictionaryType === E_DICT_TYPE.department) {
                this.addMenu = DEPARTMENT_ADD_MENU;
            } else if (this.dictionary.descriptor.dictionaryType === E_DICT_TYPE.organiz) {
                this.addMenu = ORGANIZ_ADD_MENU;
            } else if (this.dictionary.descriptor.dictionaryType !== E_DICT_TYPE.custom) {
                this.addMenu = COMMON_ADD_MENU;
            }
            this.rubricUniqMenu = RUBRIC_UNIQ_ADD_MENU;

            const opt: IActionUpdateOptions = this._buttonOptsCreate();
            this.buttons.forEach(btn => this._updateButton(btn, opt));
            this.moreButtons.forEach(btn => this._updateButton(btn, opt));
        }
    }

    private _buttonOptsCreate(): IActionUpdateOptions {
        if (!this.dictionary) {
            return null;
        }

        const marklist = this._markedNodes;
        let listHasDeleted = null;
        let listHasSelected = null;
        if (this.dictionary && this._viewParams && this._dictSrv) {
            listHasDeleted = marklist.filter(n => n.isDeleted).length !== 0;
            listHasSelected = marklist.length !== 0;
        }

        let grant = APS_DICT_GRANT.denied;

        if (marklist && marklist.length > 0 /* && (this._dictSrv.isSearchFullDictionary() || this._viewParams.showAllSubnodes) */) {
            let due = null;
            let all_grant = APS_DICT_GRANT.readwrite;
            for (let i = 0; i < marklist.length; i++) {
                const element = marklist[i];
                due = this._dictSrv.getDueForNode(element);
                grant = this.dictionary ? this._eaps.isAccessGrantedForDictionary(this.dictionary.id, due) : APS_DICT_GRANT.denied;
                if (grant < all_grant) {
                    all_grant = grant;
                }
                if (all_grant === APS_DICT_GRANT.denied) {
                    break;
                }
            }
            grant = all_grant;
        } else {
            const due = this._dictSrv.getDueForTree(this.dictionary.id);
            grant = this.dictionary ? this._eaps.isAccessGrantedForDictionary(this.dictionary.id, due) :
                APS_DICT_GRANT.denied;
        }

        const opts: IActionUpdateOptions = {
            // markList: marklist,
            listHasItems: this._markedNodes.length !== 0,
            listHasOnlyOne: this._markedNodes.length === 1,
            listHasDeleted: listHasDeleted,
            listHasSelected: listHasSelected,
            dictGrant: grant,
        };
        return opts;
    }

    private _updateButton(button: IActionButton, opts: IActionUpdateOptions) {
        if (opts === null) {
            return;
        }
        const marketN: EosDictionaryNode[] = this._storageSrv.getItem('markedNodes');
        let _enabled = false;
        let _active = false;
        let _show = false;
        let _isWriteAction = true;
        const _isLDSubTree = (this.isTree && this._selectedTreeNode && this._selectedTreeNode.isDeleted);
        const dueTo = this._selectedTreeNode && this._selectedTreeNode.id;

        if (this.dictionary && this._viewParams && this._dictSrv) {

            _enabled = !this._viewParams.updatingList;
            _show = this.dictionary.canDo(button.type);
            switch (button.type) {
                case E_RECORD_ACTIONS.add:
                    _enabled = !_isLDSubTree && !this._viewParams.updatingList;
                    if (this.dictionary.id === 'nomenkl' && _enabled) {
                        const activeNode = this.dictionary.descriptor.getActive();
                        const isHighestNode = activeNode && activeNode.id === '0.';
                        _enabled = !isHighestNode;
                    }
                    break;
                case E_RECORD_ACTIONS.moveUp:
                    _show = _show && this._viewParams.userOrdered && !this._viewParams.searchResults;
                    _enabled = _enabled && this._visibleCount && opts.listHasItems && !this._visibleList[0].isMarked;
                    break;

                case E_RECORD_ACTIONS.moveDown:
                    _show = _show && this._viewParams.userOrdered && !this._viewParams.searchResults;
                    _enabled = _enabled && this._visibleCount && opts.listHasItems && !this._visibleList[this._visibleCount - 1].isMarked;
                    break;
                case E_RECORD_ACTIONS.export:
                    if (this.dictionary.id === 'sign-kind' || this.dictionary.id === 'eds-category') {
                        _show = false;
                    }
                    _enabled = true;
                    _isWriteAction = false;
                    break;
                case E_RECORD_ACTIONS.import:
                    if (this.dictionary.id === 'sign-kind' || this.dictionary.id === 'eds-category') {
                        _show = false;
                    } else {
                        _enabled = true;
                    }
                    break;
                case E_RECORD_ACTIONS.remove: {
                    _enabled = _enabled && opts.listHasItems;
                    _enabled = _enabled && this._dictSrv.listNode && !this._dictSrv.listNode.isDeleted;
                    break;
                }
                case E_RECORD_ACTIONS.restore: {
                    _enabled = !_isLDSubTree && !this._viewParams.updatingList;
                    _enabled = _enabled && opts.listHasDeleted;
                    break;
                }
                case E_RECORD_ACTIONS.CloseSelected:
                case E_RECORD_ACTIONS.OpenSelected:
                        _enabled = _enabled && opts.listHasItems;
                        break;
                case E_RECORD_ACTIONS.AdvancedCardRK:
                case E_RECORD_ACTIONS.additionalFields:
                    _enabled = _enabled && opts.listHasItems && opts.listHasOnlyOne;
                    break;
                case E_RECORD_ACTIONS.removeHard:
                    _enabled = _enabled && opts.listHasItems;
                    break;
                case E_RECORD_ACTIONS.edit:
                    _enabled = (!_isLDSubTree || Features.cfg.canEditLogicDeleted) && !this._viewParams.updatingList && opts.listHasOnlyOne;
                    _enabled = _enabled && this._markedNodes.length > 0; /* && (this._dictSrv.listNode.isNode);*/
                    if (this.dictionary.descriptor.editOnlyNodes !== undefined) {
                        if (this._dictSrv && this._dictSrv.listNode) {
                            _enabled = this.dictionary.descriptor.editOnlyNodes && this._dictSrv.listNode.isNode;
                        }
                    }

                    if (this._dictSrv.listNode && !Features.cfg.canEditLogicDeleted) {
                        _enabled = _enabled && !this._dictSrv.listNode.isDeleted;
                    }

                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _active = this._viewParams.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    _enabled = _enabled && !this._viewParams.searchResults;
                    if (this.dictionary.id === 'nomenkl' && _enabled) {
                        const activeNode = this.dictionary.descriptor.getActive();
                        const isHighestNode = activeNode && activeNode.id === '0.';
                        _enabled = !isHighestNode;
                    }
                    _active = this._viewParams.userOrdered;
                    _isWriteAction = false;
                    break;
                case E_RECORD_ACTIONS.showAllSubnodes:
                    _isWriteAction = false;
                    _enabled = _enabled && !this._viewParams.searchResults;
                    if (this.dictionary.descriptor.type !== E_DICT_TYPE.linear && this._dictSrv.treeNode.id === '0.') {
                        _enabled = false;
                    }
                    _active = this._viewParams.showAllSubnodes && !this._viewParams.searchResults;
                    break;
                case E_RECORD_ACTIONS.createRepresentative:
                    _enabled = _enabled && !this._viewParams.searchResults;
                    break;
                case E_RECORD_ACTIONS.tableCustomization:
                    _isWriteAction = false;
                    break;
                case E_RECORD_ACTIONS.counterDocgroup:
                    _enabled = _enabled && opts.listHasSelected && opts.listHasOnlyOne;
                    break;
                case E_RECORD_ACTIONS.departmentCalendar:
                        if (this._dictSrv && this._dictSrv.listNode) {
                            _enabled = _enabled && this._dictSrv.listNode.isNode;
                        } else {
                            _enabled = false;
                        }
                    _enabled = _enabled && opts.listHasSelected && opts.listHasOnlyOne;
                    break;
                case E_RECORD_ACTIONS.counterDocgroupRKPD:
                    _enabled = _enabled && opts.listHasSelected && opts.listHasOnlyOne;
                    // RK_TYPE_OPTIONS /* 1 = 'Входящие', 2 title: 'Письма граждан' */
                    const rc_type = this._dictSrv.listNode && this._dictSrv.listNode.data['rec'].RC_TYPE;
                    _enabled = _enabled && !(rc_type === 2 || rc_type === 1);
                    break;
                case E_RECORD_ACTIONS.counterDepartmentMain:
                    break;
                case E_RECORD_ACTIONS.counterDepartmentRK:
                case E_RECORD_ACTIONS.counterDepartmentRKPD:
                    _enabled = _enabled && opts.listHasOnlyOne;
                    if (this._dictSrv && this._dictSrv.listNode) {
                        _enabled = _enabled && this._dictSrv.listNode.isNode &&
                            this._dictSrv.listNode.data['rec'].DUE_LINK_ORGANIZ;
                    } else {
                        _enabled = false;
                    }
                    break;
                case E_RECORD_ACTIONS.counterDepartment:
                    if (this._dictSrv && this._dictSrv.listNode) {
                        _enabled = this._dictSrv.listNode.isNode && opts.listHasSelected && opts.listHasOnlyOne;
                    } else {
                        _enabled = false;
                    }
                    break;
                case E_RECORD_ACTIONS.copyPropertiesFromParent:
                    if (this._dictSrv && this._dictSrv.listNode) {
                        _enabled = this._dictSrv.listNode.isNode && opts.listHasSelected;
                    } else {
                        _enabled = false;
                    }
                    break;
                case E_RECORD_ACTIONS.prjDefaultValues:
                    if (this._dictSrv && this._dictSrv.listNode) {
                        _enabled = this._dictSrv.listNode.isPrjDocGroup && opts.listHasSelected && opts.listHasOnlyOne;
                    } else {
                        _enabled = false;
                    }
                    break;
                case E_RECORD_ACTIONS.copyProperties:
                    _enabled = _enabled && opts.listHasSelected && opts.listHasOnlyOne;
                    break;
                case E_RECORD_ACTIONS.copyNodes:
                    _enabled = _enabled && opts.listHasSelected;
                    break;
                case E_RECORD_ACTIONS.pasteNodes:
                    _enabled = (this._dictSrv.bufferNodes) && (!!this._dictSrv.bufferNodes.length);
                    break;
                case E_RECORD_ACTIONS.downloadFile:
                    _enabled = _enabled && opts.listHasItems;
                    _enabled = _enabled && this._dictSrv.listNode && !this._dictSrv.listNode.isDeleted;
                    break;
                case E_RECORD_ACTIONS.importEDS:
                    _enabled = _enabled && opts.listHasOnlyOne;
                    _enabled = _enabled && this._dictSrv.listNode && !this._dictSrv.listNode.isDeleted;
                    break;
                case E_RECORD_ACTIONS.cut:
                    _enabled = _enabled && opts.listHasItems;
                 //   _enabled = _enabled && this._dictSrv.listNode && !this._dictSrv.listNode.isDeleted;
                    break;
                case E_RECORD_ACTIONS.combine:
                    /* _enabled = _enabled && opts.listHasItems;
                    _enabled = _enabled && this._dictSrv.listNode && this.slicedInfo.length > 0; */
                    _enabled =
                        _enabled &&
                        marketN &&
                        marketN.length > 0 &&
                        this.mercedNodesWithoutSliced.length > 0 &&
                        this.mercedNodesWithoutSliced.every((unslicedNode) =>
                            marketN.every((slicedNode) => unslicedNode.id.indexOf(slicedNode.id) === -1)
                        );
                    break;
                case E_RECORD_ACTIONS.uncheckNewEntry:
                    _enabled = _enabled && opts.listHasItems;
                    _enabled = _enabled && this.checkNewCitizen.length > 0;
                    break;
                case E_RECORD_ACTIONS.protViewSecurity:
                    _enabled = (!_isLDSubTree || Features.cfg.canEditLogicDeleted) && !this._viewParams.updatingList && opts.listHasOnlyOne;
                    _enabled = _enabled && this._markedNodes.length > 0; /* && (this._dictSrv.listNode.isNode);*/
                    if (this.dictionary.descriptor.editOnlyNodes !== undefined) {
                        if (this._dictSrv && this._dictSrv.listNode) {
                            _enabled = this.dictionary.descriptor.editOnlyNodes && this._dictSrv.listNode.isNode;
                        }
                    }

                    if (this._dictSrv.listNode && !Features.cfg.canEditLogicDeleted) {
                        _enabled = _enabled && !this._dictSrv.listNode.isDeleted;
                    }
                    break;
                case E_RECORD_ACTIONS.uniqueIndexDel:
                    _isWriteAction = false;
                    break;
                case E_RECORD_ACTIONS.paste:
                    _enabled = _enabled && (marketN && marketN.length > 0);
                    if (_enabled && dueTo) {
                        _enabled = !marketN.some((node) => dueTo.indexOf(node.id) !== -1);
                    }
                    break;
                case E_RECORD_ACTIONS.copy:
                    _enabled = _enabled && opts.listHasItems;
                    break;
                case E_RECORD_ACTIONS.printNomenc:
                    _isWriteAction = false;
                    break;
                case E_RECORD_ACTIONS.dopRequisites:
                    if (this.dictionary.id === 'organization' && _enabled) {
                        _enabled = this._eaps.checkAccessTech(E_TECH_RIGHT.ArrDescripts);
                    }
                    break;
            }

            if (this.dictionary.id === 'nomenkl' && _enabled) {
                _enabled = this._checkNomenklHighestNode(_enabled, button.type);
            }
        }

        const is_granted = this._checkGranted(button, opts);

        button.show = _show;
        button.enabled = _enabled && (!_isWriteAction || is_granted);
        button.isActive = _active;
    }

    private _actionToButton(action: IAction, opts: IActionUpdateOptions): IActionButton {
        const _btn = Object.assign({
            isActive: false,
            enabled: false,
            show: false
        }, action);

        this._updateButton(_btn, opts);
        return _btn;
    }
    private _checkNomenklHighestNode(enabled, btnType) {
        const activeNode = this.dictionary.descriptor.getActive();
        const isHighestNode = activeNode && activeNode.id === '0.';
        if (isHighestNode) {
            const activeBtns = [
                E_RECORD_ACTIONS.export,
                E_RECORD_ACTIONS.import,
                E_RECORD_ACTIONS.showDeleted,
                E_RECORD_ACTIONS.tableCustomization,
            ];
            if (activeBtns.indexOf(btnType) === -1) {
                return !isHighestNode;
            }
        }
        return enabled;
    }
    private _checkGranted(button: IActionButton, opts: IActionUpdateOptions): boolean {
        if (button.type === E_RECORD_ACTIONS.showDeleted) {
            return this._eaps.checkShowDeleted(this.dictionary.id);
        } else if (this.dictionary && this.dictionary.id) {
            const forDicts = [
                'rubricator',
                'docgroup',
                'departments',
                'nomenkl',
                'cabinet',
            ];
            const forButtons = [
                E_RECORD_ACTIONS.add,
                E_RECORD_ACTIONS.paste,
                E_RECORD_ACTIONS.pasteNodes,
                E_RECORD_ACTIONS.import,
            ];
            if (forDicts.indexOf(this.dictionary.id) !== -1 && forButtons.indexOf(button.type) !== -1) {
                // const hash = location.hash.split('/');
                // let grant = this._eaps.isAccessGrantedForDictionary(this.dictionary.id, hash[hash.length - 1]);
                // grant = grant ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
                // return button.accessNeed <= grant;
                const due = this._dictSrv.getDueForTree(this.dictionary.id);
                const grant = this.dictionary ? this._eaps.isAccessGrantedForDictionary(this.dictionary.id, due) :
                    APS_DICT_GRANT.denied;

                return button.accessNeed <= grant;
            }
        } else if (
            button.type === E_RECORD_ACTIONS.copyPropertiesFromParent &&
            this.dictionary.id === 'docgroup' &&
            this._markedNodes && this._markedNodes.length
        ) {
            let commonGrant = APS_DICT_GRANT.readwrite;
            this._markedNodes.every((node) => {
                const due = node.id;
                const grant = this.dictionary ? this._eaps.isAccessGrantedForDictionary(this.dictionary.id, due) : APS_DICT_GRANT.denied;
                if (grant < commonGrant) {
                    commonGrant = grant;
                }

                return commonGrant !== APS_DICT_GRANT.denied;
            });
            return button.accessNeed <= commonGrant;
        }

        return button.accessNeed <= opts.dictGrant;
    }
}
