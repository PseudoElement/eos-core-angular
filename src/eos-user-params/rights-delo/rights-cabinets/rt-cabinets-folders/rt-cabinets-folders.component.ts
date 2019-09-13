import {Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardsClass, Cabinets} from '../helpers/cards-class';
import {RigthsCabinetsServices} from '../../../shared/services/rigths-cabinets.services';
import { EosMessageService } from 'eos-common/services/eos-message.service';
@Component({
    selector: 'eos-cabinets-folders',
    templateUrl: 'rt-cabinets-folders.component.html',
    styleUrls: ['rt-cabinets-folders.component.scss']
})
export class RtCabinetsFoldersComponent implements OnInit, OnChanges, OnDestroy {
    @Input() card: CardsClass;
    @Input() flagEdit: boolean;
    @Output() sendNewValues: EventEmitter<any> = new EventEmitter<any>();
    public Cabinet: Cabinets;
    private unSubscribe: Subject<any> = new Subject();
    private changedValuesMap = new Map();
    constructor(
        private _rtCabintsSrv: RigthsCabinetsServices,
        private _msgSrv: EosMessageService,
    ) {
        this._rtCabintsSrv.changeCabinets
        .pipe(
            takeUntil(this.unSubscribe)
        )
        .subscribe((newCabinets: CardsClass) => {
            this.card = newCabinets;
            this.setFolders(this.card.cabinets[0]);
        });
        this._rtCabintsSrv.submitRequest
        .pipe(
            takeUntil(this.unSubscribe)
        )
        .subscribe(() => {
           this.changedValuesMap.clear();
        });
    }
    ngOnInit() {
        this.setFolders(this.card.cabinets[0]);
    }
    ngOnChanges() {}

    changeFolders(changedCabinets: Cabinets, folder): void {
        folder.selected = !folder.selected;
        this.CheckChanges(changedCabinets);
        this.checkMapNewValues(changedCabinets);
        if (this.changedValuesMap.size) {
            this.sendNewValues.emit(this.changedValuesMap);
        }   else {
            this.sendNewValues.emit(false);
        }
    }
    CheckChanges(changedCabinets: Cabinets): void {
        let countChanges: number = 0;
        const arrValues: Array<string|number> = [];
        changedCabinets.folders.forEach(((folder, index) => {
            if (folder.selected) {
                  arrValues.push(folder.value);
            }
            if (folder.selected !== changedCabinets.originFolders[index].selected) {
                countChanges++;
            }
       }));
       if ((countChanges > 0) || (changedCabinets.originHomeCabinet !== changedCabinets.homeCabinet)) {
        changedCabinets.isChanged = true;
       }    else {
        changedCabinets.isChanged = false;
       }
       this.checkDisabled(changedCabinets, arrValues.join(''));
    }
    checkMapNewValues(changedCabinets: Cabinets): void {
        const isnCab = changedCabinets.isnCabinet;
        const isnClass = changedCabinets.isnClassif;
        if (changedCabinets.isChanged) {
              this.changedValuesMap.set(`${isnCab}|${isnClass}`, {
                cabinet: changedCabinets,
                due: this.card.cardDue,
                delete: changedCabinets.deleted,
            });
        }   else {
            if (this.changedValuesMap.has(`${isnCab}|${isnClass}`)) {
                this.changedValuesMap.delete(`${isnCab}|${isnClass}`);
            }
        }
    }
    checkDisabled(changedCabinets: Cabinets, newStringAvalable: string): void {
        changedCabinets.deleted = false;
        changedCabinets.isEmpty = false;
        const str1 = changedCabinets.checkDisabled(newStringAvalable, true);
        const str2 = changedCabinets.checkDisabled(newStringAvalable, false);
        if (!str1) {
            changedCabinets.folders[10].selected = false;
            changedCabinets.folders[10].disabled = true;
        }   else {
            changedCabinets.folders[10].disabled = false;
        }

        if (!str2) {
            changedCabinets.folders[11].selected = false;
            changedCabinets.folders[11].disabled = true;
        }   else {
            changedCabinets.folders[11].disabled = false;
        }
        if (!str1 && !str2 && !changedCabinets.folders[6].selected) {
            this.checkDeletedCabinet(changedCabinets);
        }
    }
    checkDeletedCabinet(changedCabinets: Cabinets): void {
        if (changedCabinets.homeCabinet) {
            this.alertWarning();
            changedCabinets.homeCabinet = false;
        }
        if (changedCabinets.isChanged) {
            changedCabinets.deleted = true;
        }
        changedCabinets.isEmpty = true;
    }
    changeMainCabinet() {
        if (this.Cabinet.homeCabinet) {
            this.alertWarning();
            this.Cabinet.homeCabinet = false;
            this.Cabinet.parent.homeCardCabinet = false;
        }   else {
            if (!this.Cabinet.parent.homeCardCabinet) {
                this.Cabinet.homeCabinet = true;
                this.Cabinet.parent.homeCardCabinet = true;
            }   else {
                this.findHomeCabinet();
                this.Cabinet.homeCabinet = true;
            }
        }
        this.CheckChanges(this.Cabinet);
        this.checkMapNewValues(this.Cabinet);
        if (this.changedValuesMap.size) {
            this.sendNewValues.emit(this.changedValuesMap);
        }   else {
            this.sendNewValues.emit(false);
        }
    }
    findHomeCabinet() {
     const findCabinet =   this.Cabinet.parent.cabinets.filter((cabinet: Cabinets) => {
            return cabinet.homeCabinet === true;
        });
        if (findCabinet.length) {
            findCabinet[0].homeCabinet = false;
            this.CheckChanges(findCabinet[0]);
            this.checkMapNewValues(findCabinet[0]);
        }
    }
    setFolders(folders): void {
        this.Cabinet = folders;
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
}