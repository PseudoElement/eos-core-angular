import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, IRecordModeDescription } from 'eos-dictionaries/interfaces';
// import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { FormGroup } from '@angular/forms';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDictionary } from '../core/eos-dictionary';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';
import { DID_NOMENKL_CL } from 'eos-dictionaries/consts/dictionaries/nomenkl.const';

/*
const SEARCH_MODEL = {
    rec: {},
    cabinet: {},
    printInfo: {}
};
*/

@Component({
    selector: 'eos-dictionary-filter',
    templateUrl: 'dictionary-filter.component.html'
})
export class DictionaryFilterComponent implements OnDestroy {
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type

    filterInputs = [
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
            hideLabel: true,
            readonly: false
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
        // private _msgSrv: EosMessageService,
        private inputCtrlSrv: InputControlService,
    ) {
        // ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));
        this.inputs = this.inputCtrlSrv.generateInputs(this.filterInputs);
        this.searchForm = this.inputCtrlSrv.toFormGroup(this.inputs, false);
        const dateFilter = this.searchForm.controls['filter.stateDate'];
        const yearFilter = this.searchForm.controls['filter.stateYear'];
        const cb1Filter = this.searchForm.controls['filter.CB1'];

        this.searchForm.valueChanges.subscribe((data) => {
            if (yearFilter.valid) {
                this.numberFilter(data['filter.stateYear']);
            }
            if (cb1Filter) {
                this.cbFilter(data['filter.CB1']);
            }
            if (dateFilter.valid) {
                this.dateFilter(data['filter.stateDate']);
            } else if (dateFilter.errors.minDate || dateFilter.errors.maxDate) {
                dateFilter.setValue(new Date());
            } else {
                this.dateFilter(new Date());
            }
        });

        this.subscriptions.push(_dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(_dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));
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


    numberFilter(n: number) {
        this._dictSrv.setFilter({ YEAR: n});
    }

    cbFilter(n: boolean) {
        this._dictSrv.setFilter({ CB1: n});
    }

    dateFilter(date: Date) {
        if (!date || !this.date || date.getTime() !== this.date.getTime()) {
            this.date = date;
            this._dictSrv.setFilter({ date: date ? date.setHours(0, 0, 0, 0) : null });
        }
    }

    private initSearchForm() {
        this.dictionary = this._dictSrv.currentDictionary;
        if (this.dictionary) {
            const dateFilter = this.searchForm.controls['filter.stateDate'];
            // this.fieldsDescription = this.dictionary.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();
            if (this.modes) {
                this.setTab(this.modes[0].key);
            } else {
                // this.searchModel = this.getSearchModel();
            }

            const _config = this.dictionary.descriptor.record.getSearchConfig();
            /* tslint:disable:no-bitwise */
            this.hasDate = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.dateFilter);

            if (this.dictId === DID_NOMENKL_CL) {
                const yearFilter = this.searchForm.controls['filter.stateYear'];
                const cb1 = this.searchForm.controls['filter.CB1'];
                const yv = this._dictSrv.getFilterValue('YEAR');
                const cv = this._dictSrv.getFilterValue('CB1');
                this.hasYear = true;
                if (yv) {
                    yearFilter.setValue(yv);
                } else {
                    this.numberFilter(yearFilter.value);
                }

                if (cv) {
                    cb1.setValue(cv);
                }

            }

            if (this.dictId === 'departments') {
                if (this._dictSrv.getFilterValue('date')) {
                    dateFilter.setValue(new Date(this._dictSrv.getFilterValue('date')));
                } else {
                    this.dateFilter(dateFilter.value);
                }
            }
        }
    }
}
