import { Component,  } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
// import { Router} from '@angular/router';
// import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
 import { PipRX } from 'eos-rest/services/pipRX.service';
// import {BaseUserSrv} from '../shared-user-param/services/base-user.service';
// // import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../shared-user-param/consts/eos-user-params.const';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-prof-sert',
    styleUrls: ['user-params-prof-sert.component.scss'],
    templateUrl: 'user-params-prof-sert.component.html'
})

export class UserParamsProfSertComponent {
    // public input: AbstractControl;
    // public form: FormGroup;
    constructor(
        private _userSrv: UserParamsService,
        // private _router: Router,
        // private _modalService: BsModalService,
         private apiSrv: PipRX,
        // private _msgSrv: EosMessageService,
        // private _baseSrv: BaseUserSrv,
    ) {
        this.getSerts();
    }

    // init() {
    //     const value = this._userSrv.hashUserContext;
    //     this.input = new FormControl();

    // }

    getSerts() {
        const query = {
            USER_CERT_PROFILE: {
                criteries: {
                    ISN_USER: String(this._userSrv.userContextId)
                }
            }
        };
        this.apiSrv.read(query).then(res => {
            console.log(res);
        }).catch(error => {

        });
    }

}
