import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NodeDocsTree } from './node-docs-tree';

@Component({
    selector: 'eos-list-doc-tree',
    templateUrl: 'list-docs-tree.component.html',
})
export class ListDocsTreeComponent implements OnInit, OnChanges {
    @Input() listNode: NodeDocsTree[];
    @Output() select = new EventEmitter();
    @Output() checkedNode = new EventEmitter();
    list: NodeDocsTree[] = [];
    curentNode: NodeDocsTree;

    ngOnInit() {
        // this._createStructure(this.listNode);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.listNode.length) {
            this._createStructure(this.listNode);
        }
    }

    clickLable(event, item: NodeDocsTree) {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.tagName === 'LABEL') { // click to label
            this._selectNode(item);
        }
        if (event.target.tagName === 'SPAN') { // click to checkbox
            if (item.isviewAllowed) {
                item.isAllowed = !item.isAllowed;
                this.checkedNode.emit(item);
            }
        }
    }
    onExpand(evt: Event, node: NodeDocsTree) {
        evt.stopPropagation();
        node.isExpanded = !node.isExpanded;
    }
    private _createStructure(liNodes: NodeDocsTree[]) {
        this.list = [];
        this._resetNodes(liNodes);
        const minLength = this._findMinLength(liNodes);
        liNodes.forEach((node: NodeDocsTree) => {
            if (node.link.length === minLength) {
                this.list.push(node);
            } else {
                this._findParent(node);
            }
        });
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
