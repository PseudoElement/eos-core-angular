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
import { AR_DESCRIPT } from 'eos-rest';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { DOP_REC } from 'eos-dictionaries/consts/dictionaries/_common';
import { FormGroup } from '@angular/forms';
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
    public formSearch: FormGroup;
    public inputs;
    inputsSelect;
    formSelect: FormGroup;
    mapAr_Descr: Map<string, AR_DESCRIPT> = new Map();
    private dictionary: EosDictionary;
    private subscriptions: Subscription[] = [];
    private searchData = {
        srchMode: ''
    };
    private searchValueDopRec = null;
    constructor(
        private _dictSrv: EosDictService,
        private _classif: WaitClassifService,
        private _inputCtrlSrv: InputControlService,
        private _dataSrv: EosDataConvertService,
    ) {
    }

    ngOnChanges() {

    }
    ngOnInit(): void {
        this.subscriptions.push(this._dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.searchInfo$.subscribe((_d) => this.clearForm()));
        this.subscriptions.push(this._dictSrv.reloadDopRec$.subscribe(() => this.updateDopRec()));
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
    get arDescript(): AR_DESCRIPT[] {
        if (this.dictionary) {
            return this.dictionary.descriptor['dopRec'];
        }
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
        const model = (this.dictId === 'departments' || this.dictId === 'organization') ? this.searchData : this.getSearchModel();
        this.settings.full.data = model;
        if (this.searchValueDopRec) {
            this.searchModel['DOP_REC'] =  this.searchValueDopRec;
        }  else {
            delete this.searchModel['DOP_REC'];
        }
        this.searchRun.emit(this.settings);
        this.fSearchPop.hide();
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
    get validFormSearch() {
        if (this.formSearch) {
            return this.formSearch.valid;
        }
        return true;
    }
    get hasSelectValue (): boolean {
        if (this.formSelect) {
            return !!this.formSelect.controls['rec.select'].value;
        }   else {
            return true;
        }
    }
    get arType(): AR_DESCRIPT {
        if (this.formSelect.controls['rec.select'].value) {
            return this.mapAr_Descr.get(this.formSelect.controls['rec.select'].value);
        }
        return null;
    }

    public rest($event) {
        /* console.log($event); */
        $event.target.checked ? this.searchModel['NEW'] = '1' : delete this.searchModel['NEW'];
    }

    public considerDel() {
        this._dictSrv.updateViewParameters({ showDeleted: this.settings.opts.deleted });
    }
    public openDict() {
        this.openRubricCL('REGION_CL', false).then((params: any) => {
            if (params.data && params.data.length) {
                this.searchModel['REGION_NAME'] = params.data[0].CLASSIF_NAME;
                this.searchModel['ISN_REGION'] = params.isnNode;
            }
        }).catch((e) => {
            console.log(e);
        });
    }
    public updateDopRec() {
        this.dictionary.descriptor.ar_Descript().then(() => {
            this.initFormDopRec();
        }).catch(e => {
            console.warn(e);
        });
    }
   public initFormDopRec() {
        const options = [];
        this.arDescript.forEach(_d => {
            this.mapAr_Descr.set(_d.API_NAME, _d);
            options.push({ title: _d.UI_NAME, value: _d.API_NAME });
        });
        this.inputsSelect = this._dataSrv.getInputs({
            rec: {
                select: {
                    foreignKey: 'select',
                    title: '',
                    type: 17,
                    options: [
                        { title: '...', value: '' },
                        ...options
                    ]
                }
            }
        } as any, { rec: { select: '' } });
        this.formSelect = this._inputCtrlSrv.toFormGroup(this.inputsSelect);
        this.formSelect.valueChanges.subscribe(() => {
            this.formSearch.reset();
        });

        this.inputs = this._dataSrv.getInputs(DOP_REC as any, { rec: { text: '', decimal: '', date: '', flag: '' } });
        this.formSearch = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.formSearch.valueChanges.subscribe(_d => {
            if (this.arType) {
                const value = _d[`${'rec.' + this.arType.AR_TYPE}`];
                this.searchValueDopRec = value ? JSON.stringify({ API_NAME: String(this.arType.API_NAME), SEARCH_VALUE: String(value), type: String(this.arType.AR_TYPE) }) : null;
                this.searchModel['DOP_REC'] = value ? String(value) : '';
            } else {
                this.searchModel['DOP_REC'] = '';
                this.searchValueDopRec = null;
            }
        });
    }
    private clearModel(modelName: string) {
        if (this.formSearch) {
            this.formSearch.reset();
            this.formSelect.reset();
        }
        this.mode = 0;
        this.settings.opts.deleted = false;
        this.settings.opts.onlyNew = false;
        const model = this.searchData[modelName];
        if (model) {
            Object.keys(model).forEach((prop) => model[prop] = null);
        } else {
            this.searchData[modelName] = {};
        }
    }
    private getModelName(): string {
        return (this.dictId === 'departments' || this.dictId === 'organization') ? this.currTab || 'department' : this.dictId;
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
                    ['department', 'data', 'person', 'cabinet', 'common', 'medo'].forEach((model) => this.clearModel(model));
                }
            }

            this.fieldsDescription = this.dictionary.descriptor.record.getFieldDescription(E_FIELD_SET.fullSearch);
            this.type = this.dictionary.descriptor.dictionaryType;
            this.modes = this.dictionary.descriptor.record.getModeList();


            if (this.modes) {
                const i = this.modes.findIndex(m => m.key === (this.settings && this.settings.entity));
                this.setTab(this.modes[i >= 0 ? i : 0].key);
            } else {
                this.searchModel = this.getSearchModel();
            }

            const _config = this.dictionary.descriptor.record.getSearchConfig();
            // tslint:disable-next-line:no-bitwise
            this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
            // tslint:disable-next-line:no-bitwise
            this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);
            if (this.arDescript && this.arDescript.length) {
                this.initFormDopRec();
            }
        }
    }
    private openRubricCL(classif: string, skipDeleted?: boolean): Promise<any> {
        const params: IOpenClassifParams = {
            classif: classif,
            selectMulty: false,
            skipDeleted: skipDeleted,
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
