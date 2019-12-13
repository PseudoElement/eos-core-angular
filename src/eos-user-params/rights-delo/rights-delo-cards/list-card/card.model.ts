import { E_CARD_TYPE } from '../card-func-list.consts';
import { CardRightSrv } from '../card-right.service';
import { USERCARD, USER_CARD_DOCGROUP } from 'eos-rest';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { _ES } from 'eos-rest/core/consts';
// import { FuncNum } from '../funcnum.model';

export class CardRight {
    public expandable: boolean = true;
    public isExpanded: boolean = false;
    public isLoading: boolean = false;
    public isLimit: boolean;
    public type: E_CARD_TYPE;
    public listNodes: NodeDocsTree[];
    public curentSelectedNode: NodeDocsTree;
    private _value: number;
    private _funcIndex: number;
    private _funcNum: number;
    get name (): string {
        return this._srv.departments.get(this._card.DUE).CARD_NAME;
    }
    get value(): boolean { // 0 1 2
        return !!this._value;
    }
    set value (v: boolean) {
        this._value = +v;
        if (!this.expandable) {
            this._setValueEntity();
            return;
        }
        if (v) {
            this._setValueEntity();
            this._srv.createRootEntity(this._card);
            return;
        }
        this._setValueEntity();
        this._srv.deleteAllDoc(this._card);
        this.isExpanded = false;
    }
    get limit(): boolean { // 0 1 2
        return this._value === 2;
    }
    set limit (v: boolean) {
        console.log('set limit (v: boolean)', v);
        this._value = v ? 2 : 1;
        this._setValueEntity();
    }
    constructor(
        private _srv: CardRightSrv,
        private _card: USERCARD,
    ) {
        this._funcNum = this._srv.selectedFuncNum.funcNum;
        this._funcIndex = this._funcNum - 1;
        this.expandable = this._srv.selectedFuncNum.type !== E_CARD_TYPE.none;
        this.isLimit = this._srv.selectedFuncNum.type === E_CARD_TYPE.docGroup;
        this._value = +this._card.FUNCLIST[this._funcIndex];
    }
    expanded() {
        this.isExpanded = !this.isExpanded;
        if (!this.isExpanded) {
            return;
        }
        const list = this._card.USER_CARD_DOCGROUP_List.filter((doc: USER_CARD_DOCGROUP) => doc.FUNC_NUM === this._funcNum && doc._State !== _ES.Deleted);
        this.isLoading = true;
        this._srv.getlistTreeNode$(list)
        .then((nodes: NodeDocsTree[]) => {
            this.listNodes = nodes;
            this.isLoading = false;
        });
    }
    select(node: NodeDocsTree) {
        if (node.DUE === '0.') {
            this.curentSelectedNode = null;
            return;
        }
        this.curentSelectedNode = node;
    }
    checkedNode(node: NodeDocsTree) {
        this._srv.checkedNode(node);

    }
    addInstance() {
        this._srv.addingDocGroup$(this._card) // TODO spiner for adding
        .then((nodes: NodeDocsTree[]) => {
            if (nodes) {
                this.listNodes = this.listNodes.concat(nodes);
            }
        })
        .catch(() => {
            // снять шторку
        });
    }
    deleteInstance() {
        this._srv.deleteNode(this.curentSelectedNode, this._card);
        this.listNodes = this.listNodes.filter((node: NodeDocsTree) => node !== this.curentSelectedNode);
        this.curentSelectedNode = null;
    }
    updateEditFile(num: number, func_list: string[]) {
        const inListMes = [];
        let mes = '';
        if (func_list[14] === '1') {
            inListMes.push('\"Редактировать файлы\"');
        }
        if (func_list[15] === '1') {
            inListMes.push('\"Удалять файлы\"');
        }
        if (inListMes.length === 1 ) {
            mes = 'назначено право на выполнение операции';
        } else {
            mes = 'назначены права на выполнение операций';
        }
        if (num === 13) {
            const message = 'У пользователя ' + mes + ':' + inListMes.join(', ') + 'в данной картотеке. Снять эти права?';
            if (func_list[13] === '0' && inListMes.length > 0) {
                const flag = confirm(message);
                if (flag) {
                    func_list[14] = '0';
                    func_list[15] = '0';
                }
            }
        }
        if ((num === 14 || num === 15) && func_list[13] === '0') {
            if (func_list[num] === '1') {
                const message = 'Назначить пользователю права на выполнение операции \"Читать файлы\"?';
                const flag = confirm(message);
                if (flag) {
                    func_list[13] = '1';
                }
            }
        }
    }
    private _setValueEntity() {
        const value = this._card.FUNCLIST.split('');
        value[this._funcIndex] = this._value.toString();
        if (this._funcIndex > 12 && this._funcIndex < 16) {
            this.updateEditFile(this._funcIndex, value);
        }
        this._card.FUNCLIST = value.join('');
        this._srv.checkChenge();
    }
}
