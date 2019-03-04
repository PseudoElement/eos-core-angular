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
    _initFict: boolean;
    // enaddRules1: boolean;

    ngOnChanges(changes: SimpleChanges) {
    }

    onDataChanged(path: string, prevValue: any, newValue: any): any {
        switch (path) {
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST_W': { // Передача документов
                if (newValue === null) {
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W'].setValue(null);
                } else if (prevValue === null) {
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_PARM_W'].setValue(2);
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
                if (!this.forward_who_w) {
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHO_EMPTY_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHO_REDIRECTION_W'].setValue(null);
                    this.form.controls['DOC_DEFAULT_VALUE_List.JOURNAL_WHERE_REDIRECTION_W'].setValue(null);
                }
                break;
            }
            case 'fict.KR_CURRENT': {
                if (this._initFict) {
                    break;
                }
                this.enKart1Select = newValue;
                if (newValue === '0') {
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_FORWARD_W' AND isn_docgroup = 3670
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_W' AND isn_docgroup = 3670
                    // INSERT INTO doc_default_VALUE ( default_id, isn_docgroup, value ) VALUES ( 'ISN_CARD_REG_CURR_W', 3670, '1' )
                    // this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', null, false);
                    this.setValue('fict.ISN_CARD_REG_W_1', null);
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    // this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1');
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', null, false);
                }
                if (newValue === '1') {
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_FORWARD_W' AND isn_docgroup = 3670
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_CURR_W' AND isn_docgroup = 3670
                    // INSERT INTO doc_default_VALUE ( default_id, isn_docgroup, value ) VALUES ( 'ISN_CARD_REG_W', 3670, '15660' )
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', null, false);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', null, false);
                    // this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', '0');
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    this.setValue('fict.ISN_CARD_REG_W_1', '0', true);

                }
                if (newValue === '2') {
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_W' AND isn_docgroup = 3670
                    // INSERT INTO doc_default_VALUE ( default_id, isn_docgroup, value ) VALUES ( 'ISN_CARD_REG_FORWARD_W', 3670, '1' )
                    this.setValue('fict.ISN_CARD_REG_W_1', null);
                    this.setValue('fict.ISN_CARD_REG_W_2', null);
                    this.setValue('fict.KR_CURRENT_IF', '0', false);

                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', null, false);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1', false);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1', false);
                } else {
                    if (this.getValue('fict.KR_CURRENT_IF', null)) {
                        this.setValue('fict.KR_CURRENT_IF', null, false);
                    }
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_PARM'].options, null, false);
                }
                break;
            }
            case 'fict.KR_CURRENT_IF': {
                this.enKart2Select = newValue;
                if (this._initFict) {
                    break;
                }
                if (this.getValue('fict.KR_CURRENT', null) !== '2') {
                    break;
                }
                if (newValue === null || prevValue !== '1') {
                    this.setValue('fict.ISN_CARD_REG_W_2', null, false);
                }
                if (newValue === '0') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', '1', false);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1', false);
                    this.setValue('fict.ISN_CARD_REG_W_2', null, false);
                } else if (newValue === '1') {
                    // DELETE FROM doc_default_VALUE WHERE default_id = 'ISN_CARD_REG_CURR_W' AND isn_docgroup = 3670
                    // INSERT INTO doc_default_VALUE ( default_id, isn_docgroup, value ) VALUES ( 'ISN_CARD_REG_FORWARD_W', 3670, '1' )
                    // INSERT INTO doc_default_VALUE ( default_id, isn_docgroup, value ) VALUES ( 'ISN_CARD_REG_W', 3670, '1422' )
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', null, false);
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', '1', false);
                    this.setValue('fict.ISN_CARD_REG_W_2', '0', false);
                }

                break;
            }

            case 'fict.ISN_CARD_REG_W_1': {
                if (this.enKart1Select === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', newValue, false);
                }
                break;
            }
            case 'fict.ISN_CARD_REG_W_2': {
                if (this.enKart1Select === '2' && this.enKart2Select === '1') {
                    this.setValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', newValue, false);
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
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [1]);
        } else {
            this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM_W'].options, [0, 1]);
        }

        this._initFict = true;
        const cur = this.getValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_CURR_W', null);
        const forw = this.getValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_FORWARD_W', null);
        const id = this.getValue('DOC_DEFAULT_VALUE_List.ISN_CARD_REG_W', null);
        if (forw) {
            this.enKart1Select = '2';
            this.setValue('fict.KR_CURRENT', '2');
            if (cur) {
                this.enKart2Select = '0';
                this.setValue('fict.KR_CURRENT_IF', '0');
            } else if (id) {
                this.enKart2Select = '1';
                this.setValue('fict.KR_CURRENT_IF', '1');
                this.setValue('fict.ISN_CARD_REG_W_2', id);
            }
        } else {
            if (id) {
                this.enKart1Select = '1';
                this.setValue('fict.KR_CURRENT', '1');
                this.setValue('fict.ISN_CARD_REG_W_1', id);
            } else if (cur) {
                this.enKart1Select = '0';
                this.setValue('fict.KR_CURRENT', '0');
            }
        }
        this._initFict = false;

    }

}
