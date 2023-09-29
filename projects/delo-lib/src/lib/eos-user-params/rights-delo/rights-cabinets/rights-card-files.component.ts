import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, RouterStateSnapshot} from '@angular/router';
import { PipRX } from '../../../eos-rest';
import { RigthsCabinetsServices } from '../../../eos-user-params/shared/services/rigths-cabinets.services';
import { UserParamsService } from '../../shared/services/user-params.service';
import { USERCARD } from '../../../eos-rest/interfaces/structures';
import { CardsClass, Cabinets, /* Cabinets */ } from '../rights-cabinets/helpers/cards-class';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { OPEN_CLASSIF_CARDINDEX } from '../../../app/consts/query-classif.consts';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { AppContext } from '../../../eos-rest/services/appContext.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ECellToAll, ITableBtn, ITableData, ITableHeader, ITableSettings } from '../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { TABLE_HEADER_BTN_TABEL, TABLE_HEADER_BTN_TABEL_SECOND, TABLE_HEADER_CARD } from './right-card-files.const';
import { ConfirmWindowService, IOrderTable } from '../../../eos-common/index';
import { CONFIRM_MAIN_CABINET_IN_CARTOTEK } from '../../../eos-dictionaries/consts/confirm.consts';
import { NavParamService } from '../../../app/services/nav-param.service';

@Component({
    selector: 'eos-card-files',
    templateUrl: 'rights-card-files.component.html',
    providers: [RigthsCabinetsServices]
})

export class RightsCardFilesComponent implements OnInit, OnDestroy {
    @ViewChild('firstTable', { static: false }) firstTable;
    public isLoading = true;
    public flagChangeCards: boolean;
    public mainArrayCards = [];
    public currentCard: CardsClass;
    public flagEdit: boolean = false;
    public flagBacground: boolean = false;
    public loadCabinets: boolean = false;
    public closeAcordFirst = false;
    public closeAcordSecond = false;
    public arrayBtn: ITableBtn[] = [...TABLE_HEADER_BTN_TABEL];
    public arrayBtnSecond: ITableBtn[] = [...TABLE_HEADER_BTN_TABEL_SECOND];
    public extWindow = false;
    public isWide;
    get titleHeader() {
        if (this._userSrv.curentUser) {
            if (this._userSrv.curentUser.isTechUser) {
                return this._userSrv.curentUser.CLASSIF_NAME + '- Картотеки и Кабинеты'; /*  */
            }
            return `${this._userSrv.curentUser['DUE_DEP_SURNAME']} - Картотеки и Кабинеты`;
        }
        return '';
    }
    private flagGrifs: boolean;
    private userId: number;
    private _ngUnsubscribe: Subject<any> = new Subject();
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: [...TABLE_HEADER_CARD],
        data: []
    };
    public settingsTable: ITableSettings = {
        hiddenCheckBox: true,
        maxHeightTable: '200px',
        selectedRow: true,
        count: true
    }
    // private indexDeleted: Array<number> = [];
    constructor(
        private _rightsCabinetsSrv: RigthsCabinetsServices,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _whaitSrv: WaitClassifService,
        private _msgSrv: EosMessageService,
        private _pipSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _appContext: AppContext,
        private _userParamsSetSrv: UserParamsService,
        private _confirmSrv: ConfirmWindowService,
        private _navSrv: NavParamService,
    ) { }
     // чтобы подписка происходила только 1 перенёс основной код из ngOnInit
     ngOnInit() {
        this.updateInit();
        this._userParamsSetSrv.canDeactivateSubmit$
        .pipe(
            takeUntil(this._ngUnsubscribe)
            )
        .subscribe((rout: RouterStateSnapshot) => {
            this._userParamsSetSrv.submitSave = this.preSubmit(true);
        });
        this._navSrv.StateSandwich$
        .pipe(
            takeUntil(this._ngUnsubscribe)
            )
        .subscribe((state: boolean) => {
            this.isWide = state;
        });
        this.updateBtn();
    }
    getDefaultBtn() {
        return true;
    }
    extensionWindow(exten) {
        this.extWindow = exten;
    }
    updateInit () {
        this._userSrv.getUserIsn({
            expand: 'USER_PARMS_List,USERCARD_List'
        })
        .then(() => {
            this.flagChangeCards = true;
            this.userId = this._userSrv.userContextId;
            this._userSrv.checkGrifs(this.userId).then(elem => {
                this.flagGrifs = elem;
                this.init();
            });
        })
        .catch(e => {
            this.cancel(null);
            this._errorSrv.errorHandler(e);
        });
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    checkGlobalChanges() {
        if (this.flagEdit) {
            let change = false;
            this.mainArrayCards.forEach(el => {
                if (el.origin !== null && el.data.HOME_CARD !== el.origin.HOME_CARD
                    || el.deleted
                    || el.origin === null) {
                    change = true;
                    return;
                }
                el.cabinets.forEach(cab => {
                    cab.change();
                    if (cab.isChanged) {
                        change = true;
                        return;
                    }
                });
            });
            this._userParamsSetSrv.setChangeState({ isChange: change });
            this.updateFirstTable();
            const sorterColomn = this.getHowSortedColomn();
            this.orderHead(sorterColomn);
        }
    }

    init(): Promise<any> {
        this.isLoading = true;
        return this._rightsCabinetsSrv.getUserCard(this._userSrv.curentUser.USERCARD_List, this.userId).then( async (user_cards: USERCARD[]) => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
            this.updateFirstTable();
            const sorterColomn = this.getHowSortedColomn();
            this.orderHead(sorterColomn);
            const curent = this.tabelData.data.filter((item) => this.currentCard && item['key'] === this.currentCard['key']);
            this.currentCard = null;
            this.isLoading = false;
            if (this.tabelData.data.length) {
                const Home = this.tabelData.data.filter((item) => item['data']['HOME_CARD'] === 1);
                if (Home[0]) {
                    await this.selectCurentCard(Home[0]);
                }
                if (curent[0] && curent[0]['key'] !== Home[0]['key']) {
                    await this.selectCurentCard(curent[0]);
                } else if(Home[0]['key'] !== this.tabelData.data[0]['key']) {
                    await this.selectCurentCard(this.tabelData.data[0]);
                }
            }
            this.isLoading = false;
            if (this.firstTable) {
                this.firstTable.selectIdLast = this.currentCard['key'];
                this.firstTable.scrollToRow(this.currentCard['key']);
            }
        }).catch(e => {
            this.isLoading = false;
            this._errorSrv.errorHandler(e);
            //   this.sendMessage('Предупреждение', 'Ошибка соединения');
        });
    }
    getHowSortedColomn(): ITableHeader {
        let sorterColomn: ITableHeader; 
        this.tabelData.tableHeader.forEach((item) => {
            if (item.order === 'asc' || item.order === 'desc') {
                sorterColomn = item;
            }
        });
        return sorterColomn;
    }
    btnAction($event) {
        switch ($event) {
            case 'add':
                this.addCards();
                break; 
            case 'main':
                this.homeCardMoov();
                break;
            case 'deleted':
                this.removeCards();
                break;
            default:
                break;
        }
    }
    btnActionSecond($event) {
        switch ($event) {
            case 'add':
                this.addCards();
                break; 
            case 'main':
                this.homeCardMoov();
                break;
            case 'deleted':
                this.removeCards();
                break;
            default:
                break;
        }
    }
    updateFirstTable() {
        this.mainArrayCards.forEach((card) => {
            card['key'] = card['data']['DUE'];
            if (card['data']['HOME_CARD'] === 1) {
                card['Icons'] = {type: ECellToAll.icon, info: [{class: 'eos-adm-icon-keyfile-grey', tooltip: 'Главная картотека'}]};
            } else {
                card['Icons'] = undefined;
            }
        });
        this.tabelData.data = this.mainArrayCards.filter((item) => {return !item.deleted});
    }
    orderHead($event: IOrderTable) {
        this.tabelData.data = this.tabelData.data.sort((a, b) => {
            let first;
            let second;
            if ($event['id'] === 'Icons') {
                first = a[$event.id] ? 1 : 0;
                second = b[$event.id] ? 1 : 0;
            } else {
                first = a[$event.id];
                second = b[$event.id];
            }
            if (first > second) {
                return $event.order === 'desc' ? -1 : 1;
            } else if (first < second) {
                return $event.order === 'desc' ? 1 : -1;
            } else {
                return 0;
            }
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
            if (this._appContext.limitCardsUser.length > 0) {
                dueCards = this.prepareLimitCards(dueCards);
            }
            this.flagBacground = false;
            this.prepareWarnindMessage(dueCards).then(() => {
                this.selectFromAddedCards();
                this.checkGlobalChanges();
            }).catch(error => {
                this.sendMessage('Предупреждение', 'Потеряно соединение с сервером ');
            });
        }).catch(error => {
            this.flagBacground = false;
        });
    }
    prepareLimitCards(dueCard: string) {
        const answer = [];
        dueCard.split('|').forEach(elem => {
            if (this._appContext.limitCardsUser.indexOf(elem) !== -1) {
                answer.push(elem);
            } else {
                this.sendMessage('Предупреждение', 'Не были добавлены данные, не принадлежащие вашей картотеке');
            }
        });
        return answer.join('|');
    }

    prepareWarnindMessage(dueCards: string): Promise<any> {
        if (!this.mainArrayCards.length && dueCards.trim().length) {
            return this.getInfoForNewCards(dueCards.split('|')).then(() => {
                if (this.mainArrayCards.length) {
                    this.mainArrayCards[0].data.HOME_CARD = 1;
                }
                return;
            });
        } else {
            const transformString = dueCards.length ? dueCards.split('|') : [];
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
                    if (newCard === oldCard.data.DUE) {
                        if (oldCard.deleted) {
                            oldCard.deleted = false;
                        } else {
                            stringMatches += oldCard.cardName + ',\n ';
                        }
                    }
                    return newCard !== oldCard.data.DUE;
                });
            });
            if (stringMatches.length) {
                this.showWarnMessage(stringMatches);
            }
            if (newCardDue.length) {
                return this.getInfoForNewCards(newCardDue);
            }
            return Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }
    showWarnMessage(stringMatches: string) {
        const msg = 'Выбранные картотеки: ' + stringMatches + 'уже существуют и не могут быть добавлены снова!';
        this.sendMessage('Предупреждение', msg);
    }

    getInfoForNewCards(newCard: Array<string>): Promise<any> {
        const userCard = this._rightsCabinetsSrv.createUSERCARDArray(newCard);
        return this._rightsCabinetsSrv.getUserCard(userCard, this.userId, true).then(res => {
            this.mainArrayCards = this._rightsCabinetsSrv.cardsArray;
        });
    }

    async selectCurentCard(card: CardsClass) {
        if (!card.cabinets.length) {
            this.loadCabinets = true;
            await this._rightsCabinetsSrv.getCabinets(card.data.DUE, card.data.ISN_LCLASSIF).then(infoCabinets => {
                if (infoCabinets) {
                    card.createCabinets(infoCabinets);
                }
                if (this.currentCard) {
                    this.currentCard.current = false;
                }
                this.currentCard = card;
                this.currentCard.current = true;
                this.loadCabinets = false;
                if (this.firstTable) {
                    this.firstTable.selectIdLast = card['key'];
                }
                this._rightsCabinetsSrv.changeCabinets.next(this.currentCard);
            });
        } else {
            if (this.currentCard) {
                this.currentCard.current = false;
            }
            this.currentCard = card;
            this.currentCard.current = true;
            this._rightsCabinetsSrv.changeCabinets.next(this.currentCard);
            if (this.firstTable) {
                this.firstTable.selectIdLast = card['key']; 
            }
        }
        this.updateBtn();
    }
    removeCards() {
        if (!this.currentCard || !this.currentCard.data.HOME_CARD) {
            this.currentCard.deleted = true;
            this.currentCard.current = false;
            if (!this.currentCard.origin) {
                this.deleteNewCard();
            }
            const upCurrCard = this.mainArrayCards.filter((card: CardsClass) => {
                return !card.deleted;
            });
            if (upCurrCard.length) {
                this.selectCurentCard(upCurrCard[0]);
            } else {
                this.currentCard = null;
            }
        } else {
            this.sendMessage('Предупреждение', 'Нельзя удалить главную картотеку');
        }
        this.checkGlobalChanges();
    }

    deleteNewCard() {
        this.mainArrayCards = this.mainArrayCards.filter((card: CardsClass) => {
            return this.currentCard && card.data.DUE !== this.currentCard.data.DUE;
        });
        this._rightsCabinetsSrv.cardsArray = this._rightsCabinetsSrv.cardsArray.filter((card: CardsClass) => {
            return this.currentCard && card.data.DUE !== this.currentCard.data.DUE;
        });
    }
    preSubmit(event) {
        let flag = false;
        this.mainArrayCards.forEach((card) => {
            if (card['data']['HOME_CARD'] === 1) {
                flag = true;
                card['cabinets'].forEach((cab) => {
                    if (cab['data']['HOME_CABINET']) {
                        flag = false;
                    }
                });
            }
        });
        if (flag) {
            return this._confirmSrv.confirm2(CONFIRM_MAIN_CABINET_IN_CARTOTEK)
            .then((button) => {
                if (button && button['result'] === 1) {
                    return this.submit(event);
                } else {
                    return Promise.resolve('error');
                }
            })
            .catch((error) => {
                console.log('error', error);
            });
        } else {
            return this.submit(event);
        }
    }
    /*
    * если сохраняем через кнопку то в event лежит false если при переходе то true
    */
    submit(event): Promise<any> {
        this.isLoading = true;
        const changes = [];
        const mergechange = [];
        this.mainArrayCards.forEach((card: CardsClass) => {
            if (card.deleted) {
                this.queryDelete(card, changes);
            }
            if (!card.origin) {
                this.queryPost(card, changes, mergechange);
            }
            if (!card.deleted && card.origin) {
                this.queryMerge(card, changes);
            }
        });
        if (changes.length) {
            return this._pipSrv.batch(changes, '').then(data => {
                this._userSrv.ProtocolService(this.userId, 5);
                this._msgSrv.addNewMessage({
                    type: 'success',
                    title: 'Изменения сохранены',
                    msg: '',
                    dismissOnTimeout: 6000
                });
                /* В случае если были добавлены новые картотеки то необходимо изменить записи после их создания*/
                if (mergechange.length) {
                    return this._pipSrv.batch(mergechange, '').then(() => {
                        this.cancel(event);
                        this._userParamsSetSrv.setChangeState({ isChange: false });
                        this.isLoading = false;
                    });
                } else {
                    this.cancel(event);
                    this._userParamsSetSrv.setChangeState({ isChange: false });
                    this.isLoading = false;
                }
            }).catch(e => {
                this.cancel(event);
                this._errorSrv.errorHandler(e);
                this.isLoading = false;
            });
        } else {
            this.cancel(event);
            this.isLoading = false;
            return Promise.resolve(true);
        }
    }
    queryDelete(card: CardsClass, changes: Array<any>): void {
        changes.push({
            method: 'DELETE',
            requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${card.data.DUE}\')`
        });
        if (card.cabinets.length) {
            card.cabinets.forEach((cab: Cabinets) => {
                if (cab.origin) {
                    changes.push(
                        {
                            method: 'DELETE',
                            requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cab.parent.data.DUE}\')/USER_CABINET_List(\'${cab.data.ISN_CABINET} ${this.userId}\')`,
                        }
                    );
                }
            });
        }
    }
    queryPost(card: CardsClass, changes: Array<any>, merge?: Array<any>) {
        changes.push({
            method: 'POST',
            requestUri: `USER_CL(${this.userId})/USERCARD_List`,
            data: {
                ISN_LCLASSIF: `${this.userId}`,
                DUE: `${card.data.DUE}`,
                HOME_CARD: `${card.data.HOME_CARD}`,
                FUNCLIST: '010000000000010010000'
            }
        });
        /*изменяем "Права в картотеках" -> "Читать файлы" разрешение на всё */
        merge.push({
            method: 'MERGE',
            requestUri: `USER_CL(${this.userId})/USERCARD_List('${this.userId} ${card.data.DUE}')/USER_CARD_DOCGROUP_List('${this.userId} ${card.data.DUE} 0. 14')`,
            data: {
                ALLOWED: 1,
            }
        });
        card.cabinets.forEach((cab: Cabinets) => {
            const folders = cab.data.FOLDERS_AVAILABLE;
            if (folders.length) {
                if (cab.origin) {
                    this._msgSrv.addNewMessage({ type: 'warning', msg: 'Для новой картотеки уже были кабинеты', title: 'Предупреждение' });
                } else {
                    changes.push(this.queryPostCabinets(cab));
                }
            }
        });
    }
    queryMerge(card: CardsClass, changes: Array<any>) {
        if (card.data.HOME_CARD !== card.origin.HOME_CARD) {
            changes.push({
                method: 'MERGE',
                requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${card.data.DUE}\')`,
                data: {
                    HOME_CARD: `${card.data.HOME_CARD}`
                }
            });
        }
        card.cabinets.forEach((cab: Cabinets) => {
            const folders = cab.data.FOLDERS_AVAILABLE;
            if (folders.length && cab.origin) {
                if (this.checkChanges(cab)) {
                    changes.push({
                        method: 'MERGE',
                        requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cab.parent.data.DUE}\')/USER_CABINET_List(\'${cab.data.ISN_CABINET} ${this.userId}\')`,
                        data: {
                            FOLDERS_AVAILABLE: cab.data.FOLDERS_AVAILABLE,
                            HOME_CABINET: `${cab.data.HOME_CABINET}`,
                            HIDE_INACCESSIBLE: `${cab.data.HIDE_INACCESSIBLE}`,
                            HIDE_INACCESSIBLE_PRJ: `${cab.data.HIDE_INACCESSIBLE_PRJ}`,
                        }
                    });
                }
                // merge
            } else if (!folders.length && cab.origin) {
                changes.push({
                    method: 'DELETE',
                    requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cab.parent.data.DUE}\')/USER_CABINET_List(\'${cab.data.ISN_CABINET} ${this.userId}\')`,
                });
            } else if (!folders.length && !cab.origin) {
                // not
            } else {
                changes.push(this.queryPostCabinets(cab));
            }
        });
    }
    checkChanges(cab: Cabinets): boolean {
        if (cab.data.FOLDERS_AVAILABLE !== cab.origin.FOLDERS_AVAILABLE
            || cab.data.HIDE_INACCESSIBLE !== cab.origin.HIDE_INACCESSIBLE
            || cab.data.HIDE_INACCESSIBLE_PRJ !== cab.origin.HIDE_INACCESSIBLE_PRJ
            || cab.data.HOME_CABINET !== cab.origin.HOME_CABINET) {
            return true;
        } else {
            return false;
        }
    }

    queryPostCabinets(cab) {
        return {
            method: 'POST',
            requestUri: `USER_CL(${this.userId})/USERCARD_List(\'${this.userId} ${cab.parent.data.DUE}\')/USER_CABINET_List`,
            data: {
                ISN_CABINET: cab.data.ISN_CABINET,
                ISN_LCLASSIF: cab.data.ISN_LCLASSIF,
                FOLDERS_AVAILABLE: cab.data.FOLDERS_AVAILABLE,
                ORDER_WORK: null,
                HOME_CABINET: `${cab.data.HOME_CABINET}`,
                HIDE_INACCESSIBLE: `${cab.data.HIDE_INACCESSIBLE}`,
                HIDE_INACCESSIBLE_PRJ: `${cab.data.HIDE_INACCESSIBLE_PRJ}`,
            }
        };
    }

    homeCardMoov(): void {
        if (this.currentCard) {
            this.findHomeCard();
            this.currentCard.data.HOME_CARD = 1;
            this.checkGlobalChanges(); // обновить состояние при назначении новой главной картотеки
        }
    }
    findHomeCard(): void {
        this.mainArrayCards.forEach((card: CardsClass) => {
            if (card.data.HOME_CARD) {
                card.data.HOME_CARD = 0;
            }
        });
    }

    edit(event) {
        if (this.flagGrifs) {
            this.flagEdit = event;
            this.updateBtn();
        } else {
            this._router.navigate(['user-params-set/', 'access-limitation'],
                {
                    queryParams: { isn_cl: this.userId, flag: 'grif' }
                });
            this.sendMessage('Предупреждение', 'Не заданы грифы доступа');
        }
    }
    cancel(event) {
        this.flagEdit = false;
        this.mainArrayCards.length = 0;
        this._rightsCabinetsSrv.cardsArray.length = 0;
        this._userParamsSetSrv.setChangeState({ isChange: false });
        if (!event) { // если event === true то не нужно загружать данные снова так сохранение идёт перед переходом
            this.updateInit();
        }
        this.updateBtn();
    }
    sendMessage(tittle: string, msg: string) {
        this._msgSrv.addNewMessage({
            type: 'warning',
            title: tittle,
            msg: msg,
        });
    }
    openAccordion(flagOpen: number) {
        switch (flagOpen) {
          case 1:
            this.closeAcordFirst = !this.closeAcordFirst;
            break;
          case 2:
            this.closeAcordSecond = !this.closeAcordSecond;
            break;
        }
    }
    updateBtn() {
        this.arrayBtn.forEach((btn) => {
            switch (btn.id) {
                case 'add':
                    btn.disable = !this.flagEdit;
                    break;
                case 'main':
                    btn.disable = !this.currentCard || !this.flagEdit || !this.currentCard?.allowed;
                    break;
                case 'deleted':
                    btn.disable = !this.currentCard || !this.flagEdit || !this.currentCard?.allowed;
                    break;
            }
        });
    }
}
