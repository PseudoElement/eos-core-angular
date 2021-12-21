import {
    Component,
    OnInit,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    EventEmitter, /*  Output, EventEmitter */
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardsClass, Cabinets } from '../helpers/cards-class';
import { RigthsCabinetsServices } from '../../../shared/services/rigths-cabinets.services';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DropdownInput } from 'eos-common/core/inputs/select-input';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { AppContext } from 'eos-rest/services/appContext.service';
@Component({
    selector: 'eos-cabinets-folders',
    templateUrl: 'rt-cabinets-folders.component.html',
    styleUrls: ['rt-cabinets-folders.component.scss']
})
export class RtCabinetsFoldersComponent implements OnInit, OnChanges, OnDestroy {

    @Input() card: CardsClass;
    @Input() flagEdit: boolean;
    @Output() changes = new EventEmitter();
    public limitCard: boolean = false;
    public currentCabinet: Cabinets;
    form: FormGroup;
    selectCabinetInput: DropdownInput = new DropdownInput({
        key: 'selectedCabinet',
        options: [],
        hideLabel: true,
    });
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
            return 'eos-icon-checkbox-square-v-blue';
        } else if (this.currentCabinet.data.FOLDERS_AVAILABLE.length > 0) {
            return 'eos-icon-checkbox-square-minus-blue';
        } else {
            return 'eos-icon-checkbox-square-blue';
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
            this.currentCabinet = this.card.cabinets[this.form.controls['selectedCabinet'].value];
        });

        this._rtCabintsSrv.changeCabinets
            .pipe(
                takeUntil(this.unSubscribe)
            )
            .subscribe((changedCard: CardsClass) => {
                this.card = changedCard;
                this.setFolders(this.card.cabinets[0]);
                this._updateSelect();
            });
    }
    checkedFolder(value): boolean {
        // tslint:disable-next-line: no-bitwise
        return ~this.currentCabinet.data.FOLDERS_AVAILABLE.indexOf(value) !== 0;
    }
    checkAllElem() {
        if (this.flagEdit) {
            if (this.currentCabinet.data.FOLDERS_AVAILABLE === '123456789') {
                this.currentCabinet.data.FOLDERS_AVAILABLE = '';
                this.currentCabinet.data['HIDE_INACCESSIBLE'] = 0;
                this.currentCabinet.data['HIDE_INACCESSIBLE_PRJ'] = 0;
                this.currentCabinet.data.HOME_CABINET = 0;
                this.alertWarning();
            } else {
                this.currentCabinet.data.FOLDERS_AVAILABLE = '123456789';
            }
            this.changes.emit();
        }
    }
    ngOnInit() {
        this.setFolders(this.card.cabinets[0]);
        this._updateSelect();
    }
    ngOnChanges() {
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

    setFolders(cabinet): void {
        this.currentCabinet = cabinet;
    }
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
            style: { color: c.data.HOME_CABINET ? 'red' : 'black' }
        }));
        this.selectCabinetInput.options = opts;
        if (!flag && opts.length) {
            this.form.controls['selectedCabinet'].setValue(opts[0].value);
        }
    }
}
