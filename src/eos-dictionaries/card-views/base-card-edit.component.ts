import {Input, Injector, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { EosDictService } from '../services/eos-dict.service';
import { Subscription } from 'rxjs';
import { NOT_EMPTY_STRING } from '../consts/input-validation';
import { IDynamicInputOptions } from 'eos-common/dynamic-form-input/dynamic-input.component';

export class BaseCardEditComponent implements OnDestroy, OnInit, AfterViewInit {
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

    selOpts: IDynamicInputOptions = {
        defaultValue: {
            value: '',
            title: '...',
        }
    };

    protected dictSrv: EosDictService;
    protected formChanges$: Subscription;

    /* private _dates: any = {}; */
    constructor(injector: Injector) {
        this.dictSrv = injector.get(EosDictService);
        this.currTab = this.dictSrv.currentTab ? this.dictSrv.currentTab : 0;
        this.prevValues = [];
    }

    public static autoFocusOnFirstStringElement(parentTag: string) {
        setTimeout( () => {
            let autofocusFlag = false;
            const parents = document.getElementsByTagName(parentTag);
            if (parents.length > 0) {
                const inputs = parents[0].getElementsByTagName('input');
                for (let i = 0; i < inputs.length; i++) {
                    if (inputs[i].type === 'text' && inputs[i].scrollWidth > 0) {
                        inputs[i].autofocus = true;
                        inputs[i].focus();
                        autofocusFlag = true;
                        break;
                    }
                }
                if (!autofocusFlag) {
                    const textAreas = parents[0].getElementsByTagName('textarea');
                    if (textAreas.length > 0) {
                        textAreas[0].autofocus = true;
                        textAreas[0].focus();
                    }
                }
            }
        }, 500);
    }

    getCardTitle(): any {
        return null;
    }

    ngAfterViewInit(): void {
        BaseCardEditComponent.autoFocusOnFirstStringElement('eos-card-edit');
    }

    ngOnInit(): void {
        const descriptor = this.dictSrv.currentDictionary.descriptor;
        const list = descriptor.record.getEditView({});

        descriptor.getRelatedFields(list.filter(i => i.dictionaryId)
                                .map(i => i.dictionaryId ? i.dictionaryId : null))
            .then((related) => {
                list.forEach((field) => {
                    if ((field.dictionaryId !== undefined)) {
                        field.options.length = 0;
                        // field.options.splice(0, field.options.length);
                        related[field.dictionaryId].forEach((rel) => {
                            const fn = (field.dictionaryLink ? field.dictionaryLink.pk : 'ISN_LCLASSIF');
                            const ln = (field.dictionaryLink ? field.dictionaryLink.label : 'CLASSIF_NAME');
                            field.options.push({value: rel[fn], title: rel[ln]});
                        });
                    }
                });
            });

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

    protected setValue(path: string, value: any) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value);
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
