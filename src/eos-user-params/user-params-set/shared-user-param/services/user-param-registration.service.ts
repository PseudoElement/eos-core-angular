import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { REGISTRATION_USER } from '../consts/registration.consts';

@Injectable()
export class UserParamRegistrationSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, REGISTRATION_USER);
        this.init();
    }
    afterInitUserSearch() {
        this.userParamApiSrv.getData(Object.assign({}, {a: 1}))
        .then(data => {
            this.dataAttachDb = data;
            this.inputAttach = this.getInputAttach();
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
}
