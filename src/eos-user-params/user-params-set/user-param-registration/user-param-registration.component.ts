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
    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }

    openClassif() {
        const query: IOpenClassifParams = {
            classif: 'CONTACT',
            selectMulty: false,
            selectLeafs: false,
            selectNodes: true,
        };
        this.flagBacground = true;
        this._waitClassifSrv.openClassif(query)
        .then(data => {
            if (String(data) === '') {
                this.msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Выберите значение',
                    dismissOnTimeout: 5000,
                });
                throw new Error();
            }   else {
                this.getListOrgGroup((data as string), true).then(list => {
                   if (list) {
                    this.nameAuthorControl  = list[0]['CLASSIF_NAME'];
                    this.form.controls['rec.ORGGROUP_NAME'].patchValue( list[0]['CLASSIF_NAME'], {
                        emitEvent: false,
                    });
                   }
                   this.flagBacground = false;
                });
            }
        }).catch(error => {
            this.flagBacground = false;
        });
    }
}
