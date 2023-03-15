import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CertStoresService } from '../../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
// import { PARM_ERR_OPEN_CERT_STORES } from '../../../../../eos-parameters/parametersSystem/shared/consts/eos-parameters.const';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IListStores } from '../../../../../eos-parameters/parametersSystem/shared/consts/web.consts';
import { CarmaHttp2Service } from '../../../../../app/services/camaHttp2.service';
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

    @Output() closeAddCertModal = new EventEmitter;
    public certSystemStore: string;
    public certSystemAddress: string;
    public currentSelectNode: IListStores;
    public statusBtnSub;
    public listStores: IListStores[] = [];
    public sheckSelect: string;
    private mapBtnName = new Map([
        ['CERT_DIFF_CHECK_STORES', 'sslm'],
        ['CERT_OTHER_STORES', 'sscu'],
        ['CERT_USER_STORES', 'sscu']
       ]);
   // private modalRef: BsModalRef;
    constructor(
        public certStoresService: CertStoresService,
        public cermaHttp2Srv: CarmaHttp2Service,
        // private msgSrv: EosMessageService
        //   private _modalService: BsModalService,
    ) {

    }
    searchStore() {
        if (this.certSystemStore === 'sslm' || this.certSystemStore === 'sscu' || this.certSystemStore === 'remote') {
            this.cermaHttp2Srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
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
                console.log(e);
            });
        }
        if (this.certSystemStore === 'sss') {
            this.cermaHttp2Srv.EnumStores(this.certSystemStore, this.certSystemAddress).then(stores => {
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
    onChangeSelect($event) {
        this.certSystemAddress = '';
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
        this.sheckSelect = this.mapBtnName.get(this.inputName);

    }
    ngOnInit() {
        setTimeout(() => {
            this.init();
            if (this.certSystemStore === 'sscu') {
                this.searchStore();
            }
        }, 0);
    }



}
