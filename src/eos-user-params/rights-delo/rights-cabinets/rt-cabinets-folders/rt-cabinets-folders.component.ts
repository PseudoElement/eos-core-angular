import {Component, OnInit, Input, OnChanges} from '@angular/core';
import { CardsClass } from '../helpers/cards-class';

@Component({
    selector: 'eos-cabinets-folders',
    templateUrl: 'rt-cabinets-folders.component.html',
    styleUrls: ['rt-cabinets-folders.component.scss']
})
export class RtCabinetsFoldersComponent implements OnInit, OnChanges {
    @Input() card: CardsClass;
    public folders;
    constructor() {}
    ngOnInit() {
    }
    ngOnChanges() {

            if (this.card) {
                this.setFolders(this.card.cabinets[0]);
            }

    }
    changeFolders(folder) {
        this.folders = folder;
    }
    setFolders(folders) {
        this.folders = folders;
        console.log(this.folders);
    }
}
