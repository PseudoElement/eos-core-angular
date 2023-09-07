import { Component, Injector, Input, ViewChild } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, } from '../shared/consts/eos-parameters.const';
import { CONVERSION_PARAM, CONVERSION_PARAM_BTN_TABEL, HEADER_TABLE_CONVERSION, SETTIING_TABLE_CONVERSION } from '../shared/consts/conversion.const';
import { IConverterParam, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { ECellToAll, ITableBtn, ITableData } from '../shared/interfaces/tables.interfaces';
import { APP_HOST } from '../../../eos-rest';

@Component({
    selector: 'eos-parameters-conversion',
    templateUrl: 'param-conversion.component.html',
})
export class ParamConversionComponent extends BaseParamComponent {
    @Input() btnError;
    @ViewChild('tableConversion', {static: false}) tableConversion;
    public isLoading = true;
    public masDisable: any[] = [];
    public oldData: any;
    public viewTable = true;
    public paramConverter: IUploadParam = {
        namespace: AppsettingsParams.Converter,
        typename: AppsettingsTypename.TConverter,
    };
    public openAcord = false;
    public arrayBtn: ITableBtn[] = [...CONVERSION_PARAM_BTN_TABEL];
    public settingsTable = SETTIING_TABLE_CONVERSION;
    public editData;
    public converter;
    public libLibrary;
    public appHost: APP_HOST[] = [];
    public tableHeader = [...HEADER_TABLE_CONVERSION];
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: this.tableHeader,
        data: []
    };
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
        allRequest.push(this.getData({'LIB_LIBRARY': ALL_ROWS }));
        allRequest.push(this.getAppSetting<IConverterParam>(this.paramConverter));
        allRequest.push(this.getData({'APP_HOST': ALL_ROWS }));
        return Promise.all(allRequest)
        .then(([libLibrary, Converter, appHost]) => {
            this.libLibrary = libLibrary;
            this.prepareDataParam();
            this.prepareData = this.convData([]);
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.inputs['rec.LibraryName'].options = [];
            this.libLibrary.forEach((item) => {
                this.inputs['rec.LibraryName'].options.push({value: item['NAME'], title: item['DESCRIPTION']});
            });
            this.converter = Converter;
            this.appHost = appHost;
            if (Converter) {
                this.updateTableData(Converter);
            }
            
            this.subscribeChangeForm();
        })
        .catch((er) => {
            this._errorSrv.errorHandler({code: er.status, message: er.error});
        });
    }

    edit() {
        this.form.enable({ emitEvent: false });
        this.updateBtn();
    }

    openAccordion() {
        this.openAcord = !this.openAcord;
    }

    submit() {
        this.form.disable({ emitEvent: false });
        this.updateBtn();
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.updateData = {};
            this.form.disable({ emitEvent: false });
          } else {
            this.form.disable({ emitEvent: false });
            this.formChanged.emit(false);
          }
          this.updateBtn();
    }
    updateTableData(newConverter: any) {
        this.tabelData.data = [];
        Object.keys(newConverter).forEach((key) => {
            const hostName = this.appHost.filter((host) => '' + host.ISN_APP_HOST === '' + key)[0];
            const conwert: IConverterParam =  newConverter[key];
            conwert['key'] = '' + key;
            conwert['DISPALY_NAME'] = hostName ? hostName['DISPLAY_NAME'] : '';
            conwert['InstanceName'] = conwert['InstanceName'];
            conwert['Name'] = conwert.Name || '';
            conwert['IsSharedList'] = {type: ECellToAll.checkbox, check: conwert.IsShared, click: () => {}, disabled: true};
            this.tabelData.data.push(conwert);
        })
    }
    actionTo($event) {
        switch ($event) {
            case 'edit':
                this.editData = this.tabelData.data.filter((item) => '' + item.key === '' + this.tableConversion?.selectIdLast)[0];
                this.viewTable = false;
                break;
            default:
                break;
        }
    }
    updateBtn() {
        const disabled = this.tabelData.data.filter((item) => '' + item.key === '' + this.tableConversion?.selectIdLast).length === 0;
        this.tabelData.tableBtn.forEach((btn) => {
            switch (btn.id) {
                case 'edit':
                    btn.disable = disabled || this.form.disabled;
                    break;
                default:
                    break;
            }
        });
    }
    submitEmit($event) {
        const query = [];
        const newConverter: IConverterParam = {
            Library: {
                Name: this.updateData['LibraryName'] !== undefined ? this.updateData['LibraryName'] : this.prepareData.rec['LibraryName'],
                Directory: this.updateData['LibraryDirectory'] !== undefined ? this.updateData['LibraryDirectory'] : this.prepareData.rec['LibraryDirectory'],
            },
            MaxCacheSize: this.updateData['MaxCacheSize'] !== undefined ? +this.updateData['MaxCacheSize'] : +this.prepareData.rec['MaxCacheSize'],
            Name: this.updateData['Name'] !== undefined ? this.updateData['Name'] : this.prepareData.rec['Name'],
            IsShared: this.updateData['IsShared'] !== undefined ? Boolean(+this.updateData['IsShared']) : Boolean(+this.prepareData.rec['IsShared']),
            CountProcesses: this.updateData['CountProcesses'] !== undefined ? +this.updateData['CountProcesses'] : +this.prepareData.rec['CountProcesses'],
            InstanceName: this.prepareData.rec['InstanceName'],
        };
        Object.keys(this.converter).forEach((key) => {
            if ('' + key === '' + this.editData.key) {
                this.converter[key] = newConverter;
            }
        });
        const newSetConverter = Object.assign({instance: this.editData.key}, this.paramConverter);
        if (this.updateData['LibraryName'] !== undefined ||
            this.updateData['LibraryDirectory'] !== undefined ||
            this.updateData['MaxCacheSize'] !== undefined ||
            this.updateData['Name'] !== undefined ||
            this.updateData['IsShared'] !== undefined
            ) {
            query.push(this.setAppSetting(newSetConverter, newConverter));
            
        }
        Promise.all(query)
        .then(() => {
            this.updateData = {};
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.isLoading = true;
            this.updateTableData(this.converter);
            this.updateBtn();
            this.viewTable = true;
        })
        .catch((error) => {
            this.msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка сервера',
                msg: error.message ? error.message : error
            });
        });
    }
    cancelEmit($event) {
        this.updateBtn();
        this.updateData = {};
        this.viewTable = true;
        this.formChanged.emit(false);
        this.isChangeForm = false;
    }
    selectElement($event) {
        this.updateBtn();
    }
}
