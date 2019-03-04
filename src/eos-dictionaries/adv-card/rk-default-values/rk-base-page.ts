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


    isEDoc: boolean;

    ngOnChanges(changes: SimpleChanges) {
    }


    ngOnDestroy() {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        if (dgStoredValues['E_DOCUMENT'] === 1) {
            this.isEDoc = true;
        } else {
            this.isEDoc = false;
        }

    }

    ngOnInit() {
        this.onTabInit(this.dgStoredValues, this.data);
    }

    setValue (path: string, value: any) {
        console.log(path, value);
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


}
