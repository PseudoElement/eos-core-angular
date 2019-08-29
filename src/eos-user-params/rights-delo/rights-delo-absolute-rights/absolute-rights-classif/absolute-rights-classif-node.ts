import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from './tech-user-classif.interface';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl, INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { E_CLASSIF_ID } from './tech-user-classif.consts';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { AbsoluteRightsClassifComponent } from './absolute-rights-classif.component';
import { IChengeItemAbsolute } from '../right-delo.intefaces';
import { USER_TECH } from 'eos-rest';

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
    get expandable(): boolean {
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
    get value(): number {
        return this._value;
    }
    set value(v) {
        this._valueLast = this._value;
        this._value = +v;
        const right = this._curentUser['TECH_RIGHTS'].split('');
        right[this.key - 1] = this._value.toString();
        const newTechRight = right.join('');
        this._curentUser['TECH_RIGHTS'] = newTechRight;
        const chenge: IChengeItemAbsolute = {
            method: 'MERGE',
            user_cl: true,
            data: {
                TECH_RIGHTS: newTechRight,
            }
        };
        this._parentNode.pushChange(chenge);
        setTimeout(() => {
            this._component.Changed.emit();
        }, 0);
        if (this.key === 1) {
            this._item.label = 'Пользователи';
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            if (!this._valueLast && v && this.type !== E_TECH_USER_CLASSIF_CONTENT.limitation) { // создать корневой елемент
                const newNode: USER_TECH = this._component.createEntyti<USER_TECH>({
                    ISN_LCLASSIF: this._curentUser.ISN_LCLASSIF,
                    FUNC_NUM: this.key,
                    CLASSIF_ID: E_CLASSIF_ID[(this.key.toString())],
                    DUE: '0.',
                    ALLOWED: 1,
                }, 'USER_TECH');
                this._listUserTech.push(newNode);
                this._component.userTechList.push(newNode);
                this._parentNode.pushChange({
                    method: 'POST',
                    due: newNode.DUE,
                    funcNum: this.key,
                    data: newNode
                });
            }
            if (this._valueLast && !v) { // удалить все элементы
                this._isExpanded = false;
                if (this._listUserTech.length) {
                    this._deletAll();
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
        if ((this.type !== E_TECH_USER_CLASSIF_CONTENT.none) && !this._parentNode.isCreate || this._component.userTechList.filter((i) => i['FUNC_NUM'] === this.key).length !== 0) {
            this._listUserTech = this._component.userTechList.filter((i) => i['FUNC_NUM'] === this.key);
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            this._config = this._component.getConfig(this.type);
        }
        if (this._parentNode.isCreate) {
            this._value = 0;
            this.value = v;
            return;
        }
        this._value = v;
        this._valueLast = v;
        const techListLim = this._component.userTechList.filter((tech) => tech.FUNC_NUM === 1);
        if (this.key === 1 && techListLim.length === 0) {
            this._item.label = 'Пользователи';
        }
        if (this.key === 1 && techListLim.length > 0) {
            this._item.label = 'Пользователи (доступ ограничен)';
        }
    }
    addInstance() {
        this.isShell = true;
        this._component.addInstance(this._config, this)
            .then(data => {
                if (this._config.rootLabel === 'Центральная картотека') {
                    this._item.label = 'Пользователи (доступ ограничен)';
                }
                const newList: NodeDocsTree[] = [];
                if (data) {
                    data.forEach(entity => {
                        const newTechRight: USER_TECH = this._component.createEntyti<USER_TECH>({
                            ISN_LCLASSIF: this._curentUser.ISN_LCLASSIF,
                            FUNC_NUM: this.key,
                            CLASSIF_ID: E_CLASSIF_ID[(this.key.toString())],
                            DUE: entity['DUE'],
                            ALLOWED: this.getAllowedParent(entity['DUE']) ? 0 : 1,
                        }, 'USER_TECH');
                        const d = {
                            userTech: newTechRight,
                            instance: entity
                        };
                        const cfg: INodeDocsTreeCfg = {
                            due: entity['DUE'],
                            label: entity[this._config.label],
                            allowed: !!newTechRight['ALLOWED'],
                            data: d,
                        };
                        newList.push(new NodeDocsTree(cfg, this.type === 1 ? undefined : true));

                        this._parentNode.pushChange({
                            method: 'POST',
                            due: entity.DUE,
                            funcNum: this.key,
                            data: newTechRight,
                        });
                        this._listUserTech.push(newTechRight);
                        this._component.userTechList.push(newTechRight);
                    });
            }
            this.listContent = this.listContent.concat(newList);
            this._component.Changed.emit();
            this.isShell = false;
            })
            .catch((error) => {
                this.isShell = false;
            });
    }
    getAllowedParent(due: string) {
        if (this.listContent.length) {
            return this.excludeNode(this.type, due);
        }
        return false;
    }
    excludeNode(nameNode: number, due: string) {
        const exist = [2, 3, 4].some(value => {
            return value === nameNode;
        });
        if (exist) {
            return this.findParent(due);
        } else {
            return false;
        }
    }

    findParent(due: string) {
        const n = due.split('.');
        n.pop();
        const d = due + '.';
        if (d !== '0.') {
            const findElement = this.listContent.filter((element: NodeDocsTree) => {
                return element.DUE === d;
            });
            if (findElement[0]) {
                return findElement[0].isAllowed ? true : false;
            } else {
                return this.findParent(n.join('.'));
            }
        } else {
            return this.listContent[0].isAllowed ? true : false;
        }
    }
    DeleteInstance() {
        if (this.curentSelectedNode) {
            if (this.curentSelectedNode.children.length !== 0 && this.curentSelectedNode.DUE !== '0.' && this._config.rootLabel === 'Центральная картотека') {
                this._component.strNewCards = [];
                this._component.strNewCards = [{value: 'Исключить из перечня подчиненные картотеки:'}];
                this.curentSelectedNode.children.forEach((card) => {
                    this._component.strNewCards.push({value: String(card.label), due: card.DUE});
                });
                this._component._userParmSrv.confirmCallCard(this._component.newCards).then((answer) => {
                    if (answer) {
                        const childDue = this.curentSelectedNode.children.map(item => {
                            this._parentNode.pushChange({
                                method: 'DELETE',
                                due: item.DUE,
                                funcNum: 1,
                                data: item.data['userTech']
                            });
                            return item.DUE;
                        });
                        this.listContent = this.listContent.filter(node => node !== this.curentSelectedNode && childDue.indexOf(node.DUE) === -1);
                        this._listUserTech = this._listUserTech.filter(node => childDue.indexOf(node['DUE']) === -1);
                        this._component.userTechList = this._component.userTechList.filter(node => childDue.indexOf(node['DUE']) === -1);
                    } else {
                        this.listContent = this.listContent.filter(node => node !== this.curentSelectedNode);
                    }
                    this._parentNode.pushChange({
                        method: 'DELETE',
                        due: this.curentSelectedNode.DUE,
                        funcNum: this.key,
                        data: this.curentSelectedNode.data['userTech']
                    });
                    if (this.listContent.length === 0) {
                        this._item.label =  'Пользователи';
                    }
                    const index = this._listUserTech.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                    this._listUserTech.splice(index, 1);
                    const index2 = this._component.userTechList.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                    this._component.userTechList.splice(index2, 1);
                    this.curentSelectedNode = null;
                    this._component.Changed.emit();
                });
            } else {
                this.listContent = this.listContent.filter(node => node !== this.curentSelectedNode);
                this._parentNode.pushChange({
                    method: 'DELETE',
                    due: this.curentSelectedNode.DUE,
                    funcNum: this.key,
                    data: this.curentSelectedNode.data['userTech']
                });
                if (this.listContent.length === 0) {
                    this._item.label =  'Пользователи';
                }
                const index = this._listUserTech.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                this._listUserTech.splice(index, 1);
                const index2 = this._component.userTechList.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                this._component.userTechList.splice(index2, 1);
                this.curentSelectedNode = null;
                this._component.Changed.emit();
            }
        }
    }
    select(node: NodeDocsTree) {
        if (node.DUE === '0.' && this.type !== E_TECH_USER_CLASSIF_CONTENT.limitation) {
            this.curentSelectedNode = null;
        } else {
            this.curentSelectedNode = node;
        }
    }
    checkedNode(node: NodeDocsTree) {
        node.data['userTech']['ALLOWED'] = +node.isAllowed;
        this._parentNode.pushChange({
            method: 'MERGE',
            due: node.DUE,
            funcNum: this.key,
            data: node.data['userTech']
        });
        this._component.Changed.emit();
    }
    private _createListContent(userTech: any[], listContent: NodeDocsTree[]) {
        this.isLoading = true;
        const arr = [];
        userTech.forEach(i => {
            arr.push(i['DUE']);
        });
        this._component.getEntyti(arr.join('||'), this._config)
            .then(data => {
                data.forEach(item => {
                    const uT = userTech.find(i => i['DUE'] === item['DUE']);
                    const d = {
                        userTech: uT,
                        instance: item
                    };
                    const cfg: INodeDocsTreeCfg = {
                        due: uT['DUE'],
                        label: uT['DUE'] === '0.' ? this._config.rootLabel : item[this._config.label],
                        allowed: uT['ALLOWED'],
                        data: d,
                    };
                    listContent.push(new NodeDocsTree(cfg, this.type === 1 ? undefined : true));
                });
                this.isLoading = false;
            });
    }
    private _deletAll() {
        let count = this._component.userTechList.length;
        for (let i = 0; i < count; i++) {
            const node = this._component.userTechList[i];
            if (node['FUNC_NUM'] === this.key) {
                this._parentNode.pushChange({
                    method: 'DELETE',
                    due: node.DUE,
                    funcNum: this.key,
                    data: node,
                });
                this._component.userTechList.splice(i, 1);
                i--;
                count = this._component.userTechList.length;
            }
        }
        this.listContent = [];
        this._listUserTech = [];
    }
}
