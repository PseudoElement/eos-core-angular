import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { IFieldView } from 'eos-dictionaries/interfaces';
import { EosDictService } from '../services/eos-dict.service';

@Component({
    selector: 'eos-column-settings',
    templateUrl: 'column-settings.component.html',
})
export class ColumnSettingsComponent implements OnDestroy, OnInit {
    @Input() customTitles: IFieldView[] = [];
    @Input() fixedFields: IFieldView[] = [];
    @Input() currentFields: IFieldView[] = [];
    @Input() dictionaryFields: IFieldView[] = [];
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    public haveCustomTitle = false;

    selectedDictItem: IFieldView;
    selectedCurrItem: IFieldView;
    selectedFixedItem: IFieldView;

    editedItem: IFieldView;
    newTitle: string;

    modalRef: BsModalRef;

    readonly MAX_LEN = 80;

    private _subscriptionDrop: Subscription;
    private _subscriptionDrag: Subscription;

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private dictSrv: EosDictService,
    ) {
        // value[3] - src
        // value[2] - dst
        // value[1] - droped elem
        this._subscriptionDrop = dragulaService.drop.subscribe((value) => {
            if (value[2].id !== value[3].id) {
                if (value[3].id === 'selected') {
                    this.selectedCurrItem = this.currentFields.find((_f) => _f.title === value[1].innerText);
                } else {
                    this.selectedDictItem = this.dictionaryFields.find((_f) => _f.title === value[1].innerText);
                }
            }
        });
        this._subscriptionDrag = dragulaService.drag
            .subscribe(() => {
                this.selectedDictItem = null;
                this.selectedCurrItem = null;
                this.selectedFixedItem = null;
            });
        dragulaService.setOptions('bag-one', {
            moves: (el/*, source, handle, sibling*/) => !el.classList.contains('fixed-item')
        });

        dragulaService.setOptions('fixed-bag', {
            moves: (el/*, source, handle, sibling*/) => !el.classList.contains('fixed-item')
        });
    }

    /**
     * @description unsubscribe from dragulaService,
     * destroy dragula bags
     */
    ngOnDestroy() {
        if (!!this.dragulaService.find('bag-one')) {
            this.dragulaService.destroy('bag-one');
        }

        if (!!this.dragulaService.find('fixed-bag')) {
            this.dragulaService.destroy('fixed-bag');
        }
        this._subscriptionDrop.unsubscribe();
        this._subscriptionDrag.unsubscribe();
    }

    /**
     * @description remove current custom fields from all dictionary fields
     */
    ngOnInit() {
        setTimeout(() => {
            if (this.dictionaryFields) {
                this.currentFields.forEach((_field) => {
                    this.dictionaryFields = this.dictionaryFields.filter((_f: IFieldView) => _f.key !== _field.key);
                });
            }
            if (this.currentFields) {
                this.dictionaryFields.forEach(_field => {
                    const fieldWithCustom = this.customTitles.find(item => item.key === _field.key);
                    if (fieldWithCustom) {
                        _field.customTitle = fieldWithCustom.customTitle;
                    }
                });
            }
            this.haveCustomTitle = Boolean(this.customTitles.length);
        }, 0);
    }

    /**
     * @description hide modal
     */
    public hideModal(): void {
        this.bsModalRef.hide();
    }

    /**
     * @description emit custom fields and hide modal
     */
    save() {
        const customsTitles = [].concat(
            this.fixedFields.filter(el => el.customTitle),
            this.dictionaryFields.filter(el => el.customTitle),
            this.currentFields.filter(el => el.customTitle));
        this.dictSrv.customTitles = customsTitles;
        this.dictSrv.customFields = this.currentFields;
        this.hideModal();
        this.onChoose.emit();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
    addToCurrent() {
        if (this.selectedDictItem) {
            // console.log('addToCurrent, this.selectedDictItem', this.selectedDictItem);
            /* tslint:disable:no-bitwise */
            if (!~this.currentFields.findIndex((_f) => _f.key === this.selectedDictItem.key)) {
                this.currentFields.push(this.selectedDictItem);
            }
            /* tslint:enable:no-bitwise */
            this.dictionaryFields.splice(this.dictionaryFields.indexOf(this.selectedDictItem), 1);
            this.selectedDictItem = null;
        }
    }

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    removeFromCurrent() {
        if (this.selectedCurrItem) {
            /* tslint:disable:no-bitwise */
            if (!~this.dictionaryFields.findIndex((_f) => _f.key === this.selectedCurrItem.key)) {
                this.dictionaryFields.push(this.selectedCurrItem);
            }
            /* tslint:enable:no-bitwise */
            this.currentFields.splice(this.currentFields.indexOf(this.selectedCurrItem), 1);
            this.selectedCurrItem = null;
        }
    }

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param type indicates where item is placed
     * 1 - current
     * 2 - dictionary
     * 3 - fixed
     */
    select(item: IFieldView, type: number) {
        switch (type) {
            case 1:
                this.selectedCurrItem = item;
                this.selectedDictItem = null;
                this.selectedFixedItem = null;
                break;
            case 2:
                this.selectedDictItem = item;
                this.selectedCurrItem = null;
                this.selectedFixedItem = null;
                break;
            case 3:
                this.selectedFixedItem = item;
                this.selectedCurrItem = null;
                this.selectedDictItem = null;
        }
    }

    /*
     * make item edited
     * @param item edited item
     */
    edit(item: IFieldView) {
        this.editedItem = item;
        this.newTitle = item.customTitle || item.title;
    }

    /**
     * @description set newTitle as customTitle for editedItem
     */
    saveNewTitle() {
        const trimNewTitle = this.newTitle.trim();
        if (trimNewTitle !== this.editedItem.title) {
            this.editedItem.customTitle = trimNewTitle;
        } else {
            this.editedItem.customTitle = undefined;
        }

        this.haveCustomTitle = this.fixedFields.some(el => Boolean(el.customTitle)) ||
            this.dictionaryFields.some(el => Boolean(el.customTitle)) ||
            this.currentFields.some(el => Boolean(el.customTitle));
        this.cancelTitleEdit();
    }

    /**
     * @description cancel title edit, set selectedCurrItem, selectedDictItem,
     * editedItem, newTitle equal to null
     */
    cancelTitleEdit() {
        this.selectedCurrItem = null;
        this.selectedDictItem = null;
        this.editedItem = null;
        this.newTitle = null;
    }

    /**
     * open modal with remove custom titles confirmation
     * @param template modal template
     */
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    }

    /**
     * remove all custom titles
     */
    moveTitlesBack() {
        this.modalRef.hide();
        this.currentFields.forEach((_f) => {
            _f.customTitle = null;
        });
        this.dictionaryFields.forEach((_f) => {
            _f.customTitle = null;
        });
        this.fixedFields.forEach((_f) => {
            _f.customTitle = null;
        });
        this.haveCustomTitle = false;
    }

}
