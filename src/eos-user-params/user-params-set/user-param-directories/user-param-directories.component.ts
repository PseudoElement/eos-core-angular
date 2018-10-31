import { Component, Injector } from '@angular/core';
import { UserParamDirectoriesSrv } from '../shared-user-param/services/user-param-directories.service';
import { USER_PARMS } from 'eos-rest';

@Component({
    selector: 'eos-user-param-directories',
    templateUrl: 'user-param-directories.component.html'
})

export class UserParamDirectoriesComponent extends UserParamDirectoriesSrv {
    prepInputsAttach;
    userParams: USER_PARMS[];
    constructor(
        injector: Injector ) {
        super(injector);
    }
}