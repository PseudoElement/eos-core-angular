import { OnInit, Component, Output, EventEmitter } from '@angular/core';
// import { CertStoresService } from '../cert-stores.service';

@Component({
    selector: 'eos-add-cert-stores',
    templateUrl: 'add-cert-stores.component.html'
})
export class AddCertStoresComponent implements OnInit {
    @Output('closeAddCertModal') closeAddCertModal = new EventEmitter;
    protected titleHeader = 'Выберите хранилища сертификатов';
    protected btnSubmitDisabled: boolean = false;
    protected certSystemStore: string = 'sslm';
    constructor(
        // private certStoresService: CertStoresService
    ) {}
    ngOnInit() {
        // console.log('init');
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        this.closeAddCertModal.emit();
    }
    searchStore() {
        console.log('search', this.certSystemStore);
    }
}
