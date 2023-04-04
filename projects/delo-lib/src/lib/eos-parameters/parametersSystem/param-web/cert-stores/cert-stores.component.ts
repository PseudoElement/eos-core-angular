import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, ElementRef, Input } from '@angular/core';
import { CertStoresService, IListCertStotes } from '../cert-stores.service';
import { /* Observable, */ Subject } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { PARM_NOT_CARMA_SERVER } from '../../shared/consts/eos-parameters.const';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html'
})

export class CertStoresComponent implements OnInit, OnDestroy, AfterContentInit {
    @ViewChild('InfoCertModal', { static: true }) InfoCertModal: ModalDirective;
    @ViewChild('addCertStoresModal', { static: true }) addCertStoresModal: ModalDirective;
    @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
    @Input() editMode;
    offsetLeftModal: number;
    formControlStores: AbstractControl;
    CurrentSelect: IListCertStotes;
    listCertStores: IListCertStotes[];
    listCertNode: any[] = [];
    orderBy: boolean = true;
    isCarma: boolean = false;
    CertStoresModal = false;
    public updateItem;
    private ngUnsubscribe: Subject<void> = new Subject<void>();

    constructor(
        public certStoresService: CertStoresService,
        //    private msgSrv: EosMessageService
    ) { }
    ngOnInit() {
        this.init();
        this.certStoresService.getCurrentSelectedNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((list: IListCertStotes) => {
                this.CurrentSelect = list;
            });
        this.certStoresService.updateFormControlStore$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
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
        if (this.editMode) {
            this.certStoresService.orderByField();
            this.orderBy = !this.orderBy;
        }
    }
    markNode(e, list: IListCertStotes) {
        this.certStoresService.markNode(e, list);
    }
    selectedNode(list: IListCertStotes) {
        if (this.editMode) {
            this.certStoresService.selectedNode(list);
        }
    }
    checkboxClick(e: Event) {
        e.stopPropagation();
    }
    showCert() {
        if (this.editMode) {
            this.certStoresService.showListCertNode().then(data => {
                this.listCertNode = data;
                this.InfoCertModal.show();
            }).catch(e => {
                console.log(e);
                this.InfoCertModal.hide();
            });
        }
    }
    showCertInfo(certId: string) {
        this.certStoresService.showCert(certId);
    }
    addStores() {
        this.CertStoresModal = true;
        this.updateItem = undefined;
        this.addCertStoresModal.show();
    }
    redactStores() {
        this.CertStoresModal = true;
        this.updateItem = this.CurrentSelect;
        console.log(this.updateItem);
        
        this.addCertStoresModal.show();
    }
    deleteStores() {
        this.formControlStores.patchValue(this.certStoresService.deleteStores());
    }
    init() {
        this.formControlStores = this.certStoresService.formControl;
        let certStores = [];
        if (typeof this.formControlStores.value === 'string') {
            certStores = this.formControlStores.value.split('\t');
        }
        this.certStoresService.initCarma(certStores);
        this.listCertStores = this.certStoresService.getListCetsStores;
    }
    closeAddCertModal() {
        this.init();
        this.addCertStoresModal.hide();
        this.CertStoresModal = false;
    }
}
