import { Component, OnInit, Input } from '@angular/core';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html'
})

export class CertStoresComponent implements OnInit {
    @Input('formControlStores') formControlStores;
    initCarmaStores: Istore[];
    listCertStores: string[];

    constructor(
        private carmaService: CarmaHttpService
    ) {}
    ngOnInit() {
        // console.log('OnInit', this.formControlStores);
        this.listCertStores = this.formControlStores.value.split('\t');
        this.createInitCarmaStores(this.listCertStores);
        this.carmaService.init(null, this.initCarmaStores);
        console.log(this.initCarmaStores);
    }
    createInitCarmaStores(listStore: string[]) {
        this.initCarmaStores = [];
        listStore.forEach((str: string) => {
            const arr = str.split(':');
            this.initCarmaStores.push({
                Location: arr[0],
                Address: '',
                Name: arr[1]
            });
        });
    }

}
