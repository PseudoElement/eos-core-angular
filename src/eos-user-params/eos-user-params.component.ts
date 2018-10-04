import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserParamsService } from './shared/services/user-params.service';
// import { USER_CL } from 'eos-rest';

@Component({
    selector: 'eos-user-params',
    templateUrl: 'eos-user-params.component.html'
})

export class UserParamsComponent implements OnDestroy {
    isLoading: boolean = false;
    pageId: 'param-set' | 'email-address' | 'rights-delo';
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor (
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
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
