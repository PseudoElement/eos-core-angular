import { Component, OnInit, HostListener } from '@angular/core';
import { MODS_USER_SELECT } from 'eos-user-select/shered/consts/user-select.consts';
import { IModesUserSelect, E_MODES_USER_SELECT } from 'eos-user-select/shered/interfaces/user-select.interface';
import { TreeUserSelectService } from 'eos-user-select/shered/services/tree-user-select.service';
import { TreeUserNode } from './core/tree-user-node';
import { Router } from '@angular/router';
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
    currMode: E_MODES_USER_SELECT = E_MODES_USER_SELECT.department;
    showDeleted: boolean;
    isLoading: boolean = true;
    private w: number;
    constructor(
        private _router: Router,
        private treeSrv: TreeUserSelectService,
        private _apiSrv: UserParamApiSrv,
    ) {
    }
    ngOnInit() {
        this.isLoading = true;
        this.treeSrv.init(this.currMode)
        .then(() => {
            this.nodes = [this.treeSrv.root];
            this.isLoading = false;
        });
        this.onResize();
    }
    setTab(key) {
        this.currMode = key;
        this.ngOnInit();
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
            titleDue: node.data['CLASSIF_NAME']
        });
        this._router.navigate(['user_param', node.id]);
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
