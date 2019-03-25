import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamDirectoriesSrv } from '../shared-user-param/services/user-param-directories.service';
import { USER_PARMS } from 'eos-rest';

@Component({
    selector: 'eos-user-param-directories',
    templateUrl: 'user-param-directories.component.html'
})

export class UserParamDirectoriesComponent extends UserParamDirectoriesSrv implements OnDestroy {
    prepInputsAttach;
    userParams: USER_PARMS[];
    selfLink;
    link;
    constructor(
        injector: Injector ) {
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
}
close(event?) {
    this._router.navigate(['user_param']);
 }

}
