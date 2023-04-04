import { Component, TemplateRef, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { /* Observable, */ Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { CertStoresService, IListCertStotes } from '../../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
import { ITableBtn, ITableData, ITableHeader, ITableSettings } from '../../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { CRYPTO_EI_BTN_TABEL } from '../../../../eos-user-params/user-params-set/shared-user-param/consts/electronic-signature';
// import { CarmaError } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-signature-popup',
    styleUrls: ['signature-popup.component.scss'],
    templateUrl: 'signature-popup.component.html',
    providers: [CertStoresService]
})

export class SignaturePopupComponent implements OnInit {
    @Input() inputName: string;
    @Input() input: FormControl;
    @Input() form: FormGroup;
    @Input() isCurrentSettings?: boolean;
    @ViewChild('templateNested') templateNested: TemplateRef<any>;
    @ViewChild('template') template: TemplateRef<any>;
    public CurrentSelect: IListCertStotes;
    public InfoSert: Array<string> = [];
    public currentName: string;
    public listCertStores: IListCertStotes[] = [];
    // private listCertNode: Observable<any> = new Observable();
    private modalRef: BsModalRef | null;
    private modalRef2: BsModalRef;
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    public InputToRedact;
    public arrayBtn: ITableBtn[] = [...CRYPTO_EI_BTN_TABEL];
    public settingsTable: ITableSettings = {
        selectedRow: true
    };
    public tableHeader: ITableHeader[] = [
        {
            title: 'Хранилище',
            id: 'name',
            order: 'asc',
            style: {
                width: '100%',
                '-webkit-user-select': 'none',
                'user-select': 'none'
            }
        },
    ];
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: this.tableHeader,
        data: []
    };
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
        // this.certStoresService.formControlInit = this.form.controls['CRYPTO_INITSTR'];
        let certStores = [];
        if (typeof this.form.controls[this.inputName].value === 'string' && this.form.controls[this.inputName].value !== '') {
            certStores = this.form.controls[this.inputName].value.split('\t');
        }
        this.certStoresService.initCarma(certStores);
        this.listCertStores = this.certStoresService.getListCetsStores;
        console.log('this.listCertStores', this.listCertStores);
        this.listCertStores.forEach((item, index) => {
            item['key'] = index;
            item['name'] = this.certStoresService.parseName(item);
            item['check'] = item.marked;
        });
        this.tabelData.data = this.listCertStores;
    }

    showCert(template: TemplateRef<any>, list: IListCertStotes) {
        this.currentName = `${list.Location} ${list.Name}`;
        this.certStoresService.showListCertNode().then(data => {
            if (data) {
                this.InfoSert = data;
                this.modalRef = this._modalService.show(template, { class: 'modal-mode' });
            }
        }).catch(e => {
            this.InfoSert = [];
            this.modalRef = this._modalService.show(template, { class: 'modal-mode' });
        });
    }

    openModal2(template: TemplateRef<any>, flagRedact?) {
        if (flagRedact) {
            this.InputToRedact = this.listCertStores.filter((item) => item['check'])[0]['Location'];
        } else {
            this.InputToRedact = undefined;
        }
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
        this.listCertStores.forEach((item, index) => {
            item['check'] = false;
        });
    }
    dbClickRow($event) {
        this.selectedNode($event);
        this.showCert(this.template, $event);
    }
    orderHead($event) {

    }
    actionTo(action) {
        switch (action) {
            case 'add':
                this.openModal2(this.templateNested);
                break;
            case 'edit':
                this.openModal2(this.templateNested, true);
                break;
            case 'deleted':
                this.deleteStores();
                break;
            case 'show':
                this.showCert(this.template,  this.listCertStores.filter((item) => item['check'])[0]);
                break;
            default:
                break;
        }
    }
    selectElement($event) {
        this.listCertStores.forEach((item, index) => {
            item['key'] = index;
            item['name'] = this.certStoresService.parseName(item);
            item['marked'] = item['check'];
        });
        this.updateButton(this.listCertStores.filter((item) => item['check']));
    }
    updateButton($event: any[]) {
        this.arrayBtn.forEach((elem) => {
            switch (elem.id) {
                case 'deleted':
                    elem.disable = !($event.length > 0);
                    break;
                case 'add':
                    elem.disable = false;
                    break;
                case 'edit':
                    elem.disable = !($event.length === 1);
                    break;
                case 'show':
                    elem.disable = !($event.length === 1);
                    break;
            }
        });
    }
}
