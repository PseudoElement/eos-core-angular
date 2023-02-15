import { Component, OnChanges, SimpleChanges, } from '@angular/core';
import { RKNomenkBasePageDirective } from './rk-nomenk-base-page';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { DictUtils } from 'eos-dictionaries/utils/dict-utils';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

const FeaturesRK = Features.cfg.rkdefaults;

@Component({
    selector: 'eos-rk-default-values',
    templateUrl: 'rk-default-values.component.html',
})

export class RKDefaultValuesCardComponent extends RKNomenkBasePageDirective implements OnChanges {

    static rkDaysVariations = [];

    flagEn_extAddr: boolean;
    flagEn_intAddr: boolean;
    flagEn_doc: boolean;
    flagEn_spinnum: boolean;
    dayTypeTitle: string;

    isCB = this._appCtx.cbBase;



    static termExecOptsByValue(value: number): any {
        if (RKDefaultValuesCardComponent.rkDaysVariations.length === 0) {
            const opts = FeaturesRK.calendarValues;
            RKDefaultValuesCardComponent.rkDaysVariations = DictUtils.termExecOpts(opts);
        }
        const variations = RKDefaultValuesCardComponent.rkDaysVariations;

        return variations[DictUtils.termExecOptsVariant(value)];


        // if (RKDefaultValuesCardComponent.rkDaysVariations.length === 0) {
        //     const opts = FeaturesRK.calendarValues;

        //     let v = { daysLabel: 'дней', options: Array.from(opts, o => Object.assign({}, o)) } ;
        //     v.options.forEach( o => { o.title = o.title.replace('н.', 'ных').replace('ч.', 'чих'); });
        //     RKDefaultValuesCardComponent.rkDaysVariations.push(v);

        //     v = { daysLabel: 'день', options: Array.from(opts, o => Object.assign({}, o)) };
        //     v.options.forEach( o => { o.title = o.title.replace('н.', 'ный').replace('ч.', 'чий'); });
        //     RKDefaultValuesCardComponent.rkDaysVariations.push(v);

        //     v = { daysLabel: 'дня', options: Array.from(opts, o => Object.assign({}, o)) };
        //     v.options.forEach( o => { o.title = o.title.replace('н.', 'ных').replace('ч.', 'чих'); });
        //     RKDefaultValuesCardComponent.rkDaysVariations.push(v);
        // }

        // const variations = RKDefaultValuesCardComponent.rkDaysVariations;

        // const mod100 = value % 100;

        // if (mod100 >= 10 && mod100 <= 20) {
        //     return variations[0];
        // }

        // const mod10 = value % 10;
        // switch (mod10) {
        //     case 1:
        //         return variations[1];
        //     case 2:
        //     case 3:
        //     case 4:
        //         return variations[2];
        //     case 5:
        //     case 6:
        //     case 7:
        //     case 8:
        //     case 9:
        //     case 0:
        //     default:
        //         return variations[0];
        // }
    }
    public securColor(name: string) {
        if (this.form) {
            const val = this.form.controls[name].value;
            const val1 = this.InputsSucerlevelOpt(name).filter(f => +f.value === +val);
            return val1[0] ? val1[0].style.color : 'black';
        }
        return 'black';
    }
     InputsSucerlevelOpt(name) {
        return this.inputs['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'].options;
    }

    ngOnChanges(changes: SimpleChanges) {
        // this.dayTypeTitle = DAYS_TYPE_OPTS_VARIATIONS[0].daysLabel;
        this.selOpts.events = {
            select: this.journalNomencClickSel.bind(this),
            remove: this.journalNomencClickRemove.bind(this),
            getTitle: this.journalNomencGetTitle.bind(this),
        };
    }

    journalNomencClickSel() {
        this.doNomenklSelectView('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC');
    }
    journalNomencClickRemove() {
        this.setDictLinkValue('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC', null);
    }

    onDataChanged(path: string, prevValue: any, newValue: any, initial = false): any {
        switch (path) {

            case 'DOC_DEFAULT_VALUE_List.TERM_EXEC': { // Срок исполнения
                this.form.controls['DOC_DEFAULT_VALUE_List.TERM_EXEC_W'].updateValueAndValidity();
                const lbls = RKDefaultValuesCardComponent.termExecOptsByValue(newValue);
                this.inputs['DOC_DEFAULT_VALUE_List.TERM_EXEC_TYPE'].options = lbls.options;
                this.dayTypeTitle = lbls.daysLabel;
                break;
            }
            // Передача документов
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST': {
                if (newValue) {
                    this.flagEn_doc = true;
                    if (!prevValue) {
                        this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM', '2');
                    }
                } else {
                    this.flagEn_doc = false;
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_PARM', null);
                }
                this.setAvailableFor('DOC_DEFAULT_VALUE_List.JOURNAL_PARM');
                break;
            }

            // Списать в Дело
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC': {
                this.flagEn_spinnum = newValue;
                this.setAvailableFor('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM');
                if (newValue && !prevValue) {
                    this.setFirstAvailableValue('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM');
                }
                if (!newValue) {
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM', null);
                }

                // console.log(this);
                break;

            }

            // Внутренние адресаты
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_DEP': {
                if (newValue) {
                    this.flagEn_intAddr = true;
                    if (!prevValue) {
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_MARKSEND', true);
                    }
                } else {
                    this.flagEn_intAddr = false;
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_MARKSEND', null);
                }
                this.setAvailableFor('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM');
                break;
            }
            // Внутренние адресаты - с отметкой об отправке
            case 'DOC_DEFAULT_VALUE_List.SEND_MARKSEND': {
                this.setAvailableFor('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM');
                if (!initial) {
                    if (newValue) {
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM', this.isEDoc ? '1' : '2');
                    } else {
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_DEP_PARM', null);
                    }
                }
                break;
            }
            // Внешние адресаты
            case 'DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_ORGANIZ': {
                this.flagEn_extAddr = newValue ? true : false;
                if (newValue === null) {
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_ISN_DELIVERY', null);
                    this.setValue('DOC_DEFAULT_VALUE_List.SEND_OUTER_MARKSEND', null);
                    if (this.isCB) {
                        this.setValue('DOC_DEFAULT_VALUE_List.SEND_CB_SENDING_TYPE', null);
                    }
                }
                // this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_ISN_DELIVERY', this.flagEn_extAddr);
                // this.valueSecondarySet('DOC_DEFAULT_VALUE_List.SEND_OUTER_MARKSEND', this.flagEn_extAddr);
                break;
            }
        }
    }

    setAvailableFor (key: string) {
        switch (key) {
            // Внутренние адресаты - с отметкой об отправке
            case 'DOC_DEFAULT_VALUE_List.SEND_DEP_PARM': {
                const cb = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.SEND_MARKSEND');
                const v = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.SEND_ISN_LIST_DEP');
                if (v && cb) {
                    this.setEnabledOptions(this.inputs[key].options,
                        this.isEDoc ? [1, 3] : [0, 1, 2]);
                } else {
                    this.setEnabledOptions(this.inputs[key].options, null, false);
                }
                break;
            }
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_PARM': {
                const v = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_LIST');
                if (v && !this.isEDoc) {
                    this.setEnabledOptions(this.inputs[key].options, null, true);
                } else {
                    this.setEnabledOptions(this.inputs[key].options, null, false);
                }
                break;
            }
            // Списать в Дело - радиобуттоны
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM': {
                this.nomencChildControlAvial('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC',
                        'DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM');
                break;
            }
        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
    }
}
