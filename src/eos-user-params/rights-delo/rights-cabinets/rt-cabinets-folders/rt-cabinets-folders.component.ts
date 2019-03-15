import {Component, OnInit, Input, OnChanges, OnDestroy} from '@angular/core';
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
    }
    ngOnInit() {
        this.setFolders(this.card.cabinets[0]);
    }
    ngOnChanges() {}

    changeFolders(chagedCabinet: Cabinets, folder) {
        folder.selected = !folder.selected;
        this.CheckChanges();
        this.checkMapNewValues();
        console.log(this.changedValuesMap);
    }
    CheckChanges() {
    const flagChanges = this.Cabinet.folders.some(((folder, index) => {
            return folder.selected !== this.Cabinet.originFolders[index].selected;
       }));
       if (flagChanges) {
           this.Cabinet.isChanged = true;
       }    else {
           this.Cabinet.isChanged = false;
       }
    }
    checkMapNewValues() {
        const isnCab = this.Cabinet.isnCabinet;
        const isnClass = this.Cabinet.isnClassif;
        if (this.Cabinet.isChanged) {
              this.changedValuesMap.set(`${isnCab}|${isnClass}`, {
                create: this.card.newCard,
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
    setFolders(folders) {
        this.Cabinet = folders;
    }
    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
