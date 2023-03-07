import { Component, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { RKBasePageDirective } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-mandatory',
    templateUrl: 'rk-default-mandatory.component.html',
})

export class RKMandatoryCardComponent extends RKBasePageDirective implements OnChanges, OnInit {

    ngOnChanges(changes: SimpleChanges) {
    }

    ngOnInit() {
        super.ngOnInit();
        if (this.form) {
            const corresp = this.form.controls['DOC_DEFAULT_VALUE_List.CORRESP_M'];
            const delivery = this.form.controls['DOC_DEFAULT_VALUE_List.ISN_DELIVERY_M'];
            if (this.rkType === 0) {
                corresp.setValue(true, { emitEvent: false });
            }
            if (this.rkType === 1) {
                corresp.setValue(true, { emitEvent: false });
                delivery.setValue(true, { emitEvent: false });
            }
            if (this.rkType === 2) {
                delivery.setValue(true, { emitEvent: false });
            }
        }
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
    }

}
