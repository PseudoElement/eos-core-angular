import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { NodeDocsTree } from './node-docs-tree';

@Component({
    selector: 'eos-list-doc-tree',
    templateUrl: 'list-docs-tree.component.html',
})
export class ListDocsTreeComponent implements OnChanges {
    @Input() editMode: boolean = true;
    @Input() listNode: NodeDocsTree[];
    @Input() systemTech: number;
    @Input() hideExpand?: boolean;
    @Output() select = new EventEmitter();
    @Output() checkedNode = new EventEmitter();
    list: NodeDocsTree[] = [];
    curentNode: NodeDocsTree;
    ngOnChanges(changes: SimpleChanges) {
        if (this.listNode.length) {
            this._createStructure(this.listNode);
        } else {
            this.list = [];
        }
    }

    clickLable(event, item: NodeDocsTree) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.tagName === 'LABEL') { // click to label
            this._selectNode(item);
        }
        if (event.target.tagName === 'SPAN' && this.editMode) { // click to checkbox
            if (item.isviewAllowed) {
                item.isAllowed = !item.isAllowed;
                this.checkedNode.emit(item);
            }
        }
    }
    onExpand(evt: Event, node: NodeDocsTree) {
        if (!this.hideExpand) {
            evt.stopPropagation();
            node.isExpanded = !node.isExpanded;
        }
    }
    private _createStructure(liNodes: NodeDocsTree[]) {
        this.list = [];
        this._resetNodes(liNodes);
        const minLength = this._findMinLength(liNodes);
        if (this.hideExpand) {
            this.list = liNodes;
        } else {
            liNodes.forEach((node: NodeDocsTree) => {
                if (node.link.length === minLength) {
                    this.list.push(node);
                } else {
                    this._findParent(node);
                }
            });
        }
        this._writeLayer(this.list, 0);
    }
    private _findParent(node: NodeDocsTree) {
        let parent: NodeDocsTree = null;
        let index = node.link.length - 2;
        while (!parent && (index >= 0)) {
            const parentName = node.link[index];
            this.listNode.some((n: NodeDocsTree) => {
                if (n.link.length - 1 === index && n.link[index] === parentName) {
                    parent = n;
                    return true;
                }
            });
            index--;
        }
        if (parent) {
            parent.isExpanded = this.hideExpand ? this.hideExpand : parent.isExpanded;
            parent.addChildren(node);
            node.parent = parent;
        } else {
            this.list.push(node);
        }
    }
    private _writeLayer(li: NodeDocsTree[], layer: number) {
        li.forEach((node: NodeDocsTree) => {
            node.layer = layer;
            if (node.children.length) {
                this._writeLayer(node.children, layer + 1);
            }
        });
    }
    private _selectNode(item: NodeDocsTree) {
        if (this.curentNode) {
            this.curentNode.isSelected = false;
        }
        this.curentNode = item;
        this.curentNode.isSelected = true;
        this.select.emit(item);
    }
    private _findMinLength (liNodes: NodeDocsTree[]): number {
        let min = liNodes[0].link.length;
        liNodes.forEach(node => {
            const count = node.link.length;
            if (count < min) {
                min = count;
            }
        });
        return min;
    }
    private _resetNodes (liNodes: NodeDocsTree[]) {
        liNodes.forEach((node: NodeDocsTree) => {
            node.reset();
        });
    }
}
