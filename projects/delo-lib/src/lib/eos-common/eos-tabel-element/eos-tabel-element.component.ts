/* import { EosAccessPermissionsService, APS_DICT_GRANT } from 'eos-dictionaries/services/eos-access-permissions.service'; */
import { AfterContentInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ECellToAll, ICellInfo, ITableBtn, ITableData, ITableHeader, ITableSettings } from '../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
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
export class TabelElementComponent implements OnInit, AfterContentInit {
    @Input() tabelData: ITableData;
    @Input() edit: boolean;
    @Input() settings?: ITableSettings;
    @Output() btnAction = new EventEmitter();
    @Output() elementsSelect = new EventEmitter<any[]>();
    @Output() orderHead = new EventEmitter<IOrderTable>();
    @Output() clickToRow = new EventEmitter();
    @Output() dbClickRow = new EventEmitter();
    @ViewChild('headerTable', {static: false}) headerTable: ElementRef;
    @ViewChild('fixetColoms', {static: false}) fixetColoms: ElementRef;
    @ViewChild('notFixetColoms', {static: false}) notFixetColoms: ElementRef;
    public title;
    public colomns: ITableHeader[] = [];
    public isLoading = false;
    public buttons: ITableBtn[] = [];
    public countSelected = 0;
    public selectIdLast = '';
    public currentRow: any;
    public widthAll = 0;
    types = ECellToAll;
    get showCheckBox() {
        return !this.settings?.hiddenCheckBox;
    }
    constructor() {}
    ngOnInit(): void {
        this.widthAll = 0;
        this.colomns = [];
        this.colomns = this.tabelData.tableHeader;
        this.colomns.forEach((col, index) => {
            if (col.style['min-width'] && !col['fixed']) {
                this.widthAll += +col.style['min-width'].replace('px', '');
            }
        });
        this.buttons = this.tabelData.tableBtn;
        this.tabelData.data.forEach((item) => {
            if (item.check) {
                this.countSelected++;
            }
        });

    }
    /* 
    * Прокрутить таблицу до строки с ключом = key
    */
    scrollToRow(key: string) {
        const el = document.getElementById(key + 'notFixed');
        if (el) {
            el.scrollIntoView(false);
        }
    }
    getCountRow() {
        return this.tabelData.data.filter((item) => !item.rowNotCount).length;
    }
    ngAfterContentInit(): void {
        setTimeout(() => {
            this.isLoading = true;
        }, 0);
    }
    getClassHidden(): string {
        let strClass = '';
        strClass += this.showCheckBox ? '' : 'margin-not-checkbox';
        return strClass ;
    }
    getDisabledBtn(btnElem: ITableBtn) {
        return typeof(btnElem.disable) === 'boolean' ? btnElem.disable : this.edit;
    }
    checkBtnIcons(btn: ITableBtn): string {
        if (btn.disable) {
            return btn.iconDisable;
        } else if(btn.active) {
            return btn.activeIcon;
        } else {
            return btn.iconActiv;
        }
    }
    tootipShow(width, widthParent, title: string) {
        if (this.isLoading && width && widthParent && width.offsetWidth > widthParent.offsetWidth) {
            return title;
        } else {
            return '';
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
    getStyleTd(header: ITableHeader, index: number): any {
        const style = header.style ? header.style : {};
        const flag = index % 2 === 1;
        if (this.settings && this.settings['printTable'] && flag) {
            style['background'] = '#E6E6E6';
        } else {
            style['background'] = 'white';
        }
        return style;
    }
    scrollbarHeight() {
        if (this.notFixetColoms) {
            const height = (this.notFixetColoms.nativeElement.offsetHeight - this.notFixetColoms.nativeElement.clientHeight) + 'px';
            return {height: height}
        } else {
            return undefined;
        }
    }

    selected($event, element) {
        element.check = $event.target.checked;
        $event.target.checked ? this.countSelected++ : this.countSelected--;
        this.elementsSelect.emit(this.tabelData.data.filter((elem) => elem.check));
    }
    getType(header, element): ECellToAll {
        if (typeof(element[header.id]) === 'string') {
            return undefined;
        } else if(typeof(element[header.id]) === 'object') {
            return element[header.id].type;
        }
    }
    getElement(header: ITableHeader, element: any): ICellInfo | string {
        if (typeof(element[header.id]) === 'string') {
            return element[header.id];
        } else if(typeof(element[header.id]) === 'object') {
            switch (element[header.id].type) {
                case ECellToAll.icon:
                    return {type: element[header.id].type, info: element[header.id].info}
                case ECellToAll.checkbox:
                    return {type: element[header.id].type, info: {check: element[header.id]['check'], click: element[header.id]['click'], disabled: element[header.id]['disabled'], title: element[header.id]['title'] || ''}}
                case ECellToAll.buttons:
                    const buttons = {
                        type: element[header.id].type,
                        info: []
                    };
                    if (element[header.id]['info']) {
                        element[header.id]['info'].forEach((btn) => {
                            buttons['info'].push(btn);
                        });
                    }
                    return buttons;
                default:
                    break;
            }
        }
    }
    getColomsNotFixed() {
        return this.colomns.filter((item) => !item.fixed);
    }
    getColomsFixed() {
        return this.colomns.filter((item) => item.fixed);
    }
    onListScroll($event) {
        if (this.headerTable) {
            this.headerTable.nativeElement.scrollLeft = $event.srcElement.scrollLeft;
        }
        if (this.fixetColoms) {
            this.fixetColoms.nativeElement.scrollTop = $event.srcElement.scrollTop;
        }
    }
    scrollFixed($event) {
        this.notFixetColoms.nativeElement.scrollTop = $event.srcElement.scrollTop;
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
        if (this.getColomsFixed().length) {
            style['margin-left'] = '-2px';
        }
        if (this.settings) {
            Object.keys(this.settings).forEach((key) => {
                switch (key) {
                    case 'maxHeightTable':
                        style['max-height'] = this.settings[key];
                        style['overflow'] = 'auto';
                        /* style['max-width'] = '100%'; */
                        // style['overflow-x'] = 'hidden';
                        if (this.widthAll) {
                            style['width'] = this.widthAll + 'px';
                        }
                        break;
                    case 'paddingBottom':
                        style['padding-bottom'] = this.settings[key];
                        break;
                    case 'minWidth':
                        style['min-width'] = this.settings[key];
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
            this.elementsSelect.emit([$event]);
            this.currentRow = $event;
        }
        this.clickToRow.emit([$event]);
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
