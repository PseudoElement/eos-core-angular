import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { USER_CL, DEPARTMENT, DOCGROUP_CL } from 'eos-rest';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {IPaginationConfig} from '../../../eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { EosStorageService } from '../../../../src/app/services/eos-storage.service';
import { PAGES_SELECT, LS_PAGE_LENGTH } from 'eos-user-select/shered/consts/pagination-user-select.consts';
@Injectable()
export class UserParamApiSrv {
    private paginationConfig: IPaginationConfig;
    private CurrentList: USER_CL[] = [];
    private _paginationConfig$: BehaviorSubject<IPaginationConfig>;
    private _NodeList$: BehaviorSubject<USER_CL[]>;
    get paginationConfig$(): Observable<IPaginationConfig> {
        return this._paginationConfig$.asObservable();
    }

    get NodeList$(): Observable<USER_CL[]> {
        return this._NodeList$.asObservable();
    }
    constructor(
        private apiSrv: PipRX,
        private _router: Router,
        private _storageSrv: EosStorageService
    ) {
        this._NodeList$ = new BehaviorSubject([]);
        this._paginationConfig$ = new BehaviorSubject(null);
        this._initPaginationConfig();
    }

    getData<T>(query?: any): Promise<T[]> {
        return this.apiSrv
        .read<T>(query)
        .then((data: T[]) => {
            return data;
          /*  return new Promise<T[]>(function() {
                setTimeout(() => { console.log(data); }, 3000);
            });*/
        })
        .catch(err => {
            if (err.code === 434) {
                this._router.navigate(
                    ['/login'],
                    {
                        queryParams: {
                            returnUrl: this._router.url
                        }
                    }
                );
            }
            throw err;
        });
    }

    setData(query: any[]): Promise<any[]> {
        return this.apiSrv.batch(query, '').then((data: any) => {
            return data;
        });
    }

    getUsers(dueDep?: string): Promise<USER_CL[]> {
        let q;
        if (!dueDep) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE_DEP: `${dueDep}%`});
        }
        const query = {USER_CL: q};

        return this.getData<USER_CL>(query)
        .then(data => {
            this.CurrentList = data.filter(user => user.ISN_LCLASSIF !== 0 && user.CLASSIF_NAME !== ' ');
            this._initPaginationConfig(true);
            return this.CurrentList.slice((this.paginationConfig.start - 1) * this.paginationConfig.length, this.paginationConfig.current * this.paginationConfig.length) ;
        });
    }

    grtDepartment(due?: string): Promise<DEPARTMENT[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE: due});
        }
        const query = {DEPARTMENT: q};
        return this.getData<DEPARTMENT>(query);
    }
    getDocGroup(due?: string): Promise<DOCGROUP_CL[]> {
        let q;
        if (!due) {
            q = ALL_ROWS;
        } else {
            q = PipRX.criteries({DUE: due});
        }
        const query = {DOCGROUP_CL: q};
        return this.getData<DOCGROUP_CL>(query);
    }

    changePagination(config: IPaginationConfig) {
       Object.assign(this.paginationConfig, config);
        this._updateVisibleNodes();
        this._paginationConfig$.next(this.paginationConfig);
    }

    _initPaginationConfig(update?: boolean) {
        this.paginationConfig = Object.assign(this.paginationConfig || {start: 1, current: 1}, {
            length: this._storageSrv.getItem(LS_PAGE_LENGTH) || PAGES_SELECT[0].value,
            itemsQty: this._getCountPage()
        });
        if (update) {
            this._fixCurrentPage();
        } else {
            this.paginationConfig.current = 1;
            this.paginationConfig.start = 1;
            this._paginationConfig$.next(this.paginationConfig);
        }
    }

    private _fixCurrentPage() {
        this.paginationConfig.itemsQty = this._getCountPage();
        const maxPage = Math.max(1, Math.ceil(this.paginationConfig.itemsQty / this.paginationConfig.length));
        this.paginationConfig.start = Math.min(this.paginationConfig.start, maxPage);
        this.paginationConfig.current = Math.min(this.paginationConfig.current, maxPage);
        this._paginationConfig$.next(this.paginationConfig);
    }

  private  _getCountPage() {
       if (this.CurrentList) {
           return this.CurrentList.length;
       } else {
           return 0;
       }
    }
    private _updateVisibleNodes() {
        this._fixCurrentPage();
        const pageList = this.CurrentList.slice((this.paginationConfig.start - 1) * this.paginationConfig.length, this.paginationConfig.current * this.paginationConfig.length);
        this._NodeList$.next(pageList);
    }
    // protected prepareForEdit(records: any[]): any[] {
    //     return records.map((record) => this.apiSrv.entityHelper.prepareForEdit(record));
    // }
}
