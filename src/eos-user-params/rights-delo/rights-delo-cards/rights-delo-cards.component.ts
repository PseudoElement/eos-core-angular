import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CARD_FUNC_LIST } from './card-func-list.consts';
import { FuncNum } from './funcnum.model';
import { CardRightSrv } from './card-right.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';

@Component({
    selector: 'eos-rights-delo-cards',
    templateUrl: 'rights-delo-cards.component.html'
})

export class RightsDeloCardsComponent implements OnInit, OnDestroy {
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
        private _errorSrv: ErrorHelperServices,
    ) {
        this._cardSrv.chengeState$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.btnDisabled = !state;
            });
        this._userParamsSetSrv.saveData$
            .pipe(
                takeUntil(this._ngUnsubscribe)
            )
            .subscribe(() => {
                this._userParamsSetSrv.submitSave = this.submit();
            });
    }
    ngOnInit() {
        this._userParamsSetSrv.getUserIsn()
        .then(() => {
            return this._userParamsSetSrv.checkGrifs(this._userParamsSetSrv.userContextId);
        })
        .then((flagG) => {
            this._flagGrifs = flagG;

            this._cardSrv.prepareforEdit();
            this.editableUser = this._userParamsSetSrv.curentUser;
            this.titleHeader = `${this.editableUser.SURNAME_PATRON} - Права в картотеках`;
            if (!this.editableUser.USERCARD_List || !this.editableUser.USERCARD_List.length) {
                this.pageState = 'EMPTY';
                return;
            }
            this.funcList = CARD_FUNC_LIST.map(node => new FuncNum(node));
            this.pageState = 'VIEW';
        })
        .catch(error => {
            this._errorSrv.errorHandler(error);
        });


    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    submit() {
        this.pageState = 'LOADING';
        this._cardSrv.saveChenge$()
            .then(() => {
                this.pageState = 'VIEW';
                this.btnDisabled = true;
                this._clearView();
            }).catch(error => {
                this._errorSrv.errorHandler(error);
                this._clearView();
                this.ngOnInit();
            });
    }
    cancel() {
        this._clearView();
        this._cardSrv.cancelChanges();
    }
    edit() {
        if (!this._flagGrifs) {
            this._router.navigate(['user-params-set/', 'access-limitation'],
                {
                    queryParams: { isn_cl: this._userParamsSetSrv.userContextId }
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
    private _clearView (): void {
        this._userParamsSetSrv.setChangeState({ isChange: false });
        this.editMode = false;
        this._selectedFuncNum.isSelected = false;
        this._selectedFuncNum = null;
        this._cardSrv.selectedFuncNum = null;
    }
}
