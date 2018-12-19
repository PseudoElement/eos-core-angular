import { DID_NOMENKL_CL } from './../consts/dictionaries/nomenkl.const';
import { Component, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../consts/search-types';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';
import { FormGroup } from '@angular/forms';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDictionary } from '../core/eos-dictionary';

/*
const SEARCH_MODEL = {
    rec: {},
    cabinet: {},
    printInfo: {}
};
*/

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})
export class DictionarySearchComponent implements OnDestroy {
    @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type
    @Output() switchFastSrch: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('full') fSearchPop;
    @ViewChild('quick') qSearchPop;

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

    fieldsDescription = {
        rec: {}
    };
    data: any;
    department: any;
    person: any;
    cabinet: any;

    settings: ISearchSettings = {
        mode: SEARCH_MODES.totalDictionary,
        deleted: false
    };
    currTab: string;
    modes: IRecordModeDescription[];
    searchDone = true; // Flag search is done, false while not received data

    isOpenQuick = false;
    dataQuick = null;

    hasDate: boolean;
    hasQuick: boolean;
    hasFull: boolean;
    hasYear: boolean;
    type: E_DICT_TYPE;

    searchForm: FormGroup;
    inputs: InputBase<any>[];

    searchModel = {};

    public mode = 0;

    private date: Date = new Date();
    private dictionary: EosDictionary;
    private subscriptions: Subscription[] = [];
    private searchData = {
        srchMode: ''
    };

    get dictId(): string {
        return this.dictionary.id;
    }

    get noSearchData(): boolean {
        return Object.keys(this.searchModel).findIndex((prop) =>
            this.searchModel[prop] && this.searchModel[prop].trim()) === -1;
        /*
        const model = this.getSearchModel();
        let noData = true;
        Object.keys(model).forEach((_dict) => {
            Object.keys(model[_dict]).forEach((_field) => {
                noData = !(model[_dict][_field] && model[_dict][_field].trim());
            });
        });
        return noData;
        */
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private inputCtrlSrv: InputControlService,
    ) {
        ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));
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

    setTab(key: string) {
        this.currTab = key;
        this.searchData.srchMode = key;
        this.searchModel = this.getSearchModel();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    fullSearch() {
        this.settings.mode = this.mode;
        this.fSearchPop.hide();
        if (this.searchDone) {
            this.searchDone = false;
            const model = (this.dictId === 'departments') ? this.searchData : this.getSearchModel();
            this._dictSrv.fullSearch(model, this.settings)
                .then(() => {
                    this.searchDone = true;
                });
        } else {
            this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
        }
    }

    clearForm() {
        this.clearModel(this.getModelName());
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

    showFastSrch() {
        this.isOpenQuick = !this.isOpenQuick;
        this.switchFastSrch.emit(this.isOpenQuick);
    }

    public considerDel() {
        this._dictSrv.updateViewParameters({ showDeleted: this.settings.deleted });
    }

    private clearModel(modelName: string) {
        this.mode = 0;
        this.settings.deleted = false;
        const model = this.searchData[modelName];
        if (model) {
            Object.keys(model).forEach((prop) => model[prop] = null);
        } else {
            this.searchData[modelName] = {};
        }
    }

    private getModelName(): string {
        return (this.dictId === 'departments') ? this.currTab || 'department' : this.dictId;
    }

    private getSearchModel() {
        const prop = this.getModelName();
        if (!this.searchData[prop]) {
            this.searchData[prop] = {};
        }
        return this.searchData[prop];
    }

    private initSearchForm() {
        this.dictionary = this._dictSrv.currentDictionary;
        if (this.dictionary) {
            const dateFilter = this.searchForm.controls['filter.stateDate'];
            this.fieldsDescription = this.dictionary.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();
            if (this.modes) {
                this.setTab(this.modes[0].key);
            } else {
                this.searchModel = this.getSearchModel();
            }

            const _config = this.dictionary.descriptor.record.getSearchConfig();
            /* tslint:disable:no-bitwise */
            this.hasDate = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.dateFilter);
            this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
            this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);
            /* tslint:enable:no-bitwise */

            if (this.dictId === DID_NOMENKL_CL) {
                const yearFilter = this.searchForm.controls['filter.stateYear'];
                this.hasYear = true;
                if (this._dictSrv.getFilterValue('YEAR')) {
                    yearFilter.setValue(this._dictSrv.getFilterValue('YEAR'));
                } else {
                    this.numberFilter(yearFilter.value);
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
