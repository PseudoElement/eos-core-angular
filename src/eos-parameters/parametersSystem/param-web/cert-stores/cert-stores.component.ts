import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { CertStoresService, IListCertStotes } from './cert-stores.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html',
    providers: [CertStoresService]
})

export class CertStoresComponent implements OnInit, OnChanges, OnDestroy {
    @Input('formControlStores') formControlStores;
    cSub: Subscription;
    CurrentSelect: IListCertStotes;
    listCertStores: IListCertStotes[];

    constructor(
        public certStoresService: CertStoresService
    ) {}
    ngOnInit() {
        this.certStoresService.initCarma(this.formControlStores.value.split('\t'));
        this.listCertStores = this.certStoresService.getListCetsStores;
        this.cSub = this.certStoresService.getCurrentSelectedNode$.subscribe((list: IListCertStotes) => {
            this.CurrentSelect = list;
            // console.log(list);
        });
    }
    ngOnChanges() {
        console.log('OnChanges');
    }
    ngOnDestroy() {
        this.cSub.unsubscribe();
    }

    toggleAllMarks(e) {
        this.certStoresService.toggleAllMarks(e);
    }
    orderByField() {
        console.log('orderByField');
        console.log(this.certStoresService.getListCetsStores);
    }
    markNode(e, list: IListCertStotes) {
        this.certStoresService.markNode(e, list);
        // console.log('markNode');
    }
    selectedNode(list: IListCertStotes) {
        this.certStoresService.selectedNode(list);
        // console.log('selectNode');
    }
    checkboxClick(e: Event) {
        e.stopPropagation();
    }
    showCert(list: IListCertStotes) {
        console.log('ShowCert');
    }
}
