import {DictionaryDescriptor} from '../dictionary-descriptor';
import { EosDictionaryNode } from '../eos-dictionary-node';
import { BUTTON_RESULT_OK } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';


export class SevParticipantDictionaryDescriptor extends DictionaryDescriptor {

    confirmSave(nodeData: EosDictionaryNode, confirmSrv, isNewRecord: boolean): Promise<boolean> {
        if (nodeData &&
            (!nodeData['SEV_PARTICIPANT_RULE_List'] || !nodeData['SEV_PARTICIPANT_RULE_List'].length)
            ) {
                const w: IConfirmWindow2 = {
                    title: 'Не удалось сохранить',
                    body: '',
                    bodyList: ['Укажите "Используемые Правила"'],
                    buttons: [
                        {title: 'Ok', result: BUTTON_RESULT_OK, isDefault: true },
                    ]
                };
                return confirmSrv.confirm2(w)
                    .then(() => {
                        return false;
                    });
        }


        return Promise.resolve(true);
    }

}
