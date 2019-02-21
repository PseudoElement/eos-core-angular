import { Component, OnChanges, SimpleChanges, } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-default-values',
    templateUrl: 'rk-default-values.component.html',
})

export class RKDefaultValuesCardComponent extends RKBasePage implements OnChanges {

    flagEn_extAddr: boolean;
    flagEn_intAddr: boolean;

    // type: any;
    // output: any;
    // constructor(
    //     // private _dataSrv: EosDataConvertService,
    // ) {
    // }

    ngOnChanges(changes: SimpleChanges) {
    }

    journalNomencClick() {

    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        // this.changeEvent.next([path, prevValue, newValue]);
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_DEP': {
                if (newValue) {
                    this.flagEn_intAddr = true;
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.SEND_DEP_PARM'].options, [1, 3]);
                } else {
                    this.flagEn_intAddr = false;
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.SEND_DEP_PARM'].options, null, false);
                }

                break;
            }
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_ORGANIZ': {
                this.flagEn_extAddr = newValue ? true : false;
                this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_ISN_DELIVERY', this.flagEn_extAddr);
                this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_OUTER_MARKSEND', this.flagEn_extAddr);
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
        }
    }

}
