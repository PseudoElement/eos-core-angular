import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { UNLOAD_PARAMS } from '../shared/consts/unload-achive.const';

@Component({
  selector: 'eos-param-unloading',
  templateUrl: './param-unloading.component.html',
  styleUrls: ['./param-unloading.component.scss']
})
export class ParamUnloadingComponent extends BaseParamComponent {
  @Input() btnError;
  masDisable: any[] = [];
  constructor(injector: Injector) {
    super(injector, UNLOAD_PARAMS);
    this.init()
      .then(() => {
        this.afterCreate();
      }).catch(err => {
        if (err.code !== 434) {
          console.log(err);
        }
      });
  }


  afterCreate() {
    Object.keys(this.prepareData.rec).forEach(key => {
      if (this.prepareData.rec[key] === null || this.prepareData.rec[key] === 'null') {
        this.prepareData.rec[key] = '';
      }
    });
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].value === 'null') {
        this.form.controls[key].patchValue('');
      }
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
          this.afterCreate();
        })
        .catch(err => {
          if (err.code !== 434) {
            console.log(err);
          }
        });
    } else {
      this.form.disable();
    }

  }
}
