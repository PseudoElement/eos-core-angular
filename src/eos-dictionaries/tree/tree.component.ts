import { Component, Input, OnInit, HostListener } from '@angular/core';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { Router } from '@angular/router';
import { EosDictService } from '../services/eos-dict.service';

const BIG_PANEL = 340,
    SMALL_PANEL = 260,
    PADDING_W = 32,
    BIG_DISPLAY_W = 1600;

@Component({
    selector: 'eos-tree',
    templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {
    @Input() nodes: EosDictionaryNode[];
    @Input() showDeleted: boolean;

    private w: number;

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) { }

    ngOnInit() {
        this.onResize();
    }

    @HostListener('window:resize')
    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
    }

    onExpand(evt: Event, node: EosDictionaryNode/*, isDeleted: boolean*/) {
        evt.stopPropagation();
        if (node.isExpanded) {
            node.isExpanded = false;
        } else {
            node.updating = true;
            this._dictSrv.expandNode(node.id)
                .then((_node) => {
                    _node.isExpanded = true;
                    node.updating = false;
                });
        }
    }

    onSelect(evt: Event, node: EosDictionaryNode) {
        evt.stopPropagation();
        if (!node.isDeleted || this._dictSrv.currentDictionary.id === 'cabinet') {
            const _path = node.getPath();
            this._router.navigate(_path);
        }
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
