import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { PAGES_SELECT, LS_PAGE_LENGTH } from 'eos-user-select/shered/consts/pagination-user-select.consts';
import { IPaginationUserConfig } from 'eos-user-select/shered/consts/pagination-user-select.interfaces';
import {UserParamApiSrv} from '../../eos-user-params/shared/services/user-params-api.service';


@Component({
    selector: 'eos-user-list-pagination',
    templateUrl: 'pagination-user-select.component.html'
})
export class UserSelectPaginationComponent {
    @Input() currentState: boolean[];
    public config: IPaginationUserConfig;
    readonly pageLengths = PAGES_SELECT;

    pageCount = 1;
    pages: number[] = [];

    private readonly _buttonsTotal = 5;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _user_service: UserParamApiSrv,
        private _storageSrv: EosStorageService,
    ) {

        _user_service.paginationConfig$.takeUntil(this.ngUnsubscribe)
            .subscribe((config: IPaginationUserConfig) => {
                if (config) {
                    this.config = config;
                    this._update();
                }
            });
    }

    public setPageLength(length: number): void {
        this._storageSrv.setItem(LS_PAGE_LENGTH, length, true);
        this.config.length = length;
        this._user_service.changePagination(this.config);
    }

    public showMore() {
        this.config.current++;
        this._user_service.changePagination(this.config);
    }

    public showPage(page: number): void {
        if (page !== this.config.current) {
            this.config.current = page;
            this.config.start = page;
            this._user_service.changePagination(this.config);
        }
    }

    private _update() {
        let total = Math.ceil(this.config.itemsQty / this.config.length);
        if (total === 0) { total = 1; }
        const firstSet = this._buttonsTotal - this.config.current;
        const lastSet = total - this._buttonsTotal + 1;
        const middleSet = this._buttonsTotal - 3;

        this.pageCount = total;
        this.pages = [];
        for (let i = 1; i <= this.pageCount; i++) {
            if (
                i === 1 || i === this.pageCount || // first & last pages
                (1 < firstSet && i < this._buttonsTotal) || // first 4 pages
                (1 < this.config.current - lastSet && i - lastSet > 0) || // last 4 pages
                (middleSet > this.config.current - i && i - this.config.current < middleSet)  // middle pages
            ) {
                this.pages.push(i);
            }
        }
    }
}
