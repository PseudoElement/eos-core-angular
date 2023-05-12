import { Component, EventEmitter, Output, OnInit, TemplateRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { CRYPTO_PARAM_BTN_TABEL } from '../../../../eos-parameters/parametersSystem/shared/consts/cryptography.const';
import { ITableBtn, ITableData, ITableHeader, ITableSettings } from '../../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { CarmaHttp2Service } from '../../../../app/services/camaHttp2.service';
import { IListStores } from '../../../../eos-parameters/parametersSystem/shared/consts/web.consts';
import { Istore } from '../../../../app/services/carmaHttp.service';
import { EosMessageService, IOrderTable, TabelElementComponent } from '../../../../eos-common/index';
import { CARMA_UNIC_VALUE } from '../../../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppContext } from '../../../../eos-rest';

@Component({
    selector: 'eos-edit-cryptography',
    templateUrl: 'edit-cryptography.component.html'
})
export class EditCryptographyComponent implements OnInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() allData: any[];
    @Input() inputs;
    @Input() dataProfile;
    @Input() prepareData;
    @Input() title;
    @Output() submitEmit = new EventEmitter();
    @Output() cancelEmit = new EventEmitter();
    @ViewChild('modalStorage') modalStorage: TemplateRef<any>;
    @ViewChild('infoCrypto') template: TemplateRef<any>;
    @ViewChild("tableRef") tableRef: TabelElementComponent;
    edit = true;
    nameProfile: string;
    initStr: string;
    modalWordRef: BsModalRef;
    certSystemStore: string = 'sslm';
    certSystemAddress: string;
    listStores: IListStores[];
    currentSelectNode: IListStores;
    openModal = false;
    public editCertId: number;
    public InfoSert: Array<string> = [];
    public modalRef: BsModalRef | null;
    public currentName: string;
    public arrayBtn: ITableBtn[] = [...CRYPTO_PARAM_BTN_TABEL, {
        tooltip: 'Просмотреть',
        disable: true,
        iconActiv: 'eos-adm-icon-info-blue',
        iconDisable: 'eos-adm-icon-info-grey',
        id: 'show'
    },];
    public settingsTable: ITableSettings = {
        selectedRow: true
    };
    public tableHeader: ITableHeader[] = [
        {
            title: 'Хранилище',
            id: 'name',
            order: 'asc',
            style: {
                width: '100%',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            }
        },
    ];
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: this.tableHeader,
        data: []
    };
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        private _modalSrv: BsModalService,
        private _msgSrv: EosMessageService,
        private _cermaHttp2Srv: CarmaHttp2Service,
        private _appContext: AppContext
    ) { }
    async ngOnInit() {
        this.init();
        const stores: Istore[] = [{ Location: 'sscu', Address: '', Name: 'My' }];
        if (this.dataProfile) {
            this.form.controls['rec.ProfileName'].setValue(this.dataProfile['ProfileName'], { emitEvent: false });
            this.form.controls['rec.InitString'].setValue(this.dataProfile['InitString'], { emitEvent: false });
            this.form.controls['rec.CertStores'].setValue(this.dataProfile['CertStores'], { emitEvent: false });
            this.prepareData.rec['ProfileName'] = this.dataProfile['ProfileName'];
            this.prepareData.rec['InitString'] = this.dataProfile['InitString'];
            this.prepareData.rec['CertStores'] = this.dataProfile['CertStores'];
        } else {
            this.form.controls['rec.ProfileName'].setValue('', { emitEvent: false });
            this.form.controls['rec.InitString'].setValue('', { emitEvent: false });
            this.form.controls['rec.CertStores'].setValue('', { emitEvent: false });
            this.prepareData.rec['ProfileName'] = '';
            this.prepareData.rec['InitString'] = '';
            this.prepareData.rec['CertStores'] = '';
        }
        let cryptoStr = "";
        this._appContext.reInit().then(async () => {
            this._appContext.CurrentUser['USER_PARMS_List'].forEach((params) => {
                if (params['PARM_NAME'] === 'CRYPTO_INITSTR') {
                    cryptoStr = params['PARM_VALUE'];
                }
            });
            if (!cryptoStr) {
                const crypto = await this._appContext.get99UserParms('CRYPTO_INITSTR');
                cryptoStr = crypto['PARM_VALUE'];
            }
            const addr = cryptoStr ? cryptoStr : "";

            this._cermaHttp2Srv.connectWrapper(addr, stores, false).catch(e => {
                console.log(e);
            });
        })


        this.updateTableList(this.prepareData.rec['CertStores']);
        this.orderHead({ id: this.tableHeader[0].id, order: this.tableHeader[0].order });
        this.form.controls['rec.ProfileName'].valueChanges
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((state: string) => {
                if (state) {
                    let flag = false;
                    this.allData.forEach((item) => {
                        if (item['ProfileName'] === state) {
                            flag = true;
                        }
                    });
                    if (flag) {
                        this.form.controls['rec.ProfileName'].setErrors(null);
                        this.form.controls['rec.ProfileName'].setErrors({ valueError: 'Название профиля должно быть уникальным' });
                    } else {
                        this.form.controls['rec.ProfileName'].setErrors(null);
                    }
                } else {
                    this.form.controls['rec.ProfileName'].setErrors(null);
                    this.form.controls['rec.ProfileName'].setErrors({ isRequired: undefined });
                }
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    init() {
        this.arrayBtn.forEach((btn) => {
            if (btn.id === 'add') {
                btn.disable = false;
            } else {
                btn.disable = true;
            }
        });
    }
    cancel() {
        this.cancelEmit.emit();
    }
    submit() {
        this.submitEmit.emit();
    }
    actionTo(action: string) {
        switch (action) {
            case 'add':
                this.addWord();
                break;
            case 'edit':
                this.editWord();
                break;
            case 'deleted':
                this.tabelData.data = this.updateToDelete(this.tabelData.data);
                break;
            case 'show':
                this.showCert();
                break;
            default:
                break;
        }
    }
    addWord() {
        this.certSystemStore = 'sslm';
        this.certSystemAddress = '';
        this.listStores = [];
        this._openModal();
    }
    editWord() {
        const cert = this.tabelData.data.filter((item) => item.check)[0] || this.tableRef.currentRow;
        this.certSystemStore = cert['name'].split(':')[0];
        this.editCertId = cert['key'];
        this.searchStore();
        this._openModal();
    }
    updateToDelete(data: any[]): any[] {
        const newElem = [];
        data.forEach((item) => {
            if (!item.check) {
                newElem.push(item);
            }
        });
        this.form.controls['rec.CertStores'].setValue(newElem.join(' '));
        return newElem;
    }
    cancelModal() {
        this.editCertId = undefined;
        this.modalWordRef.hide();
        this.openModal = false;
    }
    submitModal() {
        const cert = this.form.controls['rec.CertStores'];
        let item = '';
        this.listStores.forEach(node => {
            if (node.selected) {
                if (cert.value.indexOf(node.Location + ':' + node.Name) === -1) {
                    if (this.editCertId === undefined) {
                        item = cert.value ? ' ' + node.Location + ':' + node.Name : node.Location + ':' + node.Name;
                    } else {
                        const certArr = cert.value.split(' ');
                        certArr[this.editCertId] = node.Location + ':' + node.Name;
                        item = certArr.join(' ');
                    }

                } else {
                    this._msgSrv.addNewMessage(CARMA_UNIC_VALUE);
                }
            }
        });
        let newItem;
        if (this.editCertId === undefined) {
            newItem = cert.value + item;
        } else {
            newItem = item;
        }
        cert.setValue(newItem);
        this.editCertId = undefined;
        this.updateTableList(newItem);
        this.modalWordRef.hide();
        this.openModal = false;
    }
    private _openModal() {
        this.modalWordRef = this._modalSrv.show(this.modalStorage, { class: 'modalCrypto', ignoreBackdropClick: true });
        this.openModal = true;
    }
    onChangeSelect($event) {
        this.certSystemAddress = '';
    }
    /*
    * Обновление
    */
    updateTableList(newItem: string) {
        this.tabelData.data = [];
        if (newItem) {
            newItem.split(' ').forEach((item, index) => {
                this.tabelData.data.push({
                    name: item,
                    key: index
                });
            });
        }
    }
    /*
    * Запрос на получение данных сертификатов
    */
    searchStore() {
        if (this.certSystemStore === 'sslm' || this.certSystemStore === 'sscu' || this.certSystemStore === 'remote') {
            this._cermaHttp2Srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
                const listStores: IListStores[] = [];
                if (stores && stores.length) {
                    stores.forEach(item => {
                        const arr = item.split('\\');
                        listStores.push({
                            title: arr[arr.length - 1],
                            Name: arr[arr.length - 1],
                            selected: false,
                            Location: this.certSystemStore === 'sslm' ? 'sslm' : 'sscu',
                            Address: this.certSystemAddress || ''
                        });
                    });
                }
                this.listStores = listStores;
                if (this.listStores.length === 0) {
                    this.currentSelectNode = null;
                }
            }).catch(e => {
                this._msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка приложения!',
                    msg: e.message ? e.message : e,
                });
            });
        }
        if (this.certSystemStore === 'sss') {
            this._cermaHttp2Srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
                const listStores = [];
                if (stores && stores.length) {
                    stores.forEach(item => {
                        const arr = item.split('\\');
                        listStores.push({
                            title: arr[arr.length - 1],
                            Name: item,
                            selected: false,
                            Location: 'sss',
                            Address: this.certSystemAddress || ''
                        });
                    });
                }
                this.listStores = listStores;
                if (this.listStores.length === 0) {
                    this.currentSelectNode = null;
                }
            }).catch(e => {
                console.log(e);
            });
        }
    }
    /*
    * Выбор записи из таблицы Хранилище сертификатов на вход принимает весь список элементов
    */
    selectNode(list: IListStores) {
        this.currentSelectNode = list;
        this.listStores.forEach(node => {
            if (node === list) {
                node.selected = true;
            } else {
                node.selected = false;
            }
        });
    }
    /*
    * Обновление доступности кнопок в зависимости от выбранных значений таблицы
    */
    selectElement($event) {
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
                case 'show':
                    elem.disable = !($event.length === 1);
                    break;
                default:
                    break;
            }
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
    showCert(row?) {
        let param;
        if (!row) {
            const list = this.tabelData.data.filter((item) => item.check)[0] || this.tableRef.currentRow;
            param = list['name'].split(':');
        } else {
            param = row['name'].split(':');
        }
        this._cermaHttp2Srv.EnumCertificates(param[0], this.certSystemAddress || '', param[1]).then(data => {
            if (data) {
                this.InfoSert = data;
                this.modalRef = this._modalSrv.show(this.template, { class: 'modal-mode' });
                this.openModal = true;
                this._modalSrv.onHide.subscribe(() => {
                    this.openModal = false;
                });
            }
        }).catch(e => {
            this.InfoSert = [];
            this.modalRef = this._modalSrv.show(this.template, { class: 'modal-mode' });
            this.openModal = true;
            this._modalSrv.onHide.subscribe(() => {
                this.openModal = false;
            });
        });
    }
    dbClickRow($event) {
        this.showCert($event);
    }
    showCertInfo(certId: string) {
        this._cermaHttp2Srv.showCertInfo(certId);
    }

}
