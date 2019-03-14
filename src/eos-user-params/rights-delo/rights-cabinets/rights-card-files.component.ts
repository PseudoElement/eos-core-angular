import {Component, OnInit} from '@angular/core';
// import { PipRX } from 'eos-rest';
import {RigthsCabinetsServices} from 'eos-user-params/shared/services/rigths-cabinets.services';
import { UserParamsService } from '../../shared/services/user-params.service';
import {USERCARD} from '../../../eos-rest/interfaces/structures';
import {Router} from '@angular/router';
import {CardsClass} from '../rights-cabinets/helpers/cards-class';
// import { WaitClassifService } from 'app/services/waitClassif.service';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-card-files',
    styleUrls: ['rights-card-files.component.scss'],
    templateUrl: 'rights-card-files.component.html',
})

export class RightsCardFilesComponent implements OnInit {
    public isLoading = false;
    public titleHeader;
    public link;
    public selfLink;
    public mainArrayCards = [];
    private userId: number;
    constructor(
        // private _pipRx: PipRX,
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router
    ) {
        this.isLoading = false;
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Картотеки и Кабинеты';
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];

    }
    ngOnInit() {
        this.userId = this._userSrv.userContextId;
        this._userSrv.getUserIsn().then(() => {
            console.log(this._userSrv);
            this.init();
        });
    }

    init() {
        this._rightsCabinetsSrv.getUserCard(this._userSrv.curentUser.USERCARD_List).then((user_cards: USERCARD[]) => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
        });
    }
    showContent(card: CardsClass) {
        console.log(card);

    }
}
