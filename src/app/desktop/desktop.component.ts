import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { EosDeskService } from '../services/eos-desk.service';

import { IDeskItem } from '../core/desk-item.interface';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_LINK_DELETE } from '../consts/confirms.const';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { NAVIGATE_TO_ELEMENT_WARN } from '../consts/messages.consts';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';

@Component({
    templateUrl: 'desktop.component.html',
})
export class DesktopComponent implements OnDestroy {
    referencesList: IDeskItem[];
    recentItems: IDeskItem[];
    deskId: string;

    // historyToLeft = false;

    notEmptyString = NOT_EMPTY_STRING;
    private dragResolve = false;
    private _editingItem: IDeskItem;
    private _newTitle: string;

    private _routerSubscription: Subscription;
    private _selectedDeskSubscription: Subscription;
    private _recentItemsSubscription: Subscription;
    private _routeSubscription: Subscription;

    constructor(
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _router: Router,
        _route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService,
        // private _storageSrv: EosStorageService,
        private _msgSrv: EosMessageService,
    ) {
        this.referencesList = [];
        this._routerSubscription = this._router.events
            .filter((evt) => evt instanceof NavigationEnd)
            .subscribe(() => this._dictSrv.getDictionariesList());

        this._selectedDeskSubscription = _deskSrv.selectedDesk.subscribe(
            (desk) => {
                if (desk) {
                    this._update(desk.references);
                    this.deskId = desk.id;
                }
            }
        );

        this._recentItemsSubscription = _deskSrv.recentItems.subscribe(
            (items) => this.recentItems = items
        );

        this._routeSubscription = _route.params.subscribe(
            (params) => {
                const id = params.desktopId || 'system' ;
                _deskSrv.setSelectedDesk(id);
            }
        );
        this._dictSrv.closeDictionary();
    }

    ngOnDestroy() {
        this._routerSubscription.unsubscribe();
        this._selectedDeskSubscription.unsubscribe();
        this._recentItemsSubscription.unsubscribe();
        this._routeSubscription.unsubscribe();
    }

    _update(dictionariesList: IDeskItem[]) {
        this.referencesList = dictionariesList;
    }

    removeLink(link: IDeskItem, $evt: Event): void {
        $evt.stopPropagation();
        const _confrm = Object.assign({}, CONFIRM_LINK_DELETE);
        _confrm.body = _confrm.body.replace('{{link}}', link.title);

        this._confirmSrv
            .confirm(_confrm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this._deskSrv.unpinRef(link);
                }
            })
            .catch();
    }

    tryMove(evt: Event) {
        if (!this.dragResolve) {
            this.stopDefault(evt);
        }
    }

    editing(item: IDeskItem) {
        return this._editingItem === item;
    }

    changeName(newValue: string) {
        this._newTitle = newValue.trim();
    }

    edit(evt: Event, item: IDeskItem) {
        this.stopDefault(evt);
        this._editingItem = item;
        this._newTitle = item.title;
        const index = this.referencesList.indexOf(item);
        const itemDiv = document.getElementsByClassName('sortable-item');
        itemDiv[index]['draggable'] = false;
    }

    /**
     * Save new name elements of desktop
     * @param evt Mouse Event
     */
    public save(evt: Event) {
        if (this._newTitle !== this._editingItem.title) {
            this._editingItem.title = this._newTitle;
            /* this._editingItem.fullTitle = this._newTitle; */
            this._deskSrv.updateName(this._editingItem);
            /* then ??? */
        }
        this.cancel(evt);
    }

    cancel(_evt: Event) {
        const index = this.referencesList.indexOf(this._editingItem);
        const itemDiv = document.getElementsByClassName('sortable-item');
        itemDiv[index]['draggable'] = true;
        this._editingItem = null;
    }

    stopDefault(evt: Event) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    setCursor(event) {
        /* set the cursor position at the end of textarea - special trick for IE and Edge */
        event.target.selectionStart = event.target.value.length;
    }

    /**
     * Method check is there node and navigate or get message
     * @param link item to navigate
     */
    public goToCard(link: IDeskItem): void {
        const segments: Array<string> = link.url.split('/');
        this._dictSrv.getFullNode(segments[2], segments[3])
            .then((node: EosDictionaryNode) => {
                node ? this._router.navigate([link.url]) : this._msgSrv.addNewMessage(NAVIGATE_TO_ELEMENT_WARN);
            });
    }
}
