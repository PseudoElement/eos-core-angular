import { Component, OnInit } from '@angular/core';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { CardRightSrv } from '../card-right.service';

@Component({
    selector: 'eos-list-card-right',
    templateUrl: 'list-card.component.html'
})
export class ListCardRightComponent implements OnInit {
    public isLoading: boolean;
    constructor (
        private _userParamsSetSrv: UserParamsService,
        private _cardSrv: CardRightSrv,
    ) {}

    ngOnInit() {
        console.log(this._cardSrv);
        console.log(this._userParamsSetSrv);
        // this._cardSrv.getCardList();
    }
}
