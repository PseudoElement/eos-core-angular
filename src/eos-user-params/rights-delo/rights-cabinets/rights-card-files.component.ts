import {Component, OnInit} from '@angular/core';
// import { PipRX } from 'eos-rest';
import {RigthsCabinetsServices} from 'eos-user-params/shared/services/rigths-cabinets.services';
import {UserParamsService } from '../../shared/services/user-params.service';
import {USERCARD, DEPARTMENT} from '../../../eos-rest/interfaces/structures';
import {Router} from '@angular/router';
import {CardsClass} from '../rights-cabinets/helpers/cards-class';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_CARDINDEX } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
// import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-card-files',
    templateUrl: 'rights-card-files.component.html',
    providers: [RigthsCabinetsServices]
})

export class RightsCardFilesComponent implements OnInit {
    public isLoading = false;
    public titleHeader;
    public link;
    public selfLink;
    public mainArrayCards = [];
    public currentCard: CardsClass;
    private userId: number;
    constructor(
        // private _pipRx: PipRX,
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _whaitSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
    ) {
        this.isLoading = false;
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Картотеки и Кабинеты';
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
    }
    ngOnInit() {
        this.userId = this._userSrv.userContextId;
        this._userSrv.getUserIsn().then(() => {
            this.init();
        });
    }

    init(): void {
        this._rightsCabinetsSrv.getUserCard(this._userSrv.curentUser.USERCARD_List, this.userId).then((user_cards: USERCARD[]) => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
            if (this.mainArrayCards.length) {
                this.selectCurentCard(this.mainArrayCards[0]);
            }
        });
    }
    showContent(card: CardsClass) {
        console.log(card);

    }

    addCards(): void {
        this._whaitSrv.openClassif(OPEN_CLASSIF_CARDINDEX).then((dueCards: string) => {
            this.prepareWarnindMessage(dueCards);
        }).catch(error => {

        });
    }

    prepareWarnindMessage(dueCards: string) {
        if (!this.mainArrayCards.length) {
            this.getInfoForNewCards(dueCards.split('|')).then(() => {});
        }  else {
            const transformString = dueCards.split('|');
            this.searchMathes(transformString);
        }
    }
    searchMathes(dueArray: Array<string>) {
        let stringMatches = '';
        if (dueArray.length) {
         const newCardDue = dueArray.filter(newCard => {
                return this.mainArrayCards.every((oldCard: CardsClass) => {
                    if (newCard === oldCard.cardDue) {
                        if (oldCard.deleted) {
                            oldCard.deleted = false;
                        }   else {
                            stringMatches += oldCard.cardName + ',\n ';
                        }
                    }
                    return newCard !== oldCard.cardDue;
                });
            });
            if (stringMatches.length) {
                this.showWarnMessage(stringMatches);
            }
            if (newCardDue.length) {
                this.getInfoForNewCards(newCardDue).then(() => {});
            }
        } else {
            return;
        }
    }
    showWarnMessage(stringMatches: string) {
        const MessageError: IMessage = {
            title: 'Предупреждение',
            msg: '',
            type: 'warning',
            dismissOnTimeout: 20000
        };
            MessageError.msg = `Выбранные картотеки:\n ${stringMatches} уже существуют и не могут быть добавленны снова!!!`;
            this._msgSrv.addNewMessage(MessageError);
    }

    getInfoForNewCards(newCard: Array<string>): Promise<any> {
        const queryDeepstreing = this._rightsCabinetsSrv.createStringQuery(newCard, true);
        return this._rightsCabinetsSrv.getDepartmentName(queryDeepstreing)
            .then((deepInfo: DEPARTMENT[]) => {
                const queryString = this._rightsCabinetsSrv.createStringQuery(deepInfo);
                return this._rightsCabinetsSrv.getCabinetsName(queryString)
                    .then(data => {
                        const queryStringCards = this._rightsCabinetsSrv.createStringQueryCabinet(data);
                        return this._rightsCabinetsSrv.getUserCabinet(queryStringCards)
                            .then(res => {
                                const q: CardInit = {
                                    DEPARTMENT_info: deepInfo,
                                    CABINET_info: data,
                                    USER_CABINET_info: res,
                                    create: true
                                };
                            const userCard = this._rightsCabinetsSrv.createUSERCARDArray(newCard);
                                this._rightsCabinetsSrv.fillArrayCards(userCard, q);
                                this._rightsCabinetsSrv.fillArrayCardsName(deepInfo);
                                this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
                            });
                    });
            });
    }

    selectCurentCard(card: CardsClass) {
        if (this.currentCard) {
            this.currentCard.current = false;
        }
        this.currentCard = card;
        this.currentCard.current = true;
    }
    removeCards() {
        this.currentCard.deleted = true;
        if (this.currentCard.newCard) {
            this.removeNewCard();
        }
        const upCurrCard = this.mainArrayCards.filter((card: CardsClass) => {
            return !card.deleted;
        });
        if (upCurrCard.length) {
            this.selectCurentCard(upCurrCard[0]);
        }
    }
    cancel(event?) {
        this.mainArrayCards = this._rightsCabinetsSrv.cardsOrigin.slice();
    }
    removeNewCard() {
        const indexDel = this.mainArrayCards.indexOf(this.currentCard);
        this.mainArrayCards.splice(indexDel, 0);
        this._rightsCabinetsSrv.cardsArray.splice(indexDel, 0);
    }
}
