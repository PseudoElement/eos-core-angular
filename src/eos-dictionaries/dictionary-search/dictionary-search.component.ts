import { Component, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, ISearchSettings, SEARCH_MODES } from 'eos-dictionaries/interfaces';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';
import { EosDictionary } from '../core/eos-dictionary';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';
import {BaseCardEditComponent} from '../card-views/base-card-edit.component';


@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})
export class DictionarySearchComponent implements OnDestroy {
    // @Output() setFilter: EventEmitter<any> = new EventEmitter(); // todo add filter type
    @Output() switchFastSrch: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('full') fSearchPop;
    @ViewChild('quick') qSearchPop;

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

    hasQuick: boolean;
    hasFull: boolean;
    type: E_DICT_TYPE;

    searchModel = {};

    public mode = 0;

    private dictionary: EosDictionary;
    private subscriptions: Subscription[] = [];
    private searchData = {
        srchMode: ''
    };

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
    ) {
        ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));

        this.subscriptions.push(_dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(_dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));
    }
    get dictId(): string {
        return this.dictionary.id;
    }
    get noSearchData(): boolean {
        return Object.keys(this.searchModel).findIndex((prop) =>
            this.searchModel[prop] && this.searchModel[prop].trim()) === -1;
    }

    get searchActive(): boolean {
        return this._dictSrv.viewParameters.searchResults;
    }

    isActiveButton(): boolean {
        return (this.fSearchPop.isOpen /*|| (!this.noSearchData && this.searchActive) || this.searchActive*/);
    }

    setTab(key: string) {
        this.currTab = key;
        this.searchData.srchMode = key;
        this.searchModel = this.getSearchModel();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    autoFocus() {
        BaseCardEditComponent.autoFocusOnFirstStringElement('popover-container');
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
            this.fieldsDescription = this.dictionary.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();
            if (this.modes) {
                this.setTab(this.modes[0].key);
            } else {
                this.searchModel = this.getSearchModel();
            }

            const _config = this.dictionary.descriptor.record.getSearchConfig();
            // tslint:disable-next-line:no-bitwise
            this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
            // tslint:disable-next-line:no-bitwise
            this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);
        }
    }
}
