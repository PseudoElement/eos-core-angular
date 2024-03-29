import { Component, Input, OnInit, HostListener, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { EosDictService } from '../../eos-dictionaries/services/eos-dict.service';
import { Subscription } from 'rxjs';
import { Features } from '../../eos-dictionaries/features/features-current.const';
// import {EosDictService} from '../services/eos-dict.service';

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
    isClickable: boolean;
    updating: boolean;
    path: string[];
    data?: {};
    visibleFilter?: any;
    children: CustomTreeNode[];
}

@Component({
    selector: 'eos-custom-tree',
    templateUrl: './custom-tree.component.html'
})
export class CustomTreeComponent implements OnInit, OnDestroy, OnChanges {
    @Input() data: CustomTreeNode[];
    @Input() showDeleted: boolean;
    @Input() filters: any;
    @Output() onSetActiveNode: EventEmitter<CustomTreeNode> = new EventEmitter<CustomTreeNode>();
    lastSelectedNode: CustomTreeNode;
    private w: number;
    private _subscription: Subscription;
    // private data: CustomTreeNode[];

    constructor(
        private _router: Router,
        private _dictSrv: EosDictService,
    ) {
        // this.data = _dictSrv.currentDictionary.descriptor.getCustomTreeData();
        // this._dictSrv = _dictSrv;
        // this._dictDiscr = _dictDiscr;
    }

    static findTreeParent(treeData: CustomTreeNode[], id: any) {
        let i: number;
        let res: CustomTreeNode;
        for (i = 0; i < treeData.length; i++) {
            if (treeData[i].id === id) {
                return treeData[i];
            } else if (treeData[i].children && treeData[i].children.length) {
                res = this.findTreeParent(treeData[i].children, id);
                if (res) {
                    return res;
                }
            }
        }
        return null;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('filters')) {
            this.updateTreeForFilters(this.data);
        }
        if (changes.hasOwnProperty('showDeleted')) {
            this._checkTreePath(false, changes);
        }
    }
    ngOnInit() {
        this.onResize();
        this._subscription = this._dictSrv.openedNode$
            .subscribe((n) => {
                // if (n) {
                // this.setActiveNode(this.data, n.data.rec.DUE);
                // }
            });
        this._checkTreePath(true);
    }
    updateTreeForFilters(data: CustomTreeNode[]) {
        if (data && data.length) {
            data.forEach((d: CustomTreeNode) => {
                d.visibleFilter = this.setVisible(d);
                if (d.children && d.children.length) {
                    this.updateTreeForFilters(d.children);
                }
            });
        }
    }

    setVisible(node: CustomTreeNode) {
        if (node.id !== '0.') {
            if (this.filters && this.filters.YEAR) {
                const y = +this.filters.YEAR;
                const startDate = node.data['START_DATE'] ? new Date(node.data['START_DATE']).getFullYear() : null;
                const endDate = node.data['END_DATE'] ? new Date(node.data['END_DATE']).getFullYear() : null;
                return (!startDate || y - startDate >= 0) && (!endDate || endDate - y >= 0);
            }
            return true;
        }
        return true;
    }
    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    @HostListener('window:resize')
    onResize() {
        window.innerWidth >= BIG_DISPLAY_W ? this.w = BIG_PANEL : this.w = SMALL_PANEL;
    }

    onExpand(evt: Event, node: CustomTreeNode/*, isDeleted: boolean*/) {
        evt.stopPropagation();
        node.isExpanded = !node.isExpanded;
    }

    onSelect(evt: Event, node: CustomTreeNode) {
        evt.stopPropagation();
        if (!node.isClickable) {
            return;
        }
        if (!node.isDeleted && this.lastSelectedNode !== node || Features.cfg.canEditLogicDeleted && this.lastSelectedNode !== node) {
            this.lastSelectedNode =  node;
            this.onSetActiveNode.emit(node);
            this._router.navigate(node.path);
        }
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level);
    }


    setActiveNode(treeData: CustomTreeNode[], id: any) {
        if (id) {
            const t = CustomTreeComponent.findTreeParent(treeData, id);
            if (t) {
                this.expandToSelected(t, treeData);
                this.setActiveRecursive(treeData, false);
                t.isActive = true;
                this.onSetActiveNode.emit(t);
                this.setScrollIntoView(t.id);
            }
        }
    }

    setScrollIntoView(id: string): void {
        const elSelect = document.getElementById(id);
        if (elSelect) {
            const treeViewElement = document.getElementById('leftTreeView');
            if (treeViewElement) {
                treeViewElement.scrollTop = elSelect.offsetTop - treeViewElement.clientHeight / 2 + elSelect.offsetHeight / 2;
            }
        }
    }

    setActiveRecursive(treeData: CustomTreeNode[], active: boolean) {
        for (let i = 0; i < treeData.length; i++) {
            const element = treeData[i];
            element.isActive = active;
            if (treeData[i].children && treeData[i].children.length) {
                this.setActiveRecursive(treeData[i].children, active);
            }
        }
    }

    expandToSelected(node2expand: CustomTreeNode, nodes: CustomTreeNode[]) {
        let r = node2expand;
        if (r) {
            while (r) {
                if (r.expandable) {
                    r.isExpanded = true;
                }
                r = CustomTreeComponent.findTreeParent(nodes, r.parent);
                if (r) {
                    r.isExpanded = true;
                }
            }
        } else {
            nodes.find((f) => f.id === '0.').isExpanded = true;
        }
        return r;
    }

    private _checkTreePath(init: boolean, changes?: SimpleChanges) {
        let changePath;
        if (changes && !changes.showDeleted.currentValue) {
            const activeNode = this._dictSrv.currentDictionary.descriptor.getActive();
            changePath = activeNode && activeNode.isDeleted;
            if (changePath) {
                this._dictSrv.currentDictionary.descriptor.setRootNode('0.');
            }
        }
        if (changePath || init) {
            const defaultRoot = this._dictSrv.currentDictionary.descriptor.defaultTreePath(this.data);
            if (defaultRoot) {
                setTimeout(() => {
                    this._router.navigate(defaultRoot);
                }, 100);
            }
        }
    }
}
