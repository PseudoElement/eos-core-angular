import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { PARAMS_LIB } from '../shared/consts/params-lib';

const USER_PARAMS_KEY: string[] = [
  'EDMSNAME',
  'EDMSPARM',
  'GATEPATH',
  'STORAGEPATH',
  'MAX_FILESIZE',
  'DIRECTSTORAGE'
];
enum KEY_LIB_PARAM {
  'gate' = 1003,
  'EXPIRATION' = 1004
}
const OPTIONS = [
  {value: 'R', title: 'Чтение'},
  {value: 'RW', title: 'Чтение/Запись'},
  {value: 'NO', title: 'Нет (используется процедура БД)'}
];

@Component({
  selector: 'eos-param-lib',
  templateUrl: './param-lib.component.html'
})
export class ParamLibComponent extends BaseParamComponent {
  @Input() btnError;
  masDisable: any[] = [];
  constructor(injector: Injector) {
    super(injector, PARAMS_LIB);
    this.init()
      .then(() => {
        this.afterCreate();
        this.LibParamInit();
      }).catch(err => {
        if (err.code !== 401) {
          console.log(err);
        }
      });
  }

  LibParamInit() {
    return this.getData({
      LIB_PARAM: {
          criteries: {
            PARAM_NAME: 'gate||expiration',
          }
    }})
    .then((data) => {
      data.forEach((d) => {
        if (d['PARAM_NAME'] === 'gate') {
          this.form.controls['rec.gate'].setValue(d['PARAM_VALUE'], { emitEvent: false });
          this.prepareData.rec['gate'] = d['PARAM_VALUE'];
        }
        if (d['PARAM_NAME'] === 'expiration') {
          this.form.controls['rec.EXPIRATION'].setValue(d['PARAM_VALUE'], { emitEvent: false });
          this.prepareData.rec['EXPIRATION'] = d['PARAM_VALUE'];
        }
      });
    });
  }
  afterCreate() {
    this.form.disable({ emitEvent: false });
    if (this.form.controls['rec.DIRECTSTORAGE_TYPES'].value) {
      const allOption: string[] = this.form.controls['rec.DIRECTSTORAGE_TYPES'].value.split(',');
      this.inputs['rec.DIRECTSTORAGE'].options = [];
      allOption.forEach((key) => {
        const ind = OPTIONS.findIndex((opt) => opt.value === key);
        if (ind !== -1) {
          this.inputs['rec.DIRECTSTORAGE'].options.push(OPTIONS[ind]);
        }
      });
    }
    this.subscriptions.push(
      this.form.controls['rec.EXPIRATION'].valueChanges.subscribe(text => {
          if (Number(text) > 1440 || Number(text) <= 0) {
            this.form.controls['rec.EXPIRATION'].setErrors({ error: true });
          } else {
            this.form.controls['rec.EXPIRATION'].setErrors(null);
          }
      })
    );
    this.subscriptions.push(
      this.form.controls['rec.MAX_FILESIZE'].valueChanges.subscribe(text => {
          if (Number(text) > 100 || Number(text) <= 0) {
            this.form.controls['rec.MAX_FILESIZE'].setErrors({ error: true });
          } else {
            this.form.controls['rec.MAX_FILESIZE'].setErrors(null);
          }
      })
    );
    Object.keys(this.prepareData.rec).forEach(key => {
      if (this.prepareData.rec[key] === null || this.prepareData.rec[key] === 'null') {
        this.prepareData.rec[key] = '';
      }
    });
    Object.keys(this.form.controls).forEach(key => {
      if (this.form.controls[key].value === 'null') {
        this.form.controls[key].patchValue('', { emitEvent: false });
      }
    });
  }

  edit() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].enable({ emitEvent: true });
    });
  }

  createObjRequest(): any[] {
    const req = [];
    for (const key in this.updateData) {
        if (key) {
          if (USER_PARAMS_KEY.indexOf(key) !== -1) {
            req.push({
              method: 'MERGE',
              requestUri: `SYS_PARMS(-99)/USER_PARMS_List('-99 ${key}')`,
              data: {
                PARM_VALUE: this.updateData[key]
              }
            });
          } else {
            req.push({
              method: 'MERGE',
              requestUri: `LIB_LIBRARY(1000)/LIB_PARAM_List(${KEY_LIB_PARAM[key]})`,
              data: {
                PARAM_VALUE: this.updateData[key]
              }
            });
          }
        }
    }
    return req;
}

  submit() {
    if (this.updateData) {
      const req = this.createObjRequest();
      this.updateData = {};
      this.formChanged.emit(false);
      this.isChangeForm = false;
      this.paramApiSrv
      .setData(req)
      .then(data => {
        this.prepareData.rec = Object.assign({}, this.newData.rec);
        this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
        this.form.disable();
      })
      .catch(data => {
        this.formChanged.emit(true);
        this.isChangeForm = true;
        this.msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка сервера',
            msg: data.message ? data.message : data
        });
        this.form.disable();
      });
  }
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
          if (err.code !== 401) {
            console.log(err);
          }
        });
    } else {
      this.form.disable();
    }

  }
  cancelEdit() {
    this.masDisable = [];
    Object.keys(this.form.controls).forEach(key => {
        if (!this.form.controls[key].disabled) {
            this.masDisable.push(key);
        }
    });
    this.form.disable({ emitEvent: false });
}
}
