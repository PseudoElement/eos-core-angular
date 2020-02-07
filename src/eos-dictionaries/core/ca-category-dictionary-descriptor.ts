import { DictionaryDescriptor } from './dictionary-descriptor';
import { _ES } from 'eos-rest/core/consts';
import { EDS_CATEGORY_CL } from 'eos-dictionaries/consts/dictionaries/category-eds.consts';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { BUTTON_RESULT_CANCEL } from 'app/consts/confirms.const';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { CA_CATEGORY } from 'eos-rest/interfaces/structures';

export class CaCategoryDictionaryDescriptor extends DictionaryDescriptor {

    getParentDictionaryId(): string {
        return EDS_CATEGORY_CL.id;
    }

    confirmSave(nodeData: any, confirmSrv: ConfirmWindowService, isNewRecord: boolean): Promise<boolean> {


        return this.apiSrv.read<CA_CATEGORY>({'CA_CATEGORY': PipRX.criteries({
            'CA_SERIAL': nodeData.rec.CA_SERIAL,
            // 'CA_SUBJECT': nodeData.rec.CA_SUBJECT,
            'CA_CATEGORY.CA_SUBJECT_1024': nodeData.rec.CA_SUBJECT,
            'ISN_EDS_CATEGORY': String(nodeData.rec.ISN_EDS_CATEGORY)}), })
            .then((data) => {
                if (data && data.length) {
                    const ex = data.filter(d => nodeData.rec['ISN_CA_CATEGORY'] !== d['ISN_CA_CATEGORY']);
                    if (ex.length) {
                        const uniqueMessage: IConfirmWindow2 = {
                            title: 'Не удалось сохранить',
                            body: 'Корневой сертификат уже был добавлен ранее',
                            buttons: [{
                                title: 'ОК',
                                result: BUTTON_RESULT_CANCEL,
                                isDefault: true,
                            }, ],
                        };
                        return confirmSrv.confirm2(uniqueMessage).then( (button) => {
                            return false;
                        });
                    }
                }
                return true;
            });

    }

}
