import { NOMENKL_DICT } from './../../consts/dictionaries/nomenkl.const';
import { Component, OnChanges, SimpleChanges, } from '@angular/core';
import { RKBasePage } from './rk-base-page';
import { RecordViewComponent } from '../record-view.component/record-view.component';
// import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';

declare function openPopup(url: string, callback?: Function): boolean;

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
        const path = 'DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC';
        const currentValue = this.getValue(path, null);
        if (currentValue) {
            const modalWindow = this._modalSrv.show(RecordViewComponent, {class: 'eos-record-view modal-lg'});
            const query = { criteries: {'ISN_LCLASSIF': String(currentValue)} };
            modalWindow.content.initByNodeData(query, NOMENKL_DICT);

            if (modalWindow) {
                const subscription = modalWindow.content.onChoose.subscribe(() => {
                    subscription.unsubscribe();
                });
            }

        } else {
            const config = this.dataController.getApiConfig();
            const url = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?Classif=NOMENKL_CL';
            openPopup(url, ((event, str) => {
                this.dataController.zone.run(() => {
                    this.setDictLinkValue(path, str, this.nomenklTitleFunc());
                });
                return Promise.resolve(str);
            }).bind(this));
        }
    }

    onDataChanged(path: string, prevValue: any, newValue: any, initial = false): any {
        switch (path) {

            case 'DOC_DEFAULT_VALUE_List.TERM_EXEC': { // Срок исполнения
                this.form.controls['DOC_DEFAULT_VALUE_List.TERM_EXEC_W'].updateValueAndValidity();
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
                    this.setValue('DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM', '0');
                }
                break;

                // this.setAvailableFor('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC');
                // if (newValue !== prevValue) {
                //     const d = this.dataController.getDescriptions()[DEFAULTS_LIST_NAME];
                //     const d1 = d.find( i => i.key === 'JOURNAL_ISN_NOMENC');

                //     this.dataController.readDictLinkValue(d1, String(newValue.value), this.dataController.updateLinks).then (opts => {
                //         newValue['title'] = opts[0].title;
                //         this.flagEn_spinnum = newValue;
                //     });
                // } else {
                //     this.flagEn_spinnum = newValue;
                // }
                // break;
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
            // Списать в Дело
            case 'DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM': {
                const v = this.getfixedDBValue('DOC_DEFAULT_VALUE_List.JOURNAL_ISN_NOMENC');
                if (v) {
                    if (this.isEDoc) {
                        this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM'].options, [1], true);
                    } else {
                        this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM'].options, [0, 1], true);
                    }
                } else {
                    this.setEnabledOptions(this.inputs['DOC_DEFAULT_VALUE_List.JOURNAL_NOMENC_PARM'].options, null, true);
                }
                break;
            }
        }
    }

    onTabInit (dgStoredValues: any, values: any[]) {
        super.onTabInit(dgStoredValues, values);
    }

}
