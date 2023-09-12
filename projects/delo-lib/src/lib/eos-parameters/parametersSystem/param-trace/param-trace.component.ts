import { Component, Injector, OnInit } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARAMS, TRACE_PARAMS, UPLOAD_PARAMS } from '../shared/consts/params-trace.const';
import { InputBase } from '../../../eos-common/core/inputs/input-base';
import { FormGroup } from '@angular/forms';
import { EosMessageService, InputControlService } from '../../../eos-common/index';
import { PipRX } from '../../../eos-rest';

@Component({
  selector: 'eos-param-trace',
  templateUrl: './param-trace.component.html',
  styleUrls: ['./param-trace.component.scss'],
})
export class ParamTraceComponent extends BaseParamComponent implements OnInit {
  inputsData: InputBase<string>[] = TRACE_PARAMS;
  form: FormGroup
  constructor(_injector: Injector, private _inputCntrlSrv: InputControlService, private _apiSrv: PipRX, private _msgSrv: EosMessageService) {
    super(_injector, PARAMS)
  }

  ngOnInit(): void {
    this._loadAppSettings()
    this.form = this._inputCntrlSrv.toFormGroup(this.inputsData)
    this.form.disable({ emitEvent: false });
  }

  public edit() {
    this.form.enable({ emitEvent: false });
  } 
  public async submit(){
    const protocolParams = this.form.controls['TRACE_PARAMS'].value || '{}'
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
    this.form.disable({ emitEvent: false });
  }
  private async _loadAppSettings(): Promise<void>{
    try{
      const res = await this._apiSrv.getAppSetting(UPLOAD_PARAMS)
      /*Заполнить value Параметры протоколирования(textarea) существующими настройками*/
      this.inputsData[0].value = res ? JSON.stringify(res) : ''
      this.form.controls['TRACE_PARAMS'].patchValue(this.inputsData[0].value)
    }catch(err){
      console.error('loadAppSettings_error', err)
    }
  }
}
