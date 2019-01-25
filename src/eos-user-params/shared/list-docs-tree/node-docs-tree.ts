import { IListDocsTree } from '../intrfaces/user-parm.intterfaces';

export class NodeDocsTree implements IListDocsTree {
    DUE: string;
    label: string;
    data: any;
    children: NodeDocsTree[] = [];
    parent: NodeDocsTree;
    layer: number;
    link: string[];
    isSelected: boolean = false;
    private _allowed: boolean;
    get allowed() {
        return this._allowed;
    }
    set allowed(value: boolean) {
        this._allowed = value;
        // this.data['rightDocGroup']['ALLOWED'] = +value;
    }
    constructor(due: string, label: string, allowed: boolean, data?: any) {
        this.DUE = due;
        this.label = label;
        this._allowed = allowed;
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
