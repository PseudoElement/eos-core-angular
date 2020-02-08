import { DictionaryDescriptor } from '../dictionary-descriptor';
import { EosDictionaryNode } from '../eos-dictionary-node';
import { BUTTON_RESULT_OK } from 'app/consts/confirms.const';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { SEV_PARTICIPANT_RULE, SEV_PARTICIPANT, ORGANIZ_CL } from 'eos-rest';



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
    public getData(query?: any, order?: string, limit?: number): Promise<any> {
        return super.getData(query, order, limit).then((sev_part: SEV_PARTICIPANT[]) => {
            const mapLinksOrganiz = new Map<string, SEV_PARTICIPANT>();
            const organizIds = [];
            sev_part.forEach((sev: SEV_PARTICIPANT) => {
                if (sev.DUE_ORGANIZ) {
                    organizIds.push(sev.DUE_ORGANIZ);
                    mapLinksOrganiz.set(sev.DUE_ORGANIZ, sev);
                }
            });
            if (organizIds.length) {
                return this.apiSrv.read({ ORGANIZ_CL: organizIds }).then((org: ORGANIZ_CL[]) => {
                    org.forEach((o: ORGANIZ_CL) => {
                        const s: SEV_PARTICIPANT = mapLinksOrganiz.get(o.DUE);
                        s.DELETED = o.DELETED;
                    });
                    return sev_part;
                });
            }
            return sev_part;
        });
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
