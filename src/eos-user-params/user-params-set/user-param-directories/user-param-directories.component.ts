import { Component, Injector } from '@angular/core';
import { UserParamDirectoriesSrv } from '../shared-user-param/services/user-param-directories.service';

@Component({
    selector: 'eos-user-param-directories',
    templateUrl: 'user-param-directories.component.html'
})

export class UserParamDirectoriesComponent extends UserParamDirectoriesSrv {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
