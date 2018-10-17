import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()

export class NavParamService {
    private _changeStateSandwich$ = new BehaviorSubject(false);

    get StateSandwich$() {
        return this._changeStateSandwich$.asObservable();
    }

    changeStateSandwich(state: boolean) {
        this._changeStateSandwich$.next(state);
    }
}
