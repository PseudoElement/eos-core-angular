/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, Injector, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppsettingsParams, AppsettingsTypename } from '../../../eos-common/consts/params.const';
import { IOrderTable } from '../../../eos-common/eos-tabel-element/eos-tabel-element.component';
import { ISettingEmailCommon, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { BaseParamComponent } from '../shared/base-param.component';
import { CRYPTO_PARAM_BTN_TABEL } from '../shared/consts/cryptography.const';
import { EMAIL_PARAM } from '../shared/consts/email-param.const';
import { ELEMENT_PROTECT_NOT_DELET, PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { ITableBtn, ITableData, ITableHeader, ITableSettings } from '../shared/interfaces/tables.interfaces';

@Component({
    selector: 'eos-param-email',
    templateUrl: 'param-email.component.html',
    styleUrls: ['./param-email.component.scss']
})
export class ParamEmailComponent extends BaseParamComponent {
    @Input() btnError;
    public paramCommon: IUploadParam = {
        namespace: AppsettingsParams.Email,
        typename: AppsettingsTypename.TCommon
    };
    public paramReceive: IUploadParam = {
        namespace: AppsettingsParams.Email,
        typename: AppsettingsTypename.TReceive,
    };
    public paramSend: IUploadParam = {
        namespace: AppsettingsParams.Email,
        typename: AppsettingsTypename.TSend,
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
    public settings: ITableSettings = {
        headerTitleColor: '#F5F5F5',
    }
    public tableHeader: ITableHeader[] = [
        {
            title: 'Наименование',
            id: 'ProfileName',
            order: 'asc',
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
        });
    }
    init() {
        this.prepareDataParam();
        this.prepareData = this.convData([]);
        this.inputs = this.getInputs();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.subscribeChangeForm();
        const allQueryGet = [];
        allQueryGet.push(this.getAppSetting<ISettingEmailCommon>(this.paramCommon));
        return Promise.all<Map<string, ISettingEmailCommon>>(allQueryGet)
        .then(([Common]) => {
            Object.keys(Common).forEach((key) => {
                if (typeof(+key) === 'number' && !isNaN(+key)) {
                    this.maxKey = +key;
                }
                this.tabelData.data.push({
                    'ProfileName': Common[key]['ProfileName'],
                    'Password': Common[key]['Password'] ? Common[key]['Password']['Key'] : '',
                    'EmailAccount': Common[key]['EmailAccount'],
                    'key': key
                });
            });
            this.orderHead({id: this.tableHeader[0].id, order: this.tableHeader[0].order});
        });
    }
    orderHead($event: IOrderTable) {
        this.tabelData.data = this.tabelData.data.sort((a, b) => {
            if (a[$event.id] > b[$event.id]) {
                return $event.order === 'desc' ? -1 : 1;
            } else if (a[$event.id] < b[$event.id]) {
                return $event.order === 'desc' ? 1 : -1;
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
        if (this.deletedElem.length > 0) {
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
        }
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
        this.formChanged.emit(false);
    }
    actionTo(action) {
        switch (action) {
            case 'add':
                this.form.controls['rec.ProfileName'].setValidators([Validators.required]);
                this.editData = undefined;
                this.showCard = true;
                break;
            case 'edit':
                this.editData = this.tabelData.data.filter((item) => item.check)[0];
                this.showCard = true;
                break;
            case 'deleted':
                this.tabelData.data = this.updateToDelete(this.tabelData.data);
                if (this.deletedElem.length > 0) {
                    this.formChanged.emit(true);
                }
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
    async submitEmit() {
        const queryAll = [];
        const newEmailAcount = {
            EmailAccount: this.updateData['EmailAccount'] !== undefined ? this.updateData['EmailAccount'] : this.prepareData.rec['EmailAccount'],
            Password: {},
            ProfileName: this.updateData['ProfileName'] !== undefined ? this.updateData['ProfileName'] : this.prepareData.rec['ProfileName']
        };
        if (this.updateData['Password'] !== undefined && this.updateData['Password'] !== '') {
            newEmailAcount.Password['Value'] = this.updateData['Password'];
        } else {
            newEmailAcount.Password['Key'] = this.prepareData.rec['Password'];
        }
        if (this.updateData['DeleteEmailsOnServer'] === 'NO') {
            this.updateData['DeleteEmailsOnServer'] = false;
        }
        if (this.updateData['DeleteEmailsOnServer'] === 'YES') {
            this.updateData['DeleteEmailsOnServer'] = true;
        }
        const newEmailReceive = {
            DeleteEmailsOnServer: this.updateData['DeleteEmailsOnServer'] !== undefined ? this.updateData['DeleteEmailsOnServer'] : this.prepareData.rec['DeleteEmailsOnServer'],
            InAuthMethod: this.updateData['InAuthMethod'] !== undefined ? this.updateData['InAuthMethod'] : this.prepareData.rec['InAuthMethod'],
            InEncryption: this.updateData['InEncryption'] !== undefined ? this.updateData['InEncryption'] : this.prepareData.rec['InEncryption'],
            InServerHost: this.updateData['InServerHost'] !== undefined ? this.updateData['InServerHost'] : this.prepareData.rec['InServerHost'],
            InServerPort: this.updateData['InServerPort'] !== undefined ? +this.updateData['InServerPort'] : +this.prepareData.rec['InServerPort'],
            InServerType: this.updateData['InServerType'] !== undefined ? this.updateData['InServerType'] : this.prepareData.rec['InServerType'],
            InUserName: this.updateData['InUserName'] !== undefined ? this.updateData['InUserName'] : this.prepareData.rec['InUserName'],
            ImapFolder: this.updateData['ImapFolder'] !== undefined ? this.updateData['ImapFolder'] : this.prepareData.rec['ImapFolder'],
        };
        const newEmailSend = {
            OutAuthMethod: this.updateData['OutAuthMethod'] !== undefined ? this.updateData['OutAuthMethod'] : this.prepareData.rec['OutAuthMethod'],
            OutEncryption: this.updateData['OutEncryption'] !== undefined ? this.updateData['OutEncryption'] : this.prepareData.rec['OutEncryption'],
            OutServerHost: this.updateData['OutServerHost'] !== undefined ? this.updateData['OutServerHost'] : this.prepareData.rec['OutServerHost'],
            OutServerPort: this.updateData['OutServerPort'] !== undefined ? +this.updateData['OutServerPort'] : +this.prepareData.rec['OutServerPort'],
            OutUserName: this.updateData['OutUserName'] !== undefined ? this.updateData['OutUserName'] : this.prepareData.rec['OutUserName']
        };
        const newInstance =  this.editData ? '' + this.editData.key : '' + (this.maxKey + 1);
        const newCommon = Object.assign({instance: newInstance}, this.paramCommon);
        const newReceive = Object.assign({instance: newInstance}, this.paramReceive);
        const newSend = Object.assign({instance: newInstance}, this.paramSend);
        queryAll.push(this.setAppSetting(newCommon, newEmailAcount));
        queryAll.push(this.setAppSetting(newReceive, newEmailReceive));
        queryAll.push(this.setAppSetting(newSend, newEmailSend));
        return Promise.all(queryAll)
        .then(async () => {
            this.showCard = false;
            this.maxKey++;
            this.updateData = {};
            if (this.deletedElem.length > 0) {
                this.formChanged.emit(true);
            } else {
                this.formChanged.emit(false);
            }
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            const params = Object.assign({instance: newInstance}, this.paramCommon) ;
            const ans = await this.getAppSetting<ISettingEmailCommon>(params);
            if (this.editData) {
                this.tabelData.data.forEach((item) => {
                    if ('' + item.key === '' + this.editData.key) {
                        item['EmailAccount'] = newEmailAcount.EmailAccount;
                        item['Password'] = ans['Password']['Key'];
                        item['ProfileName'] = newEmailAcount.ProfileName;
                    }
                });
            } else {
                this.tabelData.data.push({
                    'ProfileName': newEmailAcount['ProfileName'],
                    'Password': ans['Password']['Key'],
                    'EmailAccount': newEmailAcount['EmailAccount'],
                    'key': this.maxKey
                });
            }
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
        this.updateData = {};
        this.form.controls['rec.ProfileName'].setValidators(null);
        this.showCard = false;
    }
    submit(): Promise<any> {
        const allQuery = [];
        this.deletedElem.forEach((item) => {
            const deletCommon: IUploadParam = {
                namespace: AppsettingsParams.Email,
                typename: AppsettingsTypename.TCommon,
                instance: '' + item.key
            };
            allQuery.push(this.setAppSetting(deletCommon, {}));
        });
        return Promise.all(allQuery)
        .then(() => {
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.arrayBtn.forEach((btn) => {
                btn.disable = true;
            });
            this.disableForm = true;
            this.tabelData.data.forEach((item) => {
                item.check = false;
            });
            this.deletedElem = [];
            this.formChanged.emit(false);
        })
        .catch((error) => {
            console.log('err', error);
            this._errorSrv.errorHandler(error);
        });
    }
    selectElement($event: any[]) {
        this.arrayBtn.forEach((elem) => {
            switch (elem.id) {
                case 'deleted':
                    elem.disable = !($event.length > 0);
                    break;
                case 'add':
                    elem.disable = false;
                    break;
                case 'edit':
                    elem.disable = !($event.length === 1);
                    break;
                default:
                    break;
            }
        });
    }
}
