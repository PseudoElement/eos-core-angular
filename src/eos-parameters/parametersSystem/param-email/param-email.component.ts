/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, Injector, Input} from '@angular/core';
import { Validators } from '@angular/forms';
import { IOrderTable } from 'eos-parameters/eos-tabel-element/eos-tabel-element.component';
import { ISettingEmailCommon, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { BaseParamComponent } from '../shared/base-param.component';
import { CRYPTO_PARAM_BTN_TABEL } from '../shared/consts/cryptography.const';
import { EMAIL_PARAM } from '../shared/consts/email-param.const';
import { ELEMENT_PROTECT_NOT_DELET, PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { ITableBtn, ITableData, ITableHeader } from '../shared/interfaces/tables.interfaces';

@Component({
    selector: 'eos-param-email',
    templateUrl: 'param-email.component.html',
    styleUrls: ['./param-email.component.scss']
})
export class ParamEmailComponent extends BaseParamComponent {
    @Input() btnError;
    public paramCommon: IUploadParam = {
        namespace: 'Eos.Delo.Settings.Email',
        typename: 'CommonCfg'
    };
    public masDisable: any[] = [];
    public orderBy: boolean = true;
    public editElement = false;
    public disableForm = true;
    public arrayBtn: ITableBtn[] = [...CRYPTO_PARAM_BTN_TABEL];
    public modalCollection;
    public showCard = false;
    public maxKey = 0;
    public editData;
    public deletedElem = [];
    public tableHeader: ITableHeader[] = [
        {
            title: 'Наименование',
            id: 'ProfileName',
            order: 1,
            style: {width: '100%'}
        },
    ];
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: this.tableHeader,
        data: []
    };
    public tableString = [];
    constructor( injector: Injector,
        // private _eaps: EosAccessPermissionsService,
        ) {
        super( injector, EMAIL_PARAM);
        this.init()
        .then(() => {
            this.cancelEdit();
        })
        .catch(err => {
            this._errorSrv.errorHandler(err);
            /* if (err.code !== 434 || err.statusText ===) {
                console.log(err);
            } */
        });
    }
    init() {
        this.prepareDataParam();
        this.prepareData = this.convData([]);
        this.inputs = this.getInputs();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.subscribeChangeForm();
        const allQueryGet = [];
        /* const paramReceive: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Email',
            typename: 'ReceiveCfg'
        }
        const paramSend: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Email',
            typename: 'SendCfg'
        } */
        allQueryGet.push(this.getAppSetting<ISettingEmailCommon>(this.paramCommon));
        /* allQueryGet.push(this.getAppSetting<any>(paramReceive));
        allQueryGet.push(this.getAppSetting<any>(paramSend)); */
        return Promise.all<Map<string, ISettingEmailCommon>>(allQueryGet)
        .then(([Common/* , Receive, Send */]) => {
            Object.keys(Common).forEach((key) => {
                if (typeof(+key) === 'number' && !isNaN(+key)) {
                    this.maxKey = +key;
                }
                this.tabelData.data.push({'ProfileName': Common[key]['ProfileName'], 'key': key});
            });
            this.orderHead({id: this.tableHeader[0].id, order: this.tableHeader[0].order});
        });
    }
    orderHead($event: IOrderTable) {
        this.tabelData.data.sort((a, b) => {
            if (a[$event.id] > b[$event.id]) {
                return $event.order === 2 ? -1 : 1;
            } else if (a[$event.id] < b[$event.id]) {
                return $event.order === 2 ? 1 : -1;
            } else {
                return 0;
            }
        });
    }
    edit() {
        this.arrayBtn.forEach((btn) => {
            if (btn.id === 'add') {
                btn.disable = false;
            }
        });
        this.disableForm = false;
    }
    cancelEdit() {
        this.deletedElem.forEach((item) => {
            this.tabelData.data.push(item);
        });
        this.deletedElem = [];
        this.orderHead({id: this.tableHeader[0].id, order: this.tableHeader[0].order});
        this.arrayBtn.forEach((btn) => {
            btn.disable = true;
        });
        this.disableForm = true;
        this.tabelData.data.forEach((item) => {
            item.check = false;
        });
    }
    actionTo(action) {
        switch (action) {
            case 'add':
                this.form.controls['rec.ProfileName'].setValidators([Validators.required]);
                this.form.controls['rec.ProfileName'].setValidators([Validators.required]);
                // this.form.controls['rec.ProfileName'].setValue('', { emitEvent: false });
                this.editData = undefined;
                this.showCard = true;
                break;
            case 'edit':
                this.editData = this.tabelData.data.filter((item) => item.check)[0];
                this.showCard = true;
                break;
            case 'deleted':
                this.tabelData.data = this.updateToDelete(this.tabelData.data);
                break;
            default:
                break;
        }
    }
    updateToDelete(data): any[] {
        const newElem = [];
        data.forEach((item) => {
            if (!item.check) {
                newElem.push(item);
            } else {
                if (item.key === 'Default') {
                    const massage = Object.assign({}, ELEMENT_PROTECT_NOT_DELET);
                    massage.msg = massage.msg.replace('{{prot}}', item['ProfileName']);
                    this.msgSrv.addNewMessage(massage);
                    newElem.push(item);
                } else {
                    this.deletedElem.push(item);
                }
            }
        });
        return newElem;
    }
    submitEmit() {
        const newEmailAcount = {
            EmailAccount: this.updateData['EmailAccount'] ? this.updateData['EmailAccount'] : this.prepareData.rec['EmailAccount'],
            Password: this.updateData['Password'] ? this.updateData['Password'] : this.prepareData.rec['Password'],
            ProfileName: this.updateData['ProfileName'] ? this.updateData['ProfileName'] : this.prepareData.rec['ProfileName']
        };
        const newCommon: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Email',
            typename: 'CommonCfg',
            instance: '' + (this.maxKey + 1)
        };
        this.setAppSetting(newCommon, newEmailAcount)
        .then(() => {
            this.tabelData.data.push({'ProfileName': newEmailAcount['ProfileName'], 'key': this.maxKey});
            this.showCard = false;
            this.maxKey++;
          this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
        })
        .catch((error) => {
          this.msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка сервера',
            msg: error.message ? error.message : error
          });
        });
      }
    cancelEmit() {
        this.form.controls['rec.ProfileName'].setValidators(null);
        this.showCard = false;
    }
    submit(): Promise<any> {
        const allQuery = [];
        this.deletedElem.forEach((item) => {
            const deletCommon: IUploadParam = {
                namespace: 'Eos.Delo.Settings.Email',
                typename: 'CommonCfg',
                instance: '' + item.key
            };
            allQuery.push(this.setAppSetting(deletCommon, {}));
        });
        return Promise.all(allQuery)
        .then(() => {
            this.arrayBtn.forEach((btn) => {
                btn.disable = true;
            });
            this.disableForm = true;
            this.tabelData.data.forEach((item) => {
                item.check = false;
            });
            this.deletedElem = [];
        })
        .catch((error) => {
            console.log('err', error);
            this._errorSrv.errorHandler(error);
        });
    }
    selectElement($event: any[]) {
        if ($event.length > 0) {
            this.arrayBtn.forEach((elem) => {
                if (elem.id === 'deleted') {
                    elem.disable = false;
                }
            });
        }
        if ($event.length === 1) {
            this.arrayBtn.forEach((elem) => {
                if (elem.id === 'edit') {
                    elem.disable = false;
                }
            });
        } else {
            this.arrayBtn.forEach((elem) => {
                if (elem.id === 'edit') {
                    elem.disable = true;
                }
            });
        }
    }
}
