import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardRightSrv } from '../card-right.service';
import { CardRight } from './card.model';
import { USERCARD } from 'eos-rest';
import { AppContext } from 'eos-rest/services/appContext.service';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit, OnDestroy {
    @Input() editMode: boolean;
    public isLoading: boolean = true;
    public isShell: boolean = false;
    public listNodes: CardRight[];
    private _cardList: USERCARD[];
    private _ngUnsubscribe: Subject<void>;
    constructor (
        private _cardSrv: CardRightSrv,
        private _appCtx: AppContext,
    ) {
        this._ngUnsubscribe = new Subject<void>();
        this._cardSrv.selectingNode$
        .pipe(
            takeUntil(this._ngUnsubscribe)
        )
        .subscribe(() => {
            this._createList();
        });
    }

    ngOnInit() {
        this._createList();
        this.isLoading = false;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    // hideToolTip() {
    //     const element = document.querySelector('.tooltip');
    //     if (element) {
    //         element.setAttribute('style', 'display: none');
    //     }
    // }
    // test() {
    //     this._cardSrv.test();
    // }
    private _createList() {
        this._cardSrv.getCardList()
        .then(data => {
                this.listNodes = [];
                this._cardList = data;
                this._cardList.forEach((card: USERCARD) => {
                    this.listNodes.push(new CardRight(this._appCtx, this._cardSrv, card));
                });
        });
    }
}
