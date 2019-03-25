import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamRCSrv } from '../shared-user-param/services/user-param-rc.service';

@Component({
    selector: 'eos-user-param-rc',
    templateUrl: 'user-param-rc.component.html'
})

export class UserParamRCComponent extends UserParamRCSrv implements OnDestroy {
    prepInputsAttach;
    selfLink;
    link;
    constructor( injector: Injector ) {
        super(injector);
        this.selfLink = this._router.url.split('?')[0];
        this.link = this._userParamsSetSrv.userContextId;
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
    cancel($event?) {
        this.flagEdit = false;
        super.cancel();
    }
    edit($event) {
        this.flagEdit = $event;
        this.editMode();
        this.checRcShowRes();
    }

}
