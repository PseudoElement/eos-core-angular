import { Component, Injector } from '@angular/core';
import { UserParamOtherSrv } from '../shared-user-param/services/user-param-other.service';
import { OTHER_USER } from '../shared-user-param/consts/other.consts';

@Component({
    selector: 'eos-user-param-other',
    templateUrl: 'user-param-other.component.html'
})

export class UserParamOtherForwardingComponent extends UserParamOtherSrv {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    listTemplates = OTHER_USER.fieldsTemplates;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}