import {Component, OnInit} from '@angular/core';
import { PipRX } from 'eos-rest';
import {RigthsCabinetsServices} from 'eos-user-params/shared/services/rigths-cabinets.services';
import {UserParamsService } from '../../shared/services/user-params.service';
import {USERCARD, DEPARTMENT} from '../../../eos-rest/interfaces/structures';
import {Router} from '@angular/router';
import {CardsClass, Cabinets} from '../rights-cabinets/helpers/cards-class';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_CARDINDEX } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
@Component({
    selector: 'eos-card-files',
    templateUrl: 'rights-card-files.component.html',
    providers: [RigthsCabinetsServices]
})

export class RightsCardFilesComponent implements OnInit {
    public isLoading = true;
    public titleHeader;
    public link;
    public selfLink;
    public btnDisabled: boolean = true;
    public mainArrayCards = [];
    public currentCard: CardsClass;
    public newValueMap: Map<any, any>;
    public flagEdit: boolean = false;
    private userId: number;
    // private deletedCardsUrl = [];
    // private deleteFoldersUrl = [];

    constructor(
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _whaitSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
    //    private _pipSrv: PipRX,
    ) {
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Картотеки и Кабинеты';
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
        console.log(PipRX);
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
            this.isLoading = false;
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
        this._rightsCabinetsSrv.changeCabinets.next(this.currentCard);
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
        }   else {
            this.currentCard = null;
        }
    }
    removeNewCard() {
        const indexDel = this.mainArrayCards.indexOf(this.currentCard);
        this.mainArrayCards.splice(indexDel, 0);
        this._rightsCabinetsSrv.cardsArray.splice(indexDel, 0);
    }
    submit(event) {
     // this._rightsCabinetsSrv.submitRequest.next();

     const q = this.searchDeletedCards();
     console.log(q);
    // this._pipSrv.batch(q, '').then(res => {
    //     console.log(res);
    // }).catch(error => {
    //     console.log(error);
    // });
    this.createUrlForNewOrMerge();

    }
    searchDeletedCards() {
        const deletedUrlCards = [];
        const deleteUrlFolders = [];
        const indexDeleted = [];
        this.mainArrayCards.forEach((el: CardsClass, index) => {
            if (el.deleted) {
                deletedUrlCards.push(this.createUrlDeleteCards(el));
                indexDeleted.push(index);
                deleteUrlFolders.push(...this.createUrlDeleteFoldersCards(el.cabinets, true));
            }   else {
                deleteUrlFolders.push(...this.createUrlDeleteFoldersCards(el.cabinets, false));
            }

        });
        this.deleteCard(indexDeleted);
        return [...deletedUrlCards, ...deleteUrlFolders];
    }
    createUrlDeleteCards(card: CardsClass) {
        return  {
            method: 'DELETE',
            requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${card.cardDue}\')`
        };
    }
    createUrlDeleteFoldersCards(cabinets: Cabinets[], flag: boolean): Array<any> {
        const arrayDeleted = [];
        if (flag) {
              cabinets.forEach((cabinet: Cabinets) => {
            if (!cabinet.isEmptyOrigin || cabinet.deleted) {
                arrayDeleted.push ({
                    method: 'DELETE',
                    requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cabinet.parent.cardDue}\')/USER_CABINET_List(\'${cabinet.isnCabinet} ${this.userId}\')`,
                });
                this.clearDeleteMap(cabinet);
            }
        });
        } else {
            cabinets.forEach((cabinet: Cabinets) => {
                if (cabinet.deleted) {
                    arrayDeleted.push ({
                        method: 'DELETE',
                        requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cabinet.parent.cardDue}\')/USER_CABINET_List(\'${cabinet.isnCabinet} ${this.userId}\')`,
                    });
                    this.clearDeleteMap(cabinet);
                }
            });
        }
        return arrayDeleted;
    }
    deleteCard(index: Array<number>) {
        if (index.length) {
            index.reverse().forEach(el => {
                this.mainArrayCards.splice(el, 1);
            });
        }
    }
    clearDeleteMap(cabinet: Cabinets) {
        const isnCab = cabinet.isnCabinet;
        const isnClass = cabinet.isnClassif;
        if (this.newValueMap.size) {
            if (this.newValueMap.has(`${isnCab}|${isnClass}`)) {
                this.newValueMap.delete(`${isnCab}|${isnClass}`);
            }
            if (cabinet.parent.SetChangedCabinets.has(`${isnCab}|${isnClass}`)) {
                cabinet.parent.SetChangedCabinets.delete(`${isnCab}|${isnClass}`);
            }
        }
    }
    getChangesFromCabinets($event) {
        if (event) {
            this.newValueMap = $event;
        }   else {
            console.log('clear');
            this.newValueMap.clear();
        }
    }
    createUrlForNewOrMerge() {
      //  const query = [];
        this.newValueMap.forEach((value, key, array) => {
            console.log(value, key);
        });
        console.log(this.newValueMap);
    }

    edit(event) {
        this.flagEdit = event;
    }
    close() {

    }
    default() {
        return;
    }
    cancel(event?) {
        this._rightsCabinetsSrv.cardsOrigin.splice(0);
        this._rightsCabinetsSrv.cardsArray.splice(0);
        this.mainArrayCards.splice(0);
        this.init();
    }
}
