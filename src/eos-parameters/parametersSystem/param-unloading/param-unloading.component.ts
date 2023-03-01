import { Component, Injector, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { IArchivist, IUploadParam } from 'eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { UNLOAD_PARAMS } from '../shared/consts/unload-achive.const';

@Component({
  selector: 'eos-param-unloading',
  templateUrl: './param-unloading.component.html',
  styleUrls: ['./param-unloading.component.scss']
})
export class ParamUnloadingComponent extends BaseParamComponent {
  @Input() btnError;
  public paramUpload: IUploadParam = {
    namespace: 'Eos.Delo.Settings.Archivist',
    typename: 'ArchivistCfg',
    instance: 'Default'
  };
  masDisable: any[] = [];
  constructor(injector: Injector) {
    super(injector, UNLOAD_PARAMS);
    this.init()
      .then(() => {
        this.cancel();
      }).catch(err => {
        if (err.code !== 434) {
          console.log(err);
        }
      });
  }
  init(): Promise<any> {
    const allRequest = [];
    allRequest.push(this.getData({'GetLibLibraries': ALL_ROWS }));
    allRequest.push(this.getAppSetting<IArchivist>(this.paramUpload));
    return Promise.all(allRequest)
    .then(([libLibrary, Archivist]) => {
      this.prepareData = this.convData([]);
      this.prepareDataParam();
      this.inputs = this.getInputs();
      this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
      this.inputs['rec.Name'].options = [];
      Object.keys(libLibrary[0]).forEach((key) => {
        if (key !== '__metadata') {
          this.inputs['rec.Name'].options.push({value: key, title: libLibrary[0][key]});
        }
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
      console.log('er', er);
      this._errorSrv.errorHandler({code: er.status, message: er.error});
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
          if (err.code !== 434) {
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
        Name: this.updateData['Name'] ? this.updateData['Name'] : this.prepareData.rec['Name'],
        Directory: this.updateData['Directory'] ? this.updateData['Directory'] : this.prepareData.rec['Directory'],
      },
      ArhStoreUrl: this.updateData['ArhStoreUrl'] ? this.updateData['ArhStoreUrl'] : this.prepareData.rec['ArhStoreUrl'],
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
