import { Injectable, Injector } from '@angular/core';
import { BaseRightsDeloSrv } from './base-rights-delo.service';
import { CARD_FILES_USER } from '../consts/card-files.consts';

@Injectable()
export class RightsDeloCardFilesSrv extends BaseRightsDeloSrv {
    readonly fieldKeysforCardFiles: string[] = ['0.2SF.2T7.', '0.2SL.',
    '0.2SH.', '0.2SV.', '0.2SF.', '0.', '0.2SJ.'];
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, CARD_FILES_USER);
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
