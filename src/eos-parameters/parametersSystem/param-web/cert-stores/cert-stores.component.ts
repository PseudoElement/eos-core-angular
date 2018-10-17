import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ElementRef } from '@angular/core';
import { CertStoresService, IListCertStotes } from '../cert-stores.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { PARM_NOT_CARMA_SERVER } from '../../shared/consts/eos-parameters.const';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html'
})

export class CertStoresComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('InfoCertModal') InfoCertModal: ModalDirective;
    @ViewChild('addCertStoresModal') addCertStoresModal: ModalDirective;
    @ViewChild('wrapper') wrapper: ElementRef;
    offsetLeftModal: number;
    formControlStores: AbstractControl;
    CurrentSelect: IListCertStotes;
    listCertStores: IListCertStotes[];
    orderBy: boolean = true;
    isCarma: boolean = false;
    CertStoresModal = false;
    listCertNode$: Observable<string[]>;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

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
        this.certStoresService.getCurrentSelectedNode$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((list: IListCertStotes) => {
            this.CurrentSelect = list;
        });
        this.certStoresService.getIsCarmaServer$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((data: boolean) => {
            this.isCarma = data;
        });
        this.certStoresService.updateFormControlStore$
            .takeUntil(this.ngUnsubscribe)
            .subscribe((data: string) => {
            this.formControlStores.patchValue(data);
        });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    ngAfterContentInit() {
        this.offsetLeftModal = this.wrapper.nativeElement.offsetLeft - 21;
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
        if (this.listCertNode$) {
            this.InfoCertModal.show();
        }
    }
    showCertInfo(certId: string) {
        this.certStoresService.showCert(certId);
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
