import { Component, OnInit, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { CertStoresService, IListCertStotes } from './cert-stores.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html',
    providers: [CertStoresService]
})

export class CertStoresComponent implements OnInit, OnChanges, OnDestroy {
    @Input('formControlStores') formControlStores: FormControl;
    @ViewChild('InfoCertModal') InfoCertModal;
    cSub: Subscription;
    sSub: Subscription;
    CurrentSelect: IListCertStotes;
    listCertStores: IListCertStotes[];
    orderBy: boolean = true;
    isCarma: boolean = true;
    listCertNode$: Observable<string[]>;

    constructor(
        public certStoresService: CertStoresService
    ) {}
    ngOnInit() {
        this.certStoresService.initCarma(this.formControlStores.value.split('\t'));
        this.listCertStores = this.certStoresService.getListCetsStores;
        this.cSub = this.certStoresService.getCurrentSelectedNode$.subscribe((list: IListCertStotes) => {
            this.CurrentSelect = list;
        });
        this.sSub = this.certStoresService.getIsCarmaServer$.subscribe((data: boolean) => {
            this.isCarma = data;
        });
    }
    ngOnChanges() {
        console.log('OnChanges');
    }
    ngOnDestroy() {
        this.cSub.unsubscribe();
        this.sSub.unsubscribe();
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
        this.certStoresService.addStores();
    }
    deleteStores() {
        this.formControlStores.patchValue(this.certStoresService.deleteStores());
    }
}
