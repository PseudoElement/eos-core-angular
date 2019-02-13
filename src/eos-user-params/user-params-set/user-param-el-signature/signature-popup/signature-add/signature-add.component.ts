import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CertStoresService } from '../../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
import { PARM_ERR_OPEN_CERT_STORES } from '../../../../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IListStores } from '../../../../../eos-parameters/parametersSystem/shared/consts/web.consts';
//  import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: 'eos-signature-add',
    styleUrls: ['signature-add.component.scss'],
    templateUrl: 'signature-add.component.html',
})

export class SignatureAddComponent implements OnInit {
    @Input() inputName: string;
    @Input() input: FormControl;

    @Input() form: FormGroup;

    @Output('closeAddCertModal') closeAddCertModal = new EventEmitter;
    public certSystemStore: string;
    public certSystemAddress: string;
    public currentSelectNode: IListStores;
    public statusBtnSub;
    public listStores:  IListStores[];

    public listStores$: any;
    private mapBtnName = new Map([
        ['CERT_WEB_STORES', 'sslm'],
        ['CERT_OTHER_STORES', 'sscu'],
        ['CERT_USER_STORES', 'sscu']
       ]);
   // private modalRef: BsModalRef;
    constructor(
        public certStoresService: CertStoresService,
        private msgSrv: EosMessageService
     //   private _modalService: BsModalService,
        ) {

    }
    searchStore() {
        if (this.certSystemStore === 'sslm' || this.certSystemStore === 'sscu') {
            this.listStores$ = this.certStoresService.showListStores(this.certSystemStore, this.certSystemAddress)
                .catch(e => {
                    this.msgSrv.addNewMessage(PARM_ERR_OPEN_CERT_STORES);
                    return Observable.of(null);
                })
                .map(data => {
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
                    if (this.listStores.length === 0) {
                        this.currentSelectNode = null;
                    }
                    return data;
                });
            }
            if (this.certSystemStore === 'sss') {
                this.listStores$ = this.certStoresService.showListStores(this.certSystemStore, this.certSystemAddress)
                    .catch(e => {
                        this.msgSrv.addNewMessage(PARM_ERR_OPEN_CERT_STORES);
                        return Observable.of(null);
                    })
                    .map(data => {
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
                        if (this.listStores.length === 0) {
                            this.currentSelectNode = null;
                        }
                        return data;
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

    submit() {
        this.certStoresService.addStores(this.currentSelectNode);
        this.closeAddCertModal.emit();
    }
    cancel() {
        this.closeAddCertModal.emit();

    }
    init() {
        this.certSystemStore = this.mapBtnName.get(this.inputName);

    }
    ngOnInit() {
        this.init();
    }



}
