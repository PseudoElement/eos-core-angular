import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { VISUALIZATION_USER } from '../consts/visualization.consts';

@Injectable()
export class UserParamVisualizationSrv extends BaseUserSrv {
   // dataAttachDb;
   // inputAttach;
   // prepInputsAttach;
   // prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, VISUALIZATION_USER);
        this.init();
    }
   /* afterInitUserSearch() {
        this.userParamApiSrv.getData(Object.assign({}, {a: 1}))
        .then(data => {
            this.dataAttachDb = data;
            this.inputAttach = this.getInputAttach();
        });
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }*/
}
