import { IListDocsTree, INodeDocsTreeCfg } from '../intrfaces/user-parm.intterfaces';

export class NodeDocsTree implements IListDocsTree {
    DUE: string;
    label: string;
    data: any;
    children: NodeDocsTree[] = [];
    parent: NodeDocsTree;
    layer: number;
    link: string[];
    isSelected: boolean = false;
    isExpanded: boolean = true;
    isAllowed: boolean;
    isviewAllowed: boolean;
    isOwnDepartment: boolean = true;
    flagCheckNode: any;
    redFlag: boolean;
    weight: number;
    logDelete: boolean;
    get classChecBox() {
        return {
            'redUnchecked': !this.isAllowed && this.redFlag,
        };
    }
    constructor({due, label, allowed, data, viewAllowed, flagCheckNode, weight}: INodeDocsTreeCfg, redFlag?, isOwnDepartment = true, logDeleted?: any) {
        this.DUE = due;
        this.label = label;
        this.isAllowed = allowed;
        this.isviewAllowed = viewAllowed === undefined ? true : viewAllowed;
        this.flagCheckNode = flagCheckNode ? flagCheckNode : undefined;
        this.redFlag = redFlag ? redFlag : undefined;
        this.isOwnDepartment = isOwnDepartment;
        this.data = data;
        this.weight = weight;
        this.logDelete = logDeleted;
        this.link = due.split('.');
        this.link.pop();
    }
    addChildren(node: NodeDocsTree) {
        this.children.push(node);
    }
    sortChildren() {
        if (this.children.length > 1) {
            this.children = this.children.sort((a, b) => {
                if (a.data.instance && b.data.instance && a.data.instance['CARD_NAME'] && b.data.instance['CARD_NAME']) {
                    return a.data.instance['CARD_NAME'].localeCompare(b.data.instance['CARD_NAME']);
                }
                return 0;
            });
        }
    }
    deleteChild(node: NodeDocsTree) {
        if (this.children.length) {
            this.children = this.children.filter((chld) => chld !== node);
        }
    }
    reset() {
        this.children = [];
        this.parent = null;
        this.layer = null;
    }
}
