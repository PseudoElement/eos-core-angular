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
                this.flagEn_intAddr = newValue ? true : false;
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

        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                this.onDataChanged(key, value, value);
            }
        }

    super.onTabInit(dgStoredValues, values);

        // for (const key in values) {
        //     if (values.hasOwnProperty(key)) {
        //         const e = values[key];
        //         for (const k in e) {
        //             if (e.hasOwnProperty(k)) {
        //                 const path = key + '.' + k;
        //                 const value = e[k];
        //                 this.onDataChanged(path, value, value);
        //             }
        //         }
        //     }
        // }
    }

}
