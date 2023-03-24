import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CertStoresService } from '../../cert-stores.service';
import { EosMessageService } from '../../../../../eos-common/services/eos-message.service';
import { IListStores } from '../../../shared/consts/web.consts';
import { CarmaHttp2Service } from '../../../../../app/services/camaHttp2.service';


@Component({
    selector: 'eos-add-cert-stores',
    templateUrl: 'add-cert-stores.component.html'
})
export class AddCertStoresComponent implements OnInit {
    @Input() UpdateItem;
    @Output() closeAddCertModal = new EventEmitter;
    titleHeader = 'Выберите хранилища сертификатов';
    certSystemStore: string = 'sslm';
    certSystemAddress: string;
    listStores: IListStores[];
    currentSelectNode: IListStores;

    constructor(
        private certStoresService: CertStoresService,
        private carmeHttp2srv: CarmaHttp2Service,
        private msgSrv: EosMessageService
    ) { }
    ngOnInit() {
        if (this.UpdateItem) {
            this.searchStore();
        }
    }
    submit() {
        if (this.UpdateItem) {
            this.certStoresService.updateStores(this.currentSelectNode, this.UpdateItem);
        } else {
            this.certStoresService.addStores(this.currentSelectNode);
        }
        this.closeAddCertModal.emit();
    }
    cancel() {
        this.closeAddCertModal.emit();
    }
    onChangeSelect($event) {
        this.certSystemAddress = '';
    }
    searchStore() {
        if (this.certSystemStore === 'sslm') {
            this.carmeHttp2srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
                const listStores = [];
                if (stores && stores.length) {
                    stores.forEach(item => {
                        const arr = item.split('\\');
                        listStores.push({
                            title: arr[arr.length - 1],
                            Name: arr[arr.length - 1],
                            selected: false,
                            Location: 'sslm',
                            Address: this.certSystemAddress || ''
                        });
                    });
                }
                this.listStores = listStores;
            }).catch(e => {
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка приложения!',
                    msg: e.message ? e.message : e,
                });
            });
        }
        if (this.certSystemStore === 'sss') {
            this.carmeHttp2srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
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
                return stores;
            }).catch(e => {
                this.msgSrv.addNewMessage({
                    type: 'danger',
                    title: 'Ошибка приложения!',
                    msg: e.message ? e.message : e,
                });
            });
        }
    }
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
}
