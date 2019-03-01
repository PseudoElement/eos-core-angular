import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamRCSrv } from '../shared-user-param/services/user-param-rc.service';

@Component({
    selector: 'eos-user-param-rc',
    templateUrl: 'user-param-rc.component.html'
})

export class UserParamRCComponent extends UserParamRCSrv implements OnDestroy {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }

    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

}
