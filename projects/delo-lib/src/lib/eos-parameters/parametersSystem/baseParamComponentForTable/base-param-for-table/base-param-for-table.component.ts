import { Component, Inject, Injector, OnInit } from '@angular/core';
import { ITableData } from '../../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { IUploadParam } from '../../../../eos-parameters/interfaces/app-setting.interfaces';
import { PipRX } from '../../../../eos-rest';

import { ErrorHelperServices } from '../../../../eos-user-params/index';
import { BaseParamTableService } from '../../../../eos-parameters/parametersSystem/shared/service/base-param-table.service';
import { AppSettingsFields, DEFAULT_APP_SETTINGS_BTN, ResultAppSettings } from '../../../../eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { IOrderTable } from '../../../../eos-common/index';
import { BaseParamComponent } from '../../../../eos-parameters/parametersSystem/shared/base-param.component';
import { SMS_GATEWAY_PARAM } from '../../../../eos-parameters/parametersSystem/shared/consts/sms-gateway.const';
import { PARM_SUCCESS_SAVE } from '../../../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
export interface BaseParamForTable {
    appsettingsParams: IUploadParam;
    appSettingsFields: AppSettingsFields[];
    tableConfig: Omit<ITableData, "data">;
}


@Component({
    template: ""
})

export class BaseParamForTableComponent extends BaseParamComponent implements OnInit {
    public pipRx: PipRX;
    public errSrv: ErrorHelperServices;
    public tableSrv: BaseParamTableService;
    public maxKey = 0;
    public parameters: BaseParamForTable;
    public tableData: ITableData;
    public disableForm = true;
    public showCard = false;
    public editData = undefined;
    constructor(private injector: Injector, @Inject(Object) paramModel: BaseParamForTable) {
        super(injector, SMS_GATEWAY_PARAM);
        this.parameters = paramModel;
        this.pipRx = this.injector.get(PipRX);
        this.errSrv = this.injector.get(ErrorHelperServices);
        this.tableSrv = this.injector.get(BaseParamTableService);
        this.tableSrv.tableData.tableBtn = this.parameters.tableConfig.tableBtn;
        this.tableSrv.tableData.tableHeader = this.parameters.tableConfig.tableHeader;
    }

    ngOnInit(): void {
        this.pipRx.getAppSetting(this.parameters.appsettingsParams).then((result: ResultAppSettings) => {
            this.tableSrv.getTableRow(result, this.tableData?.data || []);
            this.tableData = this.tableSrv.tableData;
            this.tableData.data.forEach((value) => {
                if (typeof (+value.key) === 'number' && !isNaN(+value.key)) {
                    this.maxKey = Math.max(this.maxKey, +value.key);
                }
            })
            this.init();

        }).catch(error => {
            this.errSrv.errorHandler(error);
        })
    }
    init() {
        this.prepareDataParam();
        this.prepareData = this.convData([]);
        this.inputs = this.getInputs();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.subscribeChangeForm();
        return Promise.resolve();
    }

    cancelEmit() {
        this.showCard = false;
        this.formChanged.emit(false);
        this.init();
    }

    submit() {
        if (this.tableSrv.deletedNodesCollection.size) {
            const deletedNodes = this.tableSrv.getDeleteNodes();
            Promise.all(deletedNodes.map(node => this.pipRx.setAppSetting({
                instance: String(node.instanse),
                namespace: this.parameters.appsettingsParams.namespace,
                typename: this.parameters.appsettingsParams.typename
            }, {}))).then(() => {
                this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            }).catch((e) => {
                console.log('err', e);
                this._errorSrv.errorHandler(e);
                this.cancelEdit();
            });
        } else {
            this.cancelEdit();
        }

    }
    orderHead($event: IOrderTable) {
        this.tableData = this.tableSrv.sortOrder($event);
    }
    cancelEdit() {
        this.tableSrv.resetNodes();
        this.disableForm = true;
        this.formChanged.emit(false);
        this.ngOnInit();
    }
    edit() {
        this.tableSrv.updateBtn((btn) => {
            if (btn.id === DEFAULT_APP_SETTINGS_BTN.add) {
                btn.disable = false
            }
        })
        this.disableForm = false;
    }
    actionTo(action) {
        switch (action) {
            case DEFAULT_APP_SETTINGS_BTN.add:
                this.editData = undefined;
                this.showCard = true;
                break;
            case DEFAULT_APP_SETTINGS_BTN.edit:
                this.editData = this.tableData.data.filter((item) => item.check)[0];
                this.showCard = true;
                break;
            case DEFAULT_APP_SETTINGS_BTN.deleted:
                this.tableSrv.deleteNode();
                this.formChanged.emit(true);
                break;
            default:
                break;
        }
    }
    selectElement($event: any[]) {
        this.tableData.tableBtn.forEach((elem) => {
            switch (elem.id) {
                case DEFAULT_APP_SETTINGS_BTN.deleted:
                    elem.disable = !($event.length > 0);
                    break;
                case DEFAULT_APP_SETTINGS_BTN.add:
                    elem.disable = false;
                    break;
                case DEFAULT_APP_SETTINGS_BTN.edit:
                    elem.disable = !($event.length === 1);
                    break;
                default:
                    break;
            }
        });
    }

}
