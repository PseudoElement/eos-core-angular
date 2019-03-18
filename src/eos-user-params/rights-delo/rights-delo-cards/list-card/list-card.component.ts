import { Component, OnInit } from '@angular/core';
// import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { CardRightSrv } from '../card-right.service';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit {
    public isLoading: boolean = true;
    public cardList;
    constructor (
        // private _userParamsSetSrv: UserParamsService,
        private _cardSrv: CardRightSrv,
    ) {}

    async ngOnInit() {
        // console.log();
        this.cardList = await this._cardSrv.getCardList();
        this.isLoading = false;
    }
}
