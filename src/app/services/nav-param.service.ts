import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';


@Injectable()

export class NavParamService {
    public _subscriBtnTree =  new Subject();
    private _changeStateSandwich$ = new BehaviorSubject(true);
    private _subscribeScan =  new Subject();
    get _subscriBtnTree$() {
        return this._subscriBtnTree.asObservable();
    }
    get StateSandwich$() {
        return this._changeStateSandwich$.asObservable();
    }
    get StateScanDelo() {
        return this._subscribeScan.asObservable();
    }

    changeStateSandwich(state: boolean): void {
        this._changeStateSandwich$.next(state);
    }

    scanObserver(flag: boolean): void {
        this._subscribeScan.next(flag);
    }
}
