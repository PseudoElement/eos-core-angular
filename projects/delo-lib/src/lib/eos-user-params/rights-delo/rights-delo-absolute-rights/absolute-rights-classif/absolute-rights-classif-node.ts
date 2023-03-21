import { ITechUserClassifConst, E_TECH_USER_CLASSIF_CONTENT, IConfigUserTechClassif } from './tech-user-classif.interface';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl, INodeDocsTreeCfg } from '../../../shared/intrfaces/user-parm.intterfaces';
import { E_CLASSIF_ID } from './tech-user-classif.consts';
import { NodeDocsTree } from '../../../shared/list-docs-tree/node-docs-tree';
import { AbsoluteRightsClassifComponent } from './absolute-rights-classif.component';
import { IChengeItemAbsolute } from '../right-delo.intefaces';
import { USER_TECH } from '../../../../eos-rest';

export class RightClassifNode {
    // isExpanded: boolean = false;
    listContent: NodeDocsTree[] = [];
    curentSelectedNode: NodeDocsTree;
    isLoading: boolean;
    isShell: Boolean = false;
    disableItem: boolean = true;
    get listUserTech() {
        return this._listUserTech;
    }
    set isExpanded(v: boolean) {
        this._isExpanded = v;
        if (v && this._listUserTech.length && !this.listContent.length) {
            this.createListContent(this._listUserTech, this.listContent);
        }
    }
    get isExpanded() {
        return this._isExpanded;
    }
    get expandable(): boolean {
        return (this.item.expandable !== E_TECH_USER_CLASSIF_CONTENT.none) && !!this._value;
    }
    get key(): number {
        return this.item.key;
    }
    get type(): E_TECH_USER_CLASSIF_CONTENT {
        return this.item.expandable;
    }
    get label(): string {
        return this.item.label;
    }
    get value(): number {
        return this._value;
    }
    set value(v) {
        this._valueLast = this._value;
        this._value = +v;
        const right = this.curentUser['TECH_RIGHTS'].split('');
        right[this.key - 1] = this._value.toString();
        const newTechRight = right.join('');
        this.curentUser['TECH_RIGHTS'] = newTechRight;
        const chenge: IChengeItemAbsolute = {
            method: 'MERGE',
            user_cl: true,
            data: {
                TECH_RIGHTS: newTechRight,
            }
        };
        this.parentNode.pushChange(chenge);
        setTimeout(() => {
            this._component.Changed.emit();
        }, 0);
        if (this.key === 1) {
            this.item.label = 'Пользователи';
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            if (!this._valueLast && v && this.type !== E_TECH_USER_CLASSIF_CONTENT.limitation) { // создать корневой елемент
                const newNode: USER_TECH = this._component.createEntyti<USER_TECH>({
                    ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                    FUNC_NUM: this.key,
                    CLASSIF_ID: E_CLASSIF_ID[(this.key.toString())],
                    DUE: '0.',
                    ALLOWED: 1,
                }, 'USER_TECH');
                this._listUserTech.push(newNode);
                this._component.userTechList.push(newNode);
                this.parentNode.pushChange({
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
        // const pos_in =  this._curentUser['TECH_RIGHTS'].indexOf('1');
        // const math_in = this._curentUser['TECH_RIGHTS'].match(/1/g);
        // if (pos_in === -1 || pos_in >= 37 || math_in.length === 4) {
        //     this._component.allNotCheck.emit(true);
        // }
    }
    public curentUser: IParamUserCl;
    public item: ITechUserClassifConst;
    public parentNode: NodeAbsoluteRight;
    private _value: number;
    private _component: AbsoluteRightsClassifComponent;
    private _valueLast: number;
    private _isExpanded: boolean;
    private _listUserTech: any[] = [];
    private _config: IConfigUserTechClassif;
    constructor(item: ITechUserClassifConst, user: IParamUserCl, pNode: NodeAbsoluteRight, component: AbsoluteRightsClassifComponent) {
        this.item = item;
        this.curentUser = user;
        this.parentNode = pNode;
        this._component = component;
        const v = +(this.curentUser['TECH_RIGHTS'][item.key - 1]);
        if ((this.type !== E_TECH_USER_CLASSIF_CONTENT.none) && !this.parentNode.isCreate || this._component.userTechList.filter((i) => i['FUNC_NUM'] === this.key).length !== 0) {
            this._listUserTech = this._component.userTechList.filter((i) => i['FUNC_NUM'] === this.key);
        }
        if (this.type !== E_TECH_USER_CLASSIF_CONTENT.none) {
            this._config = this._component.getConfig(this.type);
        }
        const initialOwerride = component._extentionsRigts.initialValues().filter(e => e.key === item.key);
        const disableFields  = component._extentionsRigts.disableRigths().filter(e => e.key === item.key);
        if (this.parentNode.isCreate) {
            this._value = 0;
            this.value = v;
            // переопределение поведения и дефолтных значений
            if (initialOwerride.length) {
                this.value = initialOwerride[0].setValue(this);
            }
            if (disableFields.length) {
                this.disableItem = disableFields[0].checkStatus(component);
            }
            return;
        }
        this._value = v;
        this._valueLast = v;
        const techListLim = this._component.userTechList.filter((tech) => tech.FUNC_NUM === 1);
        if (this.key === 1 && techListLim.length === 0) {
            this.item.label = 'Пользователи';
        }
        if (this.key === 1 && techListLim.length > 0) {
            this.item.label = 'Пользователи (доступ ограничен)';
        }
        // переопределение поведения и дефолтных значений
        if (initialOwerride.length) {
            this._value = initialOwerride[0].setValue(this);
        }

        if (disableFields.length) {
            this.disableItem = disableFields[0].checkStatus(component);
        }
    }
    addInstance() {
        this.isShell = true;
        this._component.addInstance(this._config, this)
            .then(data => {
                if (this._config.rootLabel === 'Центральная картотека') {
                    this.item.label = 'Пользователи (доступ ограничен)';
                }
                const newList: NodeDocsTree[] = [];
                if (data) {
                    data.forEach(entity => {
                        const newTechRight: USER_TECH = this._component.createEntyti<USER_TECH>({
                            ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
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

                        this.parentNode.pushChange({
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
                this._component.DeleteChildCards(this.curentSelectedNode.DUE).then((data: any) => {
                    const newData = data.map((item) => {
                        const cardTech = this._component.createEntyti<USER_TECH>({
                            ISN_LCLASSIF: this.curentUser.ISN_LCLASSIF,
                            FUNC_NUM: this.key,
                            CLASSIF_ID: E_CLASSIF_ID[(this.key.toString())],
                            DUE: item.DUE,
                            ALLOWED: this.getAllowedParent(item.DUE) ? 0 : 1,
                        }, 'USER_TECH');
                        return Object.assign(item, {cardTech: cardTech});
                    });
                    this._component._userParmSrv.confirmCallCard(this._component.newCards).then((answer) => {
                        if (answer === true) {
                            const childDue = newData.map(item => {
                                this.parentNode.pushChange({
                                    method: 'DELETE',
                                    due: item.DUE,
                                    funcNum: 1,
                                    data: item.cardTech
                                });
                                return item.DUE;
                            });
                            this.listContent = this.listContent.filter(node => childDue.indexOf(node.DUE) === -1);
                            this._listUserTech = this._listUserTech.filter(node => childDue.indexOf(node['DUE']) === -1);
                            this._component.userTechList = this._component.userTechList.filter(node => childDue.indexOf(node['DUE']) === -1);
                        } else {
                            this.listContent = this.listContent.filter(node => node !== this.curentSelectedNode);
                            this.parentNode.pushChange({
                                method: 'DELETE',
                                due: this.curentSelectedNode.DUE,
                                funcNum: this.key,
                                data: this.curentSelectedNode.data['userTech']
                            });
                            const index = this._listUserTech.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                            this._listUserTech.splice(index, 1);
                            const index2 = this._component.userTechList.findIndex(node => this.curentSelectedNode.DUE === node['DUE']);
                            this._component.userTechList.splice(index2, 1);
                        }
                        if (this.listContent.length === 0) {
                            this.item.label = 'Пользователи';
                        }
                        this.curentSelectedNode = null;
                        this._component.Changed.emit();
                    });
                });
            } else {
                this.listContent = this.listContent.filter(node => node !== this.curentSelectedNode);
                this.parentNode.pushChange({
                    method: 'DELETE',
                    due: this.curentSelectedNode.DUE,
                    funcNum: this.key,
                    data: this.curentSelectedNode.data['userTech']
                });
                if (this.listContent.length === 0) {
                    this.item.label = 'Пользователи';
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
    copyInstance(listUserTech, listContent) {
        this.isShell = true;
        this._deletAll();
        listUserTech.forEach((newTechRight) => {
            this.parentNode.pushChange({
                method: 'POST',
                due: newTechRight.DUE,
                funcNum: this.key,
                data: newTechRight,
            });
            this._listUserTech.push(newTechRight);
            this._component.userTechList.push(newTechRight);
        });
        const newList = [];
        listContent.forEach((cfg) => {
            newList.push(new NodeDocsTree(cfg, this.type === 1 ? undefined : true));
        });
        this.listContent = this.listContent.concat(newList);
        this._component.Changed.emit();
        this.isShell = false;
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
        this.parentNode.pushChange({
            method: 'MERGE',
            due: node.DUE,
            funcNum: this.key,
            data: node.data['userTech']
        });
        this._component.Changed.emit();
    }
    public createListContent(userTech: any[], listContent: NodeDocsTree[]): Promise<any> {
        this.isLoading = true;
        const arr = [];
        userTech.forEach(i => {
            arr.push(i['DUE']);
        });
        return this._component.getEntyti(arr.join('||'), this._config)
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
                this.parentNode.pushChange({
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
