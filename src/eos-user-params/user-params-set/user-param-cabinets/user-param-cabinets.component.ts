import { Component, Injector } from '@angular/core';
import { UserParamCabinetsSrv } from '../shared-user-param/services/user-param-cabinets.service';

@Component({
    selector: 'eos-user-param-cabinets',
    templateUrl: 'user-param-cabinets.component.html'
})

export class UserParamCabinetsComponent extends UserParamCabinetsSrv {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
