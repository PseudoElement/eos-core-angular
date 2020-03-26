import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USERCARD, DEPARTMENT, USER_CARD_DOCGROUP, DOCGROUP_CL, PipRX, IEnt } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { FuncNum } from './funcnum.model';
import { Subject, Observable } from 'rxjs';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { _ES } from 'eos-rest/core/consts';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_DOCGROUP_CL } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EMPTY_ADD_ELEMENT_WARN } from 'app/consts/messages.consts';
import { SUCCESS_SAVE_MESSAGE_SUCCESS } from 'eos-common/consts/common.consts';
import { AppContext } from 'eos-rest/services/appContext.service';

@Injectable()
export class CardRightSrv {
    public selectedFuncNum: FuncNum;
    public departments = new Map<string, DEPARTMENT>(); // Map<DUE, DEPARTMENT>
    private _docGroup = new Map<string, DOCGROUP_CL>(); // Map<DUE, DOCGROUP_CL>

    get selectingNode$(): Observable<void> {
        return this._selectingNode$.asObservable();
    }
    get chengeState$(): Observable<boolean> {
        return this._chengeState$.asObservable();
    }
    private _selectingNode$: Subject<void>;
    private _chengeState$: Subject<boolean>;

    private _funcNum_skip_deleted: Array<number> = [1, 13, 14, 15, 16];
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private _apiSrv: UserParamApiSrv,
        private _pipSrv: PipRX,
        private _waitClassifSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
        private _appContext: AppContext
    ) {
        this._selectingNode$ = new Subject<void>();
        this._chengeState$ = new Subject<boolean>();
    }
    prepareforEdit() {
        this._userParamsSetSrv.curentUser.USERCARD_List = this._prepareforEdit(this._userParamsSetSrv.curentUser.USERCARD_List);
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
    limitCardAccess(due: string): boolean {
        if (this._appContext.limitCardsUser.length === 0) {
            return true;
        }
        return this._appContext.limitCardsUser.indexOf(due) !== -1;
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
                    this._createListNode(nodeList, { docGroup, userCardDG });
                });
                return nodeList;
            });
    }
    provPrevSubmit() {
        // проверяю есть ли право, и если ни у одного парава нет ALLOWED = 1 то выдавать ошибку и не давать сохранять
        let flag = true;
        const viewResol = [];
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            let countFN = 0;
            let countFNA = 0;
            card.USER_CARD_DOCGROUP_List.forEach(elem => {
                if (elem.FUNC_NUM === 1 && elem._State !== _ES.Deleted) {
                    countFN++;
                    if (elem.ALLOWED === 1) {
                        countFNA++;
                    }
                }
            });
            if (countFN > 0 && countFNA === 0) {
                flag = false;
            }
            this.checkViewResol(card, viewResol);
        });
        if (!flag) {
            this._msgSrv.addNewMessage({
                type: 'danger',
                title: 'Предупреждение',
                msg: 'Пользователю дано право на регистрацию документов, но нет разрешения ни на одну группу документов!\nУкажите группу документов для регистрации'
            });
            return false;
        }
        if (viewResol.length) {
            this._msgSrv.addNewMessage({
                type: 'warning',
                title: 'Предупреждение',
                msg: `Невозможно снять право 'Просмотр поручений.'\n Пользователь имеет доступ в папки 1-3 кабинетов данных картотек: ${this.getNamesDue(viewResol)}`
            });
            return false;
        }
        return true;
    }

    checkViewResol(card: USERCARD, viewResol: string[]): void {
        if (card.USER_CABINET_List.length) {
            const fold_av = card.USER_CABINET_List[0].FOLDERS_AVAILABLE.charAt(0);
            if ((fold_av === '1' || fold_av === '2' || fold_av === '3') && card.FUNCLIST.charAt(16) === '0') {
                viewResol.push(card.DUE);
            }
        }
    }

    getNamesDue(viewResol: any[]): string {
        let str = '';
        viewResol.forEach(due => {
            str += this.departments.get(due).CARD_NAME + ', ';
        });
        return str.slice(0, -2);
    }

    saveChenge$() {
        const chl = [];
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            if (card._State) {
                this._createChangeList(chl, card);
            }
            for (let i = 0; card.USER_CARD_DOCGROUP_List.length > i; i++) {
                const dg: USER_CARD_DOCGROUP = card.USER_CARD_DOCGROUP_List[i];
                const saveState = dg._State;
                if (dg._State) {
                    this._createChangeList(chl, dg, card);
                }
                if (saveState === _ES.Deleted) {
                    card.USER_CARD_DOCGROUP_List.splice(i, 1);
                    i--;
                }
            }
        });
        return this._pipSrv.batch(chl, '')
            .then((d) => {
                this._userParamsSetSrv.setChangeState({ isChange: false });
                this.prepareforEdit();
                this._msgSrv.addNewMessage(SUCCESS_SAVE_MESSAGE_SUCCESS);
            })
            .catch((err) => {
                const errMessage = err.message ? err.message : err;
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка операции',
                    msg: errMessage
                });
                return null;
            });
    }
    // test() {
    //     const arr = [];
    //     this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
    //         if (card._State) {
    //             arr.push(card);
    //         }
    //         card.USER_CARD_DOCGROUP_List.forEach((dg: USER_CARD_DOCGROUP) => {
    //             if (dg._State) {
    //                 arr.push(dg);
    //             }
    //         });
    //     });
    //     console.log(arr.length, arr);
    // }
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
    newDGEntity(card: USERCARD, dues: string[]): USER_CARD_DOCGROUP[] {
        const newUserCardDG: USER_CARD_DOCGROUP[] = [];
        let flag = true;
        card.USER_CARD_DOCGROUP_List.forEach(elem => {
            if (elem.FUNC_NUM === 14) {
                flag = false;
                if (card.FUNCLIST[13] === '1') {
                    delete elem._State;
                }
            }
        });
        if (flag) {
            dues.forEach((due: string) => {
                const dg = this._pipSrv.entityHelper.prepareAdded<USER_CARD_DOCGROUP>({
                    ISN_LCLASSIF: this._userParamsSetSrv.userContextId,
                    DUE_CARD: card.DUE,
                    DUE: due,
                    FUNC_NUM: 14,
                    ALLOWED: 1,
                }, 'USER_CARD_DOCGROUP');
                newUserCardDG.push(dg);
            });
        }
        return newUserCardDG;
    }
    newDateRG(card: USERCARD, dues: string[]): USER_CARD_DOCGROUP[] {
        const newUserCardDG: USER_CARD_DOCGROUP[] = [];
        let flag = true;
        const cardADD = [13, 14, 15, 16];
        card.USER_CARD_DOCGROUP_List.forEach(elem => {
            if (elem.FUNC_NUM === 13 || elem.FUNC_NUM === 14 || elem.FUNC_NUM === 15 || elem.FUNC_NUM === 16) {
                flag = false;
                if (card.FUNCLIST[2] === '1') {
                    delete elem._State;
                }
                cardADD.filter(el => el !== elem.FUNC_NUM);
            }
        });
        if (flag) {
            cardADD.forEach((FUNC: number) => {
                const dg = this._pipSrv.entityHelper.prepareAdded<USER_CARD_DOCGROUP>({
                    ISN_LCLASSIF: this._userParamsSetSrv.userContextId,
                    DUE_CARD: card.DUE,
                    DUE: '0.',
                    FUNC_NUM: FUNC,
                    ALLOWED: 1,
                }, 'USER_CARD_DOCGROUP');
                newUserCardDG.push(dg);
            });
        }
        return newUserCardDG;
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
            if (this.selectedFuncNum.funcNum === 15 || this.selectedFuncNum.funcNum === 16) {
                card.USER_CARD_DOCGROUP_List.splice(-1, 0, ...this.newDGEntity(card, ['0.']));
            }
            if (this.selectedFuncNum.funcNum === 3) {
                card.USER_CARD_DOCGROUP_List.splice(-1, 0, ...this.newDateRG(card, ['0.']));
            }
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
    checkNotSkipAdding(func_num) {
        return this._funcNum_skip_deleted.some((fum) => {
            return fum === func_num;
        });
    }
    addingDocGroup$(card: USERCARD): Promise<NodeDocsTree[]> {
        let dues: string[];
        let msg: string = '';
        if (this.checkNotSkipAdding(this.selectedFuncNum.funcNum)) {
            delete OPEN_CLASSIF_DOCGROUP_CL.skipDeleted;
        } else {
            OPEN_CLASSIF_DOCGROUP_CL['skipDeleted'] = false;
        }
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
                const userDocGroup: USER_CARD_DOCGROUP[] = [];
                // Проверяем, существуют ли они в списке
                card.USER_CARD_DOCGROUP_List.forEach((doc: USER_CARD_DOCGROUP) => {
                    const index = dues.findIndex((due: string) => doc.DUE === due && doc.FUNC_NUM === this.selectedFuncNum.funcNum);
                    if (index !== -1) {
                        if (doc._State === _ES.Deleted) {
                            delete doc._State;
                            doc.ALLOWED = doc._orig.ALLOWED;
                            userDocGroup.push(doc);
                        } else {
                            msg += `'${this._docGroup.get(doc.DUE).CLASSIF_NAME}',\n`;
                        }
                        dues.splice(index, 1);
                    }
                });
                if (msg.length) {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение',
                        msg: `Элемент ${msg} не будет добавлен\nтак как он уже существует`
                    });
                }
                if (!dues.length && !userDocGroup.length) {
                    this._msgSrv.addNewMessage(EMPTY_ADD_ELEMENT_WARN);
                    return null;
                }

                // Создаем ентити USER_CARD_DOCGROUP и добовляем в модель
                let userDG: USER_CARD_DOCGROUP[] = this._createDGEntity(card, dues);
                card.USER_CARD_DOCGROUP_List.splice(-1, 0, ...userDG);
                // Создаем и возвращаем массив класса NodeDocsTree
                const nodeList: NodeDocsTree[] = [];
                userDG = userDG.concat(userDocGroup);
                userDG.forEach((userCardDG: USER_CARD_DOCGROUP) => {
                    const docGroup = this._docGroup.get(userCardDG.DUE);
                    this._createListNode(nodeList, { docGroup, userCardDG });
                });
                this._checkChenge();
                return nodeList;
            });
    }
    checkChenge() {
        this._checkChenge();
    }

    cancelChanges() {
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            card.FUNCLIST = card._orig.FUNCLIST;
            delete card._State;
            // delete card.USER_CARD_DOCGROUP_List;
            card.USER_CARD_DOCGROUP_List = card.USER_CARD_DOCGROUP_List.filter((erte: USER_CARD_DOCGROUP) => {
                if (erte._State === 'MERGE') {
                    erte.ALLOWED = erte.ALLOWED ? 0 : 1;
                }
                return erte._State !== 'POST';
            });
            card.USER_CARD_DOCGROUP_List.forEach((dg: USER_CARD_DOCGROUP) => {
                delete dg._State;
                this._pipSrv.entityHelper.prepareForEdit(dg);
            });
        });
    }
    addFunclist(item: any) {
        if (item['FUNCLIST'].length < 21) {
            item['FUNCLIST'] = item['FUNCLIST'] + '0'.repeat(21 - item['FUNCLIST'].length);
        }
    }
    private _createListNode(list: NodeDocsTree[], data): void { // {docGroup, userCardDG}
        list.push(new NodeDocsTree({
            due: data.docGroup.DUE,
            label: data.docGroup.CLASSIF_NAME,
            allowed: !!data.userCardDG.ALLOWED,
            data
        },
            this.selectedFuncNum.label === 'Отправка сообщений СЭВ' ? null : true));
    }
    private _checkChenge() {
        let state: boolean = false;
        this._userParamsSetSrv.curentUser.USERCARD_List.forEach((card: USERCARD) => {
            if (card.FUNCLIST !== card._orig.FUNCLIST) {
                card._State = _ES.Modified;
                state = true;
                return;
            } else {
                delete card._State;
            }
            card.USER_CARD_DOCGROUP_List.forEach((dg: USER_CARD_DOCGROUP) => {
                if (dg._State) {
                    state = true;
                    return;
                }
            });
        });
        this._chengeState$.next(state);
        this._userParamsSetSrv.setChangeState({ isChange: state });
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
    private _prepareforEdit(arr) {
        arr.forEach((item) => {
            item = this._pipSrv.entityHelper.prepareForEdit(item);
            if (item['FUNCLIST']) {
                this.addFunclist(item);
            }
            for (const key in item) {
                if (item[key] instanceof Array) {
                    item[key] = this._prepareforEdit(item[key]);
                }
            }
        });
        return arr;
    }

    private _createChangeList(chl: any[], ent: IEnt, parent?: IEnt) {
        const userId = this._userParamsSetSrv.userContextId;
        const user: string = `USER_CL(${userId})/`;
        if (ent.__metadata.__type === 'USERCARD') {
            chl.push({
                method: ent._State,
                requestUri: `${user}USERCARD_List('${userId} ${ent['DUE']}')`,
                data: {
                    FUNCLIST: ent['FUNCLIST']
                }
            });
            delete ent._State;
            // this._saveOrigin(ent);
        }
        if (ent.__metadata.__type === 'USER_CARD_DOCGROUP') {
            const ch = {
                method: ent._State,
            };
            const uri = `${user}USERCARD_List('${userId} ${parent['DUE']}')/USER_CARD_DOCGROUP_List('${userId} ${parent['DUE']} ${ent['DUE']} ${ent['FUNC_NUM']}')`;
            if (ent._State === _ES.Added) {
                ch['requestUri'] = `${user}USERCARD_List('${userId} ${parent['DUE']}')/USER_CARD_DOCGROUP_List`;
                ch['data'] = {
                    ISN_LCLASSIF: userId,
                    DUE_CARD: parent['DUE'],
                    DUE: ent['DUE'],
                    FUNC_NUM: ent['FUNC_NUM'],
                    // FUNC_NUM: this.selectedFuncNum.funcNum,
                    ALLOWED: ent['ALLOWED'],
                };
            }
            if (ent._State === _ES.Deleted) {
                ch['requestUri'] = uri;
            }
            if (ent._State === _ES.Modified) {
                ch['requestUri'] = uri;
                ch['data'] = { ALLOWED: ent['ALLOWED'] };
            }
            chl.push(ch);
            delete ent._State;
            // this._saveOrigin(ent);
        }
    }

    // private _saveOrigin(ent: IEnt) {
    //     for (const key in ent) {
    //         if (key !== '_orig' && key !== '__metadata' && key !== '_State') {
    //             ent._orig[key] = ent[key];
    //         }
    //     }
    // }
}
