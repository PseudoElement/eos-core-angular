import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Router } from '@angular/router';

import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IDeskItem } from '../core/desk-item.interface';
import { EosDesk, IDesk } from '../core/eos-desk';

import { AppContext } from 'eos-rest/services/appContext.service';
import { SRCH_VIEW } from 'eos-rest/interfaces/structures';

import { ViewManager } from 'eos-rest/services/viewManager';
import { _ES } from 'eos-rest/core/consts';
import { WARN_DESK_MAX_COUNT } from '../consts/messages.consts';

const DEFAULT_DESKTOP_NAME = 'Мой рабочий стол';
const DEFAULT_DESKS: EosDesk[] = [{
    id: 'system',
    name: 'Стандартный рабочий стол',
    references: [],
    edited: false,
}];

@Injectable()
export class EosDeskService {
    private _desksList: EosDesk[];
    private _selectedDesk: EosDesk;
    private _recentItems: IDeskItem[];

    private _desksList$: BehaviorSubject<EosDesk[]>;
    private _selectedDesk$: BehaviorSubject<EosDesk>;
    private _recentItems$: BehaviorSubject<IDeskItem[]>;

    private selectedDeskId: string;

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    get selectedDesk(): Observable<EosDesk> {
        return this._selectedDesk$.asObservable();
    }

    get recentItems(): Observable<IDeskItem[]> {
        return this._recentItems$.asObservable();
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _appCtx: AppContext,
        private viewManager: ViewManager
    ) {
        this.selectedDeskId = 'system';
        this._desksList = DEFAULT_DESKS;

        this._desksList$ = new BehaviorSubject(this._desksList);
        this._selectedDesk = this._desksList[0];
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);
        this._recentItems$ = new BehaviorSubject(this._recentItems);

        _dictSrv.getDictionariesList()
            .then((dictionariesList) => {
                this._desksList[0].references = dictionariesList.map((dictionary) => {
                    return {
                        url: '/spravochniki/' + dictionary.id,
                        title: dictionary.title,
                        iconName: dictionary.iconName,
                    };
                });
            });

        this._recentItems = [];
        this._appCtx.ready()
            .then(() => {
                this.readDeskList();
            });
    }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    public appendDeskItemToView(desk: IDesk) {
        const dictionaryURL = this._router.url.split('/')[2];
        const item: IDeskItem = {
            title: this._dictSrv.dictionaryTitle,
            /* fullTitle: this._dictSrv.dictionaryTitle, */
            url: '/spravochniki/' + dictionaryURL,
            iconName: '',
        };
        const view: SRCH_VIEW = this.findView(desk.id);
        if (view !== undefined) {
            if (view.SRCH_VIEW_DESC_List.find(el => el.BLOCK_ID === item.url.split('/')[2])) {
                return false;
            }
            const col = this.viewManager.addViewColumn(view);
            col.BLOCK_ID = dictionaryURL;
            col.LABEL = item.title;
            this.viewManager.saveView(view).then(() => this._appCtx.reInit());
        }
        /* tslint:disable */
        if (!~desk.references.findIndex((_ref: IDeskItem) => _ref.url === item.url)) {
            desk.references.push(item);
            return true;
        }
        /*tslint:enable*/
    }

    /**
     * Update link name on the server
     * @param link editing item
     */
    public updateName(link: IDeskItem): Promise<any> {
        const v = this.findView(this._selectedDesk.id);
        if (v !== undefined) {
            const blockId = link.url.split('/')[2];
            this.viewManager.updateViewColumn(v, blockId, link.title);
            return this.viewManager.saveView(v).then(() => {
                this._appCtx.reInit();
                this._selectedDesk$.next(this._selectedDesk);
            });
        } else {
            return Promise.resolve(null);
        }
    }

    /* getDesk(id: string): Promise<EosDesk> {
        return new Promise((res, rej) => { // tslint:disable-line:no-unused-variable
            res(this._desksList.find((_desk) => id === _desk.id));
        });
    }

    getName(id: string): Observable<string> {
        const _name = new Subject<string>();
        _name.next(this._desksList.find((_desk) => id === _desk.id).name);
        return _name;
    }*/

    setSelectedDesk(deskId: string) {
        if (deskId !== this.selectedDeskId) {
            this.selectedDeskId = deskId;
            this.updateSelectedDesk();
        }
    }

    unpinRef(link: IDeskItem): void {
        const v = this.findView(this._selectedDesk.id);
        if (v !== undefined) {
            const blockId = link.url.split('/')[2];
            this.viewManager.delViewColumn(v, blockId);
            this.viewManager.saveView(v)
                .then(() => {
                    v.SRCH_VIEW_DESC_List = v.SRCH_VIEW_DESC_List.filter(c => c.BLOCK_ID !== blockId);
                    // Костыль, рефакторить!
                });
        }

        this._selectedDesk.references = this._selectedDesk.references.filter((r) => r !== link);
        this._selectedDesk$.next(this._selectedDesk);
    }

    addRecentItem(link: IDeskItem): void {
        this._recentItems.push(link);
        if (this._recentItems.length > 10) {
            this._recentItems.shift();
        }
        this._recentItems$.next(this._recentItems);
    }

    removeDesk(desk: EosDesk): Promise<any> {
        let res = Promise.resolve(null);
        const v = this.findView(desk.id);
        if (v !== undefined) {
            v._State = _ES.Deleted;
            res = this.viewManager.saveView(v);
        }
        return res.then(() => {
            if (this._selectedDesk.id === desk.id) {
                this.setSelectedDesk(this._desksList[0].id);
            }

            this._desksList = this._desksList.filter((d) => d.id !== desk.id);
            this._desksList$.next(this._desksList);
        });
    }

    editDesk(desk: EosDesk): Promise<any> {
        const deskView = this.findView(desk.id);
        // console.log('editdesk', deskView);

        let res = Promise.resolve(null);
        if (deskView) {
            deskView.VIEW_NAME = desk.name.trim();
            res = this.viewManager.saveView(deskView);
        }
        res.then(() => {
            this._desksList.splice(this._desksList.indexOf(desk), 1, desk);
            this._desksList$.next(this._desksList);
            // console.log('editing done');
        });
        return res;
    }

    createDesk(desk: EosDesk): Promise<any> {
        if (this._desksList.length > 5) {// users desk + system desk
            this._msgSrv.addNewMessage(WARN_DESK_MAX_COUNT);
            return Promise.resolve(null);
        }

        const viewMan = this.viewManager;
        const newDesc = viewMan.createView('clmanDesc');
        newDesc.VIEW_NAME = desk.name.trim();

        return viewMan.saveView(newDesc)
            .then((isn_view) => {
                return this._appCtx.init()
                    .then(() => {
                        desk.id = isn_view.toString();
                        this._desksList.push(desk);
                        this._desksList$.next(this._desksList);
                        return desk;
                    });
            });
    }
    /**
     * @description Checks does it exist deskatop with that name
     * @param name Name of desktop
     */
    public desktopExisted(name: string) {
        name = name.trim();
        /* tslint:disable:no-bitwise */
        return this._desksList.find((_d) => _d.name === name);
        /* tslint:enable:no-bitwise */
    }
    /**
     * @description Generate new dektop name bu count.
     * @returns Name of desktop. Example: 'My desktop 1', 'My desktop 2'.
     */
    public generateNewDeskName(): string {
        let _newName = DEFAULT_DESKTOP_NAME;
        let _n = 2;
        while (this.desktopExisted(_newName)) {
            _newName = DEFAULT_DESKTOP_NAME + ' ' + _n;
            _n++;
        }
        return _newName;
    }

    private readDeskList() {
        const view = this._appCtx.UserViews.filter((uv) => uv.SRCH_KIND_NAME === 'clmanDesc');
        for (let i = 0; i < view.length; i++) {
            this._desksList.push(this.readDesc(view[i]));
        }
        this._desksList$.next(this._desksList);
        this.updateSelectedDesk();
    }

    private readDesc(v: SRCH_VIEW): EosDesk {
        const res = <EosDesk>{ id: v.ISN_VIEW.toString(), name: v.VIEW_NAME, edited: false, references: [] };
        const cols = v.SRCH_VIEW_DESC_List;
        for (let i = 0; i !== cols.length; i++) {
            const col = cols[i];
            const di = this.mapToDefaultDescItem(cols[i].BLOCK_ID);
            di.title = col.LABEL;
            res.references.push(di);
        }
        return res;
    }

    private mapToDefaultDescItem(blockId: string): IDeskItem {
        const defaults = this._desksList[0].references;
        const s = '/spravochniki/' + blockId;
        const result = defaults.find(it => it.url === s);
        return Object.assign({}, result);
    }

    /**
     * Find desktop in the UserView
     * @param deskId destop ID
     */
    private findView(deskId: string) {
        const isn: number = parseInt(deskId, 0);
        const v: SRCH_VIEW = this._appCtx.UserViews.find((uv: SRCH_VIEW) => uv.ISN_VIEW === isn);
        if (v === undefined) {
            // TODO: может отругаться?
        }
        return v;
    }

    private updateSelectedDesk() {
        this._selectedDesk = this._desksList.find((d) => d.id === this.selectedDeskId);
        this._selectedDesk$.next(this._selectedDesk || this._desksList[0]);
    }
}
