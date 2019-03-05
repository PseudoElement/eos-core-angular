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
    flagEn_doc: boolean;
    flagEn_spinnum: boolean;

    ngOnChanges(changes: SimpleChanges) {
    }

    journalNomencClick() {

    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            // Передача документов
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST': {
                if (newValue) {
                    this.flagEn_doc = true;
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, true);
                    if (!prevValue) {
                        this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM', '2');
                    }
                } else {
                    this.flagEn_doc = false;
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM', null);
                }
                break;
            }

            // Списать в Дело
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC': {
                this.flagEn_spinnum = newValue;
                if (!newValue) {
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM'].options, null, false);
                }
                break;
            }

            // Внутренние адресаты
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_DEP': {
                if (newValue) {
                    this.flagEn_intAddr = true;
                    if (!prevValue) {
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_MARKSEND', true);
                        this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.SEND_DEP_PARM'].options,
                        this.isEDoc ? [1, 3] : [0, 1, 2]);
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM', this.isEDoc ? '1' : '2');
                    }
                } else {
                    this.flagEn_intAddr = false;
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_MARKSEND', null);
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.SEND_DEP_PARM'].options, null, false);
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM', null);
                }

                break;
            }
            // Внешние адресаты
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_ORGANIZ': {
                this.flagEn_extAddr = newValue ? true : false;
                if (newValue === null) {
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_ISN_DELIVERY', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_OUTER_MARKSEND', null);
                }
                // this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_ISN_DELIVERY', this.flagEn_extAddr);
                // this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_OUTER_MARKSEND', this.flagEn_extAddr);
                break;
            }
        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {

        super.onTabInit(dgStoredValues, values);

        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                const value = values[key];
                this.onDataChanged(key, value, value);
            }
        }

        if (this.isEDoc) {
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
        }
    }

}
