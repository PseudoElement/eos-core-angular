import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { RC_USER } from '../consts/rc.consts';

@Injectable()
export class UserParamRCSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, RC_USER);
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
