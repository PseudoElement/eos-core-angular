import { Component, Output, EventEmitter, ViewChild, OnDestroy, Input, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, IRecordModeDescription, SearchFormSettings, SEARCHTYPE } from 'eos-dictionaries/interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';
import { BaseCardEditComponent } from '../card-views/base-card-edit.component';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-tooltip.service';
// export interface IQuickSrchObj {
//     isOpenQuick: boolean;
// }
import { WaitClassifService } from 'app/services/waitClassif.service';
import { IOpenClassifParams } from 'eos-common/interfaces';
// import { PipRX } from 'eos-rest';

export interface IQuickSrchObj {
    isOpenQuick: boolean;
}

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy, OnInit, OnChanges {
    @Input()
    settings: SearchFormSettings;
    @Output()
    searchRun: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Output()
    switchFastSrch: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('full')
    fSearchPop;
    @ViewChild('quick')
    qSearchPop;
    tooltipDelay = TOOLTIP_DELAY_VALUE;

    fieldsDescription = {
        rec: {}
    };
    data: any;
    currTab: string;
    modes: IRecordModeDescription[];
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
        private _classif: WaitClassifService
        ) {
    }

    ngOnChanges () {

    }
    ngOnInit(): void {
        this.subscriptions.push(this._dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));
    }
    get dictId(): string {
        return this.dictionary.id;
    }
    get noSearchData(): boolean {
        return Object.keys(this.searchModel).findIndex((prop) => this.searchModel[prop] && this.searchModel[prop].trim()) === -1;
    }
    get searchActive(): boolean {
        return this._dictSrv.viewParameters.searchResults;
    }
    isActiveButton(): boolean {
        return (this.fSearchPop.isOpen || this.settings.lastSearch === SEARCHTYPE.full /*|| (!this.noSearchData && this.searchActive) || this.searchActive*/);
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
        this.settings.entity = this.getModelName();
        this.settings.entity_dict = this.dictId;
        this.settings.lastSearch = SEARCHTYPE.full;
        this.settings.opts.mode = this.mode;
        const model = (this.dictId === 'departments') ? this.searchData : this.getSearchModel();
        this.settings.full.data = model;
        this.searchRun.emit(this.settings);
    }
    clearForm() {
        this.clearModel(this.getModelName());
    }
    showFastSrch() {
        this.switchFastSrch.emit(this.isQuickOpened);
    }
    close() {
    }

    get isQuickOpened(): boolean {
        return this.settings && this.settings.lastSearch === SEARCHTYPE.quick;
    }

    public considerDel() {
        this._dictSrv.updateViewParameters({ showDeleted: this.settings.opts.deleted });
    }
    public openDict() {
        this.openRubricCL('REGION_CL').then((params: any) => {
            if (params.data && params.data.length) {
                this.searchModel['REGION_NAME'] = params.data[0].CLASSIF_NAME;
                this.searchModel['ISN_REGION'] = params.isnNode;
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    private clearModel(modelName: string) {
        this.mode = 0;
        this.settings.opts.deleted = false;
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
            if (this.settings) {
                if (this.settings.full.data) {
                    if (this.settings.entity_dict === 'departments') {
                        this.searchData = this.settings.full.data;
                        this.setTab(this.searchData.srchMode);
                    } else {
                        this.searchData[this.settings.entity] = this.settings.full.data;

                    }

                    this.mode = this.settings.opts.mode;
                } else {
                    ['department', 'data', 'person', 'cabinet'].forEach((model) => this.clearModel(model));
                }
            }

            this.fieldsDescription = this.dictionary.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();


            if (this.modes) {
                const i = this.modes.findIndex( m => m.key === (this.settings && this.settings.entity));
                this.setTab(this.modes[i >= 0 ? i : 0].key);
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
    private openRubricCL(classif: string): Promise<any> {
        const params: IOpenClassifParams = {
            classif: classif,
            selectMulty: false,
        };
        return this._classif.openClassif(params, true).then(isnNode => {
            if (isnNode) {
                return this.dictionary['dictDescrSrv']['apiSrv'].read({
                    REGION_CL: {
                        criteries: {
                            ISN_NODE: isnNode
                        }
                    }
                }).then(data => {
                    return { data, isnNode };
                });
             }
        }).catch((e) => {
            return { data: [], isnNode: null };
        });
    }
}
