import { E_CARD_TYPE } from '../card-func-list.consts';
import { CardRightSrv } from '../card-right.service';
import { USERCARD, USER_CARD_DOCGROUP } from '../../../../eos-rest';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { _ES } from '../../../../eos-rest/core/consts';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
// import { FuncNum } from '../funcnum.model';

export class CardRight {
    public expandable: boolean = true;
    public isExpanded: boolean = false;
    public isLoading: boolean = false;
    public confirmAns = false;
    public isLimit: boolean;
    public type: E_CARD_TYPE;
    public listNodes: NodeDocsTree[];
    public curentSelectedNode: NodeDocsTree;
    public limitcard: boolean;
    private _value: number;
    private _funcIndex: number;
    private _funcNum: number;
    get copyFuncNum(): number {
        return this._srv.copyFuncNum;
    }
    get copyDueCard(): string {
        return this._srv.copyDueCard;
    }
    get cardDUE(): string {
        return this._card ? this._card.DUE : undefined;
    }
    get name (): string {
        return this._srv.departments.get(this._card.DUE).CARD_NAME;
    }
    get value(): boolean { // 0 1 2
        return !!this._value;
    }
    set value (v: boolean) {
        this.setElemAll(v);
        this._srv.setUpdateFlag();
    }
    set valueAll(v: boolean) {
        this.setElemAll(v, true);
    }
    get limit(): boolean { // 0 1 2
        return this._value === 2;
    }
    get funcNum(): number {
        return this._funcNum;
    }
    get card(): USERCARD {
        return this._card;
    }
    set limit (v: boolean) {
        this._value = v ? 2 : 1;
        this._setValueEntity();
    }
    get allowed() {
        if (this._appCtx && this._appCtx.limitCardsUser.length) {
            return this._appCtx.limitCardsUser.some(_due => {
                return _due === this._card.DUE;
            });
        }
        return true;
    }
    constructor(
        private _appCtx: AppContext,
        private _srv: CardRightSrv,
        private _card: USERCARD,
    ) {
        this._funcNum = this._srv.selectedFuncNum.funcNum;
        this._funcIndex = this._funcNum - 1;
        this.expandable = this._srv.selectedFuncNum.type !== E_CARD_TYPE.none;
        this.isLimit = this._srv.selectedFuncNum.type === E_CARD_TYPE.docGroup;
        this._value = +this._card.FUNCLIST[this._funcIndex];
        this.limitcard = this._srv.limitCardAccess(this._card.DUE);
    }
    copyButton(node): boolean {
        return node.copyFuncNum === node.funcNum && node.copyDueCard === this.cardDUE;
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
    setElemAll(v: boolean, flag?: boolean) {
        this._value = +v;
        if (!this.expandable) {
            this._setValueEntity(flag);
            return;
        }
        if (v) {
            this._setValueEntity(flag);
            this._srv.createRootEntity(this._card);
            return;
        }
        this._setValueEntity(flag);
        this._srv.deleteAllDoc(this._card);
        this.isExpanded = false;
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
    copyInstance() {
        this._srv.copyNodeList(this.listNodes, this.funcNum, this.card.DUE);
    }
    pasteInstance() {
        this.listNodes = this._srv.pasteNodeList(this._card, this.listNodes);
    }
    updateEditFileAll(num: number, func_list: string[]) {
        if (num === 13 && func_list[13] === '0') {
            func_list[14] = '0';
            func_list[15] = '0';
        }
        if ((num === 14 || num === 15) && func_list[13] === '0') {
            func_list[13] = '1';
        }
    }
    updateEditFile(num: number, func_list: string[]) {
        const inListMes = [];
        let mes = '';
        let end = '';
        if (func_list[14] === '1') {
            inListMes.push('\"Редактировать файлы\"');
        }
        if (func_list[15] === '1') {
            inListMes.push('\"Удалять файлы\"');
        }
        if (inListMes.length === 1 ) {
            mes = 'назначено право на выполнение операции';
            end = 'это право?';
        } else {
            mes = 'назначены права на выполнение операций';
            end = 'эти права?';
        }
        if (num === 13) {
            const message = 'У пользователя ' + mes + ':\n' + inListMes.join('\n') + '\nв данной картотеке. Снять ' + end;
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
    /**
     * 
     * @deprecated Проверка на операции больше не производится согласно BUG 176364
     */
    updateFileRk(func_list: string[]) {
        const inListMes = [];
        let mes = '';
        let add = func_list[2] === '0' ? '1' : '0';
        if (func_list[12] === add) {
            inListMes.push('\"Добавлять файлы\"');
        }
        if (func_list[13] === add) {
            inListMes.push('\"Читать файлы\"');
        }
        if (func_list[14] === add) {
            inListMes.push('\"Редактировать файлы\"');
        }
        if (func_list[15] === add) {
            inListMes.push('\"Удалять файлы\"');
        }
        if (inListMes.length === 1 ) {
            mes = 'право на выполнение операции';
        } else {
            mes = 'права на выполнение операций';
        }
        if (func_list[2] === '1') {

            const message = 'Назначить пользователю ' + mes + ':\n' + inListMes.join('\n') + '\n в данной картотеке?';
            if (inListMes.length > 0) {
                const flag = confirm(message);
                if (flag) {
                    func_list[12] = '1';
                    func_list[13] = '1';
                    func_list[14] = '1';
                    func_list[15] = '1';
                }
            }
        } else if (inListMes.length > 0 ) {
            mes = inListMes.length === 1 ? 'назначено ' + mes : 'назначены ' + mes;
            const end = inListMes.length === 1 ? 'это право?' : 'эти права?';
            const message = 'У пользователя ' + mes + ':\n' + inListMes.join('\n') + '\n в данной картотеке. Снять ' + end;
            const flag = confirm(message);
            if (flag) {
                func_list[12] = '0';
                func_list[13] = '0';
                func_list[14] = '0';
                func_list[15] = '0';
            }
        }
    }
    private _setValueEntity(flag?) {
        const value = this._card.FUNCLIST.split('');
        value[this._funcIndex] = this._value.toString();
        if (this._funcIndex > 12 && this._funcIndex < 16) {
            if (flag !== undefined) {
                if (flag) {
                    this.updateEditFileAll(this._funcIndex, value);
                }
            } else {
                this.updateEditFile(this._funcIndex, value);
            }
        }
        if (this._funcIndex === 2) {
            if (flag !== undefined) {
                if (flag) {
                    value[12] = value[this._funcIndex];
                    value[13] = value[this._funcIndex];
                    value[14] = value[this._funcIndex];
                    value[15] = value[this._funcIndex];
                }
            } 
        }
        this._card.FUNCLIST = value.join('');
        this._srv.checkChenge();
    }
}
