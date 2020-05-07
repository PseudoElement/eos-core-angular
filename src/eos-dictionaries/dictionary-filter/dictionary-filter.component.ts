import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, IRecordModeDescription } from 'eos-dictionaries/interfaces';
import { FormGroup } from '@angular/forms';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDictionary } from '../core/eos-dictionary';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';
import { DID_NOMENKL_CL, NOMENKL_DICT } from 'eos-dictionaries/consts/dictionaries/nomenkl.const';
import { IBaseInput } from 'eos-common/interfaces';
import { YEAR_PATTERN } from 'eos-common/consts/common.consts';
import { EosStorageService } from 'app/services/eos-storage.service';


@Component({
    selector: 'eos-dictionary-filter',
    templateUrl: 'dictionary-filter.component.html'
})
export class DictionaryFilterComponent implements OnDestroy, OnInit {
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type
    @Output() setFilterNomenkl: EventEmitter<any> = new EventEmitter(); // todo add filter type

    filterInputs: IBaseInput[] = [
        {
            controlType: 'date',
            key: 'filter.stateDate',
            value: new Date(),
            label: 'Состояние на',
            hideLabel: true,
            readonly: false
        }, {
            controlType: 'numberIncrement',
            key: 'filter.stateYear',
            value: new Date().getFullYear(),
            label: 'Состояние на',
            pattern: YEAR_PATTERN,
            hideLabel: true,
            readonly: false,
            minValue: 1900,
            maxValue: 2100,
        }, {
            controlType: 'boolean',
            key: 'filter.CB1',
            value: 0,
            label: 'переходящие',
            hideLabel: true,
            readonly: false
        }
    ];

    currTab: string;
    modes: IRecordModeDescription[];

    hasDate: boolean;
    hasYear: boolean;
    type: E_DICT_TYPE;

    searchForm: FormGroup;
    inputs: InputBase<any>[];

    public mode = 0;

    private date: Date = new Date();
    private dictionary: EosDictionary;
    private subscriptions: Subscription[] = [];

    constructor(
        private _dictSrv: EosDictService,
        private inputCtrlSrv: InputControlService,
        private _storageSrv: EosStorageService,
    ) {
        this.inputs = this.inputCtrlSrv.generateInputs(this.filterInputs);
        this.searchForm = this.inputCtrlSrv.toFormGroup(this.inputs, false);

    }
    ngOnInit(): void {
        this.subscriptions.push(this._dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));

        this.searchForm.valueChanges.subscribe((data) => {
            this.applyFilters();
    });


    }
    applyFilters(): any {
        const dateFilter = this.searchForm.controls['filter.stateDate'];
        this._storageSrv.setItem('filter.stateDate', dateFilter.value);

        const yearFilter = this.searchForm.controls['filter.stateYear'];
        this._storageSrv.setItem('filter.stateYear', yearFilter.value || ' ');

        const cb1Filter = this.searchForm.controls['filter.CB1'];
        this._storageSrv.setItem('filter.CB1', cb1Filter.value);

        this._dictSrv.setMarkAllNone();
        if (this.dictId === NOMENKL_DICT.id) {
            const nomenklFilt = {};
            if (yearFilter.valid) {
                nomenklFilt['YEAR'] = yearFilter.value;
            }
            if (cb1Filter) {
                nomenklFilt['CB1'] = cb1Filter.value;
            }
            this.setFilterNomenkl.emit(nomenklFilt);
            this._dictSrv.setFilter(nomenklFilt);
        }

        if (dateFilter.valid) {
            this.dateFilter(dateFilter.value /*data['filter.stateDate']*/);
        } else if (dateFilter.errors.minDate || dateFilter.errors.maxDate) {
            dateFilter.setValue(new Date());
        } else {
            this.dateFilter(new Date());
        }
    }

    get dictId(): string {
        return this.dictionary.id;
    }

    setTab(key: string) {
        this.currTab = key;
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }


    dateFilter(date: Date) {
        if (!date || !this.date || date.getTime() !== this.date.getTime()) {
            this.date = date;
            this.setFilter.emit(this.date);
            this._dictSrv.setFilter({ date: date ? date.setHours(0, 0, 0, 0) : null });
        }
    }

    private initSearchForm() {
        this.dictionary = this._dictSrv.currentDictionary;
        if (this.dictionary) {
            const dateFilter = this.searchForm.controls['filter.stateDate'];
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();
            if (this.modes) {
                this.setTab(this.modes[0].key);
            }

            const _config = this.dictionary.descriptor.record.getSearchConfig();
            /* tslint:disable:no-bitwise */
            this.hasDate = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.dateFilter);

            if (this.dictId === DID_NOMENKL_CL) {
                const yearFilter = this.searchForm.controls['filter.stateYear'];
                const cb1 = this.searchForm.controls['filter.CB1'];
                const yv = this._dictSrv.getFilterValue('YEAR') === undefined ? yearFilter.value : this._dictSrv.getFilterValue('YEAR');
                const cv = this._dictSrv.getFilterValue('CB1');
                this.hasYear = true;
                if (yv || yv === '') {
                    yearFilter.setValue(yv, {emit: false});
                }

                if (cv) {
                    cb1.setValue(cv, {emit: false});
                }

            }

            if (this.dictId === 'departments') {
                if (this._dictSrv.getFilterValue('date') !== undefined) {
                    const newDate = this._dictSrv.getFilterValue('date') ? new Date(this._dictSrv.getFilterValue('date')) : null;
                    dateFilter.setValue(newDate);
                } else {
                    this.dateFilter(dateFilter.value);
                }
            }
            this.applyFilters();
        }
    }
}
