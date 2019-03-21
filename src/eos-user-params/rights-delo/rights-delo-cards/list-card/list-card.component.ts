import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardRightSrv } from '../card-right.service';
import { CardRight } from './card.model';
import { USERCARD } from 'eos-rest';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit, OnDestroy {
    public isLoading: boolean = true;
    public isShell: boolean = false;
    public listNodes: CardRight[];
    private _cardList: USERCARD[];
    private _ngUnsubscribe: Subject<void>;
    constructor (
        private _cardSrv: CardRightSrv,
    ) {
        this._ngUnsubscribe = new Subject<void>();
        this._cardSrv.selectingNode$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
            this._createList();
        });
    }

    async ngOnInit() {
        this._cardList = await this._cardSrv.getCardList();
        this._createList();
        this.isLoading = false;
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    expendList(node: CardRight) {
        node.expanded();
    }
    private _createList() {
        this.listNodes = [];
        this._cardList.forEach((card: USERCARD) => {
            this.listNodes.push(new CardRight(this._cardSrv, card));
        });
    }
}






// ngOnInit() {
//     this._cardSrv.getCardList()
//     .then((cardList: USERCARD[]) => {
//         cardList.forEach((card: USERCARD) => {
//             this.listNodes.push(new CardRight(this._cardSrv, card));
//         });
//         this.isLoading = false;
//     })
//     .catch(() => {});

// }
