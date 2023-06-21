import { Component, OnDestroy, OnInit, DoCheck, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot, Router, Params } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from '../app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList, IUserSettingsModes } from './shared/intrfaces/user-params.interfaces';
import { IUserSetChanges } from './shared/intrfaces/user-parm.intterfaces';
import { EosStorageService } from '../app/services/eos-storage.service';
import { AppContext } from '../eos-rest/services/appContext.service';
import { PipRX, ICancelFormChangesEvent } from '../eos-rest';
import { ErrorHelperServices } from './shared/services/helper-error.services';
import { MESSAGE_SAVE_ON_LEAVE } from '../eos-dictionaries/consts/confirm.consts';
import { REGISTRATION_DOP_OPERATION, REGISTRATION_ADDRESSES, REGISTRATION_AUTO_SEARCH, REGISTRATION_RC } from './user-params-set/shared-user-param/consts/remaster-email/remaster-email.const';
import { CABINETS_USER_FOLDERS, CABINETS_USER_ASSIGMENTS } from '../eos-user-params/user-params-set/shared-user-param/consts/cabinets.consts';
import { RC_USER } from '../eos-user-params/user-params-set/shared-user-param/consts/rc.consts';
import { DIRECTORIES_USER} from '../eos-user-params/user-params-set/shared-user-param/consts/directories.consts';
import { REGISTRATION_SCAN } from './user-params-set/shared-user-param/consts/remaster-email/remaster-email.const';
import { REGISTRATION_SEB } from './user-params-set/shared-user-param/consts/remaster-email/remaster-email-seb.const';
import { REMASTER_MADO } from './user-params-set/shared-user-param/consts/remaster-email/remaster-email-mado.const';
import { ELECTRONIC_SIGNATURE } from '../eos-user-params/user-params-set/shared-user-param/consts/electronic-signature';
import { VISUALIZATION_USER } from '../eos-user-params/user-params-set/shared-user-param/consts/visualization.consts';
import { OTHER_USER_REESTR } from '../eos-user-params/user-params-set/shared-user-param/consts/other.consts';
import {
    CERTS, APP_DOCUMENTS_EXT, APP_DOCUMENTS_SEARCH, TRANSFER_ADDRESSES, TRANSFER_DOC,
    EXT_EXCHANGE_GENERAL, EXT_EXCHANGE_PASSPORT, EXT_EXCHANGE_SENDING, EXT_EXCHANGE_PARAMS,
} from '../eos-user-params/user-params-set/shared-user-param/consts/search.consts';
import { UserParamExtendExchComponent } from '../eos-user-params/user-params-set/user-param-ext-exch/user-param-ext-exch.component';
import { SearchService } from './user-params-set/shared-user-param/services/search-service';
import { EosSandwichService } from '../eos-dictionaries/services/eos-sandwich.service';
import { ExetentionsRigthsServiceLib } from '../eos-rest/addons/extentionsRigts.service';

const REGISTRATION_DOP_OPERATION_FIELDS = REGISTRATION_DOP_OPERATION.fields;
const REGISTRATION_ADDRESSES_FIELDS = REGISTRATION_ADDRESSES.fields;
const REGISTRATION_AUTO_SEARCH_FIELDS = REGISTRATION_AUTO_SEARCH.fields;
const REGISTRATION_RC_FIELDS = REGISTRATION_RC.fields;
const CABINETS_USER_FOLDERS_FIELDS = CABINETS_USER_FOLDERS.fields;
const CABINETS_USER_ASSIGMENTS_FIELDS = CABINETS_USER_ASSIGMENTS.fields;
const RC_USER_FIELDS = RC_USER.fields;
const DIRECTORIES_USER_FIELDS = DIRECTORIES_USER.fields;
const REGISTRATION_SEB_FIELDS = REGISTRATION_SEB.fields;
const ELECTRONIC_SIGNATURE_FIELDS = ELECTRONIC_SIGNATURE;
const CERTS_FIELDS = CERTS;
const REMASTER_MADO_FIELDS = REMASTER_MADO.fields;
const VISUALIZATION_USER_FIELDS = VISUALIZATION_USER.fields;
const OTHER_USER_REESTR_FIELDS = OTHER_USER_REESTR.fields;
const OTHER_USER_DISPATCH_FIELDS = OTHER_USER_REESTR.fields;
const REGISTRATION_SCAN_FIELDS = REGISTRATION_SCAN.fields;

const SELECTION_OPEN_TAG = '<span style="background-color:yellow; vertical-align:inherit">';
const SELECTION_CLOSE_TAG = '</span>';
@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})
export class UserParamsComponent implements OnDestroy, OnInit, DoCheck {
    @ViewChild('emailChenge', { static: false }) emailChenge;
    @ViewChild(UserParamExtendExchComponent) allPanels: UserParamExtendExchComponent;

    email = '';
    accordionList: IParamAccordionList[] = JSON.parse(JSON.stringify(USER_PARAMS_LIST_NAV));
    isShowAccordion: boolean;
    isShowRightAccordion: boolean = true;
    isLoading: boolean;
    isNewUser: boolean = false;
    pageId: string;
    codeList: any[];
    closeRight: boolean = false;
    flagEdit: boolean;
    hideIcon: boolean;
    public appMode: IUserSettingsModes = {
        tk: true,
    };
    public openingOptionalTab: number = 0;
    public editingUserIsn;

    // поиск по лексеме в параметрах юзера
    kindRightPanel: string = 'SEARCH_PARAMS';
    searchLexem: string = '';
    foundSectionList: any[] = [];
    searchLabel: string = '';
    private _isSelectionSearchMode: boolean = false;
    private _bubbleSearchNames: string[] = [];
    private _searchSelectedNodes: Map<string, string> = new Map();

    private ngUnsubscribe: Subject<any> = new Subject();
    private _isChanged: boolean;
    //   private _disableSave: boolean;

    constructor(
        private _navSrv: NavParamService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService,
        //    private _confirmSrv: ConfirmWindowService,
        private _storageSrv: EosStorageService,
        private _appContext: AppContext,
        private _apiSrv: PipRX,
        private _errorSrv: ErrorHelperServices,
        private _sandwichService: EosSandwichService,
        private _searchService: SearchService,
        private _exetentionsRigts: ExetentionsRigthsServiceLib, 
    ) {
        this._route.params
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((param: Params) => {
                this.checkAdmin();
                this.pageId = param['field-id'];
                this.codeList = undefined;
                this.flagEdit = false;
                let flagRedirect = false;
                this.accordionList[2].subList.forEach((item) => {
                    if (item['url'] === 'inline-scanning' && item.disabled) {
                        flagRedirect = true;
                    }
                });
                if (flagRedirect && this.pageId === 'inline-scaning') {
                    this._router.navigate(['/user-params-set', 'registration']);
                }
                const IS_SEARCH_PANEL = this._navSrv.searchPages.includes(this.pageId);
                this.kindRightPanel = IS_SEARCH_PANEL ? 'SEARCH_PARAMS' : '';
                this._sandwichService.changeSearchMode(IS_SEARCH_PANEL);
            });
        this._route.queryParams
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((qParams: Params) => {
                // this.isLoading = true;
                if (!this._checkUserIsn(qParams)) {
                    return;
                }
                if (qParams['isn_cl']) {
                    this._storageSrv.setItem('userEditableId', qParams['isn_cl'], true);
                }
                if (!this.appMode.hasMode && qParams.mode) {
                    this.appMode = {};
                    switch (qParams.mode) {
                        case 'ARM': {
                            this.appMode.arm = true;
                            break;
                        }
                        case 'TK': {
                            this.appMode.tk = true;
                            break;
                        }
                        case 'TK_DOC': {
                            this.appMode.tkDoc = true;
                            break;
                        }
                        case 'ARMCBR': {
                            this.appMode.cbr = true;
                            break;
                        }
                        default:
                            this.appMode.tk = true;
                            break;
                    }
                    this.appMode.hasMode = true;
                }
                this._checkTabExistance(qParams);
                this.openingOptionalTab = 0;
                if (qParams.tab) {
                    const tabString = String(qParams.tab);
                    if (tabString.length >= 2) {
                        this.openingOptionalTab = tabString.length > 2 ? Number(tabString.substring(2)) : Number(tabString.substring(1));
                    }
                }
                this.isShowAccordion = true;
            });

        this._userParamService.updateUser$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.checkTabScan();
            });

        this._userParamService.hasChanges$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(({ isChange, disableSave }: IUserSetChanges) => {
                this._isChanged = isChange;
                //    this._disableSave = disableSave;
            });

        this._navSrv.StateSandwich$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isShowAccordion = state;
            });
        this._navSrv.StateSandwichRight$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.isShowRightAccordion = state;
                this.closeRight = this.isShowRightAccordion;
            });
        this._navSrv.StateScanDelo
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: boolean) => {
                this.setTabsSCan(state);
            });

        this._apiSrv.cancelFormChanges$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((event: ICancelFormChangesEvent) => {
                this._isChanged = event.isChanged;
                this._errorSrv.errorHandler(event.error);
            });

    }

    ngOnInit() {
        this._exetentionsRigts.updateRigthTabs(); // обновление параметров
        this._openAccordion(this.accordionList);
        if (document.documentElement.clientWidth < 1050) {
            this._navSrv.changeStateSandwich(false);
        }
        this._navSrv.blockChangeStateRightSandwich(false);
    }

    ngDoCheck() {
        if (this._isSelectionSearchMode) {
            this._performSearchSelection();
        } else {
            this._performClearSearchSelection();
        }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        localStorage.removeItem('lastNodeDue');
    }

    myFuntion(event) {
        if (this.emailChenge.umailsInfo[this.emailChenge.currentIndex]) {
            this.email = this.emailChenge.umailsInfo[this.emailChenge.currentIndex].EMAIL;
        } else {
            this.email = '';
        }
        if (!this.codeList || this.codeList.length === 0) {
            this.closeRight = true;
        }
        const heightWithoutScrollbar = document.documentElement.clientWidth;
        this.codeList = event;

        this.kindRightPanel = 'EMAIL';
        this._navSrv.showRightSandwich(true);
        if (this.closeRight && heightWithoutScrollbar > 1440) {
            this._navSrv.changeStateRightSandwich(true);
        }

        if (this.codeList.length > 0) {
            this.kindRightPanel = 'EMAIL';
        } else {
            this.kindRightPanel = 'SEARCH_PARAMS';
        }
    }

    redactEmailAddres($event) {
        /* this._navSrv.changeStateRightSandwich(true); */
        this.flagEdit = $event;
        if (!this.codeList || this.codeList.length === 0) {
            this._navSrv.changeStateRightSandwich(false);
        }
        this._navSrv.blockChangeStateRightSandwich(this.flagEdit);
    }

    @HostListener('window:beforeunload', ['$event'])
    canWndUnload(evt: BeforeUnloadEvent): any {
        if (this._isChanged) {
            evt.preventDefault();
            evt.stopPropagation();

            evt.returnValue = MESSAGE_SAVE_ON_LEAVE;
            return MESSAGE_SAVE_ON_LEAVE;
        }
    }

    canDeactivate(nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            if (confirm('На текущей вкладке есть несохраненные изменения. Сохранить их и продолжить?')) {
                this._userParamService.setCanDeactivateSubmit(nextState);
                return this._userParamService.submitSave
                    .then((ans) => {
                        if (ans === 'error') {
                            return false;
                        } else {
                            this._isChanged = false;
                            return true;
                        }
                    }).catch((error) => {
                        console.log(error);
                        return false;
                    });
            } else {
                return Promise.resolve(false);
            }
        } else {
            return Promise.resolve(true);
        }
    }

    getFoundTabInRegistration(): number {
        let ret = -1;
        if (this._foundLexemInFields(REGISTRATION_DOP_OPERATION_FIELDS)) {
            ret = 1;
            return ret;
        }
        if (this._foundLexemInFields(REGISTRATION_ADDRESSES_FIELDS)) {
            ret = 2;
            return ret;
        }
        if (this._foundLexemInFields(REGISTRATION_SCAN_FIELDS)) {
            ret = 3;
            return ret;
        }
        if (this._foundLexemInFields(REGISTRATION_AUTO_SEARCH_FIELDS)) {
            ret = 4;
            return ret;
        }
        if (this._foundLexemInFields(REGISTRATION_RC_FIELDS)) {
            ret = 5;
            return ret;
        }
    }

    getFoundTabInCabs(): number {
        let ret = -1;
        if (this._foundLexemInFields(CABINETS_USER_FOLDERS_FIELDS)) {
            ret = 1;
            return ret;
        }
        if (this._foundLexemInFields(CABINETS_USER_ASSIGMENTS_FIELDS)) {
            ret = 2;
            return ret;
        }
    }

    getFoundInRcUser(): number {
        let ret = -1;
        if (this._foundLexemInFields(RC_USER_FIELDS)) {
            ret = 0;
        }
        return ret;
    }

    getFoundInDirectories(): number {
        let ret = -1;
        if (this._foundLexemInFields(DIRECTORIES_USER_FIELDS)) {
            ret = 0;
        }
        return ret;
    }

    getFoundTabInRemaster(): number {
        let ret = -1;
        if (this._foundLexemInFields(EXT_EXCHANGE_GENERAL)) {
            ret = 11;
            return ret;
        }
        if (this._foundLexemInFields(EXT_EXCHANGE_PASSPORT)) {
            ret = 12;
            return ret;
        }
        if (this._foundLexemInFields(EXT_EXCHANGE_SENDING)) {
            ret = 13;
            return ret;
        }
        if (this._foundLexemInFields(EXT_EXCHANGE_PARAMS)) {
            ret = 14;
            return ret;
        }

        if (this._foundLexemInFields(REGISTRATION_SEB_FIELDS)) {
            ret = 2;
            return ret;
        }
        if (this._foundLexemInFields(REMASTER_MADO_FIELDS)) {
            ret = 3;
            return ret;
        }
    }

    getFoundInElectronicSignature(): number {
        let ret = -1;
        if (this._foundLexemInFields(ELECTRONIC_SIGNATURE_FIELDS)) {
            ret = 0;
        }
        return ret;
    }

    getFoundInCerts(): number {
        let ret = -1;
        if (this._foundLexemInFields(CERTS_FIELDS)) {
            ret = 0;
        }
        return ret;
    }

    getFoundInVisualization(): number {
        let ret = -1;
        if (this._foundLexemInFields(VISUALIZATION_USER_FIELDS)) {
            ret = 0;
        }
        return ret;
    }

    getFoundInExtAppUser(): number { // разложить по вкладкам
        let ret = -1;
        if (this._foundLexemInFields(APP_DOCUMENTS_EXT)) {
            ret = 1;
            return ret;
        }
        if (this._foundLexemInFields(APP_DOCUMENTS_SEARCH)) {
            ret = 2;
            return ret;
        }
    }

    getFoundTabInOtherUser(): number {
        let ret = -1;
        if (this._foundLexemInFields(TRANSFER_DOC)) {
            ret = 1;
            return ret;
        }
        if (this._foundLexemInFields(TRANSFER_ADDRESSES)) {
            ret = 2;
            return ret;

        }
        if (this._foundLexemInFields(OTHER_USER_REESTR_FIELDS)) {
            ret = 3;
            return ret;

        }
        if (this._foundLexemInFields(OTHER_USER_DISPATCH_FIELDS)) {
            ret = 4;
            return ret;
        }
    }

    searchSectionsByLexem() {
        this.foundSectionList = [];
        this._bubbleSearchNames = [];
        this._searchSelectedNodes.clear();
        let shifter: number = 0;
        shifter = this.getFoundTabInRegistration(); // регистрация = 5 вкладок
        if (shifter > 0) {
            this.foundSectionList.push({ label: 'Регистрация', link: 'registration', shifter });
        }
        shifter = this.getFoundTabInCabs(); // кабинеты = две вкладки
        if (shifter > 0) {
            this.foundSectionList.push({ label: 'Кабинеты', link: 'cabinets', shifter });
        }
        shifter = this.getFoundInRcUser(); // отображение РК
        if (shifter === 0) {
            this.foundSectionList.push({ label: 'Отображение РК', link: 'rc' });
        }
        shifter = this.getFoundInDirectories(); // справочники
        if (shifter === 0) {
            this.foundSectionList.push({ label: 'Справочники', link: 'dictionary' });
        }
        shifter = this.getFoundTabInRemaster(); // справочники = 3 вкладки - на первой вкладе 4 аккордеона =
        if (shifter > 0) { // аккордеоны на странице первой, надо обеспечить работу ...
            this.foundSectionList.push({ label: 'Внешний обмен', link: 'ext-exch', shifter });
        }
        shifter = this.getFoundInElectronicSignature(); // электронная подпись
        if (shifter === 0) {
            this.foundSectionList.push({ label: 'Электронная подпись', link: 'el-signature' });
        }
        shifter = this.getFoundInCerts(); // профиль сертификатов
        if (shifter === 0) {
            this.foundSectionList.push({ label: 'Профиль сертификатов', link: 'prof-sert' });
        }
        shifter = this.getFoundInVisualization(); // визуализация
        if (shifter === 0) {
            this.foundSectionList.push({ label: 'Визуализация', link: 'visualization' });
        }
        shifter = this.getFoundInExtAppUser(); // приложение Документы = две вкладки
        if (shifter > 0) {
            this.foundSectionList.push({ label: 'Приложение Документы', link: 'external-application', shifter });
        }
        shifter = this.getFoundTabInOtherUser(); // передача - 4 вкладки
        if (shifter > 0) {
            this.foundSectionList.push({ label: 'Передача', link: 'other' });

        }
        if (this.foundSectionList.length > 0) {
            this.searchLabel = 'Результаты поиска';
            this._isSelectionSearchMode = true;
            this._performSearchSelection();
        } else {
            this.searchLabel = 'Не найдено';
            this._isSelectionSearchMode = false;
            this._bubbleSearchNames = [];
        }
    }

    goSection(route: string, shifter?: number) {
        this._router.navigate(['/user-params-set', route]).then(resp => {
            if (shifter) {
                this.openingOptionalTab = shifter;
            }
            if (route === 'ext-exch') {
                if (shifter >= 11) {
                    this._searchService.emailExtChangeSubject.next(shifter - 11);
                }
            }
        }
        );
    }



    deleteSearchSections() {
        this.searchLexem = '';
        this.searchLabel = '';
        this.foundSectionList = [];
        this._isSelectionSearchMode = false;
        this._bubbleSearchNames = [];
        this._performClearSearchSelection();
    }

    private _performSearchSelection() {
        const allNodes = document.getElementsByTagName('*');
        const MAX: number = allNodes.length;
        for (let x: number = 0; x < MAX; x++) {
            {
                const NODE = allNodes[x];
                if (NODE.nodeName === 'LABEL' || NODE.nodeName === 'SPAN') {
                    if (this._bubbleSearchNames.some(item => NODE.innerHTML.toLowerCase().indexOf(item.toLowerCase()) >= 0)) { // в ноде DOM есть фраза из всплывших поисковых фраз
                        const PURE_HTML = NODE.innerHTML;
                        if (!this._searchSelectedNodes.has(PURE_HTML)) {
                            const START_POS = PURE_HTML.toLowerCase().indexOf(this.searchLexem.toLowerCase());
                            const STYLED_HTML = `${PURE_HTML.slice(0, START_POS)}${SELECTION_OPEN_TAG}${PURE_HTML.slice(START_POS, START_POS + this.searchLexem.length)}` +
                                `${SELECTION_CLOSE_TAG}${PURE_HTML.slice(START_POS + this.searchLexem.length)}`;
                            this._searchSelectedNodes.set(STYLED_HTML, PURE_HTML);
                            NODE.innerHTML = STYLED_HTML;
                        }
                    }
                }
            }
        }
    }

    private _performClearSearchSelection() {
        if (this._searchSelectedNodes.size > 0) {
            const allNodes = document.getElementsByTagName('*');
            const MAX: number = allNodes.length;
            for (let x: number = 0; x < MAX; x++) {
                const NODE = allNodes[x];
                if (NODE) {
                    if (NODE.nodeName === 'LABEL' || NODE.nodeName === 'SPAN') {
                        if (this._searchSelectedNodes.has(NODE.innerHTML)) {
                            NODE.innerHTML = this._searchSelectedNodes.get(NODE.innerHTML);
                        }
                    }
                }
            }
            this._searchSelectedNodes.clear();
        }
    }

    private _foundLexemInFields(fields: any[]): boolean { // поиск по массиву полей параметров совпадения с введенной лексемой
        const SEARCH_LEXEM = this.searchLexem.toLowerCase();
        return fields.some(item => {
            if (item.title) {
                if (item.title.length > 0) {
                    if (item.title.toLowerCase().indexOf(SEARCH_LEXEM) >= 0) {
                        this._bubbleSearchNames.push(item.title.toLowerCase());
                        return true;
                    }

                }
            }
            if (item.label) {
                if (item.label.length > 0) {
                    if (item.label.toLowerCase().indexOf(SEARCH_LEXEM) >= 0) {
                        this._bubbleSearchNames.push(item.label.toLowerCase());
                        return true;
                    }

                }
            }
            if (item.options) {
                const ITEMS = item.options.filter(x => x.title.toLowerCase().indexOf(SEARCH_LEXEM) >= 0);
                if (ITEMS.length > 0) {
                    this._bubbleSearchNames.push(ITEMS[0].title.toLowerCase());
                }

            }
        }
        );
    }

    private checkTabScan(): void {
        if (!this._userParamService.CanEdit) {
            this.accordionList[0].disabled = true;
            this.accordionList[1].subList[3].disabled = true;
            this.accordionList[2].disabled = true;
            this.accordionList[3].disabled = true;
            this.accordionList[4].disabled = true;
            this.accordionList[6].disabled = true;
            //    this.accordionList[1].isOpen = false;
            this.accordionList[2].isOpen = false;
            //    this.hideIcon = true;
        } else {
            if (this._userParamService.curentUser['ORACLE_ID'] === null && this._userParamService.curentUser['DELETED'] === 1) {
                this.accordionList[0].disabled = true;
                this.accordionList[1].disabled = true;
                this.accordionList[2].disabled = true;
                this.accordionList[3].disabled = true;
                this.accordionList[6].disabled = true;
                this.accordionList[1].isOpen = false;
                this.accordionList[2].isOpen = false;
                this.hideIcon = true;
            } else {
                this.accordionList[0].disabled = false;
                this.accordionList[1].disabled = false;
                this.accordionList[2].disabled = false;
                this.accordionList[3].disabled = false;
                this.accordionList[6].disabled = false;
                this.hideIcon = false;
            }
            if (this._userParamService.curentUser['ACCESS_SYSTEMS'][3] === '1') {
                this.accordionList[2].subList.forEach((item) => {
                    if (item['url'] === 'inline-scanning') {
                        item.disabled = false;
                    }
                });
            } else {
                this.accordionList[2].subList.forEach((item) => {
                    if (item['url'] === 'inline-scanning') {
                        item.disabled = true;
                    }
                });
            }
        }
        if (this._userParamService.curentUser === undefined) {
            if (this.pageId !== 'protocol') {
                this._router.navigateByUrl('user_param');
            }
        }
        // if (this._appContext.limitCardsUser.length > 0 && this._userParamService.curentUser !== undefined) {
        //     if (this.pageId !== 'protocol' && this._appContext.limitCardsUser.indexOf(this._userParamService.curentUser['DEPARTMENT_DUE']) === -1) {
        //         this._router.navigateByUrl('user_param');
        //     }
        // }
    }

    private setTabsSCan(flag: boolean): void {
        this.accordionList[4].disabled = flag;
    }

    private _openAccordion(list: IParamAccordionList[]) {
        list.forEach((item: IParamAccordionList) => {
            if (item.subList) {
                item.subList.forEach((i) => {
                    if (i.url === this.pageId) {
                        item.isOpen = true;
                        return;
                    }
                });
            }
            if (item.url === this.pageId) {
                item.isOpen = true;
                return;
            }
        });
    }
    private checkAdmin() {
        if (this._appContext.CurrentUser.IS_SECUR_ADM) {
            this._router.navigate(['user_param']);
        }
    }
    private _checkUserIsn(qParams: Params) {
        this.editingUserIsn = qParams.isn && Number(qParams.isn) ? Number(qParams.isn) : this.editingUserIsn;
        if (this.editingUserIsn && String(this.editingUserIsn) === '-99') {
            this._router.navigate(['/user_param', 'default-settings', `${this.pageId}`], { queryParams: { ...qParams } });
            return false;
        }
        return true;
    }
    private _checkTabExistance(qParams: Params) {
        if (this.appMode && this.appMode.arm) {
            const subLists = this.accordionList.find(list => list.url === 'param-set');
            if (subLists && subLists.subList) {
                subLists.subList = subLists.subList.filter((subItem) => subItem.url !== 'external-application' && subItem.url !== 'patterns');
            }

            if (this.pageId === 'external-application') {
                this._router.navigate(['/user-params-set', 'visualization'], { queryParams: { ...qParams } });
            } else if (this.pageId === 'patterns') {
                this._router.navigate(['/user-params-set', 'other'], { queryParams: { ...qParams } });
            }
        }
    }

}
