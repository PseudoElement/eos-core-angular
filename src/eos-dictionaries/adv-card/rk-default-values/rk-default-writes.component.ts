import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-writes',
    templateUrl: 'rk-default-writes.component.html',
})

export class RKWritesCardComponent extends RKBasePage implements OnChanges {

    forward_who_w: boolean;
    enKart1Select: any;
    enKart2Select: any;

    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.FORWARD_WHO_W': { // По значению реквизита "Кому" (адресован)
                this.forward_who_w = newValue === '1';
                break;
            }
            case 'fict.KR_CURRENT': {
                this.enKart1Select = newValue;
                if (newValue !== '1') {
                    this.form.controls['DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W'].setValue('');
                }
                if (newValue === '2') {
                    this.form.controls['fict.KR_CURRENT_IF'].setValue('0');
                } else {
                    this.form.controls['fict.KR_CURRENT_IF'].setValue(null);
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
                }
                break;
            }
            case 'fict.KR_CURRENT_IF': {
                if (newValue === null && prevValue === '1') {
                    this.form.controls['DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W'].setValue('');
                }
                this.enKart2Select = newValue;
                break;
            }
        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                this.onDataChanged(key, value, value);
            }
        }

        if (this.isEDoc) {
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [1]);
        } else {
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [2]);
        }

    }

}
