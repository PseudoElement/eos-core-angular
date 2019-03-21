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
    public newValueMap: Map<any, any> = new Map();
    public flagEdit: boolean = false;
    public flagBacground: boolean = false;
    private userId: number;
    // private deletedCardsUrl = [];
    // private deleteFoldersUrl = [];

    constructor(
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _whaitSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
         private _pipSrv: PipRX,
    ) {
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Картотеки и Кабинеты';
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
    }
    ngOnInit() {
        this.userId = this._userSrv.userContextId;
        this.init();
    }

    init(): Promise<any> {
      return  this._rightsCabinetsSrv.getUserCard(this._userSrv.curentUser.USERCARD_List, this.userId).then((user_cards: USERCARD[]) => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
            if (this.mainArrayCards.length) {
                this.selectCurentCard(this.mainArrayCards[0]);
            }
            this.isLoading = false;
        }).catch(error => {
            this.sendMessage('Предупреждение', 'Ошибка соединения');
        });
    }

    addCards(): void {
        this.flagBacground = true;
        this._whaitSrv.openClassif(OPEN_CLASSIF_CARDINDEX).then((dueCards: string) => {
            if (String(dueCards) === '') {
                this.sendMessage('Предупреждение', 'Выберите картотеку');
                this.flagBacground = false;
                return;
            }
            this.flagBacground = false;
            this.prepareWarnindMessage(dueCards).then(() => {
                this.selectFromAddedCards();
            });
        }).catch(error => {
            console.log(error);
            this.flagBacground = false;
        });
    }

    prepareWarnindMessage(dueCards: string): Promise<any> {
        if (!this.mainArrayCards.length) {
         return   this.getInfoForNewCards(dueCards.split('|')).then(() => {
             if (this.mainArrayCards.length) {
                  this.mainArrayCards[0].homeCard = true;
             }
             return;
         });
        }  else {
            const transformString = dueCards.split('|');
        return this.searchMathes(transformString);
        }
    }

    selectFromAddedCards() {
        let length = this.mainArrayCards.length - 1;
        if (!this.currentCard) {
            if (this.mainArrayCards.length) {
                while (length >= 0) {
                    if (!this.mainArrayCards[length].deleted) {
                        this.selectCurentCard(this.mainArrayCards[length]);
                        break;
                    }
                    --length;
                }
            }
        }
    }
    searchMathes(dueArray: Array<string>): Promise<any> {
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
            return   this.getInfoForNewCards(newCardDue);
            }
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }
    showWarnMessage(stringMatches: string) {
        const msg = `Выбранные картотеки:\n ${stringMatches} уже существуют и не могут быть добавленны снова!!!`;
        this.sendMessage('Предупреждение', msg);
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
        if (!this.currentCard.homeCard) {
            this.currentCard.deleted = true;
            this.currentCard.current = false;
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
        }   else {
            this.sendMessage('Предупреждение', 'Не определена главная картотека');
        }
    }
    removeNewCard() {
        const indexDel = this.mainArrayCards.indexOf(this.currentCard);
        this.mainArrayCards[indexDel].cabinets.forEach((cab: Cabinets) => {
            this.clearDeleteMap(cab);
        });
        this.mainArrayCards.splice(indexDel, 1);
        this._rightsCabinetsSrv.cardsArray.splice(indexDel, 1);
    }
    submit(event) {
    const q = this.prepUrls();
    this._pipSrv.batch(q, '').then(res => {
        this._userSrv.getUserIsn(String(this.userId)).then(() => {
         return   this.cancel();
        }).then(() => {
            this._msgSrv.addNewMessage({
                type: 'success',
                title: '',
                msg: 'Изменения сохранены',
                dismissOnTimeout: 6000
            });
        });
        }).catch(error => {
            console.log(error);
        });
    }

    prepUrls() {
        const deletedUrlCards = [];
        const deleteUrlFolders = [];
        const createUrlsCards = [];
        const createUrlFolders = [];
        const indexDeleted = [];
        this.mainArrayCards.forEach((card: CardsClass, index) => {
            if (card.deleted) {
                deletedUrlCards.push(this.createUrlDeleteCards(card));
                indexDeleted.push(index);
                deleteUrlFolders.push(...this.createUrlDeleteFoldersCards(card.cabinets, true));
            }   else {
                deleteUrlFolders.push(...this.createUrlDeleteFoldersCards(card.cabinets, false));
                if (card.changed || card.newCard) {
                    createUrlsCards.push(this.createUrlNewData(card));
                }
            }
        });
        if (this.newValueMap.size) {
            createUrlFolders.push(...this.createUrlsNewFolders());
        }
        this.deleteCard(indexDeleted);
        return [...deletedUrlCards, ...deleteUrlFolders, ...createUrlsCards, ...createUrlFolders];
    }
    createUrlsNewFolders() {
        const query = [];
        this.newValueMap.forEach((value, key, arr) => {
            if (!value.delete && !value.cabinet.isEmptyOrigin) {
                query.push(this.prepareQueryforFolders(value.cabinet, true));
            }
            if (value.cabinet.isEmptyOrigin && !value.delete) {
                query.push(this.prepareQueryforFolders(value.cabinet, false));
            }
        });
        return query;
    }

    prepareQueryforFolders(cabinet: Cabinets, flagPostOrMerge: boolean) {
        if (flagPostOrMerge) {
              return{
                method: 'MERGE',
                requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cabinet.parent.cardDue}\')/USER_CABINET_List(\'${cabinet.isnCabinet} ${this.userId}\')`,
                data: {
                          FOLDERS_AVAILABLE: cabinet.stringFolders,
                          HOME_CABINET: cabinet.homeCabinet ? 1 : 0,
                          HIDE_INACCESSIBLE: cabinet.hideAccess,
                          HIDE_INACCESSIBLE_PRJ: cabinet.hideAccessPR,
                }
            };
        }   else {
            return {
                method: 'POST',
                requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cabinet.parent.cardDue}\')/USER_CABINET_List`,
                data: {
                        ISN_CABINET: cabinet.isnCabinet,
                        ISN_LCLASSIF: cabinet.isnClassif,
                        FOLDERS_AVAILABLE:  cabinet.stringFolders ,
                        ORDER_WORK: null,
                        HOME_CABINET: cabinet.homeCabinet ? 1 : 0,
                        HIDE_INACCESSIBLE: cabinet.hideAccess,
                        HIDE_INACCESSIBLE_PRJ: cabinet.hideAccessPR,
                }
        };
    }
}
    createUrlNewData(card: CardsClass) {
        if (card.newCard) {
            return this.prepObjectforDB(card, true);
        }
        if (!card.newCard) {
            return this.prepObjectforDB(card, false);
        }
    }

    prepObjectforDB(card: CardsClass, flagCreateOrMerge: boolean) {
        if (flagCreateOrMerge) {
            return {
                        method: 'POST',
                        requestUri: `USER_CL(${this.userId})/USERCARD_List`,
                        data: {
                            ISN_LCLASSIF: `${this.userId}`,
                            DUE: `${card.cardDue}`,
                            HOME_CARD: `${card.homeCard ?  1 : 0}`,
                            FUNCLIST: '010000000000010010000'
                        }
                    };
        }   else {
            return {
                method: 'MERGE',
                requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${card.cardDue}\')`,
                data: {
                    HOME_CARD: `${card.homeCard ?  1 : 0}`
                }
            };
        }
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
        }
    }
    getChangesFromCabinets($event) {
        if ($event) {
            this.newValueMap = $event;
        }   else {
            this.newValueMap.clear();
        }
    }
    homeCardMoov() {
        if (this.currentCard) {
            this.findHomeCard();
            this.currentCard.homeCard = true;
            this.checkOfiginFlagHoumCard(this.currentCard);
        }
    }

    checkOfiginFlagHoumCard(cards: CardsClass) {
        if (cards.homeCard !== cards.homeCardOrigin) {
            cards.changed = true;
        }   else {
            cards.changed = false;
        }
    }
    findHomeCard() {
        if (this.mainArrayCards.length) {
            const length = this.mainArrayCards.length;
            for (let i = 0; i < length; i += 1) {
                const card: CardsClass = this.mainArrayCards[i];
                if (card.homeCard) {
                    card.homeCard = false;
                    this.checkOfiginFlagHoumCard(card);
                    break;
                }
            }
        }
    }


    edit(event) {
        this.flagEdit = event;
    }
    close(event) {

    }
    default(event) {
        return;
    }
    cancel(event?): Promise<any> {
        this._rightsCabinetsSrv.cardsOrigin.splice(0);
        this._rightsCabinetsSrv.cardsArray.splice(0);
        this.mainArrayCards.splice(0);
        this.newValueMap.clear();
      return  this.init();
    }
    sendMessage(tittle: string, msg: string) {
        this._msgSrv.addNewMessage({
            type: 'warning',
            title: tittle,
            msg: msg,
            dismissOnTimeout: 6000
        });
    }
}
