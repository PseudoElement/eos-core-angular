import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamSearchSrv } from '../shared-user-param/services/user-param-search.service';

@Component({
    selector: 'eos-user-param-search',
    templateUrl: 'user-param-search.component.html'
})

export class UserParamSearchComponent extends UserParamSearchSrv implements OnDestroy {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
}
