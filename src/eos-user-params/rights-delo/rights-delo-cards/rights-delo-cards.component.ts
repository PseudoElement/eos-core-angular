import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { Router } from '@angular/router';
import { CARD_FUNC_LIST } from './card-func-list.consts';
import { FuncNum } from './funcnum.model';
import { CardRightSrv } from './card-right.service';
import { Subject } from 'rxjs/Subject';
import { EosMessageService } from 'eos-common/services/eos-message.service';
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
    private _flagGrifs: boolean;
    constructor(
        private _userParamsSetSrv: UserParamsService,
        private _router: Router,
        private _cardSrv: CardRightSrv,
        private _msgSrv: EosMessageService,
    ) {
        this.selfLink = this._router.url.split('?')[0];
        this._cardSrv.chengeState$
        .takeUntil(this._ngUnsubscribe)
        .subscribe((state: boolean) => {
            this.btnDisabled = !state;
        });
        this._userParamsSetSrv.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this.submit();
        });
    }
    async ngOnInit() {
        // получение пользователя
        // await Promise.resolve();
        await this._userParamsSetSrv.getUserIsn();
        this._flagGrifs = await this._userParamsSetSrv.checkGrifs(this._userParamsSetSrv.userContextId);
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
        if (!this._flagGrifs) {
            this._router.navigate(['user-params-set/', 'access-limitation'],
                {
                    queryParams: {isn_cl: this._userParamsSetSrv.userContextId}
                });
            this._msgSrv.addNewMessage({ // TODO Перенести обьект сообщения в константы.
                type: 'warning',
                title: 'Предупреждение',
                msg: 'Не заданы грифы доступа'
            });
            return;
        }
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
