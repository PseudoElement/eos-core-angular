import {
    Component,
    OnInit,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    EventEmitter,
    ViewChild,
    AfterContentInit, /*  Output, EventEmitter */
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardsClass, Cabinets } from '../helpers/cards-class';
import { RigthsCabinetsServices } from '../../../shared/services/rigths-cabinets.services';
import { EosMessageService } from '../../../../eos-common/services/eos-message.service';
import { DropdownInput } from '../../../../eos-common/core/inputs/select-input';
import { FormGroup } from '@angular/forms';
import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
import { ECellToAll, ITableBtn, ITableData, ITableSettings } from '../../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { TABLE_HEADER_BTN_TABEL_SECOND, TABLE_HEADER_CARD_SECOND } from '../right-card-files.const';
import { RC_CABINET_FOLDER_LIST } from '../../../shared/consts/rc-cabinet-folder.const';
@Component({
    selector: 'eos-cabinets-folders',
    templateUrl: 'rt-cabinets-folders.component.html',
    styleUrls: ['rt-cabinets-folders.component.scss']
})
export class RtCabinetsFoldersComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit {

    @Input() card: CardsClass;
    @Input() flagEdit: boolean;
    @Output() changes = new EventEmitter();
    @ViewChild('secondTable', { static: false }) secondTable;
    public limitCard: boolean = false;
    public currentCabinet: Cabinets;
    public closeAcordSecond = false;
    form: FormGroup;
    public arrayBtnSecond: ITableBtn[] = [...TABLE_HEADER_BTN_TABEL_SECOND];
    public copyParams;
    selectCabinetInput: DropdownInput = new DropdownInput({
        key: 'selectedCabinet',
        options: [],
        hideLabel: true,
    });
    public tabelDataSecond: ITableData = {
        tableBtn: this.arrayBtnSecond,
        tableHeader: [...TABLE_HEADER_CARD_SECOND],
        data: []
    };
    public settingsTableSecond: ITableSettings = {
        hiddenCheckBox: true,
        maxHeightTable: '250px',
        selectedRow: true,
        count: true,
        widthAllTable: true,
    }
    openAccordion() {
        this.closeAcordSecond = !this.closeAcordSecond;
    }
    // folders = [
    //     { key: '1', title: 'Поступившие' },
    //     { key: '2', title: 'На исполнении' },
    //     { key: '3', title: 'На контроле' },
    //     { key: '4', title: 'У руководства' },
    //     { key: '5', title: 'На рассмотрении' },
    //     { key: '6', title: 'В дело' },
    //     { key: '7', title: 'Управление проектами' },
    //     { key: '8', title: 'На визировании' },
    //     { key: '9', title: 'На подписи' },
    //     { key: 'HIDE_INACCESSIBLE', title: 'Учитывать ограничения доступа к РК по грифам и группам документов' },
    //     { key: 'HIDE_INACCESSIBLE_PRJ', title: 'Учитывать права для работы с РКПД' },
    // ];
    private regExpFolders1 = /[1|2|3|4|5|6]/;
    private regExpFolders2 = /[7|8|9]/;
    private regExpFolders3 = /[1|2|3|4|5|6|7|8|9]/;
    get disabledInAcces() {
        if (this.currentCabinet) {
            return this.regExpFolders1.test(this.currentCabinet.data.FOLDERS_AVAILABLE);
        }
        return false;
    }
    get disabledInAccesPrj() {
        if (this.currentCabinet) {
            return this.regExpFolders2.test(this.currentCabinet.data.FOLDERS_AVAILABLE);
        }
        return false;
    }
    get checkHome() {
        return this.regExpFolders3.test(this.currentCabinet.data.FOLDERS_AVAILABLE);
    }
    get getflagChecked() {
        if (this.currentCabinet.data.FOLDERS_AVAILABLE.length === 9) {
            return 'eos-adm-icon-checkbox-square-v-blue';
        } else if (this.currentCabinet.data.FOLDERS_AVAILABLE.length > 0) {
            return 'eos-adm-icon-checkbox-square-minus-blue';
        } else {
            return 'eos-adm-icon-checkbox-square-blue';
        }
    }
    private unSubscribe: Subject<any> = new Subject();
    constructor(
        private _rtCabintsSrv: RigthsCabinetsServices,
        private _msgSrv: EosMessageService,
        private inputCtrlSrv: InputControlService,
        private _appContext: AppContext,
    ) {
        this.form = this.inputCtrlSrv.toFormGroup([this.selectCabinetInput], false);
        this.form.valueChanges.subscribe((data) => {
            // this.currentCabinet = this.card.cabinets[this.form.controls['selectedCabinet'].value];
            this.updateDataFolder(this.card.cabinets);
        });

        this._rtCabintsSrv.changeCabinets
            .pipe(
                takeUntil(this.unSubscribe)
            )
            .subscribe((changedCard: CardsClass) => {
                this.card = changedCard;
                // this.setFolders(this.card.cabinets[0]);
                this._updateSelect();
            });
    }
    disabledCabinetInAccesPrj(cabinet) {
        if (cabinet) {
            return this.regExpFolders2.test(cabinet.data.FOLDERS_AVAILABLE);
        }
        return false;
    }
    disabledCabinetInAcces(cabinet) {
        if (cabinet) {
            return this.regExpFolders1.test(cabinet.data.FOLDERS_AVAILABLE);
        }
        return false;
    }
    selectCurentCardSecond($event) {
        if (!this.currentCabinet || $event.key !== this.currentCabinet['key']) {
            this.currentCabinet = $event
        }
        this.updateBtn();
    }
    updateBtn() {
        if (this.flagEdit) {
            this.tabelDataSecond.tableBtn.forEach((item) => {
                switch (item.id) {
                    case 'checked':
                        item.disable = !Boolean(this.currentCabinet);
                        break;
                    case 'main':
                        item.disable = !Boolean(this.currentCabinet) || this.currentCabinet['Icons'] !== undefined;
                        break;
                    case 'copy':
                        item.disable = !Boolean(this.currentCabinet);
                        break;
                    case 'insert':
                        item.disable = !Boolean(this.currentCabinet) || localStorage.getItem('copyParamsFOLDER_AVAILABLE') === undefined;
                        break;
                    case 'checked-cabinet':
                        item.disable = false;
                        break;
                }
            });
        } else {
            this.tabelDataSecond.tableBtn.forEach((item) => {
                item.disable = true;
            })
        }
    }
    btnActionSecond($event: string) {
        switch ($event) {
            case 'checked':
                this.checkAllElem();
                break;
            case 'main':
                this.checkHomeCabinet();
                break;
            case 'copy':
                localStorage.setItem('copyParamsFOLDER_AVAILABLE', this.currentCabinet.data.FOLDERS_AVAILABLE);
                this.updateBtn();
                break;
            case 'insert':
                this.insertToCurent();
                this.checkHomeCard();
                break;
            case 'checked-cabinet':
                this.updateToAll();
                this.checkHomeCard();
                break;
        }
        this.updateDataFolder(this.card.cabinets);
    }
    insertToCurent() {
        if (localStorage.getItem('copyParamsFOLDER_AVAILABLE') !== undefined) {
            this.currentCabinet.data.FOLDERS_AVAILABLE = localStorage.getItem('copyParamsFOLDER_AVAILABLE');
        }
    }
    updateToAll() {
        const allFOLDERS = [];
        RC_CABINET_FOLDER_LIST.forEach((folder) => {
            allFOLDERS.push(folder.charKey);
        });
        const strFolder = allFOLDERS.sort().join('');
        let flag = false;
        this.card.cabinets.forEach((cab) => {
            if (cab.data.FOLDERS_AVAILABLE.split('').sort().join('') !== strFolder) {
                flag = true;
            }
        });
        if (flag) {
            this.card.cabinets.forEach((cab) => {
                cab.data.FOLDERS_AVAILABLE = strFolder;
            });
        } else {
            this.card.cabinets.forEach((cab) => {
                cab.data.FOLDERS_AVAILABLE = '';
                cab.data['HIDE_INACCESSIBLE'] = 0;
                cab.data['HIDE_INACCESSIBLE_PRJ'] = 0;
                cab.data.HOME_CABINET = 0;
            });
        }
    }
    checkedFolder(value): boolean {
        // tslint:disable-next-line: no-bitwise
        return ~this.currentCabinet.data.FOLDERS_AVAILABLE.indexOf(value) !== 0;
    }
    checkAllElem() {
        const allFOLDERS = [];
        RC_CABINET_FOLDER_LIST.forEach((folder) => {
            allFOLDERS.push(folder.charKey);
        });
        const strFOLDERS = allFOLDERS.sort().join('');
        if (this.flagEdit) {
            if (this.currentCabinet.data.FOLDERS_AVAILABLE.split('').sort().join('') === strFOLDERS) {
                this.currentCabinet.data.FOLDERS_AVAILABLE = '';
                this.currentCabinet.data['HIDE_INACCESSIBLE'] = 0;
                this.currentCabinet.data['HIDE_INACCESSIBLE_PRJ'] = 0;
                this.currentCabinet.data.HOME_CABINET = 0;
                this.checkHomeCard();
            } else {
                this.currentCabinet.data.FOLDERS_AVAILABLE =  allFOLDERS.sort().join('');
                this.checkHomeCard();
            }
            this.changes.emit();
        }
    }
    ngOnInit() {
        // this.setFolders(this.card.cabinets[0]);
        this._updateSelect();
    }
    ngAfterContentInit(): void {
        if (this.secondTable) {
            this.secondTable.selectIdLast = this.currentCabinet['key'];
        }
    }
    ngOnChanges() {
        this.updateBtn();
    }
    /* Если у картотеки нет главного кабинета то показывать предупреждение */
    checkHomeCard() {
        if (this.card.cabinets) {
            let flag = true;
            this.card.cabinets.forEach((cab) => {
                if (cab.data['HOME_CABINET'] === 1) {
                    flag = false;
                }
            });
            if (flag) {
                this.alertWarning();
            }
        }
    }
    updateCardLimit(newCabinets) {
        if (this._appContext.limitCardsUser.indexOf(newCabinets.cardDue) === -1) {
            return true;
        }
        return false;
    }
    changeFolders(key): void {
        if (key === 'HIDE_INACCESSIBLE' || key === 'HIDE_INACCESSIBLE_PRJ') {
            this.currentCabinet.data[key] = +!this.currentCabinet.data[key];
            this.changes.emit();
            return;
        }
        // tslint:disable-next-line: no-bitwise
        if (~this.currentCabinet.data.FOLDERS_AVAILABLE.indexOf(key) !== 0) {
            const reg = new RegExp(`${key}`, 'g');
            this.currentCabinet.data.FOLDERS_AVAILABLE = this.currentCabinet.data.FOLDERS_AVAILABLE.replace(reg, '');
        } else {
            const folders = this.currentCabinet.data.FOLDERS_AVAILABLE.split('');
            folders.push(key);
            this.currentCabinet.data.FOLDERS_AVAILABLE = folders.join('');
        }

        if (!this.disabledInAcces) {
            this.currentCabinet.data['HIDE_INACCESSIBLE'] = 0;
        }
        if (!this.disabledInAccesPrj) {
            this.currentCabinet.data['HIDE_INACCESSIBLE_PRJ'] = 0;
        }
        if (!this.checkHome && this.currentCabinet.data.HOME_CABINET) {
            this.currentCabinet.data.HOME_CABINET = 0;
            this._updateSelect(true);
            this.alertWarning();
        }
        if (this.checkHome && !this.mainCabinets() && !this.currentCabinet.data.HOME_CABINET) {
            this.currentCabinet.data.HOME_CABINET = 1;
            this._updateSelect(true);
        }
        this.updateDataFolder(this.card.cabinets);
        this.changes.emit();
    }

    mainCabinets(): boolean {
        return this.currentCabinet.parent.cabinets.some((cab: Cabinets) => {
            return !!cab.data.HOME_CABINET && (cab.data.ISN_CABINET !== this.currentCabinet.data.ISN_CABINET);
        });
    }
    checkHomeCabinet(): void {
        this.currentCabinet.data.HOME_CABINET = +!this.currentCabinet.data.HOME_CABINET;
        if (this.currentCabinet.data.HOME_CABINET && this.mainCabinets()) {
            this.currentCabinet.parent.cabinets.forEach((cab: Cabinets) => {
                if (cab.data.HOME_CABINET && (cab.data.ISN_CABINET !== this.currentCabinet.data.ISN_CABINET)) {
                    cab.data.HOME_CABINET = 0;
                }
            });
        } else {
            if (!this.currentCabinet.data.HOME_CABINET) {
                this.alertWarning();
            }
        }
        this.changes.emit();
        this._updateSelect(true);
    }

    /* setFolders(cabinet): void {
        this.currentCabinet = cabinet;
    } */
    alertWarning() {
        this._msgSrv.addNewMessage({
            type: 'warning',
            title: 'Предупреждение',
            msg: 'Назначьте главный кабинет',
            dismissOnTimeout: 6000
        });
    }
    ngOnDestroy() {
          this.unSubscribe.next();
          this.unSubscribe.complete();
    }
    private _updateSelect(flag?): void {
        const opts = this.card.cabinets.map((c, i) => ({
            value: i, title: c.name, cabinet: c,
            style: { color: c.data.HOME_CABINET ? 'red' : 'black' },
            tooltip: true
        }));
        this.selectCabinetInput.options = opts;
        if (!flag && opts.length) {
            this.form.controls['selectedCabinet'].setValue(opts[0].value);
        }
    }
    getHidePrj(cabinet) {
        return !this.disabledCabinetInAccesPrj(cabinet);
    }
    getHide(cabinet) {
        return !this.disabledCabinetInAcces(cabinet);
    }
    updateDataFolder(cabinets: Cabinets[]) {
        cabinets.forEach((cab) => {
            cab['key'] = cab['data']['ISN_CABINET'];
            cab['cabTitle'] = cab['cabinetInfo']['CABINET_NAME'];
            if (cab['data']['HOME_CABINET'] === 1) {
                cab['Icons'] = {type: ECellToAll.icon, info: ['eos-adm-icon-keyfile-grey']};
            } else {
                cab['Icons'] = undefined;
            }
            cab['HIDE_INACCESSIBLE'] = cab['data']['HIDE_INACCESSIBLE'];
            cab['HIDE_INACCESSIBLE_PRJ'] = cab['data']['HIDE_INACCESSIBLE_PRJ'];
            TABLE_HEADER_CARD_SECOND.forEach((col) => {
                if (col.id.indexOf('FOLDERS_AVAILABLE') !== -1) {
                    cab[col.id] = {type: ECellToAll.checkbox, check: false, click: () => {this.changeFolders(col.id.replace('FOLDERS_AVAILABLE_', ''))}};
                }
                if (col.id === 'HIDE_INACCESSIBLE') {
                    cab[col.id] = {type: ECellToAll.checkbox, check: cab['data']['HIDE_INACCESSIBLE'] === 1, disabled: this.getHide(cab), click: () => {this.changeFolders('HIDE_INACCESSIBLE')}};
                }
                if (col.id === 'HIDE_INACCESSIBLE_PRJ') {
                    cab[col.id] = {type: ECellToAll.checkbox, check: cab['data']['HIDE_INACCESSIBLE_PRJ'] === 1, disabled: this.getHidePrj(cab), click: () => {this.changeFolders('HIDE_INACCESSIBLE_PRJ')}};
                }
            });
            cab['data']['FOLDERS_AVAILABLE'].split('').forEach((key) => {
                cab['FOLDERS_AVAILABLE_' + key] = {type: ECellToAll.checkbox, check: true, click: () => {this.changeFolders(key)}};
            });
        });
        this.tabelDataSecond.data = cabinets;
    }
}
