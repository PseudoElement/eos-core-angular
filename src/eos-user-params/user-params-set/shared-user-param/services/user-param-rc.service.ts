import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { RC_USER } from '../consts/rc.consts';
import {IOpenClassifParams} from '../../../../eos-common/interfaces/interfaces';
@Injectable()
export class UserParamRCSrv extends BaseUserSrv {
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    dopRec: Array<any>;
    flagBacground: boolean;
    constructor( injector: Injector ) {
        super(injector, RC_USER);
        this.flagBacground = false;
        this.init();
        this.getInfoFroCode(this.form.controls['rec.OPEN_AR'].value);
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

    getInfoFroCode(code: string) {
        const parsedCode = code.split(',').join('||');
        const query = {
            DOCGROUP_CL: {
                criteries: {
                    ISN_NODE: parsedCode
                }
            }
        };
        this.userParamApiSrv.getData(query).then(result => {
            this.dopRec = result;
        });
    }
    addRcDoc() {
        this.flagBacground = true;
        const query: IOpenClassifParams = {
            classif: 'DOCGROUP_CL',
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
        };
        this._waitClassifSrv.openClassif(query, false).then(data => {
            this.addRcDocToInput(data);
            this.flagBacground = false;
        }).catch(error => {

        });
    }

    deleteRcDoc() {

    }

    addRcDocToInput(data) {
      console.log(data);
      const dateVal =  this.form.controls['rec.OPEN_AR'].value;
      console.log(dateVal);
      const newValue = dateVal.split(',');
      newValue.push(data);
      this.form.controls['rec.OPEN_AR'].patchValue(newValue.join(','));
      this.getInfoFroCode(this.form.controls['rec.OPEN_AR'].value);
    }
}
