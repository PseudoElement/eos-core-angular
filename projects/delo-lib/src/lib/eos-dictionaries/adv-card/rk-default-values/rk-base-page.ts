import type { DynamicInputLinkButtonComponent } from './../../../eos-common/dynamic-form-input/dynamic-input-linkbutton.component';
import { IDynamicInputOptions } from './../../../eos-common/dynamic-form-input/dynamic-input.component';
import { AdvCardRKDataCtrl } from './../adv-card-rk-datactrl';
import { Input, OnChanges, SimpleChanges, OnInit, OnDestroy, Injectable, Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import {AppContext} from '../../../eos-rest/services/appContext.service';
import { WaitClassifService } from '../../../app/services/waitClassif.service';

@Directive()
@Injectable()
export abstract class RKBasePageDirective implements OnChanges, OnInit, OnDestroy {
    @Input() dataController: AdvCardRKDataCtrl;
    // @Input() fieldsDescription: any;
    @Input() data: any;
    @Input() dgStoredValues: any;
    @Input() inputs: any;
    @Input() form: FormGroup;
    @Input() editMode: boolean;

    selOpts: IDynamicInputOptions = {
        defaultValue: {
            value: '',
            title: '...',
        },
        enRemoveButton: true,
    };

    isEDoc: boolean;
    rkType: number;

    constructor (
        protected _modalSrv: BsModalService,
        protected _appCtx: AppContext,
        protected _waitClassifSrv: WaitClassifService,
    ) {

    }
    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnDestroy() {
    }

    onDataChanged(path: string, prevValue: any, newValue: any, initial = false): any {
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        if (dgStoredValues['E_DOCUMENT'] === 1) {
            this.isEDoc = true;
        } else {
            this.isEDoc = false;
        }

        this.rkType = this.dgStoredValues['RC_TYPE'];

        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                const value = values[key];
                this.onDataChanged(key, value, value, true);
                this.setAvailableFor(key);
            }
        }
    }

    ngOnInit() {
        this.onTabInit(this.dgStoredValues, this.data);
    }

    setValue (path: string, value: any) {
        const control = this.form.controls[path];
        if (control) {
            control.setValue(value /*, {emitEvent: emit} */);
        }
    }

    getValue (path: string, valueIfUndefined: any): any {
        const control = this.form.controls[path];
        if (control) {
            return control.value;
        }
        return valueIfUndefined;
    }

    valueSecondarySet(path: string, storeOrClear: boolean) {
        const control = this.form.controls[path];
        if (control) {
            if (storeOrClear) {
            } else {
                control.setValue('');
            }
        }
    }

    validity(path: string, markDirty: boolean = false): any {
        const control = this.form.controls[path];
        if (control) {
            control.updateValueAndValidity();
            if (markDirty) {
                control.markAsDirty();
            }
        }
    }

    /**
     * Set item.disabled = !val
     * @param options array of options
     * @param listEnabled array of numbers to be set val (other be seted !val). If null - set to all
     * @param val value
     */
    setEnabledOptions(options: any[], listEnabled: number[] = null, val: boolean = true): any {
        for (let i = 0; i < options.length; i++) {
            if (!listEnabled || -1 !== listEnabled.findIndex( e => {
                return Number(e) === Number(i);
            })) {
                options[i]['disabled'] = !val;
            } else {
                options[i]['disabled'] = val;
            }
        }
    }

    setFirstAvailableValue (key: string) {
        const input = this.inputs[key];
        for (let i = 0; i < input.options.length; i++) {
            const element = input.options[i];
            if (element['disabled'] === false) {
                this.setValue(key, element['value']);
                break;
            }
        }
    }

    setAvailableFor (key: string) {

    }

    getfixedDBValue(path): any {
        return this.dataController.fixDBValueByType(this.data[path],
        this.inputs[path].controlType);
    }

    setDictLinkValue(key: string, value: any) {
        const input = this.inputs[key];
        const dib = <DynamicInputLinkButtonComponent>input.dib;

        if (!value) {
            dib.setExtValue(null, null);
            return;
        }

        const p = key.split('.');
        const descr = this.dataController.getDescriptionsRK()[p[0]].find( i => i.key === p[1]);

        this.dataController.readDictLinkValue(descr, value).then(data => {
            dib.setExtValue(value, data[0]);
        });
    }
}
