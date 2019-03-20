import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USERCARD, DEPARTMENT, USER_CARD_DOCGROUP, DOCGROUP_CL } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { FuncNum } from './funcnum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';

@Injectable()
export class CardRightSrv {
    public selectedFuncNum: FuncNum;
    public departments = new Map<string, DEPARTMENT>(); // Map<DUE, DEPARTMENT>
    private _docGroup = new Map<string, DOCGROUP_CL>(); // Map<DUE, DOCGROUP_CL>

    get selectingNode$(): Observable<void> {
        return this._selectingNode$.asObservable();
    }
    private _selectingNode$: Subject<void>;
    constructor (
        private _userParamsSetSrv: UserParamsService,
        private _apiSrv: UserParamApiSrv,
    ) {
        this._selectingNode$ = new Subject<void>();
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
    getlistTreeNode(docs: USER_CARD_DOCGROUP[]): Promise<NodeDocsTree[]> {
        const docGroupQuery = new Map<string, USER_CARD_DOCGROUP>();
        const nodeList: NodeDocsTree[] = [];
        docs.forEach((userCardDG: USER_CARD_DOCGROUP) => {
            if (this._docGroup.has(userCardDG.DUE)) {
                const docGroup = this._docGroup.get(userCardDG.DUE);
                this._createListNode(nodeList, {docGroup, userCardDG});
            } else {
                docGroupQuery.set(userCardDG.DUE, userCardDG);
            }
        });
        if (!docGroupQuery.size) {
            return Promise.resolve(nodeList);
        }
        const keys = Array.from(docGroupQuery.keys());
        return this._apiSrv.getDocGroup(keys)
        .then((list: DOCGROUP_CL[]) => {
            list.forEach((docGroup: DOCGROUP_CL) => {
                const userCardDG = docGroupQuery.get(docGroup.DUE);
                this._docGroup.set(docGroup.DUE, docGroup);
                this._createListNode(nodeList, {docGroup, userCardDG});
            });
            return nodeList;
        });

    }
    checkedNode(node: NodeDocsTree) {
        console.log(node);
    }
    private _createListNode (list: NodeDocsTree[], data): void { // {docGroup, userCardDG}
        list.push(new NodeDocsTree({
            due: data.docGroup.DUE,
            label: data.docGroup.CLASSIF_NAME,
            allowed: !!data.userCardDG.ALLOWED,
            data
        }));
    }
}
