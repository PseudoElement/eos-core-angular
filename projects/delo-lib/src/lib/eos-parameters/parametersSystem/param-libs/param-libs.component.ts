import { Component, Injector, Input, ViewChild } from '@angular/core';
import { IFdulzParams, IFilesParams, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from '../../../eos-rest';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { PARAMS_LIBS, TABLE_HEADER_FILES } from '../shared/consts/params-libs';
import { ITableData, ITableSettings } from '../shared/interfaces/tables.interfaces';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';

const PARAM_COMMON: IUploadParam = {
  namespace: AppsettingsParams.Common,
  typename: AppsettingsTypename.TFiles,
  instance: 'Default'
};

const PARAM_FDULZ: IUploadParam = {
  namespace: AppsettingsParams.Fdulz,
  typename: AppsettingsTypename.TFdulz,
  instance: 'Default'
};

@Component({
  selector: 'eos-param-libs',
  templateUrl: './param-libs.component.html',
  styleUrls: ['./param-libs.component.scss']
})
export class ParamLibsComponent extends BaseParamComponent {
  @ViewChild('headerElement', {static: false}) headerElement;
  @Input() btnError;
  masDisable: any[] = [];
  public closeAcordFirst = false;
  public closeAcordSecond = false;
  public closeAcordthree = false;
  public newValueCommonName = '';
  public tabelData: ITableData = {
      tableBtn: [],
      tableHeader: TABLE_HEADER_FILES,
      data: []
  };
  public settingsTable: ITableSettings = {
    hiddenCheckBox: true,
    maxHeightTable: '200px',
    selectedRow: true
  }
  constructor(injector: Injector) {
    super(injector, PARAMS_LIBS);
    this.init()
      .then(() => {
        this.cancel();
      }).catch(err => {
        if (err.code !== 401) {
          console.log(err);
        }
        this._errorSrv.errorHandler(err);
      });
  }
  init(): Promise<any> {
    this.prepareDataParam();
    this.prepareData = this.convData([]);
    this.inputs = this.getInputs();
    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
    this.subscribeChangeForm();
    const allRequest = [];
    allRequest.push(this.getData({'LIB_LIBRARY/LIB_PARAM_List': ALL_ROWS }));
    allRequest.push(this.getData({'LIB_LIBRARY': ALL_ROWS }));
    allRequest.push(this.getAppSetting<IFilesParams>(PARAM_COMMON));
    allRequest.push(this.getAppSetting<IFdulzParams>(PARAM_FDULZ));
    return Promise.all(allRequest)
    .then(([libParam, libLibrary, common, fdulz]) => {
      const mapData = new Map<number, any>();
      libLibrary.forEach((item) => {
        this.inputs['rec.CommonName'].options.push({value: item['NAME'], title: item['DESCRIPTION']});
        this.inputs['rec.FdulzName'].options.push({value: item['NAME'], title: item['DESCRIPTION']});
        mapData.set(item.ISN_LIBRARY, {
          key:  item.ISN_LIBRARY,
          ProfileName: item.DESCRIPTION,
        });
      });
      this.updateParams(common, fdulz);
      libParam.forEach((param) => {
        if (mapData.get(param['ISN_LIBRARY'])) {
          mapData.set(param['ISN_LIBRARY'], Object.assign(mapData.get(param['ISN_LIBRARY']), {[param.PARAM_NAME.toUpperCase()]: param.PARAM_VALUE}));
        }
      });
      mapData.forEach((data) => {
        this.tabelData.data.push(data);
      });
    });
  }
  updateParams( common: IFilesParams, fdulz: IFdulzParams) {
    if (common) {
      if (common.Library) {
        this.form.controls['rec.CommonName'].setValue(common.Library['Name'], { emitEvent: false });
        this.form.controls['rec.CommonDirectory'].setValue(common.Library['Directory'], { emitEvent: false });
        this.prepareData.rec['CommonName'] = common.Library['Name'];
        this.prepareData.rec['CommonDirectory'] = common.Library['Directory'];
      }
      this.form.controls['rec.EdmsParm'].setValue(common['EdmsParm'], { emitEvent: false });
      this.form.controls['rec.MaxFileSize'].setValue(common['MaxFileSize'], { emitEvent: false });
      this.prepareData.rec['EdmsParm'] = common['EdmsParm'];
      this.prepareData.rec['MaxFileSize'] = common['MaxFileSize'];
      this.newValueCommonName = common.Library['Name'];
    }
    if (fdulz) {
      if (fdulz.Library) {
        this.form.controls['rec.FdulzName'].setValue(fdulz.Library['Name'], { emitEvent: false });
        this.form.controls['rec.FdulzDirectory'].setValue(fdulz.Library['Directory'], { emitEvent: false });
        this.prepareData.rec['FdulzName'] = fdulz.Library['Name'];
        this.prepareData.rec['FdulzDirectory'] = fdulz.Library['Directory'];
      }
      this.form.controls['rec.Expiration'].setValue(fdulz['Expiration'], { emitEvent: false });
      this.prepareData.rec['Expiration'] = fdulz['Expiration'];
    }
  }
  openAccordion(flagOpen: number) {
    switch (flagOpen) {
      case 1:
        this.closeAcordFirst = !this.closeAcordFirst;
        break;
      case 2:
        this.closeAcordSecond = !this.closeAcordSecond;
        break;
      case 3:
        this.closeAcordthree = !this.closeAcordthree;
        break;
      default:
        break;
    }
  }

  edit() {
    this.form.enable({ emitEvent: false });
  }

  createObjRequest(): [IFilesParams, IFdulzParams] {
    const files: IFilesParams = {
      EdmsParm: this.updateData['EdmsParm'] !== undefined ? this.updateData['EdmsParm'] : this.prepareData.rec['EdmsParm'],
      Library: {
        Name: this.updateData['CommonName'] !== undefined ? this.updateData['CommonName'] : this.prepareData.rec['CommonName'],
        Directory: this.updateData['CommonDirectory'] !== undefined ? this.updateData['CommonDirectory'] : this.prepareData.rec['CommonDirectory'],
      },
      MaxFileSize: this.updateData['MaxFileSize'] !== undefined ? +this.updateData['MaxFileSize'] : +this.prepareData.rec['MaxFileSize'],
    }
    const fdulz: IFdulzParams = {
      Expiration: this.updateData['Expiration'] !== undefined ? +this.updateData['Expiration'] : +this.prepareData.rec['Expiration'],
      Library: {
        Name: this.updateData['FdulzName'] !== undefined ? this.updateData['FdulzName'] : this.prepareData.rec['FdulzName'],
        Directory: this.updateData['FdulzDirectory'] !== undefined ? this.updateData['FdulzDirectory'] : this.prepareData.rec['FdulzDirectory'],
      }
    }
    return [files, fdulz];
  }
  checkSetNewElement() {
    const massage = {
      title: 'Предупреждение',
      bodyList: [],
      body: 'При сохранении данных изменений доступ к ранее сохраненным файлам будет потерян. Обратитесь к администратору системы.',
      buttons: [
          {title: 'Сохранить', result: 1, isDefault: true, },
          {title: 'Отменить',  result: 2, },
      ],
      typeIcon: 'danger'
    }
    this.headerElement.editMode = true;
    this.confirmSrv.confirm2(Object.assign({}, massage)).then((button) => {
      this.headerElement.editMode = false;
      if (button && button['result'] === 1) {
        this.submit();
      } else {
        this.cancel();
      }
    });
  }
  preSubmit() {
    if (this.updateData['CommonName'] !== undefined || this.updateData['CommonDirectory'] !== undefined || this.updateData['MaxFileSize'] !== undefined) {
      this.checkSetNewElement();
    } else {
      this.submit();
    }
  }
  submit() {
    if (Object.keys(this.updateData).length) {
      const req = this.createObjRequest();
      const allQuery = [];
      allQuery.push(this.setAppSetting(PARAM_COMMON, req[0]));
      allQuery.push(this.setAppSetting(PARAM_FDULZ, req[1]));
      this.updateData = {};
      this.formChanged.emit(false);
      this.isChangeForm = false;
      return Promise.all(req)
      .then(data => {
        this.updateParams(req[0], req[1]);
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
        this.form.enable();
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
          /* this.afterCreate(); */
        })
        .catch(err => {
          if (err.code !== 401) {
            console.log(err);
          }
          this._errorSrv.errorHandler(err);
        });
    } else {
      this.form.disable({ emitEvent: false });
    }

  }
}
