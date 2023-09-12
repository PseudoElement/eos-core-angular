import { Component, Injector, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARAMS, PROTOCOL_OF_REQUESTS_PARAMS, UPLOAD_PARAMS } from '../shared/consts/protocol-of-requests.const';
import { InputBase } from '../../../eos-common/core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { EosMessageService, InputControlService } from '../../../eos-common/index';
import { PipRX } from '../../../eos-rest';

@Component({
  selector: 'eos-param-protocol-of-requests',
  templateUrl: './param-protocol-of-requests.component.html',
  styleUrls: ['./param-protocol-of-requests.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ParamProtocolOfRequestsComponent extends BaseParamComponent implements OnInit {
  inputsData: InputBase<string>[] = PROTOCOL_OF_REQUESTS_PARAMS;
  form: FormGroup
  isEditMode: boolean = false
  constructor(_injector: Injector, private _inputCntrlSrv: InputControlService, private _apiSrv: PipRX, private _msgSrv: EosMessageService) {
    super(_injector, PARAMS)
  }

  ngOnInit(): void {
    this._loadAppSettings()
    this.form = this._inputCntrlSrv.toFormGroup(this.inputsData)
    this.form.disable({ emitEvent: false });
  }

  public edit() {
    this.isEditMode = true
    this.form.enable({ emitEvent: false });
  } 
  public async submit(){
    const protocolParams = this.form.controls['PROTOCOL_PARAMS'].value
    try{
      await this._apiSrv.setAppSetting(UPLOAD_PARAMS, protocolParams)
      this.disableForm()
    }catch(err){
      this._msgSrv.addNewMessage({
        type: 'danger',
        title: 'Ошибка',
        msg: JSON.stringify(err)
      })
      console.error(err)
    }
  }
  public disableForm(){
    this.isEditMode = false
    this.form.disable({ emitEvent: false });
  }
  private async _loadAppSettings(): Promise<void>{
    try{
      const res = await this._apiSrv.getAppSetting(UPLOAD_PARAMS)
      /*Заполнить value Параметры протоколирования(textarea) существующими настройками*/
      this.inputsData[0].value = res ? JSON.stringify(res) : ''
      this.form.controls['PROTOCOL_PARAMS'].patchValue(this.inputsData[0].value)
    }catch(err){
      console.error('loadAppSettings_error', err)
    }
  }
}
