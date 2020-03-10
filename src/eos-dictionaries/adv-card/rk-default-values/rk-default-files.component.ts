import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
import { STRICT_OPTIONS, NOT_STRICT_OPTIONS } from './rk-default-const';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-files',
    templateUrl: 'rk-default-files.component.html',
})

export class RKFilesCardComponent extends RKBasePage implements OnChanges {
    public isFileAccessEnabled = false;
    public isSecurLavelAccessEnabled = false;
    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE': {
                if (newValue && (newValue === '3' || newValue === '2' || newValue === '4' || newValue === '5')) {
                    this.isFileAccessEnabled = true;
                    this.validity('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                } else {
                    this.isFileAccessEnabled = false;
                    this.setValue('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', null);
                    this.validity('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                }
                break;
            }
            case 'DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE':
                if (newValue) {
                    this.isSecurLavelAccessEnabled = true;
                    this.updateAccessInput(newValue);
                } else {
                    this.isFileAccessEnabled = false;
                    this.isSecurLavelAccessEnabled = false;
                    this.setValue('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', null);
                    this.validity('DOC_DEFAULT_VALUE_List.REF_FILE_ACCESS_LIST', true);
                    this.setValue('DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE', null);
                    this.validity('DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE', true);
                }
                break;
        }
    }
    updateAccessInput(value) {
        const optionsWithDsp: Array<any> = this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options;
        const findDsp = optionsWithDsp.filter(o => +o.value === +value);
        const v = this.inputs['DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE'].options;
        const  controlAccess = this.form.controls['DOC_DEFAULT_VALUE_List.ACCESS_MODE_FILE'];
        if (findDsp.length) {
            if (findDsp[0].confidentional) {
                v.length = 0;
                v.push(...STRICT_OPTIONS);
                if (controlAccess.value === '3' || controlAccess.value === '2' || controlAccess.value === '1') {
                    controlAccess.patchValue(null);
                }
            } else {
                v.length = 0;
                v.push(...NOT_STRICT_OPTIONS);
            }
        }

    }

    onTabInit(dgStoredValues: any, values: any[]) {
        this.isFileAccessEnabled = false;
        super.onTabInit(dgStoredValues, values);
    }

}
