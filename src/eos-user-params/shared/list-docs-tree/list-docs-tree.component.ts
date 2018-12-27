import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeDocsTree } from './node-docs-tree';

@Component({
    selector: 'eos-list-doc-tree',
    templateUrl: 'list-docs-tree.component.html'
})
export class ListDocsTreeComponent implements OnInit {
    @Input() listNode: NodeDocsTree[];
    @Output() select = new EventEmitter();
    list: NodeDocsTree[] = [];

    ngOnInit() {
        this._createStructure(this.listNode);
    }
    private _createStructure(list: NodeDocsTree[]) {
        list.forEach((node: NodeDocsTree) => {
            if (node.link.length === 1) {
                this.list.push(node);
            } else {
                this._findParent(node);
            }
        });
        this._writeLayer(this.list, 0);
        console.log(this.list);
    }
    private _findParent(node: NodeDocsTree) {
        let parent: NodeDocsTree = null;
        let index = node.link.length - 2;
        while (!parent) {
            const parentName = node.link[index];
            this.listNode.some((n: NodeDocsTree) => {
                if (n.link.length - 1 === index && n.link[index] === parentName) {
                    parent = n;
                    return true;
                }
            });
            index--;
        }
        parent.addChildren(node);
        node.parent = parent;
    }
    private _writeLayer(li: NodeDocsTree[], layer: number) {
        li.forEach((node: NodeDocsTree) => {
            node.layer = layer;
            if (node.children.length) {
                this._writeLayer(node.children, layer + 1);
            }
        });
    }
}
