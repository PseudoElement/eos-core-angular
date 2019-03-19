import { Injectable } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { USERCARD, DEPARTMENT } from 'eos-rest';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { FuncNum } from './funcnum.model';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CardRightSrv {
    public selectedFuncNum: FuncNum;
    public departments = new Map<string, DEPARTMENT>(); // Map<DUE, DEPARTMENT>
    get selectingNode$(): Observable<void> {
        return this._selectingNode$.asObservable();
    }
    private _selectingNode$: Subject<void>;
    constructor (
        private _userParamsSetSrv: UserParamsService,
        private apiSrv: UserParamApiSrv,
    ) {
        this._selectingNode$ = new Subject<void>();
    }
    getCardList(): Promise<USERCARD[]> {
        const userCardList: USERCARD[] = this._userParamsSetSrv.curentUser.USERCARD_List;
        const str: string[] = userCardList.map((card: USERCARD) => card.DUE);
        return this.apiSrv.getDepartment(str)
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
    // private _getDocGroupsAll(cardList: USERCARD[]): Promise<DOCGROUP_CL[]> {
    //     const due = new Set();
    //     cardList.forEach((card: USERCARD) => {
    //         card.USER_CARD_DOCGROUP_List.forEach((docGroup: USER_CARD_DOCGROUP) => {
    //             due.add(docGroup.DUE);
    //         });
    //     });
    //     return this.apiSrv.getDocGroup(Array.from(due));
    // }
}
