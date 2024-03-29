import type { DynamicInputLinkButtonComponent } from './../../../eos-common/dynamic-form-input/dynamic-input-linkbutton.component';
import { Injectable, Directive } from '@angular/core';
import { RKBasePageDirective } from './rk-base-page';
import { RecordViewComponent } from '../record-view.component/record-view.component';
import { NOMENKL_DICT } from '../../../eos-dictionaries/consts/dictionaries/nomenkl.const';

declare function openPopup(url: string, callback?: Function): boolean;

@Directive()
@Injectable()
export abstract class RKNomenkBasePageDirective extends RKBasePageDirective {
    protected doCardSelectView(path: string) {
        /* const config = this.dataController.getApiConfig();
        const pageUrl = config.webBaseUrl + 'classifChoose/cl?';
        const params = 'Classif=CARDINDEX&value_id=__ClassifIds&skip_deleted=True&select_nodes=True&select_leaf=True&return_due=False&select_multy=False';
        const url = pageUrl + params;
        let flag = false;
        if (window['dontCheckExistPopUp'] === undefined) {
            flag = true;
            window['dontCheckExistPopUp'] = true;
        }
        openPopup(url, ((event, str) => {
            if (flag) {
                delete window['dontCheckExistPopUp'];
            }
            this.dataController.zone.run(() => {
                this.setDictLinkValue(path, str);
            });
            return Promise.resolve(str);
        }).bind(this)); */
        this._waitClassifSrv.openClassif({
            classif: 'CARDINDEX',
            id: '__ClassifIds',
            skipDeleted: true,
            selectNodes: true,
            selectLeafs: true,
            return_due: false,
            selectMulty: false
        }, true)
        .then((str: string) => {
            this.dataController.zone.run(() => {
                this.setDictLinkValue(path, str);
            });
            return Promise.resolve(str);
        })
        .catch((er) => {
            console.log('er', er);
            
        });
    }

    protected doNomenklSelectView(path: string) {
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
            this._waitClassifSrv.openClassif({
                classif: 'NOMENKL_CL',
                selectMulty: false,
            }, true)
            .then((str: string) => {
                this.dataController.zone.run(() => {
                    this.setDictLinkValue(path, str);
                });
                return Promise.resolve(str);
            })
            .catch((er) => {
                console.log('er', er);
                
            });
        }
    }

    protected journalNomencGetTitle(sender: DynamicInputLinkButtonComponent): string {
        const rec = sender.input.options[0].rec;
        if (rec) {
            return rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
        }
        return '...';
    }

    protected nomencChildControlAvial(deloKey: string, childControlKey: string) {
        const v = this.getfixedDBValue(deloKey);
        if (v) {
            const dib = this.inputs[deloKey];
            let vDeloE = false;
            if (dib.options && dib.options[0] && dib.options[0].rec) {
                const rec = dib.options[0].rec;
                vDeloE = rec['E_DOCUMENT'] === 1;
            }
            if (vDeloE) { // в электронное дело
                this.setEnabledOptions(this.inputs[childControlKey].options, [2], true);
            } else { // в бумажное дело
                if (this.isEDoc) { // Для электронного документа:
                    this.setEnabledOptions(this.inputs[childControlKey].options, [1], true);
                } else { // Для бумажного документа
                    this.setEnabledOptions(this.inputs[childControlKey].options, [0, 1], true);
                }
            }
        } else {
            this.setEnabledOptions(this.inputs[childControlKey].options, null, false);
        }

    }

}
