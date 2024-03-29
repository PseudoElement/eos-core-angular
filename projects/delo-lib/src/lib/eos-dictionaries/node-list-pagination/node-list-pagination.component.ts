import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { EosStorageService } from '../../app/services/eos-storage.service';
import { IPaginationConfig } from '../../eos-common/interfaces/interfaces';
import { LS_PAGE_LENGTH, PAGES } from './node-list-pagination.consts';
import { EosDictService } from '../services/eos-dict.service';
import { takeUntil } from 'rxjs/operators';
import { EosUtils } from '../../eos-common/core/utils';

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
        this.config.current = 1;
        this.config.start = 1;
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

    isPageCountAll(): boolean {
        return this.config.length === 0;
    }

    getShowLabel(): string {
        return (this.config.length > 0) ? `Показывать по ${this.config.length}` : 'Показывать все';
    }

    private _update() {
        const { pageCount, pages } = EosUtils.updatePagination(this.config, this._buttonsTotal);
        this.pageCount = pageCount;
        this.pages = pages;
    }


}
