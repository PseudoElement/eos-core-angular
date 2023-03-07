import { Component, TemplateRef, OnInit, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import { /* Observable, */ Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CertStoresService, IListCertStotes } from '../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
// import { CarmaError } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-signature-popup',
    styleUrls: ['signature-popup.component.scss'],
    templateUrl: 'signature-popup.component.html',
    providers: [CertStoresService]
})

export class SignaturePopupComponent implements OnInit {
    @Input() inputName: string;
    @Input() input: UntypedFormControl;
    @Input() form: UntypedFormGroup;
    @Input() isCurrentSettings?: boolean;
    public CurrentSelect: IListCertStotes;
    public InfoSert: Array<string> = [];
    public currentName: string;
    public listCertStores: IListCertStotes[] = [];
    // private listCertNode: Observable<any> = new Observable();
    private modalRef: BsModalRef | null;
    private modalRef2: BsModalRef;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    constructor(
        public certStoresService: CertStoresService,
        private _modalService: BsModalService,
    ) {
    }
    ngOnInit() {
        this.getItems();
        this.certStoresService.updateFormControlStore$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
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
        this.listCertStores = this.certStoresService.getListCetsStores;

    }

    showCert(template: TemplateRef<any>, list: IListCertStotes) {
        this.currentName = `${list.Location} ${list.Name}`;
        this.certStoresService.showListCertNode().then(data => {
            if (data && data.errorMessage === 'DONE') {
                this.InfoSert = data.certificates;
                this.modalRef = this._modalService.show(template, { class: 'modal-mode' });
            }
        }).catch(e => {
            this.InfoSert = [];
            this.modalRef = this._modalService.show(template, { class: 'modal-mode' });
        });
    }

    openModal2(template: TemplateRef<any>) {
        this.modalRef2 = this._modalService.show(template, { class: 'modal-mode' });
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
