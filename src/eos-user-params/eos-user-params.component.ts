import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from './shared/services/user-params.service';
import { NavParamService } from 'app/services/nav-param.service';
import { USER_PARAMS_LIST_NAV } from './shared/consts/user-param.consts';
import { IParamAccordionList } from './shared/intrfaces/user-params.interfaces';
// import { USER_CL } from 'eos-rest';

@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})

export class UserParamsComponent implements OnDestroy, OnInit {
    accordionList: IParamAccordionList[] = USER_PARAMS_LIST_NAV;
    isShowAccordion: boolean;
    isLoading: boolean = false;
    pageId: 'param-set' | 'email-address' | 'rights-delo' | 'base-param';
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
        private _navSrv: NavParamService,
        private _route: ActivatedRoute,
        private _userParamService: UserParamsService
    ) {
        this._route.params
            .takeUntil(this.ngUnsubscribe)
            .subscribe(param => {
                // console.log(param);
                this.pageId = param['field-id'];
            });
        this._route.queryParams
            .takeUntil(this.ngUnsubscribe)
            .subscribe(qParam => {
                if (qParam['id']) {
                    this.isLoading = true;
                    this._userParamService.getUserIsn(qParam['id'])
                        .then((data: boolean) => {
                            this.isLoading = false;
                        });
                }
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
