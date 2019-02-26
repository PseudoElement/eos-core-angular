import { Component, OnInit, HostListener } from '@angular/core';
import { MODS_USER_SELECT } from 'eos-user-select/shered/consts/user-select.consts';
import { IModesUserSelect, /* E_MODES_USER_SELECT */} from 'eos-user-select/shered/interfaces/user-select.interface';
import { TreeUserSelectService } from 'eos-user-select/shered/services/tree-user-select.service';
import { TreeUserNode } from './core/tree-user-node';
import { Router } from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
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
    private w: number;
    constructor(
        private _router: Router,
        private treeSrv: TreeUserSelectService,
        private _apiSrv: UserParamApiSrv,
        private actRoute: ActivatedRoute
    ) {
        this.actRoute.params.subscribe(param => {
            this.id = param['nodeId'];
    });
}
    ngOnInit() {
        console.log(this.currMode);
        this.currMode = +sessionStorage.getItem('key');
        this.id = this.actRoute.snapshot.params['nodeId'] || '0.';
        this.isLoading = true;
        sessionStorage.setItem('sss', JSON.stringify(this.id));
        this.treeSrv.init(this.currMode)
        .then(() => {
            this.nodes = [this.treeSrv.root];
            this.isLoading = false;
        });
        this.onResize();
    }
     setTab(key) {
         sessionStorage.setItem('key', key);
        this.currMode = key;
        this._apiSrv.confiList$.next({
            shooseTab: this.currMode,
            titleDue: this.currMode === 0 ? 'Все подразделения' : this.currMode === 1 ? 'Все картотеки' : 'Все организации'
        });
        // this.ngOnInit();
        this.id = this.actRoute.snapshot.params['nodeId'] || '0.';
        this.treeSrv.init(this.currMode)
        .then(() => {
            this.nodes = [this.treeSrv.root];
            this.isLoading = false;
        });
        // this._router.navigate(['user_param', '0.']);
        this.treeSrv.changeListUsers.next();
    }

    @HostListener('window:resize')
    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
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
            titleDue: node.title
        });
        sessionStorage.setItem('sss', JSON.stringify(node.id));
        this._router.navigate(['user_param', node.id]);
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
