import { IDynamicInputOptions } from './../../../eos-common/dynamic-form-input/dynamic-input.component';
import { AdvCardRKDataCtrl } from './../adv-card-rk-datactrl';
import { Input, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


export abstract class RKBasePage implements OnChanges, OnInit, OnDestroy {
    @Input() dataController: AdvCardRKDataCtrl;
    @Input() fieldsDescription: any;
    @Input() data: any;
    @Input() dgStoredValues: any;
    @Input() inputs: any;
    @Input() form: FormGroup;
    @Input() editMode: boolean;

    selOpts: IDynamicInputOptions = {
        defaultValue: {
            value: '',
            title: '...',
        }
    };

    isEDoc: boolean;
    rkType: number;
    // { value: 0, title: 'Не определена' },
    // { value: 1, title: 'Входящие' },
    // { value: 2, title: 'Письма граждан' }
    // { value: 3, title: 'Исходящие' },

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
        // console.log(path, value);
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

    setAvailableFor (key: string) {

    }

    getfixedDBValue(path): any {
        return this.dataController.fixDBValueByType(this.data[path],
        this.inputs[path].controlType);
    }

}
