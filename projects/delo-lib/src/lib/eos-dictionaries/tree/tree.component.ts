import { Component, Input, OnInit, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { EosDictionaryNode } from '../core/eos-dictionary-node';
import { Router } from '@angular/router';
import { EosDictService } from '../services/eos-dict.service';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

const BIG_PANEL = 340,
    SMALL_PANEL = 260,
    PADDING_W = 32,
    BIG_DISPLAY_W = 1600;

@Component({
    selector: 'eos-tree',
    templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit, OnChanges {
    @Input() nodes: EosDictionaryNode[];
    @Input() showDeleted: boolean;
    @Input() filters: any;

    private w: number;

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) { }

    ngOnInit() {
        this.onResize();
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('filters') && this._dictSrv.currentDictionary.id === E_DICTIONARY_ID.DEPARTMENTS) {
            this.updateTreeForFilters(this.nodes);
        }
    }
    updateTreeForFilters(data: EosDictionaryNode[]) {
        if (data && data.length) {
            data.forEach((d: EosDictionaryNode) => {
                d.visibleFilter = this.setVisible(d);
                if (d.children && d.children.length) {
                    this.updateTreeForFilters(d.children);
                }
            });
        }
    }

    setVisible(node: EosDictionaryNode) {
            if (this.filters) {
                const startDate = node.data.rec['START_DATE'] ? new Date(node.data.rec['START_DATE']).setHours(0, 0, 0, 0) : null;
                const endDate = node.data.rec['END_DATE'] ? new Date(node.data.rec['END_DATE']).setHours(0, 0, 0, 0) : null;
            return  (!startDate || this.filters - startDate >= 0) && (!endDate || endDate - this.filters >= 0);
            }
        return true;
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
        // if (!node.isDeleted || this._dictSrv.currentDictionary.id === 'cabinet') {
            const _path = node.getPath();
            this._router.navigate(_path);
        // }
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }
}
