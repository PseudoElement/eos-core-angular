import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamCabinetsSrv } from '../shared-user-param/services/user-param-cabinets.service';

@Component({
    selector: 'eos-user-param-cabinets',
    templateUrl: 'user-param-cabinets.component.html'
})

export class UserParamCabinetsComponent extends UserParamCabinetsSrv implements OnDestroy {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }
}
