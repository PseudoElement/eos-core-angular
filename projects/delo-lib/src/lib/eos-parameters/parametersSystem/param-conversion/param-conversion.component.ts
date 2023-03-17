import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, } from '../shared/consts/eos-parameters.const';
import { CONVERSION_PARAM } from '../shared/consts/conversion.const';
import { Validators } from '@angular/forms';
import { IConverterParam, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from '../../../eos-rest/core/consts';

@Component({
    selector: 'eos-parameters-conversion',
    templateUrl: 'param-conversion.component.html',
})
export class ParamConversionComponent extends BaseParamComponent {
    @Input() btnError;
    public isLoading = true;
    public masDisable: any[] = [];
    public oldData: any;
    public paramConverter: IUploadParam = {
        namespace: 'Eos.Platform.Settings.Converter',
        typename: 'ConverterCfg',
        instance: 'Default'
    };
    public openAcord = false;
    constructor(injector: Injector,
    ) {
        super(injector, CONVERSION_PARAM);
        this.init()
        .then(() => {
            this.cancel();
        }).catch(err => {
            this._errorSrv.errorHandler(err);
        });
    }
    init(): Promise<any> {
        const allRequest = [];
        allRequest.push(this.getData({'GetLibLibraries': ALL_ROWS }));
        allRequest.push(this.getAppSetting<IConverterParam>(this.paramConverter));
        return Promise.all(allRequest)
        .then(([libLibrary, Converter]) => {
            this.prepareData = this.convData([]);
            this.prepareDataParam();
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.inputs['rec.LibraryName'].options = [];
            Object.keys(libLibrary[0]).forEach((key) => {
                if (key !== '__metadata') {
                    this.inputs['rec.LibraryName'].options.push({value: key, title: libLibrary[0][key]});
                }
            });
            if (Converter) {
                this.updatePrepareData(Converter);
                this.updateFormForPrepare();
            }
            this.form.controls['rec.LibraryName'].setValidators([Validators.required]);
            this.form.controls['rec.LibraryDirectory'].setValidators([Validators.required]);
            this.form.controls['rec.MaxCacheSize'].setValidators([Validators.required]);
            this.subscribeChangeForm();
        })
        .catch((er) => {
            this._errorSrv.errorHandler({code: er.status, message: er.error});
        });
    }

    edit() {
        this.form.enable({ emitEvent: false });
    }

    openAccordion() {
        this.openAcord = !this.openAcord;
    }

    submit() {
        const newConverter: IConverterParam = {
            Library: {
                Name: this.updateData['LibraryName'] !== undefined ? this.updateData['LibraryName'] : this.prepareData.rec['LibraryName'],
                Directory: this.updateData['LibraryDirectory'] !== undefined ? this.updateData['LibraryDirectory'] : this.prepareData.rec['LibraryDirectory'],
            },
            MaxCacheSize: this.updateData['MaxCacheSize'] !== undefined ? +this.updateData['MaxCacheSize'] : +this.prepareData.rec['MaxCacheSize'],
            ConverterFormat: this.prepareData.rec['ConverterFormat'],
            Name: this.updateData['Name'],
            IsActive: this.updateData['IsActive'] !== undefined ? Boolean(this.updateData['IsActive']) : Boolean(this.prepareData.rec['IsActive']),
            ServerURL: this.updateData['ServerURL'] !== undefined ? this.updateData['ServerURL'] : this.prepareData.rec['ServerURL']
        };
        this.setAppSetting(this.paramConverter, newConverter)
        .then(() => {
            this.updateData = {};
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.isLoading = true;
            this.form.disable();
            this.updatePrepareData(newConverter);
        })
        .catch((error) => {
            this.msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка сервера',
                msg: error.message ? error.message : error
            });
        });
    }
    cancel() {
        if (this.isChangeForm) {
            this.updateFormForPrepare();
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.updateData = {};
            this.form.disable();
          } else {
            this.form.disable();
            this.formChanged.emit(false);
          }
    }
    updatePrepareData(newConverter: IConverterParam) {
        Object.keys(newConverter).forEach((key) => {
            if (key === 'Library') {
                this.prepareData.rec['LibraryName'] = newConverter[key] ? newConverter[key].Name : '';
                this.prepareData.rec['LibraryDirectory'] = newConverter[key] ? newConverter[key].Directory : '';
            } else if (key === 'IsActive') {
                this.prepareData.rec[key] = newConverter[key] ? '1' : '0';
            } else {
                this.prepareData.rec[key] = newConverter[key] === null || newConverter[key] === undefined ? '' : newConverter[key];
            }
        });
    }
    updateFormForPrepare() {
        Object.keys(this.prepareData.rec).forEach((key) => {
            this.form.controls['rec.' + key].setValue(this.prepareData.rec[key], { emitEvent: false });
        });
    }
}
