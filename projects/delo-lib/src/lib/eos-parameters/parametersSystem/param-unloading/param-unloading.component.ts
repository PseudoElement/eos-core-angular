import { Component, Injector, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { IArchivist, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { UNLOAD_PARAMS } from '../shared/consts/unload-achive.const';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';

@Component({
  selector: 'eos-param-unloading',
  templateUrl: './param-unloading.component.html',
  styleUrls: ['./param-unloading.component.scss']
})
export class ParamUnloadingComponent extends BaseParamComponent {
  @Input() btnError;
  public paramUpload: IUploadParam = {
    namespace: AppsettingsParams.Archivist,
    typename: AppsettingsTypename.TArchivist,
    instance: 'Default'
  };
  masDisable: any[] = [];
  constructor(injector: Injector) {
    super(injector, UNLOAD_PARAMS);
    this.init()
      .then(() => {
        this.cancel();
      }).catch(err => {
        if (err.code !== 401) {
          console.log(err);
        }
      });
  }
  init(): Promise<any> {
    const allRequest = [];
    allRequest.push(this.getData({'LIB_LIBRARY': ALL_ROWS }));
    allRequest.push(this.getAppSetting<IArchivist>(this.paramUpload));
    return Promise.all(allRequest)
    .then(([libLibrary, Archivist]) => {
      this.prepareData = this.convData([]);
      this.prepareDataParam();
      this.inputs = this.getInputs();
      this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
      this.inputs['rec.Name'].options = [];
      libLibrary.forEach((item) => {
        this.inputs['rec.Name'].options.push({value: item['NAME'], title: item['DESCRIPTION']});
      });
      if (Archivist) {
        if (Archivist.Library) {
          this.form.controls['rec.Name'].setValue(Archivist.Library['Name'], { emitEvent: false });
          this.form.controls['rec.Directory'].setValue(Archivist.Library['Directory'], { emitEvent: false });
          this.prepareData.rec['Name'] = Archivist.Library['Name'];
          this.prepareData.rec['Directory'] = Archivist.Library['Directory'];
        }
        this.form.controls['rec.ArhStoreUrl'].setValue(Archivist['ArhStoreUrl'], { emitEvent: false });
        this.prepareData.rec['ArhStoreUrl'] = Archivist['ArhStoreUrl'];
      } else {
        this.prepareData.rec['ArhStoreUrl'] = '';
        this.prepareData.rec['Name'] = '';
        this.prepareData.rec['Directory'] = '';
      }
      this.form.controls['rec.Name'].setValidators([Validators.required]);
      this.form.controls['rec.Directory'].setValidators([Validators.required]);
      this.subscribeChangeForm();
    })
    .catch((er) => {
      this.prepareData = this.convData([]);
      this.prepareDataParam();
      this.inputs = this.getInputs();
      this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
      this._errorSrv.errorHandler(er);
    });
  }

  edit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].enable({ emitEvent: true });
    });
  }

  cancel() {
    if (this.isChangeForm) {
      this.isChangeForm = false;
      this.formChanged.emit(false);
      this.updateData = {};
      this.form.disable();
      this.ngOnDestroy();
      this.init()
        .then(() => {
        })
        .catch(err => {
          if (err.code !== 401) {
            console.log(err);
          }
        });
    } else {
      this.form.disable();
      this.formChanged.emit(false);
    }
  }
  submit() {
    const newArhivist = {
      Library: {
        Name: this.updateData['Name'] !== undefined ? this.updateData['Name'] : this.prepareData.rec['Name'],
        Directory: this.updateData['Directory'] !== undefined ? this.updateData['Directory'] : this.prepareData.rec['Directory'],
      },
      ArhStoreUrl: this.updateData['ArhStoreUrl'] !== undefined ? this.updateData['ArhStoreUrl'] : this.prepareData.rec['ArhStoreUrl'],
    };
    this.setAppSetting(this.paramUpload, newArhivist)
    .then(() => {
      this.isChangeForm = false;
      this.formChanged.emit(false);
      this.updateData = {};
      this.form.disable();
      this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
      this.prepareData.rec = {
        Name: newArhivist.Library.Name,
        Directory: newArhivist.Library.Directory,
        ArhStoreUrl: newArhivist.ArhStoreUrl
      };
    })
    .catch((error) => {
      this.msgSrv.addNewMessage({
        type: 'danger',
        title: 'Ошибка сервера',
        msg: error.message ? error.message : error
      });
    });
  }
}
