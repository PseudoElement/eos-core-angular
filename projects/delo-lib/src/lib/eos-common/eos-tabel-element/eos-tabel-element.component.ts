/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableBtn, ITableData, ITableHeader, ITableSettings } from '../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
/* import { RUBRICATOR_DICT } from 'eos-dictionaries/consts/dictionaries/rubricator.consts'; */

export interface IOrderTable {
    id: string;
    order?: 'asc' | 'desc' | 'none';
}

@Component({
    selector: 'eos-tabel-element',
    templateUrl: 'eos-tabel-element.component.html',
    styleUrls: ['./eos-tabel-element.component.scss']

})
export class TabelElementComponent implements OnInit {
    @Input() tabelData: ITableData;
    @Input() edit: boolean;
    @Input() settings?: ITableSettings;
    @Output() btnAction = new EventEmitter();
    @Output() elementsSelect = new EventEmitter();
    @Output() orderHead = new EventEmitter<IOrderTable>();
    @Output() dbClickRow = new EventEmitter();
    public title;
    public colomns: ITableHeader[] = [];
    public isLoading = false;
    public buttons: ITableBtn[] = [];
    public countSelected = 0;
    public selectIdLast = '';
    get showCheckBox() {
        return !this.settings?.hiddenCheckBox;
    }
    constructor() {}
    ngOnInit(): void {
        this.colomns = this.tabelData.tableHeader;
        this.buttons = this.tabelData.tableBtn;
        this.tabelData.data.forEach((item) => {
            if (item.check) {
                this.countSelected++;
            }
        });
    }
    getClassHidden(): string {
        return this.showCheckBox ? '' : 'margin-not-checkbox';
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
        this.colomns.forEach((header) => {
            if (header.id === headerOrd.id && header.order !== undefined) {
                if (header.order === 'asc') {
                    header.order = 'desc';
                    this.orderHead.emit({id: header.id, order: 'desc'});
                } else {
                    header.order = 'asc';
                    this.orderHead.emit({id: header.id, order: 'asc'});
                }
            } else {
                if (header.order) {
                    header.order = 'none';
                }
            }
        });
    }
    getBtnOrder(header: ITableHeader): string {
        if (!this.edit) {
            if (header.order === 'asc' || header.order === 'desc') {
                return header.order === 'asc' ?  'eos-adm-icon-arrow-grey-top' : 'eos-adm-icon-arrow-grey-bottom';
            } else {
                return '';
            }
        } else {
            if (header.order === 'asc' || header.order === 'desc') {
                return header.order === 'asc' ?  'eos-adm-icon-arrow-blue-top' : 'eos-adm-icon-arrow-blue-bottom';
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
    getElement<T>(header: ITableHeader, element: T): string {
        return element[header.id];
    }
    getflagChecked(): string {
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
    getTableStyle() {
        const style = {};
        if (this.settings) {
            Object.keys(this.settings).forEach((key) => {
                switch (key) {
                    case 'maxHeightTable':
                        style['max-height'] = this.settings[key];
                        style['overflow'] = 'auto';
                        break;
                    default:
                        break;
                }
            });
            return style;
        } else {
            return style;
        }
    }
    clickElem($event) {
        if (this.settings?.selectedRow) {
            this.selectIdLast = '' + $event.key;
        }
    }
    getClassRow(row) {
        let classRow = '';
        if ('' + row.key === '' + this.selectIdLast) {
            classRow += 'selected-row ';
        }
        if (!this.showCheckBox) {
            classRow += 'margin-not-checkbox ';
        }
        return classRow;
    }
    dbClickToRow(row) {
        this.dbClickRow.emit(row);
    }
}
