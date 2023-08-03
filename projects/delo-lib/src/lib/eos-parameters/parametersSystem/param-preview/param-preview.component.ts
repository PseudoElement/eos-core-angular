import { Component, Injector, Input, ViewChild } from '@angular/core';
import { IPreviewParams, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';

import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { PREVIEW_PARAM } from '../shared/consts/preview.const';
import { ALL_ROWS } from '../../../eos-rest';

const PARAM_PREVIEW: IUploadParam = {
    namespace: AppsettingsParams.FileOper,
    typename: AppsettingsTypename.Preview,
    instance: 'Default'
};

@Component({
    selector: 'eos-param-preview',
    templateUrl: './param-preview.component.html',
    styleUrls: ['./param-preview.component.scss']
})
export class ParamPreviewComponent extends BaseParamComponent {
    @ViewChild('headerElement', {static: false}) headerElement;
    @Input() btnError;
    constructor(injector: Injector) {
        super(injector, PREVIEW_PARAM);
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
        allRequest.push(this.getAppSetting<IPreviewParams>(PARAM_PREVIEW));
        allRequest.push(this.getData({'APP_HOST': ALL_ROWS }));
        return Promise.all(allRequest)
        .then(([preview, appHost]) => {
            if (appHost && appHost.length) {
                appHost.forEach((host) => {
                    this.inputs['rec.ConverterUseInstanceName'].options.push({value: host['ISN_APP_HOST'], title: host['DISPLAY_NAME']});
                });
            }
            this.updateParams(preview);
        });
    }
    updateParams(preview: IPreviewParams) {
        if (preview) {
            if (preview.ConverterUse) {
                this.form.controls['rec.ConverterUseType'].setValue('' + preview.ConverterUse.Type, { emitEvent: false });
                this.form.controls['rec.ConverterUseInstanceName'].setValue(preview.ConverterUse.InstanceName, { emitEvent: false });
                this.prepareData.rec['ConverterUseType'] = '' + preview.ConverterUse.Type;
                this.prepareData.rec['ConverterUseInstanceName'] = preview.ConverterUse.InstanceName;
            }
            this.form.controls['rec.ConverterMaxFileSize'].setValue(preview.ConverterMaxFileSize, { emitEvent: false });
            this.form.controls['rec.TimeOutWaitConverting'].setValue(preview.TimeOutWaitConverting, { emitEvent: false });
            this.prepareData.rec['ConverterFormat'] = preview.ConverterFormat;
            this.prepareData.rec['ConverterMaxFileSize'] = preview.ConverterMaxFileSize;
            this.prepareData.rec['TimeOutWaitConverting'] = preview.TimeOutWaitConverting;
            this.form.controls['rec.IsActive'].setValue(preview.IsActive, { emitEvent: false });
        }
    }

    edit() {
        this.form.enable({ emitEvent: false });
    }
    createObjRequest(): IPreviewParams[] {
        
        const preview: IPreviewParams = {
            IsActive: this.updateData['IsActive'] !== undefined ? Boolean(+this.updateData['IsActive']) : Boolean(+this.prepareData.rec['IsActive']),
            ConverterUse: {
                Type: this.updateData['ConverterUseType'] !== undefined ? +this.updateData['ConverterUseType'] : +this.prepareData.rec['ConverterUseType'],
                InstanceName: this.updateData['ConverterUseInstanceName'] !== undefined ? this.updateData['ConverterUseInstanceName'] : this.prepareData.rec['ConverterUseInstanceName'],
            },
            ConverterFormat: this.prepareData.rec['ConverterFormat'],
            TimeOutWaitConverting: this.updateData['TimeOutWaitConverting'] !== undefined ? +this.updateData['TimeOutWaitConverting'] : +this.prepareData.rec['TimeOutWaitConverting'],
            ConverterMaxFileSize: this.updateData['ConverterMaxFileSize'] !== undefined ? +this.updateData['ConverterMaxFileSize'] : +this.prepareData.rec['ConverterMaxFileSize'],
        }
        preview.ConverterUse.InstanceName = preview.ConverterUse.Type === 2 ? preview.ConverterUse.InstanceName : '';
        return [preview];
    }
    preSubmit() {
        this.submit();
    }
    submit() {
        if (Object.keys(this.updateData).length) {
            const req = this.createObjRequest();
            const allQuery = [];
            allQuery.push(this.setAppSetting(PARAM_PREVIEW, req[0]));
            this.updateData = {};
            this.formChanged.emit(false);
            this.isChangeForm = false;
            return Promise.all(allQuery)
            .then(data => {
                this.updateParams(req[0]);
                this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                this.form.disable({ emitEvent: false });
            })
            .catch(data => {
                this.formChanged.emit(true);
                this.isChangeForm = true;
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка сервера',
                    msg: data.message ? data.message : data
                });
                    this.form.enable({ emitEvent: false });
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
                this.form.disable({ emitEvent: false });
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
