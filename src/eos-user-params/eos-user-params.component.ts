import { Component, OnDestroy, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from 'app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList, IUserSettingsModes } from './shared/intrfaces/user-params.interfaces';
// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { IUserSetChanges } from './shared/intrfaces/user-parm.intterfaces';
import { EosStorageService } from 'app/services/eos-storage.service';
import { AppContext } from 'eos-rest/services/appContext.service';
import { PipRX, ICancelFormChangesEvent } from 'eos-rest';
import { ErrorHelperServices } from './shared/services/helper-error.services';
import { MESSAGE_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';


@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})
export class UserParamsComponent implements OnDestroy, OnInit {
    @ViewChild('emailChenge') emailChenge;
    email = '';
    accordionList: IParamAccordionList[] = USER_PARAMS_LIST_NAV;
    isShowAccordion: boolean;
    isShowRightAccordion: boolean = false;
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
    ) {
        this._route.params
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(param => {
                this.checkAdmin();
                this.pageId = param['field-id'];
                this.codeList = undefined;
                this.flagEdit = false;
                if (this.accordionList[4].disabled === true && this.pageId === 'inline-scaning') {
                    this._router.navigate(['user_param']);
                }
                this._navSrv.showRightSandwich(false);
                this._navSrv.blockChangeStateRightSandwich(false);
            });
        this._route.queryParams
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(qParams => {
                // this.isLoading = true;
                if (qParams['isn_cl']) {
                    this._storageSrv.setItem('userEditableId', qParams['isn_cl'], true);
                }
                this.editingUserIsn = qParams.isn && Number(qParams.isn) ? Number(qParams.isn) : this.editingUserIsn;
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
        this._openAccordion(this.accordionList);
        if (document.documentElement.clientWidth < 1050) {
            this._navSrv.changeStateSandwich(false);
        }
        this._navSrv.blockChangeStateRightSandwich(false);
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        localStorage.removeItem('lastNodeDue');
    }
    myFuntion($event) {
        if (this.emailChenge.umailsInfo[this.emailChenge.currentIndex]) {
            this.email = this.emailChenge.umailsInfo[this.emailChenge.currentIndex].EMAIL;
        } else {
            this.email = '';
        }
        if (!this.codeList || this.codeList.length === 0) {
            this.closeRight = true;
        }
        const heightWithoutScrollbar = document.documentElement.clientWidth;
        this.codeList = $event;
        if (this.codeList.length > 0) {
            this._navSrv.showRightSandwich(true);
            if (this.closeRight && heightWithoutScrollbar > 1440) {
                this._navSrv.changeStateRightSandwich(true);
            }
        } else {
            this._navSrv.showRightSandwich(false);
            this._navSrv.changeStateRightSandwich(false);
        }
    }
    redactEmailAddres($event) {
        /* this._navSrv.changeStateRightSandwich(true); */
        this.flagEdit = $event;
        if (!this.codeList || this.codeList.length === 0) {
            this._navSrv.changeStateRightSandwich(false);
        } else {
            this._navSrv.changeStateRightSandwich(true);
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
            return new Promise((res, rej) => {
                if (confirm('Возможно, внесенные изменения не сохранятся.')) {
                    this._isChanged = false;
                    return res(true);
                } else {
                    return res(false);
                }
            });
        } else {
            return Promise.resolve(true);
        }
    }

    private checkTabScan(): void {
        if (this._appContext.limitCardsUser.length > 0) {
            if (this._appContext.limitCardsUser.indexOf(this._userParamService.curentUser['DEPARTMENT_DUE']) === -1) {
                this.accordionList[0].disabled = true;
                this.accordionList[1].disabled = true;
                this.accordionList[2].disabled = true;
                this.accordionList[3].disabled = true;
                this.accordionList[4].disabled = true;
                this.accordionList[1].isOpen = false;
                this.accordionList[2].isOpen = false;
                this.hideIcon = true;
            } else {
                this.accordionList[0].disabled = false;
                this.accordionList[1].disabled = false;
                this.accordionList[2].disabled = false;
                this.accordionList[3].disabled = false;
                this.hideIcon = false;
                if (this._userParamService.curentUser['ACCESS_SYSTEMS'][3] === '1') {
                    this.accordionList[4].disabled = false;
                } else {
                    this.accordionList[4].disabled = true;
                }
            }
        } else {
            if (this._userParamService.curentUser['ACCESS_SYSTEMS'][3] === '1') {
                this.accordionList[4].disabled = false;
            } else {
                this.accordionList[4].disabled = true;
            }
            if (this._userParamService.curentUser['ORACLE_ID'] === null) {
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
        }
        if (this._appContext.limitCardsUser.length > 0 && this._userParamService.curentUser !== undefined) {
            if (this.pageId !== 'protocol' && this._appContext.limitCardsUser.indexOf(this._userParamService.curentUser['DEPARTMENT_DUE']) === -1) {
                this._router.navigateByUrl('user_param');
            }
        }
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
}
