import { Component, OnInit, Input } from '@angular/core';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-cert-stores',
    templateUrl: 'cert-stores.component.html'
})

export class CertStoresComponent implements OnInit {
    @Input('formControlStores') formControlStores;
    carmaStores: Istore[] = [];

    constructor(
        private carmaService: CarmaHttpService
    ) {}
    ngOnInit() {
        // console.log('OnInit', this.formControlStores);
        const listStore = this.formControlStores.value.split('\t');
        this.createCarmaStores(listStore);
        this.carmaService.init(null, this.carmaStores);
        console.log(this.carmaStores);
        return listStore;
    }
    createCarmaStores(listStore: string[]) {
        this.carmaStores = [];
        listStore.forEach((str: string) => {
            const arr = str.split(':');
            this.carmaStores.push({
                Location: arr[0],
                Address: '',
                Name: arr[1]
            });
        });
    }

}
