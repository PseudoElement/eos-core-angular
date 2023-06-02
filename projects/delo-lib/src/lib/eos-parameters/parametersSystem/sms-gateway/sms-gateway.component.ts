import { Component, Injector, Input, OnInit } from '@angular/core';
import { CRYPTO_PARAM_BTN_TABEL } from '../shared/consts/cryptography.const';
import { BaseParamForTable, BaseParamForTableComponent } from '../baseParamComponentForTable/base-param-for-table/base-param-for-table.component';
import { APP_SETTINGS_SMS } from '../shared/interfaces/parameters.interfaces';
import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { ConfirmWindowService, IConfirmWindow2 } from '../../../eos-common/index';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
export const CONFIRM_DELETE: IConfirmWindow2 = {
    title: 'Внимание',
    bodyList: [],
    body: 'Данные профили, наименование: {{SMS}}, используются в настройках сервисов/приложений.',
    bodyAfterList: 'Удалить?',
    buttons: [
        { title: 'Да', result: 1, isDefault: true, },
        { title: 'Нет', result: 2, },
    ],
};

const BASE_PARAM_FOR_TABLE: BaseParamForTable = {
    appsettingsParams: {
        "instance": "",
        "namespace": APP_SETTINGS_SMS.namespace,
        "typename": APP_SETTINGS_SMS.typename
    },
    appSettingsFields: ["ProfileName", "Endpoint", "Login", "UrlTemplate", "Password"],
    tableConfig: {
        "tableBtn": [...CRYPTO_PARAM_BTN_TABEL],
        "tableHeader": [
            { "id": "ProfileName", "order": "asc", "title": "Наименование", style: { width: '100%' } },
        ]
    }
}

@Component({
    selector: 'sms-gateway',
    templateUrl: './sms-gateway.component.html',
    styleUrls: ['./sms-gateway.component.scss']
})
export class SmsGatewayComponent extends BaseParamForTableComponent implements OnInit {
    public titleHeader = "СМС-шлюз";
    @Input() btnError;
    public btnEdit = true;
    public maxKey = 0;
    constructor(injector: Injector, private _confirmSrv: ConfirmWindowService) {
        super(injector, BASE_PARAM_FOR_TABLE)
    }

    submitEmit() {
        const body: any = {};
        this.parameters.appSettingsFields.forEach(field => {
            if (field !== "Password") {
                body[field] = this.form.controls["rec." + field].value || "";
            } else {
                if (this.form.controls["rec." + field].value) {
                    body[field] = { Value: this.form.controls["rec." + field].value }
                } else {
                    body[field] = { Key: this.editData?.Password?.Key || "" }

                }
            }
        })
        const key = ++this.maxKey;
        this.pipRx.setAppSetting({
            "instance": this.editData ? String(this.editData?.key) : String(key),
            "namespace": this.parameters.appsettingsParams.namespace,
            "typename": this.parameters.appsettingsParams.typename
        }, body).then(() => {
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            if (!this.tableSrv.deletedNodesCollection.size) {
                this.formChanged.emit(false);
            }
        })
            .catch((error) => {
                console.log('err', error);
                this.formChanged.emit(false);
                this._errorSrv.errorHandler(error);
            }).finally(() => {
                this.showCard = false;
                this.ngOnInit();
            })
    }


    submit(): void {
        if (this.tableSrv.deletedNodesCollection.size) {
            this.checkUsedInstanceBeforeDelete().then(deleteNodes => {
                this.deleted(deleteNodes)
            }).catch(error => {
                console.log('err', error);
                this._errorSrv.errorHandler(error);
                this.cancelEdit();
            })

        } else {
            this.cancelEdit();
        }
    }

    public deleted(deleteNodes: any[]) {
        Promise.all(deleteNodes.map(node => this.pipRx.setAppSetting({
            instance: String(node.instanse),
            namespace: this.parameters.appsettingsParams.namespace,
            typename: this.parameters.appsettingsParams.typename
        }, {}))).then(() => {
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
        }).catch((e) => {
            console.log('err', e);
            this._errorSrv.errorHandler(e);

        }).finally(() => {
            this.cancelEdit();
        });
    }

    public checkUsedInstanceBeforeDelete() {
        return this.pipRx.getAppSetting({
            instance: "",
            typename: AppsettingsTypename.TNotification,
            namespace: AppsettingsParams.Notification
        }).then(result => {
            const allPreDeleteNode = this.tableSrv.getDeleteNodes();
            const notDeletedNodes = [];
            const deletedNode = []
            allPreDeleteNode.forEach(node => {
                let isDelete = true;
                Object.keys(result).forEach(key => {
                    if (result[key]?.SmsCfgInstanceId && +result[key].SmsCfgInstanceId === +node.instanse) {
                        isDelete = false;
                    }
                });
                if (isDelete) {
                    deletedNode.push(node);
                } else {
                    notDeletedNodes.push(node);
                }
            });
            if (notDeletedNodes.length) {
                const conf = { ...CONFIRM_DELETE }
                conf.body = conf.body.replace('{{SMS}}', notDeletedNodes.map(n => n.ProfileName).join(", "))
                return this._confirmSrv.confirm2(conf).then(res => {
                    if (res.result === 1) {
                        return deletedNode.concat(notDeletedNodes);
                    } else {
                        return deletedNode;
                    }
                });
            }
            return deletedNode;
        })
    }
}
