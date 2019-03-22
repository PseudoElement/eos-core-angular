import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USERCARD, DEPARTMENT, USER_CARD_DOCGROUP, DOCGROUP_CL, PipRX } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { FuncNum } from './funcnum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { _ES } from 'eos-rest/core/consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DOCGROUP_CL } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EMPTY_ADD_ELEMENT_WARN } from 'app/consts/messages.consts';

@Injectable()
export class CardRightSrv {
    public selectedFuncNum: FuncNum;
    public departments = new Map<string, DEPARTMENT>(); // Map<DUE, DEPARTMENT>
    private _docGroup = new Map<string, DOCGROUP_CL>(); // Map<DUE, DOCGROUP_CL>
    private _orginCard = new Map<string, USERCARD>(); // Map<DUE, USERCARD>

    get selectingNode$(): Observable<void> {
        return this._selectingNode$.asObservable();
    }
    get chengeState$(): Observable<boolean> {
        return this._chengeState$.asObservable();
    }
    private _selectingNode$: Subject<void>;
    private _chengeState$: Subject<boolean>;
    constructor (
        private _userParamsSetSrv: UserParamsService,
        private _apiSrv: UserParamApiSrv,
        private _pipSrv: PipRX,
        private _waitClassifSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
    ) {
        this._selectingNode$ = new Subject<void>();
        this._chengeState$ = new Subject<boolean>();
        this._findOriginCard();
    }
    getCardList(): Promise<USERCARD[]> {
        const userCardList: USERCARD[] = this._userParamsSetSrv.curentUser.USERCARD_List;
        const str: string[] = userCardList.map((card: USERCARD) => card.DUE);
        return this._apiSrv.getDepartment(str)
        .then((deps) => {
            deps.forEach((dep: DEPARTMENT) => {
                this.departments.set(dep.DUE, dep);
            });
            return userCardList;
        });
    }
    selectFuncnum() {
        this._selectingNode$.next();
    }
    getlistTreeNode$(docs: USER_CARD_DOCGROUP[]): Promise<NodeDocsTree[]> {
        const listDG: string[] = [];
        docs.forEach((doc: USER_CARD_DOCGROUP) => {
            listDG.push(doc.DUE);
        });
        return this._getDocGroupEntity$(listDG)
        .then(() => {
            const nodeList: NodeDocsTree[] = [];
            docs.forEach((userCardDG: USER_CARD_DOCGROUP) => {
                const docGroup = this._docGroup.get(userCardDG.DUE);
                this._createListNode(nodeList, {docGroup, userCardDG});
            });
            return nodeList;
        });
    }
    checkedNode(node: NodeDocsTree) {
        const userCardDG: USER_CARD_DOCGROUP = node.data.userCardDG;
        userCardDG.ALLOWED = +node.isAllowed;
        if (userCardDG._State && userCardDG._State === _ES.Modified) {
            delete userCardDG._State;
            this._checkChenge();
            return;
        }
        if (userCardDG._State && userCardDG._State === _ES.Added) {
            return;
        }
        userCardDG._State = _ES.Modified;
        this._checkChenge();
    }
    createRootEntity(card: USERCARD) {
        let exist: boolean = false;
        card.USER_CARD_DOCGROUP_List.forEach((dg: USER_CARD_DOCGROUP) => {
            if (dg.FUNC_NUM === this.selectedFuncNum.funcNum && dg.DUE === '0.') {
                delete dg._State;
                exist = true;
                return;
            }
        });
        if (!exist) {
            card.USER_CARD_DOCGROUP_List.splice(-1, 0, ...this._createDGEntity(card, ['0.']));
        }
    }
    deleteAllDoc(card: USERCARD) {
        for (let i = 0; card.USER_CARD_DOCGROUP_List.length > i; i++) {
            const dg: USER_CARD_DOCGROUP = card.USER_CARD_DOCGROUP_List[i];
            if (dg.FUNC_NUM !== this.selectedFuncNum.funcNum) {
                continue;
            }
            if (dg._State === _ES.Added) {
                card.USER_CARD_DOCGROUP_List.splice(i, 1);
                i--;
            } else {
                dg._State = _ES.Deleted;
            }
        }
        // this._checkChenge();
    }
    deleteNode(node: NodeDocsTree, card: USERCARD) {
        const userCardDG: USER_CARD_DOCGROUP = node.data.userCardDG;
        if (userCardDG._State === _ES.Added) {
            const i = card.USER_CARD_DOCGROUP_List.findIndex((c) => c === userCardDG);
            card.USER_CARD_DOCGROUP_List.splice(i, 1);
        } else {
            userCardDG._State = _ES.Deleted;
        }
        this._checkChenge();
    }
    addingDocGroup$ (card: USERCARD): Promise<NodeDocsTree[]> {
        let dues: string[];
        let msg: string = '';
        return this._waitClassifSrv.openClassif(OPEN_CLASSIF_DOCGROUP_CL)
        .then((str: string) => { // 0.1K9B.|0.1K9D.
            if (!str) {
                throw null;
            }
            dues = str.split('|');

            // получить инстансы по дуе в мап
            return this._getDocGroupEntity$(dues);
        })
        .then(() => {
            // const userDocGroup: USER_CARD_DOCGROUP[] = [];
            // Проверяем, существуют ли они в списке
            card.USER_CARD_DOCGROUP_List.forEach((doc: USER_CARD_DOCGROUP) => {
                const index = dues.findIndex((due: string) => doc.DUE === due && doc.FUNC_NUM === this.selectedFuncNum.funcNum);
                if (index !== -1) {
                    msg += `'${this._docGroup.get(doc.DUE).CLASSIF_NAME}',\n`;
                    dues.splice(index, 1);
                }
            });
            if (msg.length) {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: '',
                    msg: `Элемент ${msg} не будет добавлен\nтак как он уже существует`
                });
            }
            if (!dues.length) {
                this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                return null;
            }

            // Создаем ентити USER_CARD_DOCGROUP и добовляем в модель
            const userDG: USER_CARD_DOCGROUP[] = this._createDGEntity(card, dues);
            card.USER_CARD_DOCGROUP_List.splice(-1, 0, ...userDG);

            // Создаем и возвращаем массив класса NodeDocsTree
            const nodeList: NodeDocsTree[] = [];
            userDG.forEach((userCardDG: USER_CARD_DOCGROUP) => {
                const docGroup = this._docGroup.get(userCardDG.DUE);
                this._createListNode(nodeList, {docGroup, userCardDG});
            });
            this._checkChenge();
            return nodeList;
        });
    }
    checkChenge() {
        this._checkChenge();
    }
    private _createListNode (list: NodeDocsTree[], data): void { // {docGroup, userCardDG}
        list.push(new NodeDocsTree({
            due: data.docGroup.DUE,
            label: data.docGroup.CLASSIF_NAME,
            allowed: !!data.userCardDG.ALLOWED,
            data
        }));
    }
    private _checkChenge() {
        const arr = [];
        let state: boolean = false;
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            console.log(card.FUNCLIST !== this._orginCard.get(card.DUE).FUNCLIST);
            if (card.FUNCLIST !== this._orginCard.get(card.DUE).FUNCLIST) {
                state = true;
                return;
            }
            card.USER_CARD_DOCGROUP_List.forEach((dg: USER_CARD_DOCGROUP) => {
                if (dg._State) {
                    arr.push(dg);
                    state = true;
                    return;
                }
            });
        });
        this._chengeState$.next(state);
        console.log(arr.length, arr);
    }
    private _createDGEntity(card: USERCARD, dues: string[]): USER_CARD_DOCGROUP[] {
        const newUserCardDG: USER_CARD_DOCGROUP[] = [];
        dues.forEach((due: string) => {
            const dg = this._pipSrv.entityHelper.prepareAdded<USER_CARD_DOCGROUP>({
                ISN_LCLASSIF: this._userParamsSetSrv.userContextId,
                DUE_CARD: card.DUE,
                DUE: due,
                FUNC_NUM: this.selectedFuncNum.funcNum,
                ALLOWED: 1,
            }, 'USER_CARD_DOCGROUP');
            newUserCardDG.push(dg);
        });
        return newUserCardDG;
    }
    private _getDocGroupEntity$(dues: string[]): Promise<void> {
            const queryDue: string[] = [];
            dues.forEach((due: string) => {
                if (!this._docGroup.has(due)) {
                    queryDue.push(due);
                }
            });
            if (queryDue.length) {
                return this._apiSrv.getDocGroup(queryDue)
                .then((list: DOCGROUP_CL[]) => {
                    list.forEach((dg: DOCGROUP_CL) => {
                        this._docGroup.set(dg.DUE, dg);
                    });
                });
            }
            return Promise.resolve();
    }
    private _findOriginCard() {
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            const userCard: USERCARD = Object.assign({}, this._userParamsSetSrv.curentUser._orig.USERCARD_List.find((c: USERCARD) => c.DUE === card.DUE));
            this._orginCard.set(userCard.DUE, userCard);
        });
    }
}
