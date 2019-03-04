import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-files',
    templateUrl: 'rk-default-files.component.html',
})

export class RKFilesCardComponent extends RKBasePage implements OnChanges {
    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
    }
}
