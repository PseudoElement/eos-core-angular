import { Component, Injector } from '@angular/core';
import { UserParamSearchSrv } from '../../shared/services/user-param-search.service';

@Component({
    selector: 'eos-user-param-search',
    templateUrl: 'user-param-search.component.html'
})

export class UserParamSearchComponent extends UserParamSearchSrv {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
