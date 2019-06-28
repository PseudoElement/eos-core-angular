import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { IPaginationConfig } from './node-list-pagination.interfaces';
import { LS_PAGE_LENGTH, PAGES } from './node-list-pagination.consts';
import { EosDictService } from '../services/eos-dict.service';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'eos-node-list-pagination',
    templateUrl: 'node-list-pagination.component.html'
})
export class NodeListPaginationComponent {
    @Input() currentState: boolean[];
    public config: IPaginationConfig;
    readonly pageLengths = PAGES;

    pageCount = 1;
    pages: number[] = [];

    private readonly _buttonsTotal = 5;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(
        private _dictSrv: EosDictService,
        private _storageSrv: EosStorageService,
    ) {
        _dictSrv.paginationConfig$
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
        this._dictSrv.changePagination(this.config);
    }

    public showMore() {
        this.config.current++;
        this._dictSrv.changePagination(this.config);
    }

    public showPage(page: number): void {
        if (page !== this.config.current) {
            this.config.current = page;
            this.config.start = page;
            this._dictSrv.changePagination(this.config);
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
