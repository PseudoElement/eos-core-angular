import { Component, Input, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { Subscription } from 'rxjs';
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
    updating: boolean;
    path: string[];
    data?: {};
    children: CustomTreeNode[];
}

@Component({
    selector: 'eos-custom-tree',
    templateUrl: './custom-tree.component.html'
})
export class CustomTreeComponent implements OnInit, OnDestroy {
    @Input() data: CustomTreeNode[];
    @Input() showDeleted: boolean;

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

    ngOnInit() {
        this.onResize();
        this._subscription = this._dictSrv.openedNode$
            .subscribe((n) => {
                if (n) {
                    this.setActiveNode(this.data, n.data.rec.DUE);
                }
            });

        const defaultRoot = this._dictSrv.currentDictionary.descriptor.defaultTreePath(this.data);
        if (defaultRoot) {
            setTimeout( () => {
                this._router.navigate(defaultRoot);
            }, 100);
        }
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


    setActiveNode(treeData: CustomTreeNode[], id: any) {
        if (id) {
            const t = this.findTreeParent(treeData, id);
            if (t) {
                this.expandToSelected(t, treeData);
                this.setActiveRecursive(treeData, false);
                t.isActive = true;
                this.setScrollIntoView(t.id);
            }
        }
    }

    setScrollIntoView(id: string): void {
        const elSelect = document.getElementById(id);
        if (elSelect) {
            const container = document.getElementsByTagName('eos-custom-tree')[0].parentElement;
            if (container) {
                container.scrollTop = elSelect.offsetTop - container.clientHeight / 2;
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
                r = this.findTreeParent(nodes, r.parent);
                if (r) {
                    r.isExpanded = true;
                }
            }
        } else {
            nodes.find((f) => f.id === '0.').isExpanded = true;
        }
        return r;
    }

    findTreeParent(treeData: CustomTreeNode[], id: any) {
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
}
