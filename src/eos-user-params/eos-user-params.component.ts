import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from 'app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList } from './shared/intrfaces/user-params.interfaces';

@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})

export class UserParamsComponent implements OnDestroy, OnInit {
    accordionList: IParamAccordionList[] = USER_PARAMS_LIST_NAV;
    isShowAccordion: boolean;
    isLoading: boolean = false;
    isNewUser: boolean = false;
    pageId: 'param-set' | 'email-address' | 'rights-delo' | 'base-param';
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _navSrv: NavParamService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                this.pageId = param['field-id'];
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
        this._route.queryParams
            .takeUntil(this.ngUnsubscribe)
            .subscribe(qParam => {
                if (!qParam['isn_cl'] && !this._userParamService.isUserContexst) {
                    this._router.navigate(['user_param']);
                    console.log(this._userParamService.curentUser);
                    return;
                }
                this.isLoading = true;
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

    }

    ngOnInit() {
        this.openAccordion();
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
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
    private openAccordion() {
        this.accordionList.forEach((item: IParamAccordionList) => {
            if (item.url === this.pageId) {
                item.isOpen = true;
            }
        });
    }
}
