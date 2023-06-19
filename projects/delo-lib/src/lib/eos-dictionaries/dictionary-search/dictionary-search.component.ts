import { Component, Output, EventEmitter, ViewChild, OnDestroy, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, E_FIELD_SET, E_FIELD_TYPE, IRecordModeDescription, SearchFormSettings, SEARCHTYPE, SearchData, ProtoIdOperation } from '../../eos-dictionaries/interfaces';
import { EosDictionary } from '../core/eos-dictionary';
import { SEARCH_TYPES } from '../../eos-dictionaries/consts/search-types';
import { BaseCardEditDirective } from '../card-views/base-card-edit.component';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';

import { WaitClassifService } from '../../app/services/waitClassif.service';
import { IOpenClassifParams } from '../../eos-common/interfaces';
import { AR_DESCRIPT, USER_CL, PROT_NAME } from '../../eos-rest/interfaces/structures';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { InputControlService } from '../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../eos-dictionaries/services/eos-data-convert.service';
import { DOP_REC, SEARCH_RADIO_BUTTON, SEARCH_RADIO_BUTTON_NOMENKL, SEV_PARTIPANT } from '../../eos-dictionaries/consts/dictionaries/_common';
import { FormGroup, Validators } from '@angular/forms';
import { InputParamControlService } from '../../eos-user-params/shared/services/input-param-control.service';
import { IInputParamControl } from 'eos-user-params/index';

export interface IQuickSrchObj {
    isOpenQuick: boolean;
}

@Component({
    selector: 'eos-dictionary-search',
    templateUrl: 'dictionary-search.component.html'
})

export class DictionarySearchComponent implements OnDestroy, OnInit {
    @Input() settings: SearchFormSettings;
    @Output() searchRun: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Output() switchFastSrch: EventEmitter<boolean> = new EventEmitter();
    @ViewChild('full', { static: true }) fSearchPop;
    @ViewChild('quick', { static: false }) qSearchPop;

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
    public protocolForm: FormGroup;
    private protocolSearchNameControl: string[] = ['FROM', 'TO', 'USER_ISN', 'OPER_DESCRIBE'];
    private protocolIdOperation: ProtoIdOperation = {
        organization: ['Z', 'A'],
        citizens: ['C']
    }
    public protocolSerchInputs: any;
    public inputs;
    public radioTopButton = [];
    inputsSelect;
    formSelect: FormGroup;
    mapAr_Descr: Map<string, AR_DESCRIPT> = new Map();
    private dictionary: EosDictionary;
    private subscriptions: Subscription[] = [];
    private searchValueDopRec = null;
    private sevChanelAllToSelect = [];
    public selectedOperation = {
        valueToInput: '',
        selectOption: []
    }
    public flagSelectPopover: boolean = false;
    public allOperation: PROT_NAME[];

    public clearSelectOperation(){
        this.selectedOperation = {
            valueToInput: '',
            selectOption: []
        }
        this.protocolForm.controls['OPERATION'].patchValue([], { emitEvent: true })
    }
    private searchData: SearchData = {
        srchMode: ''
    };

    constructor(
        private _dictSrv: EosDictService,
        private _classif: WaitClassifService,
        private _inputCtrlSrv: InputControlService,
        private _dataSrv: EosDataConvertService,
        private _pipRX: PipRX,
        private controlService: InputParamControlService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(this._dictSrv.dictMode$.subscribe(() => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.dictionary$.subscribe((_d) => this.initSearchForm()));
        this.subscriptions.push(this._dictSrv.searchInfo$.subscribe((_d) => this.clearForm()));
        this.subscriptions.push(this._dictSrv.reloadDopRec$.subscribe(() => this.updateDopRec()));

        if (this.dictionary.descriptor.id === 'sev-participant') {
            this._pipRX.read({
                SEV_CHANNEL: {
                    criteries: {
                        ISN_LCLASSIF: 'isnotnull'
                    }
                }
            })
            .then((data) => {
                this.sevChanelAllToSelect = data;
                this.initFormSevPartishion(this.dictionary.descriptor.record.getFullSearchFields);
            });
        }

        if (this.dictionary.descriptor.id === 'nomenkl') {
            this.radioTopButton = SEARCH_RADIO_BUTTON_NOMENKL;
            this.mode = 1;
        } else {
            this.mode = 0;
            this.radioTopButton = SEARCH_RADIO_BUTTON;
        }
    }

    get dictId(): string {
        return this.dictionary ? this.dictionary.id : null; // может придти null в этом случае просто передаём null
    }

    get noSearchData(): boolean {
        try {
            if(this.searchData.srchMode === 'protocol') {
                let result: boolean = true;
                const protocolKey = Object.keys(this.searchData.protocol);
                if(protocolKey.length) {
                    protocolKey.forEach(el => {
                        result = this.searchData.protocol[el] ? false : result;
                    })
                }
                return result;
            } else {
                return Object.keys(this.searchModel).findIndex((prop) => this.searchModel[prop] && this.searchModel[prop].trim()) === -1;
            }
        } catch(err) {
            console.error({err});
            return true;
        }
    }

    get isValidProtocolForm(): boolean {
        let validForm: boolean = false;
        if(this.searchData.srchMode === 'protocol') {
            validForm = !this.protocolForm.valid
        }
        return validForm
    }

    get arDescript(): AR_DESCRIPT[] {
        if (this.dictionary) {
            return this.dictionary.descriptor['dopRec'];
        }
    }

    isActiveButton(): boolean {
        return (this.fSearchPop.isOpen || this.settings.lastSearch === SEARCHTYPE.full);
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
        BaseCardEditDirective.autoFocusOnFirstStringElement('popover-container');
        this.settings.lastSearch = SEARCHTYPE.none;
        this.switchFastSrch.emit(false);
    }

    fullSearch() {
        this.settings.entity = this.getModelName();
        this.settings.entity_dict = this.dictId;
        this.settings.lastSearch = SEARCHTYPE.full;
        this.settings.opts.mode = this.mode;

        const model = (this.dictId === 'departments' || this.dictId === 'organization' || this.dictId === 'citizens') ? this.searchData : this.getSearchModel();
        this.settings.full.data = model;
        if (this.searchValueDopRec) {
            this.searchModel['DOP_REC'] =  this.searchValueDopRec;
        }  else {
            delete this.searchModel['DOP_REC'];
        }

        this._dictSrv.setNomenklFilterClose$ = this.settings.opts.closed;
        this.searchRun.emit(this.settings);
        this.fSearchPop.hide();
    }

    clearForm() {
        this.clearModel(this.getModelName());
    }

    showFastSrch() {
        if ( this.settings.lastSearch !== SEARCHTYPE.quick) {
            this.settings.lastSearch = SEARCHTYPE.quick;
            this.switchFastSrch.emit(this.isQuickOpened);
        } else if (this.settings.quick.data === '') {
            this.settings.lastSearch = SEARCHTYPE.none;
            this.switchFastSrch.emit(this.isQuickOpened);
        } else {
            this.switchFastSrch.emit(null);
        }
        this.fSearchPop.hide();
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

    get arType(): AR_DESCRIPT {
        if (this.formSelect && this.formSelect.controls['rec.select'].value) {
            return this.mapAr_Descr.get(this.formSelect.controls['rec.select'].value);
        }
        return null;
    }

    public rest($event) {
        $event.target.checked ? this.searchModel['NEW'] = '1' : delete this.searchModel['NEW'];
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

    public openDictDocgroup() {
        const params: IOpenClassifParams = {
            classif: 'DOCGROUP_CL',
            selectMulty: false,
            skipDeleted: false,
        };
        return this._classif.openClassif(params, true)
        .then((isnNode) => {
            if (isnNode) {
                return this.dictionary['dictDescrSrv']['apiSrv']
                .read({
                    DOCGROUP_CL: {
                        criteries: {
                            ISN_NODE: isnNode
                        }
                    }
                }).then(data => {
                    this.searchModel['DOCGROUP_NAME'] = data[0]['CLASSIF_NAME'];
                    this.searchModel['DUE_DOCGROUP'] = data[0]['DUE'];
                });
            }
        }).catch((e) => {
            return { data: [], isnNode: null };
        });
    }

    public updateDopRec() {
        this.dictionary.descriptor.ar_Descript().then(() => {
            this.clearDopRecAfterChange();
            this.initFormDopRec();
        }).catch(e => {
            console.warn(e);
        });
    }

   public initFormDopRec() {
        const options = [];
        const validityReg = new RegExp(/^\-?(\d+\.?\d*|\d*\.?\d+)$/);
        this.arDescript.forEach(_d => {
            this.mapAr_Descr.set(_d.API_NAME, _d);
            options.push({ title: _d.UI_NAME, value: _d.API_NAME });
        });
        const configSelectInput: any = {
            rec: {
                select: {
                    foreignKey: 'select',
                    title: '',
                    type: 10,
                    options: [
                        { title: '...', value: '' },
                        ...options
                    ]
                }
            }
        }
        this.inputsSelect = this._dataSrv.getInputs(configSelectInput, { rec: { select: '' } });
        this.formSelect = this._inputCtrlSrv.toFormGroup(this.inputsSelect);

        this.formSelect.valueChanges.subscribe((_d) => {
            const value = _d[`${'rec.select'}`];
            const curAR_Type = value ? this.mapAr_Descr.get(value) : null;
            if (curAR_Type && curAR_Type.AR_TYPE === 'decimal') {
                this.inputs['rec.decimal'].length = curAR_Type.MAX_LEN;
                this.formSearch.controls['rec.decimal'].setValidators([Validators.maxLength(curAR_Type.MAX_LEN), Validators.pattern(validityReg)]);
            }

            this.formSearch.reset();
        });
        this.inputs = this._dataSrv.getInputs(DOP_REC as any, { rec: { text: '', decimal: '', date: '', flag: '' } });
        this.formSearch = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.formSearch.valueChanges.subscribe(_d => {
            if (this.arType) {
                const value = _d[`${'rec.' + this.arType.AR_TYPE}`];
                const decimal = this.formSearch.controls['rec.decimal'].value;
                // если есть минус,то расширяем допустимую длину строки
                if (decimal && decimal.indexOf('-') === 0) {
                    this.inputs['rec.decimal'].length = this.arType.MAX_LEN + 1;
                    this.formSearch.controls['rec.decimal'].setValidators([Validators.maxLength(this.arType.MAX_LEN + 1), Validators.pattern(validityReg)]);
                    this.formSearch.controls['rec.decimal'].updateValueAndValidity({ onlySelf: true });
                    this.formSearch.updateValueAndValidity({ emitEvent: false });
                } else {
                    this.inputs['rec.decimal'].length = this.arType.MAX_LEN;
                    this.formSearch.controls['rec.decimal'].setValidators([Validators.maxLength(this.arType.MAX_LEN), Validators.pattern(validityReg)]);
                }

                this.searchValueDopRec = value ? JSON.stringify({ 
                                                                    API_NAME: String(this.arType.API_NAME), 
                                                                    SEARCH_VALUE: String(value), 
                                                                    type: String(this.arType.AR_TYPE)
                                                                }) : null;
                this.searchModel['DOP_REC'] = value ? String(value) : '';
            } else {
                this.searchModel['DOP_REC'] = '';
                this.searchValueDopRec = null;
            }
        });
    }

    private async initProtoSerchForm() {
        const defaulDate = new Date();
        this.allOperation = await this.operation(this.protocolIdOperation[this.dictId]);
        const configProtocolSerchInput: IInputParamControl[] = [
            {
                controlType: E_FIELD_TYPE.date,
                key: 'FROM',
                label: 'ДАТА С',
                value: defaulDate,
                readonly: false,
                required: true
            },
            {
                controlType: E_FIELD_TYPE.date,
                key: 'TO',
                label: 'ДАТА ПО',
                value: defaulDate,
                readonly: false,
                required: true
            },
            {
                controlType: E_FIELD_TYPE.autosearch,
                key: 'USER',
                label: 'ПОЛЬЗОВАТЕЛЬ',
                value: '',
                readonly: false,
                required: true
            },
            {
                controlType: E_FIELD_TYPE.string,
                key: 'OPERATION',
                label: 'Операция',
                value: '',
                readonly: true,
                required: false
            },
            {
                controlType: E_FIELD_TYPE.number,
                key: 'user_isn',
                label: '',
                value: '',
                readonly: false,
            },
        ]
        this.protocolSerchInputs = this.controlService.generateInputs(configProtocolSerchInput);
        this.protocolForm = this._inputCtrlSrv.toFormGroup(this.protocolSerchInputs);

        this.protocolForm.valueChanges.subscribe((data) => {
            try {
                this.protocolSearchNameControl.forEach(el => {
                    if(el === 'FROM' || el === 'TO') {
                        this.searchData['protocol'][el] = data[el]? `${data[el].toISOString()}` : null;
                    } else if (el === 'OPER_DESCRIBE') {
                        if(data['OPERATION']) {
                            let oper: string = '';
                            data['OPERATION'].forEach(el => {
                                if (oper) {
                                    oper = oper + '|' + el.OPER_DESCRIBE;
                                } else {
                                    oper = el.OPER_DESCRIBE;
                                }
                            })
                            this.searchData['protocol']['OPER_DESCRIBE'] = oper;
                        }
                    } else if (el === 'USER_ISN') {
                        this.searchData['protocol']['USER_ISN'] = data['USER'] ? data['user_isn'] : null;
                    }
                })
            } catch(err) {
                console.log(err)
                console.error('Error: ', err.message)
            }

        })
    }

    async showDepChoose() {
        const OPEN_CLASSIF_USER_CL: IOpenClassifParams = {
            classif: 'USER_CL',
            skipDeleted: false,
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
        };
        try {
            const isnClassif: string = await this._classif.openClassif(OPEN_CLASSIF_USER_CL);
            const User: USER_CL[] = await this._pipRX.read({ USER_CL: {criteries: {ISN_LCLASSIF: isnClassif}}});

            if (User[0]['SURNAME_PATRON']) {
                this.protocolForm.controls['USER'].patchValue(User[0]['SURNAME_PATRON'], { emitEvent: false });
                this.protocolForm.controls['user_isn'].patchValue(User[0]['ISN_LCLASSIF'], { emitEvent: true });
            }
        } catch(err) {
            console.error('Error: The user has not been selected.');
        }
    }

    async operation(idOperations: string[]): Promise<PROT_NAME[]> {
        const operation: PROT_NAME[] = await this.getProtOperation(idOperations);

        const sortOperation = operation.sort((a, b) => {
            if (a.DESCRIBTION.toLowerCase() < b.DESCRIBTION.toLowerCase()) {
                return -1;
              }
              if (a.DESCRIBTION.toLowerCase() > b.DESCRIBTION.toLowerCase()) {
                return 1;
              }
              return 0;
        });

        const unicOperation: PROT_NAME[] = [];
        sortOperation.forEach((el) => {
            if (el.DESCRIBTION) {
                if(!unicOperation.length){
                    unicOperation.push(el)
                } else {
                    const i = unicOperation.length - 1;
                    if(!(unicOperation[i].DESCRIBTION === el.DESCRIBTION)) {
                        unicOperation.push(el)
                    }
                }
            }
        })
        return unicOperation;
    }

    async getProtOperation(param: string[]): Promise<PROT_NAME[]> {
        try{
            let criteies: string = param.join('|');
            const allOperation: PROT_NAME[] = await this._pipRX.read({PROT_NAME: {criteries: {TABLE_ID: criteies}}})
            return allOperation;
        } catch (err) {
            console.warn(err);
            console.error('Error: Failed to get operation name.');
            return [];
        }
    }

    public changeFlagSelectPopover() {
        this.flagSelectPopover = !this.flagSelectPopover;
    }

    public togleOperation(operation: PROT_NAME) {
        if(this.checkOperationIsSelected(operation.DESCRIBTION)) {
            this.selectedOperation.selectOption = this.selectedOperation.selectOption.filter(el => {
                return el.DESCRIBTION !== operation.DESCRIBTION;
            })
            this.createValueToInputOperation();
        } else {
            this.selectOperation(operation);
        }
        this.protocolForm.controls['OPERATION'].patchValue(this.selectedOperation.selectOption, { emitEvent: true }) 
    }

    public checkOperationIsSelected(DESCRIBTION: string): boolean {
        let checkup: boolean = false;
        this.selectedOperation.selectOption.forEach(el => {
            if(el.DESCRIBTION === DESCRIBTION) {
                checkup = true;
            }
        })
        return checkup;
    }

    private selectOperation(operation: PROT_NAME) {
        this.selectedOperation.selectOption.push(operation);
        this.createValueToInputOperation();
    }

    private createValueToInputOperation() {
        this.selectedOperation.valueToInput = '';
        this.selectedOperation.selectOption.forEach(el => {
            if(this.selectedOperation.valueToInput.length) {
                this.selectedOperation.valueToInput +=  ' или ' + el.DESCRIBTION
            } else {
                this.selectedOperation.valueToInput = el.DESCRIBTION
            }
        })
    }

    public openDictSevPArtipant() {
        const OPEN_CLASSIF_SEV_RULE: IOpenClassifParams = {
            classif: 'SEV_RULE',
            selectMulty: false,
            selectLeafs: true,
            skipDeleted: false,
            id: '0.',
        };
        this._classif.openClassif(OPEN_CLASSIF_SEV_RULE)
        .then(data => {
            return this.dictionary['dictDescrSrv']['apiSrv']
                .read({
                    SEV_RULE: {
                        criteries: {
                            ISN_LCLASSIF: data
                        }
                    }
                }).then(d => {
                    if (d) {
                        this.searchModel['rules_name'] = d[0]['CLASSIF_NAME'];
                        this.searchModel['SEV_PARTICIPANT_RULE.ISN_RULE'] = '' + d[0]['ISN_LCLASSIF'];
                    }
                });
        })
        .catch(() => {});
    }

    public clearDictSev() {
        delete this.searchModel['rules_name'];
        delete this.searchModel['SEV_PARTICIPANT_RULE.ISN_RULE'];
    }

    public initFormSevPartishion(allField: any[]) {
        this.inputs = this._dataSrv.getInputs(SEV_PARTIPANT as any, { rec: { CLASSIF_NAME: '', ADDRESS: '', rules: '', ISN_CHANNEL: '' }});
        this.inputs['rec.ISN_CHANNEL'].options = [];
        this.sevChanelAllToSelect.forEach((chan) => {
            this.inputs['rec.ISN_CHANNEL'].options.push({
                value: chan['ISN_LCLASSIF'],
                title: chan['CLASSIF_NAME'],
                isDeleted: chan['DELETED'] === 0 ? undefined : true
            });
        });
        this.formSearch = this._inputCtrlSrv.toFormGroup(this.inputs);
        this.formSearch.valueChanges.subscribe(_d => {
            this.searchModel['ISN_CHANNEL'] = this.formSearch.controls['rec.ISN_CHANNEL'].value;
            this.searchModel['CLASSIF_NAME'] = this.formSearch.controls['rec.CLASSIF_NAME'].value;
            this.searchModel['ADDRESS'] = this.formSearch.controls['rec.ADDRESS'].value;
        });
    }

    public initFormRule(allField: any[]) {
        let type: any = {};
        let kind: any = {};
        allField.forEach((field) => {
            if (field.foreignKey === 'type') {
                type = field;
            }
            if (field.foreignKey === 'kind') {
                kind = field;
            }
        });

        this.inputsSelect = this._dataSrv.getInputs({
            rec: {
                type: {
                    foreignKey: 'type',
                    title: '',
                    type: 10,
                    options: [
                        { title: '...', value: '' },
                        ...type.options
                    ]
                },
                kind: {
                    foreignKey: 'kind',
                    title: '',
                    type: 10,
                    options: [
                        { title: '...', value: '' },
                        ...kind.options
                    ]
                }
            }
        } as any, { rec: { select: '' } });

        this.formSelect = this._inputCtrlSrv.toFormGroup(this.inputsSelect);
        this.formSelect.valueChanges.subscribe(_d => {
            const typeForm = this.formSelect.controls['rec.type'].value;
            const kindForm = this.formSelect.controls['rec.kind'].value;
            if (kindForm || typeForm) { // если хоть одно поле заполнено
                if (typeForm) {
                    if (kindForm) {
                        this.searchModel['RULE_KIND'] = kindForm;
                    } else {
                        this.searchModel['RULE_KIND'] = typeForm === '1' ? '1|2|3|4' : '5|6|7|8';
                    }
                } else {
                    if (kindForm) {
                        this.searchModel['RULE_KIND'] = '' + kindForm + '|' + (+kindForm + 4);
                    }
                }
            } else { // если не оба поля пустые
                this.searchModel['RULE_KIND'] = null;
            }
        });
    }
    
    visibleBranchOptions(): boolean {
        const ITEMS = ['cabinet', 'templates', 'citizens', 'sev-rules', 'sev-participant', 'file-category'];
        return !ITEMS.includes(this.dictId);
    }

    visibleDeletedOption(): boolean {
        const ITEMS = ['nomenkl', 'templates', 'citizens', 'organization', 'sev-rules', 'sev-participant', 'file-category'];
        return !ITEMS.includes(this.dictId);
    }

    visibleClosedDealsOption() {
        const ITEMS = ['departments', 'templates', 'citizens', 'organization', 'sev-rules', 'sev-participant', 'file-category'];
        return !ITEMS.includes(this.dictId);
    }

    private clearDopRecAfterChange(): void {
        this.mapAr_Descr.clear();
        if (!this.arType) {
            this.searchModel['DOP_REC'] = '';
            this.searchValueDopRec = null;
        }
    }

    private clearModel(modelName: string) {
        if (this.formSearch && (this.dictId === 'organization' || this.dictId === 'citizens') && modelName !== 'medo') {
            this.formSearch.reset();
            this.formSelect.reset();
        }
        if (this.formSelect && this.dictId === 'sev-rules') {
            this.formSelect.reset();
        }
        if (this.formSearch && this.dictId === 'sev-participant') {
            this.formSearch.reset();
        }
        if (this.dictionary.descriptor.id === 'nomenkl') {
            this.mode = 1;
        } else {
            this.mode = 0;
        }
        if ((this.dictId === 'organization' || this.dictId === 'citizens') && this.searchData.srchMode === 'protocol' && this.protocolForm) {
            const date = new Date();
            Object.keys(this.protocolForm.controls).forEach(el => {
                if(el === 'FROM' || el === 'TO'){
                    this.protocolForm.controls[el].patchValue(date, { emitEvent: true });
                } else {
                    this.protocolForm.controls[el].patchValue('', { emitEvent: true });
                }

            })
            this.selectedOperation = {
                valueToInput: '',
                selectOption: []
            }
        }
        this.settings.opts.deleted = false;
        this.settings.opts.onlyNew = false;
        this.settings.opts.closed = false;
        const model = this.searchData[modelName];
        if (model) {
            Object.keys(model).forEach((prop) => model[prop] = null);
        } else {
            this.searchData[modelName] = {};
        }
    }

    private getModelName(): string {
        return (this.dictId === 'departments' || 
                this.dictId === 'organization' || 
                this.dictId === 'citizens') ? this.currTab || 'department' : this.dictId;
    }

    private getSearchModel() {
        const prop = this.getModelName();
        if (!this.searchData[prop]) {
            this.searchData[prop] = {};
        }
        return this.searchData[prop];
    }

    private async initSearchForm() {
        this.dictionary = this._dictSrv.currentDictionary;
        if (this.dictId === 'organization' || this.dictId === 'citizens' && !this.protocolForm ) {
            await this.initProtoSerchForm();
        }
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
                    ['department', 'data', 'person', 'cabinet', 'common', 'medo', 'protocol'].forEach((model) => this.clearModel(model));
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
            this.hasQuick = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.quick);
            this.hasFull = !!~_config.findIndex((_t) => _t === SEARCH_TYPES.full);

            if (this.arDescript && this.arDescript.length) {
                this.initFormDopRec();
            }
            if (this.dictionary.descriptor.id === 'sev-rules') {
                this.initFormRule(this.dictionary.descriptor.record.getFullSearchFields);
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
            if (isnNode && isnNode.indexOf('.') === -1) {
                return this.dictionary['dictDescrSrv']['apiSrv'].read({
                    REGION_CL: {
                        criteries: {
                            ISN_NODE: isnNode
                        }
                    }
                }).then(data => {
                    return { data, isnNode };
                });
            } else if (isnNode && isnNode.indexOf('.') !== -1) {
                return this.dictionary['dictDescrSrv']['apiSrv'].read({
                    REGION_CL: {
                        criteries: {
                            DUE: isnNode
                        }
                    }
                }).then(data => {
                    return { data, isnNode: '' + data[0]['ISN_NODE']};
                });
            }
        }).catch((e) => {
            return { data: [], isnNode: null };
        });
    }
}
