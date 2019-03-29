import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamCabinetsSrv } from '../shared-user-param/services/user-param-cabinets.service';

@Component({
    selector: 'eos-user-param-cabinets',
    templateUrl: 'user-param-cabinets.component.html'
})

export class UserParamCabinetsComponent extends UserParamCabinetsSrv implements OnDestroy {
    userId: string;

    isChanged: boolean;
    prepInputsAttach;
    selfLink;
    link;

    constructor( injector: Injector ) {
        super(injector);
        this.link = this._userParamsSetSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
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
    }
    close(event) {
        this.flagEdit = event;
        this._router.navigate(['user_param', JSON.parse(localStorage.getItem('lastNodeDue'))]);
    }
}
