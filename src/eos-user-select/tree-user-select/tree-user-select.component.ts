import { Component, OnInit, HostListener } from '@angular/core';
import { MODS_USER_SELECT } from 'eos-user-select/shered/consts/user-select.consts';
import { IModesUserSelect, /* E_MODES_USER_SELECT */} from 'eos-user-select/shered/interfaces/user-select.interface';
import { TreeUserSelectService } from 'eos-user-select/shered/services/tree-user-select.service';
import { TreeUserNode } from './core/tree-user-node';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { EosStorageService } from 'app/services/eos-storage.service';
const BIG_PANEL = 340,
    SMALL_PANEL = 260,
    PADDING_W = 32,
    BIG_DISPLAY_W = 1600;

@Component({
    selector: 'eos-tree-user-select',
    templateUrl: 'tree-user-select.component.html'
})

export class TreeUserSelectComponent implements OnInit {
    nodes: TreeUserNode[];
    modes: IModesUserSelect[] = MODS_USER_SELECT;
    currMode = 0;
    showDeleted: boolean;
    isLoading: boolean = true;
    id: any;
    typeUsers: string;
    private w: number;
    constructor(
        private _router: Router,
        private treeSrv: TreeUserSelectService,
        private _apiSrv: UserParamApiSrv,
        private actRoute: ActivatedRoute,
        private _store: EosStorageService,
    ) {
        this.actRoute.params.subscribe(param => {
            this.id = param['nodeId'];
        });
}
    ngOnInit() {
        this.id = this.actRoute.snapshot.params['nodeId'] || '0.';
        this.isLoading = true;
        localStorage.setItem('lastNodeDue', JSON.stringify(this.id));
        this.currMode = +sessionStorage.getItem('key');
        this.treeSrv.init(this.currMode)
        .then(() => {
            this.nodes = [this.treeSrv.root];
            this.isLoading = false;
            this.updateTree();
        });
        this.onResize();
    }
    GetTypeUsers(): string {
        if (this._apiSrv.flagDelitedPermanantly === true) {
            this.typeUsers = 'del';
        }
        if (this._apiSrv.flagTehnicalUsers === true) {
            this.typeUsers = 'tech';
        }
        if (this._apiSrv.flagTehnicalUsers !== true && this._apiSrv.flagDelitedPermanantly !== true) {
            this.typeUsers = 'users';
        }
        return this.typeUsers;
    }
    setTab(key) {
        sessionStorage.setItem('key', key);
        sessionStorage.setItem('titleDue', '');
        this.currMode = key;
        this._apiSrv.confiList$.next({
            shooseTab: this.currMode,
            titleDue: this.currMode === 0 ? 'Все подразделения' : this.currMode === 1 ? 'Центральная картотека' : 'Все организации',
            due: this.id,
        });
        // this.ngOnInit();
        this.id = this.actRoute.snapshot.params['nodeId'] || '0.';
        localStorage.setItem('lastNodeDue', JSON.stringify('0.'));
        this.treeSrv.init(this.currMode)
        .then(() => {
            this.nodes = [this.treeSrv.root];
            this.isLoading = false;
        });
        if (this.actRoute.snapshot.params['nodeId'] === '0.') {
            this.treeSrv.changeListUsers.next();
        }
        this._router.navigate(['user_param', '0.']);
    }

    @HostListener('window:resize')
    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
    }

    updateTree() {
            let due;
            const url = this._router.url.split('/');
            if (url[url.length - 1] === 'user_param') {
                due = '0.';
            } else {
                due = url[url.length - 1];
            }
            let str = '0.';
            const mas = due.replace('0.', '').split('.');
            for (let index = 0; index + 2 < mas.length; index++) {
                this.treeSrv.expandNode(str + mas[index] + '.')
                .then(dat => {
                    dat.isExpanded = true;
                    dat.updating = false;
                });
                str = str + mas[index] + '.';
            }
    }

    onExpand(evt: Event, node: TreeUserNode/*, isDeleted: boolean*/) {
        // console.log('onExpand', arguments);
        evt.stopPropagation();
        if (node.isExpanded) {
            node.isExpanded = false;
        } else {
            node.updating = true;
            this.treeSrv.expandNode(node.id)
                .then((_node) => {
                    node.isExpanded = true;
                    node.updating = false;
            });
        }
    }

    onSelect(evt: Event, node: TreeUserNode) {
        evt.stopPropagation();
        this._apiSrv.confiList$.next({
            shooseTab: this.currMode,
            titleDue: node.title,
            due: this.id,
        });
        this._store.removeItem('page_number_user_settings');
        localStorage.setItem('lastNodeDue', JSON.stringify(node.id));
        sessionStorage.setItem('isnNodeMy', node.data['ISN_NODE']);
        this._router.navigate(['user_param', node.id]);
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
