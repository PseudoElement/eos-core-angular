import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CertStoresService, IListCertStotes } from '../cert-stores.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_NOT_CARMA_SERVER } from '../../shared/consts/eos-parameters.const';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html'
})

export class CertStoresComponent implements OnInit, OnDestroy {
    // @Input('formControlStores') formControlStores: FormControl;
    @ViewChild('InfoCertModal') InfoCertModal: ModalDirective;
    @ViewChild('addCertStoresModal') addCertStoresModal: ModalDirective;
    formControlStores: AbstractControl;
    cSub: Subscription;
    sSub: Subscription;
    uSub: Subscription;
    CurrentSelect: IListCertStotes;
    listCertStores: IListCertStotes[];
    orderBy: boolean = true;
    isCarma: boolean = true;
    CertStoresModal = false;
    listCertNode$: Observable<string[]>;

    constructor(
        public certStoresService: CertStoresService,
        private msgSrv: EosMessageService
    ) {}
    ngOnInit() {
        this.formControlStores = this.certStoresService.formControl;
        let certStores = [];
        if (typeof this.formControlStores.value === 'string') {
            certStores = this.formControlStores.value.split('\t');
        }
        this.certStoresService.initCarma(certStores);
        this.listCertStores = this.certStoresService.getListCetsStores;
        this.cSub = this.certStoresService.getCurrentSelectedNode$.subscribe((list: IListCertStotes) => {
            this.CurrentSelect = list;
        });
        this.sSub = this.certStoresService.getIsCarmaServer$.subscribe((data: boolean) => {
            this.isCarma = data;
        });
        this.uSub = this.certStoresService.updateFormControlStore$.subscribe((data: string) => {
            this.formControlStores.patchValue(data);
        });
    }
    ngOnDestroy() {
        this.cSub.unsubscribe();
        this.sSub.unsubscribe();
        this.uSub.unsubscribe();
    }

    toggleAllMarks(e) {
        this.certStoresService.toggleAllMarks(e);
    }
    orderByField() {
        this.certStoresService.orderByField();
        this.orderBy = !this.orderBy;
    }
    markNode(e, list: IListCertStotes) {
        this.certStoresService.markNode(e, list);
    }
    selectedNode(list: IListCertStotes) {
        this.certStoresService.selectedNode(list);
    }
    checkboxClick(e: Event) {
        e.stopPropagation();
    }
    showCert() {
        this.listCertNode$ = this.certStoresService.showListCertNode();
        this.InfoCertModal.show();
    }
    addStores() {
        if (this.isCarma) {
            this.CertStoresModal = true;
            this.addCertStoresModal.show();
        } else {
            this.msgSrv.addNewMessage(PARM_NOT_CARMA_SERVER);
        }
    }
    deleteStores() {
        this.formControlStores.patchValue(this.certStoresService.deleteStores());
    }
    closeAddCertModal() {
        this.addCertStoresModal.hide();
        this.CertStoresModal = false;
    }
}
