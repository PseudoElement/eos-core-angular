import { Injectable } from '@angular/core';
import { USER_CL } from 'eos-rest';
import { Subject, Observable } from 'rxjs';
import { IPaginationConfig } from '../../../eos-dictionaries/node-list-pagination/node-list-pagination.interfaces';
import { EosStorageService } from '../../../../src/app/services/eos-storage.service';
// import { PAGES_SELECT, LS_PAGE_LENGTH } from 'eos-user-select/shered/consts/pagination-user-select.consts';

@Injectable()
export class UserPaginationService {
    UsersList: any[] = [];
    paginationConfig: IPaginationConfig;
    countMaxSize: number = 0;
    totalPages: number;
    getSumIteq: boolean;
    typeConfig: string;
    private _paginationConfig$: Subject<IPaginationConfig>;
    private _NodeList$: Subject<USER_CL[]>;

    get paginationConfig$(): Observable<IPaginationConfig> {
        return this._paginationConfig$.asObservable();
    }

    get NodeList$(): Observable<any[]> {
        return this._NodeList$.asObservable();
    }

    constructor(
        private _storageSrv: EosStorageService,
    ) {
        this.totalPages = undefined;
        this._NodeList$ = new Subject();
        this._paginationConfig$ = new Subject();
        this._initPaginationConfig(true);
        this.countMaxSize = this.paginationConfig.itemsQty;
    }

    changePagination(config: IPaginationConfig) {
        Object.assign(this.paginationConfig, config);
        this._updateVisibleNodes();
        if (this.totalPages === undefined) {
            this._paginationConfig$.next(this.paginationConfig);
        }
    }

    SelectConfig() {
        switch (this.typeConfig) {
            case 'users':
                if (this._storageSrv.getItem('users') === null) {
                    this._storageSrv.setItem('users', this.paginationConfig, true);
                }
                const confUsers = this._storageSrv.getItem('users');
                this.paginationConfig = confUsers;
                break;
            case 'sum-protocol':
                if (this._storageSrv.getItem('sum-protocol') === null) {
                    this._storageSrv.setItem('sum-protocol', this.paginationConfig, true);
                }
                const confSum = this._storageSrv.getItem('sum-protocol');
                this.paginationConfig = confSum;
                break;
            case 'protocol':
                if (this._storageSrv.getItem('protocol') === null) {
                    this._storageSrv.setItem('protocol', this.paginationConfig, true);
                }
                const confProt = this._storageSrv.getItem('protocol');
                this.paginationConfig = confProt;
                break;
        }
    }
    getLength() {
        const conf = this._storageSrv.getItem(this.typeConfig);
        if (conf === undefined) {
            return 10;
        } else {
            const confProt = this._storageSrv.getItem(this.typeConfig);
            return confProt.length;
        }
    }

    _initPaginationConfig(update?: boolean) {
        this.paginationConfig = Object.assign(this.paginationConfig || { start: 1, current: 1 }, {
            length: this.getLength(),
            itemsQty: this._getCountPage(),
        });
        if (update) {
            this._fixCurrentPage();
        } else {
            //     const pagination_number_save = this._storageSrv.getItem('page_number_user_settings');
            if (this.paginationConfig.current !== undefined) {
                this.paginationConfig.current = this.paginationConfig.current;
                this.paginationConfig.start = this.paginationConfig.start;
            } else {
                this.paginationConfig.current = 1;
                this.paginationConfig.start = 1;
            }
            this._paginationConfig$.next(this.paginationConfig);
        }
        this.countMaxSize = this.paginationConfig.itemsQty;
    }

    private _fixCurrentPage() {
        this.paginationConfig.itemsQty = this._getCountPage();
        const maxPage = Math.max(1, Math.ceil(this.paginationConfig.itemsQty / this.paginationConfig.length));
        this.paginationConfig.start = Math.min(this.paginationConfig.start, maxPage);
        this.paginationConfig.current = Math.min(this.paginationConfig.current, maxPage);
        this._paginationConfig$.next(this.paginationConfig);
    }

    private _getCountPage() {
        if (this.UsersList) {
            if (this.getSumIteq === true) {
                return this.totalPages;
            } else {
                return this.UsersList.length;
            }
        } else {
            return 0;
        }
    }

    private _updateVisibleNodes() {
        this._fixCurrentPage();
        this.countMaxSize = this.paginationConfig.itemsQty;
        const pageList = this.UsersList.slice((this.paginationConfig.start - 1) * this.paginationConfig.length, this.paginationConfig.current * this.paginationConfig.length);
        this._NodeList$.next(pageList);
        // this.updatePageList(pageList).then(pageLists => {
        //     this._NodeList$.next(pageLists);
        // });
    }
}
