import {Component, TemplateRef, OnInit, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CertStoresService, IListCertStotes } from '../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
    selector: 'eos-signature-popup',
    styleUrls: ['signature-popup.component.scss'],
    templateUrl: 'signature-popup.component.html',
    providers: [CertStoresService]
})

export class SignaturePopupComponent implements OnInit {
    @Input() input: FormControl;
    @Input() form: FormGroup;
    public items: IListCertStotes[] = [];
    public  CurrentSelect: IListCertStotes;
    public InfoSert: Array<string> = [];
    public currentName: string;
    private listCertNode: Observable<any> = new Observable();
    private modalRef: BsModalRef;
    constructor(
        public certStoresService: CertStoresService,
        private _modalService: BsModalService,
        ) {
        this.init();
    }

    init() {

    }
    ngOnInit() {
      this.getItems();
    }
    getItems() {
        this.certStoresService.formControlInit = this.form.controls['CRYPTO_INITSTR'];
        let certStores = [];
        if (typeof this.input.value === 'string' && this.input.value !== '') {
            certStores = this.input.value.split('\t');
        }
        this.certStoresService.initCarma(certStores);
        this.items =  this.certStoresService.getListCetsStores;
    }

    showCert(template: TemplateRef<any>, list: IListCertStotes) {
        this.currentName = `${list.Location} ${list.Name}`;
        this.listCertNode = this.certStoresService.showListCertNode();
        this.listCertNode
        .subscribe(data => {
            this.InfoSert = data;
            this.modalRef = this._modalService.show(template);
        }, error => {
            this.InfoSert = [];
            this.modalRef = this._modalService.show(template);
        });
    }

    checkboxClick(e: Event) {
        e.stopPropagation();
    }
    selectedNode(list: IListCertStotes) {
        this.certStoresService.selectedNode(list);
    }
    markNode(e, list: IListCertStotes) {
        this.certStoresService.markNode(e, list);
    }

    showCertInfo(certId: string) {
        this.certStoresService.showCert(certId);
    }
}
