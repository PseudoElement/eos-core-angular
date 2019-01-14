import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { SEARCH_USER } from '../consts/search.consts';

@Injectable()
export class UserParamSearchSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, SEARCH_USER);
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

    default() {
        const changed = true;
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data);
                this.checkLimitSRCH(data);
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }
    checkLimitSRCH(data) {
        if (String(data[1]['PARM_VALUE']) === 'null' ) {
            this.prepareData.rec['SRCH_LIMIT_RESULT'] = '';
        }
    }
}
