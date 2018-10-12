import { Component, Injector } from '@angular/core';
import { UserParamRegistrationSrv } from '../shared-user-param/services/user-param-registration.service';

@Component({
    selector: 'eos-user-param-registration',
    templateUrl: 'user-param-registration.component.html'
})

export class UserParamRegistrationComponent extends UserParamRegistrationSrv {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
