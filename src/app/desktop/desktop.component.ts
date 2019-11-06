import {Component, OnDestroy, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {EosDictService} from '../../eos-dictionaries/services/eos-dict.service';
import {EosDeskService, DEFAULT_DESKTOP} from '../services/eos-desk.service';
import {IDeskItem} from '../core/desk-item.interface';
import {ConfirmWindowService} from '../../eos-common/confirm-window/confirm-window.service';
import {CONFIRM_LINK_DELETE} from '../consts/confirms.const';
import {NOT_EMPTY_STRING} from 'eos-common/consts/common.consts';
import {EosStorageService} from 'app/services/eos-storage.service';
import {RECENT_URL} from 'app/consts/common.consts';
import { skip } from 'rxjs/operators';

@Component({
    templateUrl: 'desktop.component.html',
})

export class DesktopComponent implements OnInit, OnDestroy {

    @ViewChild('title') title: ElementRef;

    referencesList: IDeskItem[];
    deskId: string;
    notEmptyString = NOT_EMPTY_STRING;
    dragResolve = false;

    private _editingItem: IDeskItem;
    private _newTitle: string;
    private _listIsLoaded = false;

    private _currentReferencesSubscription: Subscription;
    private _deskListSubscription: Subscription;
    private _routeSubscription: Subscription;

    constructor(
        private _dictSrv: EosDictService,
        private _deskSrv: EosDeskService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _confirmSrv: ConfirmWindowService,
        private _storageSrv: EosStorageService,
    ) {
        this._storageSrv.setItem(RECENT_URL, this._router.url);
        this._dictSrv.closeDictionary();
    }

    ngOnInit() {
        this._routeSubscription = this._route.params.subscribe(params => {
            if (params) {
                this.deskId = params.desktopId;
                if (this._listIsLoaded) {
                    this._deskSrv.setSelectedDesk(this.deskId);
                }
            }
        });
        this._deskListSubscription = this._deskSrv.desksList.subscribe( (list) => {
            if (list.length) {
                this._listIsLoaded = true;
                this._deskSrv.setSelectedDesk(this.deskId);
            }
        });

        this._currentReferencesSubscription = this._deskSrv.currentReferences.pipe(skip(1)).subscribe(refs => {
                this.referencesList = refs;
        });
    }

    ngOnDestroy() {
        this._routeSubscription.unsubscribe();
        this._currentReferencesSubscription.unsubscribe();
        this._deskListSubscription.unsubscribe();
    }

    dragStartEvent(event) {
        if (this.deskId === DEFAULT_DESKTOP.id) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    dragEndEvent(evt) {
        this._deskSrv.storeOrder(this.referencesList, this.deskId);
    }

    removeLink(link: IDeskItem, $evt: Event): void {
        $evt.stopPropagation();
        const _confirm = Object.assign({}, CONFIRM_LINK_DELETE);
        _confirm.body = _confirm.body.replace('{{link}}', link.title);

        this._confirmSrv.confirm(_confirm)
            .then((confirmed: boolean) => {
                if (confirmed) {
                    this._deskSrv.unpinRef(link);
                }
            });
    }

    tryMove(evt: Event) {
        if (this.dragResolve) {
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
        setTimeout(() => {
            if (this.title) {
                this.title.nativeElement.focus();
            }
        }, 100);
    }

    onInputKeyDown(evt: KeyboardEvent) {
        if (evt) {
            if (evt.keyCode === 27) {
                this.cancel(event);
            } else if (evt.keyCode === 13) {
                this.save(evt);
            }
        }
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

    onFocus(event) {
        const input = event.target;
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
    }
    /**
     * Method check is there node and navigate or get message
     * @param link item to navigate
     */
    // public goToCard(link: IDeskItem): void {
    //     const segments: Array<string> = link.url.split('/');
    //     this._dictSrv.getFullNode(segments[2], segments[3])
    //         .then((node: EosDictionaryNode) => {
    //             node ? this._router.navigate([link.url]) : this._msgSrv.addNewMessage(NAVIGATE_TO_ELEMENT_WARN);
    //         });
    // }

    rttlink(item) {
        return item.value.linkType === 1 ? null : [item.value.url];
    }
}
