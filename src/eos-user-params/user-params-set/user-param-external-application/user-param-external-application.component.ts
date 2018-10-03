import { Component, Injector } from '@angular/core';
import { UserParamExternalApplicationSrv } from '../../shared/services/user-param-external-application.service';

@Component({
    selector: 'eos-user-param-external-application',
    templateUrl: 'user-param-external-application.component.html'
})

export class UserParamEAComponent extends UserParamExternalApplicationSrv {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
