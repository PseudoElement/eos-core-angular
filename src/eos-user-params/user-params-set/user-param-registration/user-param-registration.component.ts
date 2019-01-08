import { Component, Injector } from '@angular/core';
import { UserParamRegistrationSrv } from '../shared-user-param/services/user-param-registration.service';
import {IOpenClassifParams} from '../../../eos-common/interfaces/interfaces';
@Component({
    selector: 'eos-user-param-registration',
    templateUrl: 'user-param-registration.component.html'
})

export class UserParamRegistrationComponent extends UserParamRegistrationSrv {
    userId: string;
    disableSave: boolean;
    isChanged: boolean;
    flagBacground: boolean;
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
        this.flagBacground = false;
    }

    openClassif() {
        const query: IOpenClassifParams = {
            classif: 'CONTACT',
            selectMulty: false,
            selectLeafs: false,
            selectNodes: true,
        };
        this.flagBacground = true;
        this._waitClassifSrv.openClassif(query, true)
        .then(data => {
            this.getListOrgGroup((data as string), true).then(list => {
               if (list) {
                this.form.controls['rec.ORGGROUP_NAME'].patchValue( list[0]['CLASSIF_NAME'], {
                    emitEvent: false,
                });
               }
               this.flagBacground = false;
            });
        }).catch(error => {
            this.flagBacground = false;
        });
    }
}
