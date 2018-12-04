import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import {EosDictService} from '../services/eos-dict.service';

const BIG_PANEL = 340,
    SMALL_PANEL = 260,
    PADDING_W = 32,
    BIG_DISPLAY_W = 1600;

export class CustomTreeNode {
    title: string;
    parent: any;
    id: any;
    isNode: boolean;
    isDeleted: boolean;
    isActive: boolean;
    expandable: boolean;
    isExpanded: boolean;
    updating: boolean;
    path: string[];
    children: CustomTreeNode[];
}

@Component({
    selector: 'eos-custom-tree',
    templateUrl: './custom-tree.component.html'
})
export class CustomTreeComponent implements OnInit {
    @Input() data: CustomTreeNode[];
    @Input() showDeleted: boolean;

    private w: number;
    // private data: CustomTreeNode[];

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) {
        // this.data = _dictSrv.currentDictionary.descriptor.getCustomTreeData();
        this._dictSrv = _dictSrv;
        // this._dictDiscr = _dictDiscr;
    }

    ngOnInit() {
        this.onResize();
    }

    @HostListener('window:resize')
    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
    }

    onExpand(evt: Event, node: CustomTreeNode/*, isDeleted: boolean*/) {
        evt.stopPropagation();
        if (node.isExpanded) {
            node.isExpanded = false;
        } else {
            // node.updating = true;
            node.isExpanded = true;
        //     this._dictSrv.expandNode(node.id)
        //         .then((_node) => {
        //             _node.isExpanded = true;
        //             node.updating = false;
        //         });
        }
    }

    onSelect(evt: Event, node: CustomTreeNode) {
        evt.stopPropagation();
        if (!node.isDeleted) {
            this._router.navigate(node.path);
        }
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
