import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardRightSrv } from '../card-right.service';
import { CardRight } from './card.model';
import { USERCARD/* , DOCGROUP_CL */ } from 'eos-rest';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit, OnDestroy {
    public isLoading: boolean = true;
    public isShell: boolean = false;
    public listNodes: CardRight[];
    // private _docGroup = new Map<string, DOCGROUP_CL>(); // Map<DUE, DOCGROUP_CL>
    private _cardList: USERCARD[];
    private s_selected: Subscription;
    constructor (
        private _cardSrv: CardRightSrv,
    ) {
        this.s_selected = this._cardSrv.selectingNode$
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
        this.s_selected.unsubscribe();
    }
    expendList(node: CardRight) {
        console.log(node);
        node.isExpanded = !node.isExpanded;
        // node.isLoading = true;
        // setTimeout(() => {
        //     node.isLoading = false;
        // }, 500);
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
