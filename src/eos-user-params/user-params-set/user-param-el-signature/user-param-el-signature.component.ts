import { Component, TemplateRef } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { Router} from '@angular/router';
import {ELECTRONIC_SIGNATURE} from '../shared-user-param/consts/electronic-signature';
import { FormGroup, AbstractControl } from '@angular/forms';
import { InputParamControlService } from 'eos-user-params/shared/services/input-param-control.service';
import {FormHelperService} from '../../shared/services/form-helper.services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { PipRX } from 'eos-rest/services/pipRX.service';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
// import { Subscription } from 'rxjs/Rx';
// import { PARM_SUCCESS_SAVE, PARM_CANCEL_CHANGE } from '../shared-user-param/consts/eos-user-params.const';
// import { USER_PARMS } from 'eos-rest';
// import { WaitClassifService } from 'app/services/waitClassif.service';
@Component({
    selector: 'eos-user-param-el-signature',
    styleUrls: ['user-param-el-signature.component.scss'],
    templateUrl: 'user-param-el-signature.component.html',
    providers: [FormHelperService],
})

export class UserParamElSignatureComponent {
    public titleHeader: string;
    public selfLink: string;
    public link: number;
    public control: AbstractControl;
    public form: FormGroup;
    public inputs: any;
    private inputFields: any;
     private modalRef: BsModalRef;
    constructor(
        private _userSrv: UserParamsService,
        private _router: Router,
        private _inputCtrlSrv: InputParamControlService,
        private _formHelper: FormHelperService,
        private _modalService: BsModalService,
    ) {
        this.titleHeader = this._userSrv.curentUser.CLASSIF_NAME;
        this.link = this._userSrv.curentUser['ISN_LCLASSIF'];
        this.selfLink = this._router.url.split('?')[0];
        this.init();
    }

    init() {
        this.inputFields =  this._formHelper.fillInputFieldsSetParams(ELECTRONIC_SIGNATURE);
        this.inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
        this.form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
        this.subscribeForm();
    }

    subscribeForm() {
        this.form.valueChanges.subscribe(data => {
            console.log(data);
        });
    }
    openPopup(template: TemplateRef<any>, controlName) {
        this.control = this.form.controls[controlName];
        this.modalRef = this._modalService.show(template);
    }
}
