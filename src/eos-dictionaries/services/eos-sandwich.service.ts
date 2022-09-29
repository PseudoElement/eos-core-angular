import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

import { E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { EosDictService } from './eos-dict.service';
import { NavParamService } from 'app/services/nav-param.service';
@Injectable()
export class EosSandwichService {
    private _currentDictState: boolean[];
    // [true, true] - both is opened
    private _currentDictState$: BehaviorSubject<boolean[]> = new BehaviorSubject<boolean[]>(null);
    private _searchMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private _treeIsBlocked = false;

    private _treeScrollTop = 0;

    constructor(
        private _dictSrv: EosDictService,
        private _navSrv: NavParamService,
        ) {
        this._dictSrv.dictionary$.subscribe((dict) => {
            if (dict) {
                if (dict.descriptor.type === E_DICT_TYPE.linear) {
                    this._treeIsBlocked = true;
                } else {
                    this._treeIsBlocked = false;
                }
            }
            if (!this._currentDictState) {
                this.resize();
            }
        });
        // баг 100937
        this._navSrv._subscriBtnTree$.subscribe((bol: boolean) => {
            this._treeIsBlocked = bol;
        });
    }

    get currentDictState$(): Observable<boolean[]> {
        return this._currentDictState$.asObservable();
    }

    get searchMode$(): Observable<boolean> {
        return this._searchMode$.asObservable();
    }

    get treeIsBlocked(): boolean {
        return this._treeIsBlocked;
    }

    get treeScrollTop(): number {
        return this._treeScrollTop;
    }

    set treeScrollTop(val: number) {
        this._treeScrollTop = val;
    }

    changeDictState( state: boolean, isLeft: boolean ) {
        if (isLeft) {
            this._currentDictState[0] = state;
        } else {
            this._currentDictState[1] = state;
        }
        this._currentDictState$.next(this._currentDictState);
    }

    changeSearchMode(state: boolean) {
        this._searchMode$.next(state);
    }

    resize() {
        if (window.innerWidth > 1000) {
            this._currentDictState = [true, true];
        } else {
            this._currentDictState = [false, false];
        }
        this._currentDictState$.next(this._currentDictState);
    }

}
