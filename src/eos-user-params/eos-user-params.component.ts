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
        this._route.queryParams
            .takeUntil(this.ngUnsubscribe)
            .subscribe(qParam => {
                if (qParam['createNewUser']) {
                    this.isNewUser = qParam['createNewUser'];
                    return;
                }
                this.isLoading = true;
                this._userParamService.getUserIsn(qParam['dueDep']) // '0.2SF.2T7.2TB.'
                    .then((data: boolean) => {
                        this.isLoading = false;
                    })
                    .catch(() => {
                        this._router.navigate(['user_param']);
                    });
            });
        this._navSrv.StateSandwich$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((state: boolean) => {
                this.isShowAccordion = state;
            });
    }

    ngOnInit() {
        this.openAccordion();
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    private openAccordion() {
        this.accordionList.forEach((item: IParamAccordionList) => {
            if (item.url === this.pageId) {
                item.isOpen = true;
            }
        });
    }
}
