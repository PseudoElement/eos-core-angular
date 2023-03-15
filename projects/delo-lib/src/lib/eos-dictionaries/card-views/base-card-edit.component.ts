import { Input, Injector, OnDestroy, OnInit, AfterViewInit, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EosDictService } from '../services/eos-dict.service';
import { Subscription } from 'rxjs';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { IDynamicInputOptions } from '../../eos-common/dynamic-form-input/dynamic-input.component';
import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { CB_FUNCTIONS, AppContext } from '../../eos-rest/services/appContext.service';
import { EOSDICTS_VARIANT } from '../../eos-dictionaries/features/features.interface';
import { DynamicInputBaseDirective } from '../../eos-common/dynamic-form-input/dynamic-input-base';
import { BsModalService } from 'ngx-bootstrap';

export class TabOptions {
    id: string;
    name: string;
    isValid: boolean;
}

enum TabStatus {
    TabValid,
    TabInvalid,
    TabEmpty,
}

@Directive()
export class BaseCardEditDirective implements OnDestroy, OnInit, AfterViewInit {
    @Input() form: FormGroup;
    @Input() inputs: any;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() isNewRecord: boolean;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    readonly notEmptyString = NOT_EMPTY_STRING;

    nodeId: string;
    currTab = 0;
    prevValues: any[];
    tabOptions: Array<TabOptions> = [];



    selOpts: IDynamicInputOptions = {
        defaultValue: {
            value: '',
            title: '...',
        }
    };

    public isCBBase: boolean;
    public isNadzor: boolean;
    public isSevIndexes: boolean = false;
    public modalService: BsModalService;
    protected dictSrv: EosDictService;
    protected formChanges$: Subscription;
    protected appctx: AppContext;

    /* private _dates: any = {}; */
    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this.currTab = this.dictSrv.currentTab ? this.dictSrv.currentTab : 0;
        this.prevValues = [];
        this.isSevIndexes = Features.cfg.SEV.isIndexesEnable;
        this.appctx = injector.get(AppContext);
        this.modalService = injector.get(BsModalService);
        this.isCBBase = this.appctx.getParams(CB_FUNCTIONS) === 'YES';
        this.isNadzor = Features.cfg.variant === EOSDICTS_VARIANT.Nadzor;

    }


    public static autoFocusOnFirstStringElement(parentTag: string) {
        setTimeout( () => {
            let autofocusFlag = false;
            const parents = document.getElementsByTagName(parentTag);
            if (parents.length > 0) {
                const inputs = parents[0].getElementsByTagName('input');
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].type === 'text' && inputs[i].scrollWidth > 0) {
                        inputs[i].focus();
                        autofocusFlag = true;
                        break;
                    }
                }
                if (!autofocusFlag) {
                    const textAreas = parents[0].getElementsByTagName('textarea');
                    if (textAreas.length > 0) {
                        textAreas[0].focus();
                    }
                }
            }
        }, 500);
    }
    public static setElementOnValidate(key: string, component: BaseCardEditDirective) {
        if (key) {
            if (component.tabOptions.length > 0) {
                let ind = -1;
                component.tabOptions.forEach((tab, index) => {
                    if (!tab.isValid) {
                        ind = index;
                    }
                });
                component.currTab = ind === -1 ? 0 : ind;
            }
            setTimeout(() => {
                const parents = document.getElementById(key);
                if (parents) {
                    parents.focus();
                }
            }, 0);
        }
    }
    public confirmSave(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public tooltipsHide() {
        for (const key in this.inputs) {
            if (this.inputs.hasOwnProperty(key)) {
                const el = this.inputs[key];
                const elDib: DynamicInputBaseDirective = el.dib;
                if (elDib && elDib.inputTooltip) {
                    elDib.inputTooltip.visible = false;
                }
            }
        }
    }

    public tooltipsRestore() {
        for (const key in this.inputs) {
            if (this.inputs.hasOwnProperty(key)) {
                const el = this.inputs[key];
                const elDib: DynamicInputBaseDirective = el.dib;
                if (elDib && elDib.inputTooltip) {
                    elDib.delayedTooltip();
                }
            }
        }
    }

    getCardTitle(): any {
        return '';
    }

    ngAfterViewInit(): void {
        BaseCardEditDirective.autoFocusOnFirstStringElement('eos-card-edit');

    }

    ngOnInit(): void {
        const descriptor = this.dictSrv.currentDictionary.descriptor;
        const list = descriptor.record.getEditView({});

        this.dictSrv.currentDictionary.loadRelatedFieldsOptions(list.filter(i => i.dictionaryId), [], true).then((d) => {
            for (const key in this.inputs) {
                if (this.inputs.hasOwnProperty(key)) {
                    const input = this.inputs[key];
                    if (input && input.options && input.controlType === E_FIELD_TYPE.select) {
                        const value = this.getValue(key);
                        input.options = input.options.filter(o => (!o.disabled || String(value) === String(o.value)));
                    }
                }
            }
            this.onAfterLoadRelated();
        });
    }

    onAfterLoadRelated() {
        this.updateValidTabs();
    }


    /**
     * switch tabs
     * @param i tab number
     */
    setTab(i: number) {
        this.currTab = i;
        this.dictSrv.currentTab = i;
        this.form.updateValueAndValidity();
    }

    /**
     * make string[] from object keys
     * @param data object which keys is used
     */
    keys(data: Object): string[] {
        if (data) {
            return Object.keys(data);
        } else {
            return [];
        }
    }

    updateValidTabs() {
        for (let i = 0;  i < this.tabOptions.length; i++) {
            const tabOption =  this.tabOptions[i];
            if (this.currTab === i) {
                const tabContainsInvalidField = this.getStatusTabByFields(tabOption.id);
                switch (tabContainsInvalidField) {
                    case TabStatus.TabInvalid: {
                        tabOption.isValid = false;
                        break;
                    }
                    case TabStatus.TabValid: {
                        tabOption.isValid = true;
                        break;
                    }
                }
            }
        }
    }

    getStatusTabByFields(tabId: string): TabStatus {
        const invalidControls = this.getInvalidControl();
        const currentTab = document.getElementById(tabId);
        if (!currentTab) {
            return TabStatus.TabEmpty;
        }
        for (let i = 0; i < invalidControls.length; i++) {
            const invalidControl = invalidControls[i];
            const invalidElement = document.getElementById(invalidControl);
            if (!invalidElement) {
                continue;
            }
            const tab = invalidElement.closest('.tab');
            if (!tab) {
                continue;
            }
            if (tabId === tab.id) {
                return TabStatus.TabInvalid;
            }
        }

        return TabStatus.TabValid;
    }

    tabsToArray(tabs: string[]) {
        for (let i = 0; i < tabs.length; i++) {
            this.tabOptions.push({
                id: 'tab' + i,
                name: tabs[i],
                isValid: true
            });
        }
    }

    getInvalidControl(): string[] {
        const invalid = [];
        const controls = this.form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    protected getValue(path: string): any {
        const control = this.form.controls[path];
        if (control) {
            return control.value;
        } else {
            return null;
        }
    }
    protected getControl(path: string) {
        const control = this.form.controls[path];
        if (control) {
            return control;
        } else {
            return null;
        }
    }

    protected setValue(path: string, value: any, emit = true) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value, {emitEvent: emit});
        }
    }
    protected setDirty(path: string) {
        const control = this.form.controls[path];
        if (control) {
            control.markAsDirty();
        }
    }

    protected toggleInput(enable: boolean, path: string, formChanges: any, updates: any) {
        const control = this.form.controls[path];
        if (control) {
            if (enable) {
                if (control.disabled) {
                    control.enable();
                }
            } else {
                if (control.enabled) {
                    control.disable();
                    if (formChanges[path]) {
                        updates[path] = null;
                    }
                }
            }
        }
    }

    protected unsubscribe() {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
    }
}
