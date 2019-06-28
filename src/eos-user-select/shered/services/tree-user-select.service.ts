import { Injectable } from '@angular/core';
import { PipRX, DEPARTMENT } from 'eos-rest';
import { TreeUserNode } from 'eos-user-select/tree-user-select/core/tree-user-node';
import { E_MODES_USER_SELECT } from '../interfaces/user-select.interface';
import {Subject} from 'rxjs';
const DEPARTMENT_QUERY = {DEPARTMENT: PipRX.criteries({
    LAYER: '1:2',
    IS_NODE: '0',
    orderby: 'INS_DATE'
})};

@Injectable()
export class TreeUserSelectService {
    root: TreeUserNode;
    cardFlag: number;
    public changeListUsers = new Subject();
    public lastNodeSelected: TreeUserNode;
    private _showDeleted: boolean;
    private _nodes: Map<string, TreeUserNode>;

    get changeListUsers$() {
        return this.changeListUsers.asObservable();
    }
    constructor (
        private apiSrv: PipRX,
    ) {
        this._nodes = new Map<string, TreeUserNode>();
        this.root = new TreeUserNode({DUE: '0.', IS_NODE: 0}, 0);
    }
    init(mode: E_MODES_USER_SELECT): Promise<any> {
        this._nodes.clear();
        this.root.isExpanded = true;
        this.root.children = [];
        const query = Object.assign({}, DEPARTMENT_QUERY);

        if (mode === E_MODES_USER_SELECT.card) {
            this.cardFlag = 1;
            query.DEPARTMENT.criteries['CARD_FLAG'] = '1';
            this.root.title = 'Центральная картотека';
        } else {
            delete query.DEPARTMENT.criteries['CARD_FLAG'];
            this.cardFlag = 0;
            this.root.title = 'Все подразделения';
        }

        return this.apiSrv.read<DEPARTMENT>(query)
        .then(data => {
            this.updateNodes(data, true);
            if (this.lastNodeSelected) {
                const paren = this.lastNodeSelected.parent;
                this.openParent(paren);
            }
        })
        .catch(e => {
            return null;
        });
    }
    openParent(node: TreeUserNode) {
        node.isExpanded = true;
        node.expandable = true;
        if (node.parent) {
            this.openParent(node.parent);
        }
    }
    updateNodes(data: DEPARTMENT[], updateTree = false): TreeUserNode[] {
        const nodeIds: string[] = [];
        data.forEach((nodeData) => {
            if (nodeData) {
                const nodeId = nodeData['DUE'];
                let _node = this._nodes.get(nodeId);
                if (_node) {
                    _node.updateData(nodeData);
                } else {
                    _node = new TreeUserNode(nodeData, this.cardFlag);
                    if (_node) {
                        this._nodes.set(_node.id, _node);
                    }
                }
                if (_node && nodeIds.findIndex((id) => id === _node.id) === -1) {
                    _node.isExpanded = false;
                    _node.expandable = false;
                    if (_node.id === JSON.parse(localStorage.getItem('lastNodeDue'))) {
                     this.lastNodeSelected = _node;
                    }
                    nodeIds.push(_node.id);
                }
            }
        });

        const nodes = nodeIds.map((id) => this._nodes.get(id))
            .filter((node) => !!node);

        if (updateTree) {
            this._updateTree(nodes);
        }

        return nodes;
    }

    expandNode(nodeId: string): Promise<TreeUserNode> {
        const node = this._nodes.get(nodeId);
        if (node) {
            return this.getSubtree(node.data)
                .then((nodes) => {
                    this.updateNodes(nodes, true);
                    return node;
                });
        } else {
            return Promise.resolve(null);
        }
    }

    private _updateTree(nodes: TreeUserNode[]) {
        /* build tree */
        nodes.forEach((_node) => {
            if (_node.parentId) {
                const parent = this._nodes.get(_node.parentId);
                if (parent) {
                    parent.addChild(_node);
                }
            }
        });

        /* find root */
        // if (!this.root) {
        //     let rootNode: TreeUserNode;
        //     rootNode = nodes.find((node) => node.parentId === null || node.parentId === undefined);

        //     /* fallback if root undefined */
        //     if (!rootNode) {
        //         rootNode = new TreeUserNode({DUE: '0.', IS_NODE: 0});
        //         rootNode.children = [];
        //         this._nodes.set(rootNode.id, rootNode);
        //     }

        //     this.root = rootNode;
        // }

        /* force set title and visible for root */
        // this.root.title = this.descriptor.title;
        // this.root.data['DELETED'] = false;
        // this.root.isExpanded = true;
        nodes.forEach((node) => {
            if (!node.parent && node !== this.root) {
                this.root.addChild(node);
            }
        });

        // const treeOrderKey = this.root.getTreeView()[0];
        // this.nodes.forEach((node) => {
        //     if (treeOrderKey && node.children && node.children.length > 0) {
        //         node.children = this._orderByField(node.children, { fieldKey: treeOrderKey.foreignKey, ascend: true });
        //     }
        // });
        this._nodes.forEach((node) => node.updateExpandable(this._showDeleted));
    }
    private getSubtree(d: DEPARTMENT) {
        const layer = d.DUE.split('.').length - 1; // calc child layer with DUE
        let criteries;
        if (this.cardFlag === 1) {
             criteries = {
                DUE: d.DUE + '%',
                IS_NODE: '0',
                LAYER: (layer + 1) + '',
                CARD_FLAG: this.cardFlag.toString(),
                orderby: 'INS_DATE',
            };
        }   else {
             criteries = {
                DUE: d.DUE + '%',
                IS_NODE: '0',
                LAYER: (layer + 1) + '',
                orderby: 'INS_DATE',
            };
        }
        return this.apiSrv.read<DEPARTMENT>({DEPARTMENT: PipRX.criteries(criteries)});
    }
}
