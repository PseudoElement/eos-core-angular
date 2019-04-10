import {Component, OnInit, OnDestroy} from '@angular/core';
import { PipRX } from 'eos-rest';
import {RigthsCabinetsServices} from 'eos-user-params/shared/services/rigths-cabinets.services';
import {UserParamsService } from '../../shared/services/user-params.service';
import {USERCARD} from '../../../eos-rest/interfaces/structures';
import {Router} from '@angular/router';
import {CardsClass, Cabinets} from '../rights-cabinets/helpers/cards-class';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_CARDINDEX } from 'app/consts/query-classif.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-card-files',
    templateUrl: 'rights-card-files.component.html',
    providers: [RigthsCabinetsServices]
})

export class RightsCardFilesComponent implements OnInit, OnDestroy {
    public isLoading = true;
    public titleHeader;
    public link;
    public selfLink;
    public flagChangeCards;
    public mainArrayCards = [];
    public currentCard: CardsClass;
    public newValueMap: Map<any, any> = new Map();
    public flagEdit: boolean = false;
    public flagBacground: boolean = false;
    get btnDisabled() {
        return ((this.newValueMap.size === 0) && this.flagChangeCards);
    }
    private _ngUnsubscribe: Subject<any> = new Subject();
    private flagGrifs: boolean;
    private userId: number;
    constructor(
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _whaitSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
        private _userServices: UserParamsService,
    ) {
        this.titleHeader = this._userSrv.curentUser['SURNAME_PATRON'] + ' - ' + 'Картотеки и Кабинеты';
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
        this.flagChangeCards = true;
        this._userServices.saveData$
        .takeUntil(this._ngUnsubscribe)
        .subscribe(() => {
         this._userServices.submitSave =  this.submit(event);
        });
    }
    ngOnInit() {
        this.userId = this._userSrv.userContextId;
        this._userSrv.getUserIsn().then(() => {
            this._userServices.checkGrifs(this.userId).then(res => {
                this.flagGrifs = res;
                this.init();
            });
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
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
                this.checkChangeCards();
            }).catch(error => {
                this.sendMessage('Предупреждение', 'Потеряно соединение с сервером ');
            });
        }).catch(error => {
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
        const msg = '<p>Выбранные картотеки:</p><div class="cabinet-warning">' + stringMatches.replace(/(\d.*,)/g, '<p>$1</p>') + '<p><b>уже существуют и не могут быть добавленны снова!</b></p></div>';
        this.sendMessage('Предупреждение', msg);
    }

    getInfoForNewCards(newCard: Array<string>): Promise<any> {
        const userCard = this._rightsCabinetsSrv.createUSERCARDArray(newCard);
        return this._rightsCabinetsSrv.getUserCard(userCard, this.userId, true).then(res => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
        });
    }

    selectCurentCard(card: CardsClass) {
        if (this.currentCard && !this.flagEdit) {
            return;
        }
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
            this.checkChangeCards();
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
    }
    submit(event): Promise<any> {
        this.isLoading = true;
        const q = this.prepUrls();
        this.flagChangeCards = true;
        this.newValueMap.clear();
        this._pushState();
     return   this._pipSrv.batch(q, '').then(res => {
            this.UpdateMainArrayAfterSubmit();
            this._rightsCabinetsSrv.submitRequest.next();
            this.isLoading = false;
                this._msgSrv.addNewMessage({
                    type: 'success',
                    title: '',
                    msg: 'Изменения сохранены',
                    dismissOnTimeout: 6000
                });
                this.flagEdit = false;
    }).catch(error => {
        this.sendMessage('Предупреждение', 'Ошибка соединения');
        });
    }
    UpdateMainArrayAfterSubmit() {
        this.mainArrayCards.forEach((cards: CardsClass) => {
                this.upCardsClass(cards);
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

    upCardsClass(card: CardsClass) {
        card.newCard = false;
        card.homeCardOrigin = card.homeCard;
        card.deleted = false;
        card.changed = false;
        this.upCabinets(card.cabinets);
    }

    upCabinets(cabinets: Cabinets[]) {
        cabinets.forEach((cabinet: Cabinets) => {
            cabinet.deleted = false;
            cabinet.originFolders = JSON.parse(JSON.stringify(cabinet.folders));
            cabinet.originHomeCabinet = cabinet.homeCabinet;
            cabinet.isChanged = false;
            cabinet.isEmptyOrigin = cabinet.isEmpty;
        });
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
        this._pushState();
    }
    checkChangeCards() {
     const flag =   this.mainArrayCards.some((cards: CardsClass) => {
            return ((cards.homeCard !== cards.homeCardOrigin) || cards.newCard || cards.deleted);
        });
        if (flag) {
            this.flagChangeCards = false;
        }   else {
            this.flagChangeCards = true;
        }
        this._pushState();
    }
    homeCardMoov() {
        if (this.currentCard) {
            this.findHomeCard();
            this.currentCard.homeCard = true;
            this.checkOfiginFlagHoumCard(this.currentCard);
        }
        this.checkChangeCards();
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
                }
            }
        }
    }

    edit(event) {
        if (this.flagGrifs) {
            this.flagEdit = event;
        }   else {
            this._router.navigate(['user-params-set/', 'access-limitation'],
            {
                queryParams: {isn_cl: this.userId}
            });
            this.sendMessage('Предупреждение', 'Не заданы грифы доступа');
        }
    }
    close(event) {
        this.flagEdit = event;
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }
    default(event) {
        return;
    }
    cancel(event?) {
        this.flagChangeCards = true;
        this.newValueMap.clear();
        this.clearMainArray();
        if (this.mainArrayCards.length) {
            this.selectCurentCard(this.mainArrayCards[0]);
        }   else {
            this.currentCard = null;
        }
        this._pushState();
        this.flagEdit = false;
    }
    clearMainArray() {
        const indexNew = [];
        this.mainArrayCards.forEach((card: CardsClass, index) => {
            if (card.newCard) {
                indexNew.push(index);
            }   else {
                card.homeCard = card.homeCardOrigin;
                card.deleted = false;
                card.current = false;
                card.changed = false;
                this.clearCabinets(card.cabinets);
            }
        });
        this.deleteCard(indexNew);
    }
    clearCabinets(cabinets: Cabinets[]) {
        if (cabinets.length) {
            cabinets.forEach((cabinet: Cabinets) => {
                cabinet.deleted = false;
                cabinet.folders = JSON.parse(JSON.stringify(cabinet.originFolders));
                cabinet.isEmpty = cabinet.isEmptyOrigin;
                cabinet.isChanged = false;
                cabinet.homeCabinet = cabinet.originHomeCabinet;
            });
        }
    }
    sendMessage(tittle: string, msg: string) {
        this._msgSrv.addNewMessage({
            type: 'warning',
            title: tittle,
            msg: msg,
            dismissOnTimeout: 1000000
        });
    }
    private _pushState () {
        this._userServices.setChangeState({isChange: !this.btnDisabled});
    }
}
