import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { RKBasePage } from './rk-base-page';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';


@Component({
    selector: 'eos-rk-writes',
    templateUrl: 'rk-default-writes.component.html',
})

export class RKWritesCardComponent extends RKBasePage implements OnChanges {

    forward_who_w: boolean;
    journal_who_w: boolean;
    enKart1Select: any;
    enKart2Select: any;
    en_journal_param_w: boolean;
    // _initFict: boolean;

    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST_W': { // Передача документов
                if (newValue === null) {
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W', null);
                } else if (prevValue === null) {
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W', 2);
                }
                break;
            }
            case 'DOC_DEFAULT_VALUE_List.FORWARD_WHO_W': { // По значению реквизита "Кому" (адресован)
                this.forward_who_w = newValue === '1';
                if (!this.forward_who_w) {
                    this.form.controls['DOC_DEFAULT_VALUE_List.FORWARD_WHO_EMPTY_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.FORWARD_WHO_REDIRECTION_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.FORWARD_WHERE_REDIRECTION_W'].setValue(null);
                }
                break;
            }
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_FROM_WHO_W': {
                this.journal_who_w = newValue === '1';
                if (!this.journal_who_w) {
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHO_EMPTY_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHO_REDIRECTION_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHERE_REDIRECTION_W'].setValue(null);
                }
                break;
            }

            case 'DOC_DEFAULT_VALUE_List.JOURNAL_FROM_FORWARD_W': {
                if (newValue === '1' && newValue !== prevValue) {
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W', '2');
                }
                this.setAvailableFor('DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W');
                break;
            }

            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC_W': { // Списать в дело
                if (newValue && newValue !== prevValue) {
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W', '0');
                }
                this.setAvailableFor ('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W');
                break;
            }

            case 'fict.KR_CURRENT': {
                this.enKart1Select = newValue;
                if (prevValue === newValue) {
                    break;
                }
                if (newValue === '0') {
                    this.setValue('fict.ISN_CARD_REG_W_1', null);
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1');
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', null);
                }
                if (newValue === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', null);
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    this.setValue('fict.ISN_CARD_REG_W_1', '0');

                }
                if (newValue === '2') {
                    this.setValue('fict.ISN_CARD_REG_W_1', null);
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    this.setValue('fict.KR_CURRENT_IF', '0');

                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1');
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1');
                } else {
                    if (this.getValue('fict.KR_CURRENT_IF', null)) {
                        this.setValue('fict.KR_CURRENT_IF', null);
                    }
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
                }
                break;
            }
            case 'fict.KR_CURRENT_IF': {
                this.enKart2Select = newValue;
                if (prevValue === newValue) {
                    break;
                }

                if (this.getValue('fict.KR_CURRENT', null) !== '2') {
                    break;
                }
                if (newValue === null || prevValue !== '1') {
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                }
                if (newValue === '0') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1');
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1');
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                } else if (newValue === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1');
                    this.setValue('fict.ISN_CARD_REG_W_2', '0');
                }

                break;
            }

            case 'fict.ISN_CARD_REG_W_1': {
                if (prevValue === newValue) {
                    break;
                }
                if (this.enKart1Select === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', newValue);
                }
                break;
            }
            case 'fict.ISN_CARD_REG_W_2': {
                if (prevValue === newValue) {
                    break;
                }
                if (this.enKart1Select === '2' && this.enKart2Select === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', newValue);
                }
                break;
            }

        }

        const t = this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST_W'].value ||
                this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_FROM_WHO_W'].value ||
                this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_FROM_FORWARD_W'].value ;
        if (t !== this.en_journal_param_w) {
            if (!t) {
                this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W', null);
            }
            this.en_journal_param_w = t;
        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
        this.forward_who_w = false;
        this.journal_who_w = false;
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                this.onDataChanged(key, value, value);
            }
        }

        if (this.isEDoc) {
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
        } else {
        }
    }

    journalNomencClick_W () {

    }

    setAvailableFor (key: string) {
        switch (key) {
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W': {
                const cb = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.JOURNAL_FROM_FORWARD_W');
                if (cb) {
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W'].options, null, true);
                } else {
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W'].options, null, false);
                }
                break;
            }
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W': {
                const v = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC_W');
                if (v) {
                    if (this.isEDoc) {
                        this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [1]);
                    } else {
                        this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [0, 1]);
                    }
                } else {
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, null, false);
                }
                break;
            }
        }
    }

}
