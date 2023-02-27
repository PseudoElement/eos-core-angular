import { Component, EventEmitter, Output, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CRYPTO_PARAM_BTN_TABEL } from 'eos-parameters/parametersSystem/shared/consts/cryptography.const';
import { ITableBtn, ITableData, ITableHeader } from 'eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
// import { CONFIRM_SAVE_ON_LEAVE } from 'eos-dictionaries/consts/confirm.consts';

@Component({
    selector: 'eos-param-auth-collection',
    templateUrl: 'edit-cryptography.component.html',
    styleUrls: ['./edit-cryptography.component.scss']
})

export class EditCryptographyComponent implements OnInit {
    @ViewChild('modalStorage') modalStorage: TemplateRef<any>;
    @Output() closeCollection = new EventEmitter();
    title;
    edit = true;
    nameProfile: string;
    initStr: string;
    modalWordRef: BsModalRef;
    public arrayBtn: ITableBtn[] = CRYPTO_PARAM_BTN_TABEL;
    public tableHeader: ITableHeader[] = [
        {
            title: 'Хранилище',
            id: 'name',
            order: 1,
            style: {width: '100%'}
        },
    ];
    public tabelData: ITableData = {
        tableBtn: this.arrayBtn,
        tableHeader: this.tableHeader,
        data: []
    };
    constructor(
        private _modalSrv: BsModalService,
    ) {}
    ngOnInit() {
        this.init();
    }
    init() {}
    cancel() {
        this.closeCollection.emit();
    }
    submit() {
        this.closeCollection.emit();
    }
    actionTo(action: string) {
        switch (action) {
            case 'add':
                this.addWord();
                break;
            case 'edit':
                this.editWord();
                break;
            case 'deleted':
                break;
            default:
                break;
        }
    }
    addWord() {
        this._openModal();
    }
    editWord() {
        // this.inputWordValue = this.currentSelectedWord.CLASSIF_NAME;
        this._openModal();
    }
    cancelModalWord() {
        this.modalWordRef.hide();
    }
    submitModalWord() {
        this.modalWordRef.hide();
    }
    private _openModal() {
        this.modalWordRef = this._modalSrv.show(this.modalStorage, { class: 'modalWord', ignoreBackdropClick: true });
    }
}
