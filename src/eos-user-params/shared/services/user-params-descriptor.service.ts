import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UserParamsDescriptorSrv {
    private _saveFromAskSubject = new Subject<any>();
    get saveData$ () {
        return this._saveFromAskSubject.asObservable();
    }
    saveDataFromAsk() {
        this._saveFromAskSubject.next();
    }
}
