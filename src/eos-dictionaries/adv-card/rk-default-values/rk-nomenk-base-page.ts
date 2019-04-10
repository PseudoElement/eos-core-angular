import { Injectable } from '@angular/core';
import { RKBasePage } from './rk-base-page';
import { RecordViewComponent } from '../record-view.component/record-view.component';
import { NOMENKL_DICT } from 'eos-dictionaries/consts/dictionaries/nomenkl.const';

declare function openPopup(url: string, callback?: Function): boolean;

@Injectable()
export abstract class RKNomenkBasePage extends RKBasePage {

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

}
