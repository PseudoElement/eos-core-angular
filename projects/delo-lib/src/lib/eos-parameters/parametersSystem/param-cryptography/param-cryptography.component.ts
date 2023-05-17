import { Component, Injector, Input } from '@angular/core';
import { ICryptographyParams, IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { BsModalRef } from 'ngx-bootstrap';
import { BaseParamComponent } from '../shared/base-param.component';
import { CRYPTO_PARAM, CRYPTO_PARAM_BTN_TABEL_SECOND } from '../shared/consts/cryptography.const';
import { ITableBtn, ITableData, ITableHeader } from '../shared/interfaces/tables.interfaces';
import { ELEMENT_PROTECT_NOT_DELET, PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { IOrderTable } from '../../../eos-common/index';
import { Validators } from '@angular/forms';



@Component({
    selector: 'eos-param-cryptography',
    templateUrl: 'param-cryptography.component.html',
    styleUrls: ['./param-cryptography.component.scss']
})
export class ParamCryptographyComponent extends BaseParamComponent {
    @Input() btnError;
    modalCollection: BsModalRef;
    public paramReceive: IUploadParam = {
        namespace: 'Eos.Delo.Settings.Cryptography',
        typename: 'CryptographyCfg'
    };
    public masDisable: any[] = [];
    public orderBy: boolean = true;
    public editElement = false;
    public disableForm = true;
    public arrayBtn: ITableBtn[] = [...CRYPTO_PARAM_BTN_TABEL_SECOND];
    public title = 'Хранилище сертификатов';
    public maxKey = 0;
    public showCard = false;
    public titleEdit;
    public editData;
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
    public deletedElem = [];
    public tableString = [];
    constructor( injector: Injector,
        // private _eaps: EosAccessPermissionsService,
        ) {
        super( injector, CRYPTO_PARAM);
        this.init()
        .then(() => {
            this.cancelEdit();
        })
        .catch(err => {
            if (err.code !== 401) {
                console.log(err);
            }
        });
    }
    init() {
        return this.getAppSetting<ICryptographyParams>(this.paramReceive)
        .then(Receive => {
            Object.keys(Receive).forEach((key) => {
                if (typeof(+key) === 'number' && !isNaN(+key)) {
                    this.maxKey = +key;
                }
                this.tabelData.data.push({
                    'ProfileName': Receive[key]['ProfileName'],
                    'InitString': Receive[key]['InitString'],
                    'CertStores': Receive[key]['CertStores'],
                    'key': key
                });
            });
            this.prepareDataParam();
            this.prepareData = this.convData([]);
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            this.subscribeChangeForm();
        })
        .catch(err => {
            throw err;
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
                this.openModalForm('Добавление профиля криптографии');
                break;
            case 'edit':
                this.openModalForm('Редактирование профиля криптографии');
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
    openModalForm(title: string) {
        this.showCard = true;
        this.titleEdit = title;
        if (title === 'Редактирование профиля криптографии') {
            this.editData = this.tabelData.data.filter((item) => item.check)[0];
        } else {
            this.editData = undefined;
        }
        this.form.controls['rec.ProfileName'].setValidators([Validators.required]);
    }
    submitEmit($event: any) {
        const allRequest = [];
        const newCert: ICryptographyParams = {
            CertStores: this.form.controls['rec.CertStores'].value,
            InitString: this.form.controls['rec.InitString'].value,
            ProfileName: this.form.controls['rec.ProfileName'].value
        };
        const newInstance =  this.editData ? '' + this.editData.key : '' + (this.maxKey + 1);
        const newReceive = Object.assign({instance: newInstance}, this.paramReceive);
        allRequest.push(this.setAppSetting(newReceive, newCert));
        if (this.editData) {
            this.tabelData.data.forEach((item) => {
                if ('' + item.key === '' + this.editData.key) {
                    item['CertStores'] = newCert['CertStores'];
                    item['InitString'] = newCert['InitString'];
                    item['ProfileName'] = newCert['ProfileName'];
                }
            });
        } else {
            this.tabelData.data.push({
                'ProfileName': newCert['ProfileName'],
                'CertStores': newCert['CertStores'],
                'InitString': newCert['InitString'],
                'key': newInstance
            });
            this.orderHead({id: this.tableHeader[0].id, order: this.tableHeader[0].order});
        }
        Promise.all(allRequest)
        .then(() => {
            this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.showCard = false;
            if (this.deletedElem.length > 0) {
                this.formChanged.emit(true);
            } else {
                this.formChanged.emit(false);
            }
        })
        .catch((er) => {
            this.msgSrv.addNewMessage({
                type: 'danger',
                title: 'Ошибка сервера',
                msg: er.message ? er.message : er
              });
        });
        
    }
    submit(): Promise<any> {
        const allQuery = [];
        this.deletedElem.forEach((item) => {
            const deletCryptograp: IUploadParam = {
                namespace: 'Eos.Delo.Settings.Cryptography',
                typename: 'CryptographyCfg',
                instance: '' + item.key
            };
            allQuery.push(this.setAppSetting(deletCryptograp, {}));
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
    cancelEmit($event: any) {
        this.updateData = {};
        this.showCard = false;
        if (this.deletedElem.length > 0) {
            this.formChanged.emit(true);
        } else {
            this.formChanged.emit(false);
        }
    }
}
