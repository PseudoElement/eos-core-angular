import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { Router } from '@angular/router';
import { CARD_FUNC_LIST } from './card-func-list.consts';
import { FuncNum } from './funcnum.model';
import { CardRightSrv } from './card-right.service';
import { Subject } from 'rxjs/Subject';
// import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'eos-rights-delo-cards',
    templateUrl: 'rights-delo-cards.component.html'
})

export class RightsDeloCardsComponent implements OnInit, OnDestroy {
    public selfLink: string;
    public titleHeader: string;
    public isLoading: boolean;
    public btnDisabled: boolean = true;
    public pageState: 'LOADING' | 'EMPTY' | 'VIEW' = 'LOADING';
    public editableUser: IParamUserCl;
    public funcList: FuncNum[];
    public editMode: boolean = false;
    private _selectedFuncNum: FuncNum;
    private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private _router: Router,
        private _cardSrv: CardRightSrv,
    ) {
        this.selfLink = this._router.url.split('?')[0];
        this._cardSrv.chengeState$
        .takeUntil(this._ngUnsubscribe)
        .subscribe((state: boolean) => {
            this.btnDisabled = !state;
        });
    }
    async ngOnInit() {
        // получение пользователя
        // await Promise.resolve();
        await this._userParamsSetSrv.getUserIsn();
        this._cardSrv.prepareforEdit();
        this.editableUser = this._userParamsSetSrv.curentUser;
        this.titleHeader = `${this.editableUser.SURNAME_PATRON} - Права в картотеках`;
        if (!this.editableUser.USERCARD_List || !this.editableUser.USERCARD_List.length) {
            this.pageState = 'EMPTY';
            return;
        }
        this.funcList = CARD_FUNC_LIST.map(node => new FuncNum(node));
        this.pageState = 'VIEW';

    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit() {
        this._cardSrv.saveChenge$()
        .then(() => {
            this.cancel();
        });
    }
    cancel() {
        this.editMode = false;
        this._selectedFuncNum.isSelected = false;
        this._selectedFuncNum = null;
        this._cardSrv.selectedFuncNum = null;
    }
    edit() {
        this.editMode = true;
        this.selectFuncNum(this.funcList[0]);
    }
    close() {
        this._router.navigate(['user_param']);
    }
    selectFuncNum(node: FuncNum) {
        if (!this.editMode) {
            return;
        }
        if (this._selectedFuncNum === node) {
            return;
        }
        if (this._selectedFuncNum) {
            this._selectedFuncNum.isSelected = false;
        }
        this._selectedFuncNum = node;
        this._selectedFuncNum.isSelected = true;
        this._cardSrv.selectedFuncNum = node;
        this._cardSrv.selectFuncnum();
    }
}
