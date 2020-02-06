import { DictionaryDescriptor } from '../dictionary-descriptor';
import { EosDictionaryNode } from '../eos-dictionary-node';
import { BUTTON_RESULT_OK } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { SEV_PARTICIPANT_RULE } from 'eos-rest';



export class SevParticipantDictionaryDescriptor extends DictionaryDescriptor {
    addRecord(data: any, _useless: any, appendToChanges: any = null, isProtected = false, isDeleted = false): Promise<any> {
        return super.addRecord(data, _useless, appendToChanges = null, isProtected = false, isDeleted = false).then(ID => {
            return this.UpdateSaveParticipantRule(data, ID);
        });
    }
    public UpdateSaveParticipantRule(data: any, ID = null): Promise<any> {
        let changes = [];
        if (data.SEV_PARTICIPANT_RULE_CHANGES_LIST && data.SEV_PARTICIPANT_RULE_CHANGES_LIST.size) {
                data.SEV_PARTICIPANT_RULE_CHANGES_LIST.forEach(function (value: SEV_PARTICIPANT_RULE, key) {
                    if (!value.ISN_PARTICIPANT) {
                        value.ISN_PARTICIPANT = ID;
                    }
                    changes.push(value);
                });
        }
        changes = this.apiSrv.changeList(changes);
        return this.apiSrv.batch(changes, '');
    }
    confirmSave(nodeData: EosDictionaryNode, confirmSrv, isNewRecord: boolean): Promise<boolean> {
        if (nodeData &&
            (!nodeData['SEV_PARTICIPANT_RULE_List'] || !nodeData['SEV_PARTICIPANT_RULE_List'].length)
        ) {
            const w: IConfirmWindow2 = {
                title: 'Не удалось сохранить',
                body: '',
                bodyList: ['Укажите "Используемые Правила"'],
                buttons: [
                    { title: 'Ok', result: BUTTON_RESULT_OK, isDefault: true },
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
