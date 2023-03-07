import { Injectable } from '@angular/core';
import { EosStorageService } from '../../app/services/eos-storage.service';

const DUTYS = 'dutysList';
const FULLNAMES = 'fullNamesList';

@Injectable()
export class EosDepartmentsService {
    private dutysList: string[];
    private fullnamesList: string[];

    get dutys(): string[] {
        if (this.dutysList === undefined) {
            this.dutysList = this.storageSrv.getItem(DUTYS) || [];
        }
        return this.dutysList;
    }

    get fullnames(): string[] {
        if (this.fullnamesList === undefined) {
            this.fullnamesList = this.storageSrv.getItem(FULLNAMES) || [];
        }
        return this.fullnamesList;
    }

    constructor(private storageSrv: EosStorageService) { }

    addDuty(duty: string) {
        this.addItem(this.dutys, duty, DUTYS);
    }

    addFullname(name: string) {
        this.addItem(this.fullnames, name, FULLNAMES);

    }

    private addItem(list: string[], item: string, storagePath) {
        if (item && -1 === list.findIndex((_item) => _item === item)) {
            list.push(item);
            this.storageSrv.setItem(storagePath, list, true);
        }
    }
}
