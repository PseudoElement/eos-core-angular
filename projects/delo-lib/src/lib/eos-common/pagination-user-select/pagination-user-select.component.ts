import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { PAGES_SELECT, LS_PAGE_LENGTH } from '../../eos-user-select/shered/consts/pagination-user-select.consts';
import { IPaginationConfig } from '../../eos-common/interfaces';
import { UserPaginationService } from '../../eos-user-params/shared/services/users-pagination.service';
import { EosUtils } from '../../eos-common/core/utils';

@Component({
    selector: 'eos-user-list-pagination',
    templateUrl: 'pagination-user-select.component.html'
})
export class UserSelectPaginationComponent {
    @Input() currentState: boolean[];
    public config: IPaginationConfig;
    readonly pageLengths = PAGES_SELECT;

    pageCount = 1;
    pages: number[] = [];

    private readonly _buttonsTotal = 5;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _user_pagination: UserPaginationService,
        private _storageSrv: EosStorageService,
    ) {
        _user_pagination.paginationConfig$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((config: IPaginationConfig) => {
                if (config) {
                    this.config = config;
                    this._update();
                }
            });
    }

    public setPageLength(length: number): void {
        this._storageSrv.setItem(LS_PAGE_LENGTH, length, true);
        this.config.length = length;
        this.config.current = 1;
        this.config.start = 1;
        this._user_pagination.changePagination(this.config);
    }

    public showMore() {
        this.config.showMore = true;
        this.config.current++;
        this._user_pagination.changePagination(this.config);
    }

    public showPage(page: number): void {
        if (page !== this.config.current) {
            this.config.showMore = false;
            this._storageSrv.setItem('page_number_user_settings', page, false);
            this.config.current = page;
            this.config.start = page;
            this._user_pagination.changePagination(this.config);
        }
    }

    isPageCountAll(): boolean {
      return this.config ? this.config.length === 0 : false;
    }

    getShowLabel(): string {
        let ret: string = '';
        if (this.config) {
           ret = this.config.length > 0 ? `Показывать по ${this.config.length}` : 'Показывать все';
        }
        return ret;
    }

    private _update() {
        const { pageCount, pages } = EosUtils.updatePagination(this.config, this._buttonsTotal);
        this.pageCount = pageCount;
        this.pages = pages;
    }

}
