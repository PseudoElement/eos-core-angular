import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { USER_TECH } from 'eos-rest';
import { E_CLASSIF_ID } from 'eos-user-params/rights-delo/shared-rights-delo/consts/tech-user-classif.consts';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { AbsoluteRightsClassifComponent } from './absolute-rights-classif.component';

export class RightClassifNode {
    // isExpanded: boolean = false;
    listContent: NodeDocsTree[] = [];
    curentSelectedNode: NodeDocsTree;
    isLoading: boolean;
    isShell: Boolean = false;
    set isExpanded(v: boolean) {
        this._isExpanded = v;
        if (v && this._listUserTech.length && !this.listContent.length) {
            this._createListContent(this._listUserTech, this.listContent);
        }
    }
    get isExpanded() {
       return this._isExpanded;
    }
    get expandable (): boolean {
        return (this._item.expandable !== E_TECH_USER_CLASSIF_CONTENT.none) && !!this._value;
    }
    get key(): number {
        return this._item.key;
    }
    get type(): E_TECH_USER_CLASSIF_CONTENT {
        return this._item.expandable;
    }
    get label(): string {
        return this._item.label;
    }
    get value (): number {
        return this._value;
    }
    set value (v) {
        this._valueLast = this._value;
        this._value = +v;
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            if (!this._valueLast && v && this.type !== E_TECH_USER_CLASSIF_CONTENT.limitation) { // создать корневой елемент
                const newNode = {
                    ISN_LCLASSIF: this._curentUser.ISN_LCLASSIF,
                    FUNC_NUM: this.key,
                    CLASSIF_ID: E_CLASSIF_ID[this.key],
                    DUE: '0.',
                    ALLOWED: 1,
                };
                this._listUserTech.push(newNode);
                this._parentNode.pushChange({
                    method: 'POST',
                    due: newNode.DUE,
                    funcNum: this.key,
                    data: newNode
                });
            }
            if (this._valueLast && !v) { // удалить все элементы
                if (this._listUserTech.length) {
                    console.log('удалить все элементы', E_TECH_USER_CLASSIF_CONTENT[this.type]);
                }
            }
        }
    }
    private _value: number;
    private _item: ITechUserClassifConst;
    private _component: AbsoluteRightsClassifComponent;
    private _valueLast: number;
    private _parentNode: NodeAbsoluteRight;
    private _curentUser: IParamUserCl;
    private _isExpanded: boolean;
    private _listUserTech: any[] = [];
    private _config: IConfigUserTechClassif;
    constructor(item: ITechUserClassifConst, user: IParamUserCl, pNode: NodeAbsoluteRight, component: AbsoluteRightsClassifComponent) {
        this._item = item;
        this._curentUser = user;
        this._parentNode = pNode;
        this._component = component;
        const v = +(this._curentUser['TECH_RIGHTS'][item.key - 1]);
        if ((this.type !== E_TECH_USER_CLASSIF_CONTENT.none) && this._curentUser['USER_TECH_List'].length) {
           this._listUserTech = this._curentUser['USER_TECH_List'].filter((i: USER_TECH) => i['FUNC_NUM'] === this.key);
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            this._config = this._component.getConfig(this.type);
        }
        if (this._parentNode.isCreate ) {
            this._value = 0;
            this.value = v;
            return;
        }
        this._value = v;
        this._valueLast = v;
    }
    addInstance() {
        const oldPage: boolean = this.type === E_TECH_USER_CLASSIF_CONTENT.limitation;
        this._component.addInstance(this._config, this, oldPage);
    }
    DeleteInstance() {
        // if (this.curentSelectedNode.DUE !== '0.') {
            console.log('DeleteInstance()', this.curentSelectedNode);
        // }
    }
    select(node: NodeDocsTree) {
        console.log('select()', node);
        if (node.DUE !== '0.') {
            this.curentSelectedNode = node;
        } else {
            this.curentSelectedNode = null;
        }
    }
    checkedNode(n: NodeDocsTree) {
        console.log('checkedNode()', n);
    }
    private _createListContent (userTech: any[], listContent: NodeDocsTree[]) {
        this.isLoading = true;
        const arr = [];
        userTech.forEach(i => {
            arr.push(i['DUE']);
        });
        this._component.getEntyti(arr.join('||'), this._config)
        .then(data => {
            data.forEach(item => {
                const uT = userTech.find(i => i['DUE'] = item['DUE']);
                const d = {
                    userTech: uT,
                    instance: item
                };
                listContent.push(new NodeDocsTree(uT['DUE'], item['CLASSIF_NAME'], uT['ALLOWED'], d));
            });
            this.isLoading = false;
        });
    }
}
