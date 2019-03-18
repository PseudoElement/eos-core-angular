import {Component, OnInit, Input, OnChanges, OnDestroy, Output, EventEmitter} from '@angular/core';
import { CardsClass, Cabinets} from '../helpers/cards-class';
import {RigthsCabinetsServices} from '../../../shared/services/rigths-cabinets.services';
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-cabinets-folders',
    templateUrl: 'rt-cabinets-folders.component.html',
    styleUrls: ['rt-cabinets-folders.component.scss']
})
export class RtCabinetsFoldersComponent implements OnInit, OnChanges, OnDestroy {
    @Input() card: CardsClass;
    @Output() sendNewValues: EventEmitter<any> = new EventEmitter<any>();
    public Cabinet: Cabinets;
    private unSubscribe: Subject<any> = new Subject();
    private changedValuesMap = new Map();
    constructor(
        private _rtCabintsSrv: RigthsCabinetsServices,
    ) {
        this._rtCabintsSrv.changeCabinets.takeUntil(this.unSubscribe).subscribe((newCabinets: CardsClass) => {
            this.card = newCabinets;
            this.setFolders(this.card.cabinets[0]);
        });
        this._rtCabintsSrv.submitRequest.takeUntil(this.unSubscribe).subscribe(() => {
           this.changedValuesMap.clear();
        });
    }
    ngOnInit() {
        this.setFolders(this.card.cabinets[0]);
    }
    ngOnChanges() {}

    changeFolders(chagedCabinet: Cabinets, folder): void {
        folder.selected = !folder.selected;
        this.CheckChanges();
        this.checkMapNewValues();
        if (this.changedValuesMap.size) {
            this.sendNewValues.emit(this.changedValuesMap);
        }   else {
            this.sendNewValues.emit(false);
        }
    }
    CheckChanges(): void {
        let countChanges: number = 0;
        const arrValues: Array<string|number> = [];
        this.Cabinet.folders.forEach(((folder, index) => {
            if (folder.selected) {
                  arrValues.push(folder.value);
            }
            if (folder.selected !== this.Cabinet.originFolders[index].selected) {
                countChanges++;
            }
       }));
       if ((countChanges > 0) || (this.Cabinet.originHomeCabinet !== this.Cabinet.homeCabinet)) {
           this.Cabinet.isChanged = true;
       }    else {
           this.Cabinet.isChanged = false;
       }
       this.checkDisabled(arrValues.join(''));
    }
    checkMapNewValues(): void {
        const isnCab = this.Cabinet.isnCabinet;
        const isnClass = this.Cabinet.isnClassif;
        if (this.Cabinet.isChanged) {
              this.changedValuesMap.set(`${isnCab}|${isnClass}`, {
                due: this.card.cardDue,
                isncl: this.Cabinet.isnClassif,
                isncab: this.Cabinet.isnCabinet,
                create: this.card.newCard,
                delete: this.Cabinet.deleted,
                values: this.Cabinet.folders
            });
            this.card.SetChangedCabinets.add(`${isnCab}|${isnClass}`);
        }   else {
            if (this.changedValuesMap.has(`${isnCab}|${isnClass}`)) {
                this.changedValuesMap.delete(`${isnCab}|${isnClass}`);
            }
            if (this.card.SetChangedCabinets.has(`${isnCab}|${isnClass}`)) {
                this.card.SetChangedCabinets.delete(`${isnCab}|${isnClass}`);
            }
        }
    }
    checkDisabled(newStringAvalable: string): void {
        this.Cabinet.deleted = false;
        this.Cabinet.isEmpty = false;
        const str1 = this.Cabinet.checkDisabled(newStringAvalable, true);
        const str2 = this.Cabinet.checkDisabled(newStringAvalable, false);
        if (!str1) {
            this.Cabinet.folders[10].selected = false;
            this.Cabinet.folders[10].disabled = true;
        }   else {
            this.Cabinet.folders[10].disabled = false;
        }

        if (!str2) {
            this.Cabinet.folders[11].selected = false;
            this.Cabinet.folders[11].disabled = true;
        }   else {
            this.Cabinet.folders[11].disabled = false;
        }
        if (!str1 && !str2) {
            this.checkDeletedCabinet();
        }
    }
    checkDeletedCabinet(): void {
        if (this.Cabinet.homeCabinet) {
            alert('Назначте главный кабинет');
            this.Cabinet.homeCabinet = false;
        }
        if (this.Cabinet.isChanged) {
            this.Cabinet.deleted = true;
        }
        this.Cabinet.isEmpty = true;
     }
    changeMainCabinet() {
        if (this.Cabinet.homeCabinet) {
            alert('Назначте главный кабинет');
            this.Cabinet.homeCabinet = false;
        }   else {
            if (!this.Cabinet.parent.homeCardCabinet) {
                this.Cabinet.homeCabinet = true;
                this.Cabinet.parent.homeCardCabinet = true;
            }   else {
                this.findHomeCabinet();
                this.Cabinet.homeCabinet = true;
            }
        }
        this.CheckChanges();
        this.checkMapNewValues();
    }
    findHomeCabinet() {
     const findCabinet =   this.Cabinet.parent.cabinets.filter((cabinet: Cabinets) => {
            return cabinet.homeCabinet === true;
        });
        if (findCabinet.length) {
            findCabinet[0].homeCabinet = false;
        }
    }
    setFolders(folders): void {
        this.Cabinet = folders;
    }
    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
