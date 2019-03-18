import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USERCARD, DEPARTMENT, USER_CARD_DOCGROUP, DOCGROUP_CL } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { FuncNum } from './funcnum.model';

@Injectable()
export class CardRightSrv {
    public funcNum: FuncNum;
    private _dep = new Map<string, DEPARTMENT>(); // Map<DUE, DEPARTMENT>
    private _docGroup = new Map<string, DOCGROUP_CL>(); // Map<DUE, DOCGROUP_CL>
    constructor (
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
    ) {}
    getCardList(): Promise<any> {
        const userCardList: USERCARD[] = this._userParamsSetSrv.curentUser.USERCARD_List;
        console.log(this._userParamsSetSrv);
        const str: string[] = userCardList.map((card: USERCARD) => card.DUE);
        const pDeps = this.apiSrv.getDepartment(str);
        const pDocGroups = this._getDocGroupsAll(userCardList);
        return Promise.all([pDeps, pDocGroups])
        .then(([deps, docGroups]) => {
            deps.forEach((dep: DEPARTMENT) => {
                this._dep.set(dep.DUE, dep);
            });
            docGroups.forEach((docGroup: DOCGROUP_CL) => {
                this._docGroup.set(docGroup.DUE, docGroup);
            });
            console.log(this._dep);
            console.log(this._docGroup);
        });
        // return new Promise((s, j) => {
        //     setTimeout(() => {
        //         s([]);
        //     }, 3000);
        // });
    }
    private _getDocGroupsAll(cardList: USERCARD[]): Promise<DOCGROUP_CL[]> {
        const due = new Set();
        cardList.forEach((card: USERCARD) => {
            card.USER_CARD_DOCGROUP_List.forEach((docGroup: USER_CARD_DOCGROUP) => {
                due.add(docGroup.DUE);
            });
        });
        return this.apiSrv.getDocGroup(Array.from(due));
    }
}
