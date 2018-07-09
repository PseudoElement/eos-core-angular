import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { Subject } from '../../../../../node_modules/rxjs';

@Injectable()
export class EosParametersDescriptionServ {
    private _saveFromAskSubject = new Subject<any>();
    get saveData$ () {
        return this._saveFromAskSubject.asObservable();
    }
    constructor(private apiSrv: PipRX) {}

    saveDataFromAsk() {
        this._saveFromAskSubject.next();
    }
    getData(query?: any): Promise<any[]> {
        return this.apiSrv
        .read(query)
        .then((data: any[]) => {
            // this.prepareForEdit(data);
            return data;
        });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }

    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
