import { Component, Output, EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CertStoresService } from '../../cert-stores.service';
import { PARM_ERR_OPEN_CERT_STORES } from '../../../shared/consts/eos-parameters.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IListStores } from '../../../shared/consts/web.consts';


@Component({
    selector: 'eos-add-cert-stores',
    templateUrl: 'add-cert-stores.component.html'
})
export class AddCertStoresComponent {
    @Output('closeAddCertModal') closeAddCertModal = new EventEmitter;
    titleHeader = 'Выберите хранилища сертификатов';
    certSystemStore: string = 'sslm';
    certSystemAddress: string;
    listStores$: Observable<string[]>;
    listStores: IListStores[];
    currentSelectNode: IListStores;

    constructor(
        private certStoresService: CertStoresService,
        private msgSrv: EosMessageService
    ) {}
    submit() {
        this.certStoresService.addStores(this.currentSelectNode);
        this.closeAddCertModal.emit();
    }
    cancel() {
        this.closeAddCertModal.emit();
    }
    searchStore() {
        if (this.certSystemStore === 'sslm') {
            this.listStores$ = this.certStoresService.showListStores(this.certSystemStore, this.certSystemAddress)
                .pipe(
                    catchError(e => {
                        this.msgSrv.addNewMessage(PARM_ERR_OPEN_CERT_STORES);
                        return of(null);
                    }),
                    map(data => {
                        const listStores = [];
                        if (data && data.length) {
                            data.forEach(item => {
                                const arr = item.split('\\');
                                listStores.push({
                                    title: arr[arr.length - 1],
                                    name: arr[arr.length - 1],
                                    selected: false,
                                    location: 'sslm',
                                    address: arr[arr.length - 2] || ''
                                });
                            });
                        }
                        this.listStores = listStores;
                        return data;
                    })
                );
            }
            if (this.certSystemStore === 'sss') {
                this.listStores$ = this.certStoresService.showListStores(this.certSystemStore, this.certSystemAddress)
                    .pipe(
                        catchError(e => {
                            this.msgSrv.addNewMessage(PARM_ERR_OPEN_CERT_STORES);
                            return of(null);
                        }),
                        map(data => {
                            const listStores = [];
                            if (data && data.length) {
                                data.forEach(item => {
                                    const arr = item.split('\\');
                                    listStores.push({
                                        title: arr[arr.length - 1],
                                        name: item,
                                        selected: false,
                                        location: 'sss',
                                        address: arr[arr.length - 2]
                                    });
                                });
                            }
                            this.listStores = listStores;
                            return data;
                        })
                    );
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
