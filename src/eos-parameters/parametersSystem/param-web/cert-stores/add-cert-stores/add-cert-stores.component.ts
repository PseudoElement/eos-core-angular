import { OnInit, Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CertStoresService } from '../cert-stores.service';

export interface IListStores {
    title: string;
    selected: boolean;
    address?: string;
}
@Component({
    selector: 'eos-add-cert-stores',
    templateUrl: 'add-cert-stores.component.html'
})
export class AddCertStoresComponent implements OnInit, OnDestroy {
    @Output('closeAddCertModal') closeAddCertModal = new EventEmitter;
    protected titleHeader = 'Выберите хранилища сертификатов';
    protected certSystemStore: string = 'sslm';
    protected certSystemAddress: string;
    protected listStores$: Observable<string[]>;
    protected listStores: IListStores[] = [
        {
            title: 'some text 1',
            selected: false
        },
        {
            title: 'some text 2',
            selected: false
        },
        {
            title: 'some text 3',
            selected: false
        },
        {
            title: 'some text 4',
            selected: false
        },
    ];
    protected currentSelectNode: IListStores;
    constructor(
        private certStoresService: CertStoresService
    ) {}
    ngOnInit() {
        console.log('init add stores');
    }
    ngOnDestroy() {
        console.log('destoy');
    }
    submit() {
        console.log('submit', this.currentSelectNode.title);
        this.closeAddCertModal.emit();
    }
    cancel() {
        this.closeAddCertModal.emit();
    }
    searchStore() {
        if (this.certSystemStore === 'sslm') {
            this.listStores$ = this.certStoresService.showListStores(this.certSystemStore, '')
                .map(data => {
                    const listStores = [];
                    console.log(data);
                    data.forEach(item => {
                        const arr = item.split('\\');
                        listStores.push({
                            title: arr[arr.length - 1],
                            selected: false,
                            address: 'sslm'
                        });
                    });
                    console.log(listStores);
                    this.listStores = listStores;
                    return data;
                });
        }
        console.log('search', this.certSystemStore);
    }
    selectNode(list: IListStores) {
        this.currentSelectNode = list;
        this.listStores.forEach(node => {
            if (node === list) {
                node.selected = true;
            } else {
                node.selected = false;
            }
        });
    }
}
