import { Injectable } from '@angular/core';
import { BehaviorSubject , Subject} from 'rxjs';


@Injectable()

export class NavParamService {
    public _subscriBtnTree =  new Subject();
    private _changeStateSandwich$ = new BehaviorSubject(true);
    private _changeStateRightSandwich$ = new BehaviorSubject(false);
    private _blockStateRightSandwich$ = new BehaviorSubject(false);
    private _showRigth$ = new BehaviorSubject(false);
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
    get BlockStateSandwichRight$() {
        return this._blockStateRightSandwich$.asObservable();
    }
    get StateSandwichRight$() {
        return this._changeStateRightSandwich$.asObservable();
    }
    get StateRightSandwich$() {
        return this._showRigth$.asObservable();
    }

    changeStateSandwich(state: boolean): void {
        this._changeStateSandwich$.next(state);
    }
    blockChangeStateRightSandwich(state: boolean) {
        this._blockStateRightSandwich$.next(state);
    }
    changeStateRightSandwich(state: boolean) {
        this._changeStateRightSandwich$.next(state);
    }
    showRightSandwich(state: boolean) {
        this._showRigth$.next(state);
    }

    scanObserver(flag: boolean): void {
        this._subscribeScan.next(flag);
    }

}
