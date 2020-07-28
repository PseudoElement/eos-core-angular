import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { Router } from '@angular/router';

import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IDeskItem, DeskItemVisibleType as DITEM_VISIBLE_TYPE } from '../core/desk-item.interface';
import { EosDesk, IDesk } from '../core/eos-desk';

import { AppContext } from 'eos-rest/services/appContext.service';
import {SRCH_VIEW, SRCH_VIEW_DESC} from 'eos-rest/interfaces/structures';

import { ViewManager } from 'eos-rest/services/viewManager';
import { _ES } from 'eos-rest/core/consts';
import { WARN_DESK_MAX_COUNT } from '../consts/messages.consts';
import { EOS_PARAMETERS_TAB } from 'eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service';
import {PipRX} from '../../eos-rest';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';

const DEFAULT_DESKTOP_NAME = 'Мой рабочий стол';
export const DEFAULT_DESKTOP = {
    id: 'system',
    name: 'Стандартный рабочий стол',
    references: [],
    edited: false,
};
export const DEFAULT_DESKS: EosDesk[] = [DEFAULT_DESKTOP];

@Injectable()
export class EosDeskService {
    private _desksList: EosDesk[] = [];
    private readonly _recentItems: IDeskItem[];

    private _desksList$: BehaviorSubject<EosDesk[]>;
    private _recentItems$: BehaviorSubject<IDeskItem[]>;
    private _currentReferences$: BehaviorSubject<IDeskItem[]>;
    private _selectedDesk$: BehaviorSubject<EosDesk>;

    private _currentReferences: IDeskItem[] = [];
    private _selectedDesk: EosDesk;

    get desksList(): Observable<EosDesk[]> {
        return this._desksList$.asObservable();
    }

    get currentReferences(): Observable<IDeskItem[]> {
        return this._currentReferences$.asObservable();
    }

    get selectedDesk(): Observable<EosDesk> {
        return this._selectedDesk$.asObservable();
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _router: Router,
        private _appCtx: AppContext,
        private _apiSrv: PipRX,
        private viewManager: ViewManager,
        private _eaps: EosAccessPermissionsService,
        private _descrSrv: DictionaryDescriptorService,
    ) {
        this._selectedDesk = DEFAULT_DESKS[0];
        this._desksList = [...DEFAULT_DESKS];
        this._recentItems = [];

        this._desksList$ = new BehaviorSubject([]);
        this._recentItems$ = new BehaviorSubject(this._recentItems);
        this._currentReferences$ = new BehaviorSubject(this._currentReferences);
        this._selectedDesk$ = new BehaviorSubject(this._selectedDesk);

        this.selectedDesk.subscribe((desk) => {
            this._appCtx.ready().then(() => {
                this._readReferences(desk ? desk.id : null);
            });
        });
        this._appCtx.ready()
            .then(() => {
                this._readDeskList();
            });
     }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    public appendDeskItemToView(desk: IDesk) {
        let item: IDeskItem;
        const dictionaryURL = this._router.url.split('/')[2];
        const section = this._router.url.split('/')[1];
        if (section === 'parameters') {
            const lable = EOS_PARAMETERS_TAB.find((i) => i.url === dictionaryURL);
            item = {
                title: `Параметры системы (${lable.title})`,
                url: '/parameters/' + lable.url,
                blockId: lable.url,
            };
        } else if (section === 'user_param') {
            item = {
                title: 'Пользователи',
                url: '/user_param',
                blockId: 'user_param',
            };
        } else if (section === 'form') {
            const list = this._descrSrv.visibleDictionaries();
            const dict = list.find( i => i.id === dictionaryURL);
            item = {
                title: dict.title,
                url: '/form/' + dictionaryURL,
                iconName: '',
                blockId: dictionaryURL,
            };
        } else {
            item = {
                title: this._dictSrv.dictionaryTitle,
                /* fullTitle: this._dictSrv.dictionaryTitle, */
                url: '/spravochniki/' + dictionaryURL,
                iconName: '',
                blockId: dictionaryURL,
            };
        }
        const view: SRCH_VIEW = this.findView(desk.id);
        if (view !== undefined) {
            if (view.SRCH_VIEW_DESC_List.find(el => el.BLOCK_ID === item.blockId)) {
                return false;
            }
            const r = this.viewManager.addViewColumn(view);
            r.result.BLOCK_ID = dictionaryURL || 'user_param';
            r.result.LABEL = item.title;
            this.viewManager.saveView(r.view).then(() => {
                this._appCtx.reInit();
            });
        }
        /* tslint:disable */
        if (!~desk.references.findIndex((_ref: IDeskItem) => _ref.url === item.url)) {
            desk.references.push(item);
            return true;
        }
        /*tslint:enable*/
    }

    public storeOrder(referencesList: IDeskItem[], deskId: string): any {

        const view: SRCH_VIEW = this.findView(deskId);

        const list = [];
        for (let i = 0; i < referencesList.length; i++) {
            const ref = referencesList[i];
            const record = view.SRCH_VIEW_DESC_List.find( r => r.BLOCK_ID === ref.blockId);
            if (record) {
                list.push(record);
            }
        }

        view.SRCH_VIEW_DESC_List = list;
        this.viewManager.saveView(view);
    }

    /**
     * Update link name on the server
     * @param link editing item
     */
    public updateName(deskItem: IDeskItem) {
        const view = this.findView(this._selectedDesk.id);
        if (view) {
            this.viewManager.updateViewColumn(view, deskItem.blockId, deskItem.title);
            this.viewManager.saveView(view)
                .then(() => {
                    this._readReferences();
            });
        }
    }

    reloadDeskList() {
        // this._readDeskList();
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

    setSelectedDesk(deskId) {
        const desk = this._desksList.find((d) => d.id === deskId);
        if (!desk) {
            this._router.navigate(['/desk', 'system']);
        } else {
            this._selectedDesk = desk;
            this._selectedDesk$.next(this._selectedDesk);
        }
    }

    unpinRef(deskItem: IDeskItem) {
        const view = this.findView(this._selectedDesk.id);
        if (view && deskItem.blockId) {
            this.viewManager.delViewColumn(view, deskItem.blockId);
            this.viewManager.saveView(view)
                .then(() => {
                    view.SRCH_VIEW_DESC_List = view.SRCH_VIEW_DESC_List.filter(c => c.BLOCK_ID !== deskItem.blockId);
                    this._readReferences();
                });
        }
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
            this._sortDeskList();
            this._desksList$.next(this._desksList);
        });
    }

    editDesk(desk: EosDesk): Promise<any> {
        const deskView = this.findView(desk.id);
        let res = Promise.resolve(null);
        if (deskView) {
            deskView.VIEW_NAME = desk.name.trim();
            res = this.viewManager.saveView(deskView);
        }
        res.then(() => {
            this._readDeskList();
            // this._desksList.splice(this._desksList.indexOf(desk), 1, desk);
            // this._desksList$.next(this._desksList);
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
                return this._appCtx.ready()
                    .then(() => {
                        newDesc.SRCH_VIEW_DESC_List = [];
                        newDesc.ISN_VIEW = isn_view;
                        newDesc._State = 'MERGE';
                        desk.id = isn_view.toString();
                        this._desksList.push(desk);
                        this._sortDeskList();
                        this._desksList$.next(this._desksList);
                        this._appCtx.UserViews.push(newDesc);
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

    private _readReferences(deskId = null) {
        // this._appCtx.init()
        //     .then( () => { });
                this._dictSrv.getAllDictionariesList(deskId)
                    .then((descriptors) => {
                        this._currentReferences = descriptors.map((descr) =>
                            this._deskItemByDescriptor(descr));
                        if (Number(this._selectedDesk.id)) {
                            this._apiSrv.read<SRCH_VIEW>({
                                SRCH_VIEW: Number(this._selectedDesk.id),
                                expand: 'SRCH_VIEW_DESC_List'
                            })
                                .then(([view]) => {
                                    const references = [];
                                    view.SRCH_VIEW_DESC_List.sort ( (a, b) => {
                                        return  (a['ORDERNUM'] === b['ORDERNUM'] ? 0 :
                                                (a['ORDERNUM'] > b['ORDERNUM'] ? 1 : -1));
                                    }).forEach((dl) => {
                                        references.push(this.mapToDefaultDescItem(dl, this._currentReferences));
                                    });
                                    this._currentReferences = references;
                                    this._currentReferences$.next(this._currentReferences);
                                });
                        } else {
                            this._currentReferences$.next(this._currentReferences);
                        }
                    });

    }

    private _deskItemByDescriptor(descr): IDeskItem {
        return <IDeskItem>{
            url: (descr.dictType === E_DICT_TYPE.form ? '/form/' : '/spravochniki/') + descr.id,
            title: descr.title,
            iconName: descr.iconName,
            linkType: this._eaps.isAccessGrantedForDictionary(descr.id, null) === APS_DICT_GRANT.denied ?
                DITEM_VISIBLE_TYPE.disabled : DITEM_VISIBLE_TYPE.enabled,
        };
    }

    private _readDeskList() {
        const list = [...DEFAULT_DESKS];
        const viewIds = this._appCtx.UserViews
            .filter((uv) => uv.SRCH_KIND_NAME === 'clmanDesc')
            .map((uv) => uv.ISN_VIEW);
        if (viewIds.length) {
            this._apiSrv.read<SRCH_VIEW>({SRCH_VIEW: viewIds})
                .then((views) => {
                    views.forEach((view) => {
                        list.push(<EosDesk>{
                            id: view.ISN_VIEW.toString(),
                            name: view.VIEW_NAME,
                            edited: false,
                            references: [],
                        });
                    });
                    this._desksList = list;
                    this._sortDeskList();
                    this._desksList$.next(this._desksList);
                });
        } else {
            this._desksList = list;
            this._desksList$.next(this._desksList);
        }
    }

    private _sortDeskList() {
        this._desksList.sort((a, b) => {
            return (a.id === 'system') ? -1 : (b.id === 'system') ? 1 :
                a.name.localeCompare(b.name);
        });
    }

    private mapToDefaultDescItem(dl: SRCH_VIEW_DESC, defaults: IDeskItem[]): IDeskItem {
        const lable = EOS_PARAMETERS_TAB.find(i => i.url === dl.BLOCK_ID);
        if (lable) {
            return {
                url: '/parameters/' + lable.url,
                title: dl.LABEL,
                blockId: dl.BLOCK_ID,
            };
        }

        if (dl.BLOCK_ID === 'user_param') {
            return {
                url: '/user_param',
                title: dl.LABEL,
                blockId: dl.BLOCK_ID,
            };
        }

        let s = '/spravochniki/' + dl.BLOCK_ID;
        let result = defaults.find(it => it.url === s);
        if (!result) {
            s = '/form/' + dl.BLOCK_ID;
            result = defaults.find(it => it.url === s);
        }
        return Object.assign({}, result, {
            title: dl.LABEL,
            blockId: dl.BLOCK_ID,
        });
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
}
