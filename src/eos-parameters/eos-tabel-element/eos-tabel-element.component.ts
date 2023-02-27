/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableBtn, ITableData, ITableHeader } from '../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */

export interface IOrderTable {
    id: string;
    order?: 0 | 1 | 2;
}

@Component({
    selector: 'eos-tabel-element',
    templateUrl: 'eos-tabel-element.component.html',
    styleUrls: ['./eos-tabel-element.component.scss']

})
export class TabelElementComponent implements OnInit {
    @Input() tabelData: ITableData;
    @Input() setting: any;
    @Input() edit: boolean;
    @Output() btnAction = new EventEmitter();
    @Output() elementsSelect = new EventEmitter();
    @Output() orderHead = new EventEmitter<IOrderTable>();
    public title;
    public headerTitle: ITableHeader[] = [];
    public isLoading = false;
    public btnArray: ITableBtn[] = [];
    public countSelected = 0;
    constructor() {}
    ngOnInit(): void {
        this.headerTitle = this.tabelData.tableHeader;
        this.btnArray = this.tabelData.tableBtn;
        this.tabelData.data.forEach((item) => {
            if (item.check) {
                this.countSelected++;
            }
        });
    }
    getDisabledBtn(btnElem: ITableBtn) {
        return typeof(btnElem.disable) === 'boolean' ? btnElem.disable : this.edit;
    }
    checkBtnIcons(btn: ITableBtn): string {
        if (btn.disable) {
            return btn.iconDisable;
        } else {
            return btn.iconActiv;
        }
    }
    getAllCheck() {
        const count = this.tabelData.data.length;
        if (count > 0 && count === this.tabelData.data.filter((elem) => elem.check).length) {
            return true;
        }
        return false;
    }
    clickToButton(btn: ITableBtn) {
        this.btnAction.emit(btn.id);
    }

    toggleAllMarks($event) {
        this.tabelData.data.forEach((item) => {
            item.check = $event.target.checked;
        });
        this.countSelected = $event.target.checked ? this.tabelData.data.length : 0;
        if ($event.target.checked) {
            this.elementsSelect.emit(this.tabelData.data);
        } else {
            this.elementsSelect.emit([]);
        }
    }
    orderByField(headerOrd: ITableHeader) {
        if (headerOrd.order === undefined || !this.edit) {
            return;
        }
        this.headerTitle.forEach((header) => {
            if (header.id === headerOrd.id && header.order !== undefined) {
                if (header.order === 1) {
                    header.order = 2;
                    this.orderHead.emit({id: header.id, order: 2});
                } else {
                    header.order = 1;
                    this.orderHead.emit({id: header.id, order: 1});
                }
            } else {
                if (header.order) {
                    header.order = 0;
                }
            }
        });
    }
    getBtnOrder(header: ITableHeader): string {
        if (!this.edit) {
            if (header.order === 1 || header.order === 2) {
                return header.order === 1 ?  'eos-adm-icon-arrow-grey-top' : 'eos-adm-icon-arrow-grey-bottom';
            } else {
                return '';
            }
        } else {
            if (header.order === 1 || header.order === 2) {
                return header.order === 1 ?  'eos-adm-icon-arrow-blue-top' : 'eos-adm-icon-arrow-blue-bottom';
            } else {
                return '';
            }
        }
    }
    getStyle(header: ITableHeader): any {
        return header.style ? header.style : {};
    }
    selected($event, element) {
        element.check = $event.target.checked;
        $event.target.checked ? this.countSelected++ : this.countSelected--;
        this.elementsSelect.emit(this.tabelData.data.filter((elem) => elem.check));
    }
    getElement(header: ITableHeader, element: any): string {
        return element[header.id];
    }
    getflagChecked() {
        const count = this.tabelData.data.length;
        const flagChecked = count - this.tabelData.data.filter((elem) => elem.check).length;
        if (count === 0) {
            return this.edit ? 'eos-adm-icon-checkbox-square-minus-blue' : 'eos-adm-icon-checkbox-square-minus-grey';
        }
        switch (flagChecked) {
            case 0:
                return this.edit ? 'eos-adm-icon-checkbox-square-v-blue' : 'eos-adm-icon-checkbox-v-black';
            case count:
                return this.edit ? 'eos-adm-icon-checkbox-square-blue' : 'eos-adm-icon-checkbox-square-grey';
            default:
                return this.edit ? 'eos-adm-icon-checkbox-square-minus-blue' : 'eos-adm-icon-checkbox-square-minus-grey';
        }
    }
}
