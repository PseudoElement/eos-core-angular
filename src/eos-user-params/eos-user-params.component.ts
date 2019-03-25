import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from 'app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList } from './shared/intrfaces/user-params.interfaces';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';
import { IUserSetChanges } from './shared/intrfaces/user-parm.intterfaces';

@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})

export class UserParamsComponent implements OnDestroy, OnInit {
    accordionList: IParamAccordionList[] = USER_PARAMS_LIST_NAV;
    isShowAccordion: boolean;
    isLoading: boolean = true;
    isNewUser: boolean = false;
    pageId: string;
    private ngUnsubscribe: Subject<any> = new Subject();
    private _isChanged: boolean;
    private _disableSave: boolean;
    constructor (
        private _navSrv: NavParamService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                this.pageId = param['field-id'];
            });
        this._route.queryParams
            .takeUntil(this.ngUnsubscribe)
            .subscribe(qParam => {
                this.isLoading = true;
                if (!qParam['isn_cl'] && !this._userParamService.isUserContexst) {
                    this._router.navigate(['user_param']);
                    return;
                }
                this._userParamService.getUserIsn(qParam['isn_cl'])
                    .then((data: boolean) => {
                        this.checkTabScan();
                        this.isLoading = false;

                    })
                    .catch(() => {
                        this._router.navigate(['user_param']);
                    });
                    this.isShowAccordion = true;
            });
        this._userParamService.hasChanges$
            .takeUntil(this.ngUnsubscribe)
            .subscribe(({isChange, disableSave}: IUserSetChanges) => {
                this._isChanged = isChange;
                this._disableSave = disableSave;
            });
        this._navSrv.StateSandwich$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean) => {
                this.isShowAccordion = state;
            });
        this._navSrv.StateScanDelo
            .takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean) => {
                this.setTabsSCan(state);
            });
    }

    ngOnInit() {
        this._openAccordion(this.accordionList);
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        localStorage.removeItem('lastNodeDue');
    }

    canDeactivate (nextState?: RouterStateSnapshot): Promise<boolean> | boolean {
        if (this._isChanged) {
            return this._confirmSrv
                .confirm(Object.assign({}, CONFIRM_SAVE_ON_LEAVE, { confirmDisabled: this._disableSave }))
                .then(doSave => {
                    if (doSave) {
                        this._userParamService.saveChenges();
                        this._isChanged = false;
                        return true;
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
