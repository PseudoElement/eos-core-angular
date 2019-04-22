import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-files',
    templateUrl: 'rk-default-files.component.html',
})

export class RKFilesCardComponent extends RKBasePage implements OnChanges {
    public isFileAccessEnabled = false;
    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE': {

                if (newValue && (newValue === '-1' || newValue === '-2')) {
                    this.isFileAccessEnabled = true;
                    this.validity('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                } else {
                    this.isFileAccessEnabled = false;
                    this.setValue ('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', null);
                    this.validity('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                }
                break;
            }

        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        this.isFileAccessEnabled = false;
        super.onTabInit(dgStoredValues, values);
    }

}
