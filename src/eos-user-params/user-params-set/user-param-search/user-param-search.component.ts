import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamSearchSrv } from '../shared-user-param/services/user-param-search.service';

@Component({
    selector: 'eos-user-param-search',
    templateUrl: 'user-param-search.component.html'
})

export class UserParamSearchComponent extends UserParamSearchSrv implements OnDestroy {
    prepInputsAttach;
    link;
    selfLink;


    constructor( injector: Injector ) {
        super(injector);
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    edit($event) {
        this.flagEdit = $event;
        this.editMode();
    }
    cancel($event?) {
        super.cancel();
    }
    close(event?) {
        this._router.navigate(['user_param']);
     }
}
