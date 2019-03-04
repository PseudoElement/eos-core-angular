import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-mandatory',
    templateUrl: 'rk-default-mandatory.component.html',
})

export class RKMandatoryCardComponent extends RKBasePage implements OnChanges {

    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
    }

}
