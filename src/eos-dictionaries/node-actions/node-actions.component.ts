import { RUBRICATOR_DICT } from './../consts/dictionaries/rubricator.consts';
import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/combineLatest';

import {EosDictService} from '../services/eos-dict.service';
import {EosDictionary} from '../core/eos-dictionary';
import {COMMON_ADD_MENU, DEPARTMENT_ADD_MENU, MORE_RECORD_ACTIONS, ORGANIZ_ADD_MENU, RECORD_ACTIONS, RUBRIC_UNIQ_ADD_MENU} from '../consts/record-actions.consts';
import {E_DICT_TYPE, E_RECORD_ACTIONS, IAction, IActionButton, IActionEvent, IDictionaryViewParameters} from 'eos-dictionaries/interfaces';
import { EosAccessPermissionsService } from 'eos-dictionaries/services/eos-access-permissions.service';
import { EosStorageService, SI_RUBRICUNOQDISABLE } from 'app/services/eos-storage.service';

@Component({
    selector: 'eos-node-actions',
    templateUrl: 'node-actions.component.html',
})
export class NodeActionsComponent implements OnDestroy {

    // @Input('params') params: INodeListParams;
    @Output('action') action: EventEmitter<IActionEvent> = new EventEmitter<IActionEvent>();

    buttons: IActionButton[];
    moreButtons: IActionButton[];

    ADD_ACTION = E_RECORD_ACTIONS.add;
    RUBRIC_ACTION1 = E_RECORD_ACTIONS.RubricUniqueSwitcher;
    isTree: boolean;

    addMenu: any;
    rubricUniqMenu: any;

    private dictionary: EosDictionary;
    private _nodeSelected = false;
    private _viewParams: IDictionaryViewParameters;
    private _dictSrv: EosDictService;
    private _visibleCount: number;

    get haveMoreButtons(): boolean {
        let have = false;
        this.moreButtons.forEach((item: IActionButton) => have = have || item.show);
        return have;
    }

    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        _dictSrv: EosDictService,
        private _eaps: EosAccessPermissionsService,
        private _storageSrv: EosStorageService,

        ) {
        this._initButtons();

        _dictSrv.listDictionary$
            .takeUntil(this.ngUnsubscribe)
            .combineLatest(_dictSrv.openedNode$, _dictSrv.viewParameters$, _dictSrv.visibleList$)
            .subscribe(([dict, node, params, list]) => {
                this.dictionary = dict;
                this._visibleCount = list.length;
                this._nodeSelected = !!node;
                this._viewParams = params;
                this._update();
            });
        this._dictSrv = _dictSrv;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    stopCloseMenu(evt: MouseEvent) {
        evt.stopPropagation();
    }

    doAction(e: MouseEvent, item: IActionButton, params?: any) {
        // console.log('action', item.type, params);
        if (item.enabled) {
            this.action.emit({ action: item.type, params: params });
            this._update();
        } else {
            e.stopPropagation();
        }
    }

    menuMng(e: MouseEvent, enabled: boolean, menu: any) {
        enabled ? menu.hide() : e.stopPropagation();
    }

    private _initButtons() {
        this.buttons = RECORD_ACTIONS.map((act) => this._actionToButton(act));
        this.moreButtons = MORE_RECORD_ACTIONS.map(act => this._actionToButton(act));
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
        }

        this.rubricUniqMenu = RUBRIC_UNIQ_ADD_MENU;

        this.buttons.forEach(btn => this._updateButton(btn));
        this.moreButtons.forEach(btn => this._updateButton(btn));
    }

    private _updateButton(button: IActionButton) {
        let _enabled = false;
        let _active = false;
        let _show = false;

        if (this.dictionary && this._viewParams) {
            _enabled = !this._viewParams.updatingList;
            _show = this.dictionary.canDo(button.type);
            switch (button.type) {
                case E_RECORD_ACTIONS.add:
                    _enabled = !this._viewParams.updatingList;
                    break;
                case E_RECORD_ACTIONS.moveUp:
                case E_RECORD_ACTIONS.moveDown:
                    _show = this._viewParams.userOrdered && !this._viewParams.searchResults;
                    _enabled = _enabled && this._nodeSelected && this._visibleCount > 1;
                    break;

                case E_RECORD_ACTIONS.CloseSelected:
                case E_RECORD_ACTIONS.OpenSelected:
                case E_RECORD_ACTIONS.restore:
                case E_RECORD_ACTIONS.remove:
                case E_RECORD_ACTIONS.removeHard:
                    _enabled = _enabled && this._viewParams.hasMarked;
                    break;
                case E_RECORD_ACTIONS.edit:
                    _enabled = _enabled && this._nodeSelected; /* && (this._dictSrv.listNode.isNode);*/
                    if (this.dictionary.descriptor.editOnlyNodes !== undefined) {
                        if (this._dictSrv && this._dictSrv.listNode) {
                            _enabled = this.dictionary.descriptor.editOnlyNodes && this._dictSrv.listNode.isNode;
                        }
                    }
                    break;
                case E_RECORD_ACTIONS.showDeleted:
                    _active = this._viewParams.showDeleted;
                    break;
                case E_RECORD_ACTIONS.userOrder:
                    /* _enabled = _enabled && !this._viewParams.searchResults; */
                    _active = this._viewParams.userOrdered;
                    break;
                case E_RECORD_ACTIONS.showAllSubnodes:
                    _enabled = _enabled && !this._viewParams.searchResults;
                    _active = this._viewParams.showAllSubnodes && !this._viewParams.searchResults;
                    break;
                case E_RECORD_ACTIONS.createRepresentative:
                    _enabled = _enabled && !this._viewParams.searchResults;
                    break;
                case E_RECORD_ACTIONS.tableCustomization:
                    break;
                case E_RECORD_ACTIONS.CounterNPMain:
                    break;
                case E_RECORD_ACTIONS.counter:
                    break;
                case E_RECORD_ACTIONS.CounterNP:
                    if (this._dictSrv && this._dictSrv.listNode) {
                        _enabled = this._dictSrv.listNode.isNode;
                    } else {
                        _enabled = false;
                    }
                    break;
                case E_RECORD_ACTIONS.RubricUniqueSwitcher: {
                    _enabled = this._eaps.isAccessGrantedForDictionary(RUBRICATOR_DICT.id);
                    const d: boolean = this._storageSrv.getItem(SI_RUBRICUNOQDISABLE);
                    this.rubricUniqMenu[0].active = !d;
                    this.rubricUniqMenu[1].active = d;
                    break;
                }
            }
        }
        button.show = _show;
        button.enabled = _enabled;
        button.isActive = _active;
    }

    private _actionToButton(action: IAction): IActionButton {
        const _btn = Object.assign({
            isActive: false,
            enabled: false,
            show: false
        }, action);
        this._updateButton(_btn);
        return _btn;
    }
}
