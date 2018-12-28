import { IListDocsTree } from '../intrfaces/user-parm.intterfaces';

export class NodeDocsTree implements IListDocsTree {
    DUE: string;
    label: string;
    allowed: boolean;
    data: any;
    children: NodeDocsTree[] = [];
    parent: NodeDocsTree;
    layer: number;
    link: string[];
    isSelected: boolean = false;
    constructor(due: string, label: string, allowed: boolean, data?: any) {
        this.DUE = due;
        this.label = label;
        this.allowed = allowed;
        this.data = data;
        this.link = due.split('.');
        this.link.pop();
    }
    addChildren(node: NodeDocsTree) {
        this.children.push(node);
    }
    deleteChild(node: NodeDocsTree) {
        if (this.children.length) {
            this.children = this.children.filter((chld) => chld !== node);
        }
    }
}
