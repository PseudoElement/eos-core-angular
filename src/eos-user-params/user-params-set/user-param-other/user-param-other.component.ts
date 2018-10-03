import { Component, Injector } from '@angular/core';
import { UserParamOtherSrv } from '../../shared/services/user-param-other.service';

@Component({
    selector: 'eos-user-param-other',
    templateUrl: 'user-param-other.component.html'
})

export class UserParamOtherForwardingComponent extends UserParamOtherSrv {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
