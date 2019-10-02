import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from 'app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList } from './shared/intrfaces/user-params.interfaces';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { IUserSetChanges } from './shared/intrfaces/user-parm.intterfaces';
import { EosStorageService } from 'app/services/eos-storage.service';
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
    private ngUnsubscribe: Subject<any> = new Subject();
    private _isChanged: boolean;
    private _disableSave: boolean;
    constructor (
        private _navSrv: NavParamService,
        // private _router: Router,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService,
        private _confirmSrv: ConfirmWindowService,
        private _storageSrv: EosStorageService,

    ) {
        this._route.params
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(param => {
                this.pageId = param['field-id'];
                this.codeList = undefined;
                this.flagEdit = false;
                this._navSrv.showRightSandwich(false);
                this._navSrv.blockChangeStateRightSandwich(false);
            });
        this._route.queryParams
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(qParam => {
                // this.isLoading = true;
                if (qParam['isn_cl']) {
                    this._storageSrv.setItem('userEditableId', qParam['isn_cl'], true);
                }

                // if (!qParam['isn_cl'] && !this._userParamService.isUserContexst) {
                //     this._router.navigate(['user_param']);
                //     return;
                // }
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
            .subscribe(({isChange, disableSave}: IUserSetChanges) => {
                this._isChanged = isChange;
                this._disableSave = disableSave;
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
        this.flagEdit = $event;
        if (!this.codeList || this.codeList.length === 0) {
            this._navSrv.changeStateRightSandwich(false);
        } else {
            this._navSrv.changeStateRightSandwich(true);
        }
        this._navSrv.blockChangeStateRightSandwich(this.flagEdit);
    }
    canDeactivate (nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            return this._confirmSrv
                .confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE, { confirmDisabled: this._disableSave }))
                .then(doSave => {
                    if (doSave) {
                        this._userParamService.saveChenges();
                     return   this._userParamService.submitSave.then(() => {
                            this._isChanged = false;
                            return true;
                        }).catch((error) => {
                            console.log(error);
                            return false;
                        });
                    } else {
                        this._isChanged = false;
                        return true;
                    }
                })
                .catch((err) => {
                    return false;
                });
        } else {
            return Promise.resolve(true);
        }
    }

    private checkTabScan(): void {
        if (this._userParamService.curentUser['ACCESS_SYSTEMS'][3] === '1') {
            this.accordionList[4].disabled = false;
        }   else {
            this.accordionList[4].disabled = true;
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
}
