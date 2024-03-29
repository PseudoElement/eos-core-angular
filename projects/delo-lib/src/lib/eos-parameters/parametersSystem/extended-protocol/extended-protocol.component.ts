import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, } from '../shared/consts/eos-parameters.const';
import { Validators } from '@angular/forms';
import { IExtendedParams, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { EXTENDED_PARAMS } from '../shared/consts/extended_protocol.const';

@Component({
    selector: 'eos-extended-protocol',
    templateUrl: 'extended-protocol.component.html',
})
export class ParamExtendedProtocolComponent extends BaseParamComponent {
    @Input() btnError;
    public isLoading = true;
    public masDisable: any[] = [];
    public oldData: any;
    public paramConverter: IUploadParam = {
        namespace: AppsettingsParams.ExtendedProtocol,
        typename: AppsettingsTypename.TExportStorage,
        instance: 'Default'
    };
    public openAcord = false;
    constructor(injector: Injector,
    ) {
        super(injector, EXTENDED_PARAMS);
        this.init()
        .then(() => {
            this.cancel();
        }).catch(err => {
            this._errorSrv.errorHandler(err);
        });
    }
    init(): Promise<any> {
        const allRequest = [];
        allRequest.push(this.getData({'LIB_LIBRARY': ALL_ROWS }));
        allRequest.push(this.getAppSetting<IExtendedParams>(this.paramConverter));
        return Promise.all(allRequest)
        .then(([libLibrary, ExtendedProtocol]) => {
            this.prepareData = this.convData([]);
            this.prepareDataParam();
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.inputs['rec.LibraryName'].options = [];
            libLibrary.forEach((item) => {
                this.inputs['rec.LibraryName'].options.push({value: item['NAME'], title: item['DESCRIPTION']});
            });
            if (ExtendedProtocol) {
                this.updatePrepareData(ExtendedProtocol);
                this.updateFormForPrepare();
            }
            this.form.controls['rec.LibraryName'].setValidators([Validators.required]);
            this.form.controls['rec.LibraryDirectory'].setValidators([Validators.required]);
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
        const newConverter: IExtendedParams = {
            Library: {
                Name: this.updateData['LibraryName'] !== undefined ? this.updateData['LibraryName'] : this.prepareData.rec['LibraryName'],
                Directory: this.updateData['LibraryDirectory'] !== undefined ? this.updateData['LibraryDirectory'] : this.prepareData.rec['LibraryDirectory'],
            }
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
    updatePrepareData(newConverter: IExtendedParams) {
        Object.keys(newConverter).forEach((key) => {
            if (key === 'Library') {
                this.prepareData.rec['LibraryName'] = newConverter[key] ? newConverter[key].Name : '';
                this.prepareData.rec['LibraryDirectory'] = newConverter[key] ? newConverter[key].Directory : '';
            }
        });
    }
    updateFormForPrepare() {
        Object.keys(this.prepareData.rec).forEach((key) => {
            this.form.controls['rec.' + key].setValue(this.prepareData.rec[key], { emitEvent: false });
        });
    }
}
