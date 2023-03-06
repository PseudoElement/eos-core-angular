import { Component, Injector, Input } from '@angular/core';
import { IUploadParam } from '../../../eos-parameters/interfaces/app-setting.interfaces';
import { BsModalRef } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { BaseParamComponent } from '../shared/base-param.component';
import { CRYPTO_PARAM, CRYPTO_PARAM_BTN_TABEL } from '../shared/consts/cryptography.const';
import { ITableBtn, ITableData, ITableHeader } from '../shared/interfaces/tables.interfaces';
import { EditCryptographyComponent } from './edit-cryptography/edit-cryptography.component';

/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */


@Component({
    selector: 'eos-param-cryptography',
    templateUrl: 'param-cryptography.component.html',
    styleUrls: ['./param-cryptography.component.scss']
})
export class ParamCryptographyComponent extends BaseParamComponent {
    @Input() btnError;
    modalCollection: BsModalRef;
    public masDisable: any[] = [];
    public orderBy: boolean = true;
    public editElement = false;
    public disableForm = true;
    public arrayBtn: ITableBtn[] = CRYPTO_PARAM_BTN_TABEL;
    public title = 'Хранилище сертификатов';
    public tableHeader: ITableHeader[] = [
        {
            title: 'Наименование',
            id: 'name',
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
        private _modalSrv: BsModalService,
        ) {
        super( injector, CRYPTO_PARAM);
        this.init()
        .then(() => {
            this.cancelEdit();
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    init() {
        /* this.prepareDataParam();
        this.prepareData = this.convData([]);
        this.inputs = this.getInputs();
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        this.subscribeChangeForm(); */
        const paramReceive: IUploadParam = {
            namespace: 'Eos.Delo.Settings.Cryptography',
            typename: 'CryptographyCfg'
        };
        /* const allQueryGet = [];
        allQueryGet.push(this.getAppSetting<any>(paramReceive)); */
        return this.getAppSetting<any>(paramReceive)
        .then(data => {
            this.prepareData = this.convData(data);
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
            btn.disable = false;
        });
        this.disableForm = false;
    }
    cancelEdit() {
        this.arrayBtn.forEach((btn) => {
            btn.disable = true;
        });
        this.disableForm = true;
        /* this.masDisable = [];
        this.form.disable({ emitEvent: false }); */
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
                break;
            default:
                break;
        }
    }
    openModalForm(title: string) {
        this.modalCollection = this._modalSrv.show(EditCryptographyComponent, {
            class: 'modal-collection',
            animated: false,
            ignoreBackdropClick: true
        });
        this.modalCollection.content.title = title;
        this.modalCollection.content.closeCollection.subscribe(() => {
            this.modalCollection.hide();
        });
    }
}
