import {Component, TemplateRef, OnInit, Input} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CertStoresService, IListCertStotes } from '../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'eos-signature-popup',
    styleUrls: ['signature-popup.component.scss'],
    templateUrl: 'signature-popup.component.html',
    providers: [CertStoresService]
})

export class SignaturePopupComponent implements OnInit {
    @Input() inputName: string;
    @Input() input: FormControl;
    @Input() form: FormGroup;
    public  CurrentSelect: IListCertStotes;
    public InfoSert: Array<string> = [];
    public currentName: string;
    public listCertStores: IListCertStotes[] = [];
    private listCertNode: Observable<any> = new Observable();
    private modalRef: BsModalRef | null;
    private modalRef2: BsModalRef;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
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
      this.certStoresService.updateFormControlStore$
      .takeUntil(this.ngUnsubscribe)
      .subscribe((data: string) => {
        this.form.controls[this.inputName].patchValue(data);
  });
    }
    getItems() {
        this.certStoresService.formControlInit = this.form.controls['CRYPTO_INITSTR'];
        let certStores = [];
        if (typeof this.form.controls[this.inputName].value === 'string' && this.form.controls[this.inputName].value !== '') {
            certStores = this.form.controls[this.inputName].value.split('\t');
        }
        this.certStoresService.initCarma(certStores);
        this.listCertStores =  this.certStoresService.getListCetsStores;

    }

    showCert(template: TemplateRef<any>, list: IListCertStotes) {
        this.currentName = `${list.Location} ${list.Name}`;
        this.listCertNode = this.certStoresService.showListCertNode();
        this.listCertNode
        .subscribe(data => {
            this.InfoSert = data;
            this.modalRef = this._modalService.show(template, { class: 'modal-sm' });
        }, error => {
            this.InfoSert = [];
            this.modalRef = this._modalService.show(template, { class: 'modal-sm' });
        });
    }

    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this._modalService.show(template, { class: 'seconds' });
      }
    closeFirstModal() {
        if (!this.modalRef) {
            return;
        }
        this.modalRef.hide();
        this.modalRef = null;
    }
    closeAddCertModal() {
        this.modalRef2.hide();
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
    deleteStores() {
        this.form.controls[this.inputName].patchValue(this.certStoresService.deleteStores());
    }


}
