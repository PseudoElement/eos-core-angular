import { Component, Injector, OnInit } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARAMS, PROTOCOL_OF_REQUESTS_PARAMS } from '../shared/consts/protocol-of-requests.const';
import { InputBase } from '../../../eos-common/core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { InputControlService } from '../../../eos-common/index';
import { PipRX } from '../../../eos-rest';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';

@Component({
  selector: 'eos-param-protocol-of-requests',
  templateUrl: './param-protocol-of-requests.component.html',
  styleUrls: ['./param-protocol-of-requests.component.scss']
})
export class ParamProtocolOfRequestsComponent extends BaseParamComponent implements OnInit {
  inputsData: InputBase<string>[] = PROTOCOL_OF_REQUESTS_PARAMS;
  form: FormGroup
  isEditMode: boolean = false
  constructor(_injector: Injector, private _inputCntrlSrv: InputControlService, private _apiSrv: PipRX) {
    super(_injector, PARAMS)
  }

  ngOnInit(): void {
    this._apiSrv.getAppSetting({
      namespace: AppsettingsParams.Email,
      typename: AppsettingsTypename.TSend    
    })
    .then(v => console.log('get_request', v))
    .catch(e => console.log('err', e))
    this.form = this._inputCntrlSrv.toFormGroup(this.inputsData)
    this.form.disable({ emitEvent: false });
  }
  public edit() {
    this.isEditMode = true
    this.form.enable({ emitEvent: false });
  } 
  public submit(){
    console.log('form_value',this.form.value)
  }
  public cancel(){
    this.isEditMode = false
    this.form.disable({ emitEvent: false });
  }
}
