import { SevDictionaryDescriptor } from './sev-dictionary-descriptor';
import { EosDictionaryNode } from '../eos-dictionary-node';
import { BUTTON_RESULT_OK } from '../../../app/consts/confirms.const';
import { IConfirmWindow2 } from '../../../eos-common/confirm-window/confirm-window2.component';
import { SEV_PARTICIPANT_RULE, SEV_PARTICIPANT, ORGANIZ_CL, SEV_RULE, PipRX, SEV_SYNC_REPORT } from '../../../eos-rest';
import { IDictionaryDescriptor, IRecordOperationResult } from '../../../eos-dictionaries/interfaces';
import * as moment from 'moment';
export class SevParticipantDictionaryDescriptor extends SevDictionaryDescriptor {
    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX
    ) {
        super(descriptor, apiSrv);
        this.record.sevFieldFullSearch([
            'fullSearchFields',
        ], descriptor);
    }
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
        changes = this.apiSrv.changeList(changes).map((ch: { method: string, requestUri: string, data?: string }) => {
            const idPartisipant = ID ? ID : data.rec['ISN_LCLASSIF'];
            if (ch.method === 'POST') {
                ch.requestUri = `SEV_PARTICIPANT(${idPartisipant})/SEV_PARTICIPANT_RULE_List`;
            } else {
                ch.requestUri = `SEV_PARTICIPANT(${idPartisipant})/${ch.requestUri.replace(/SEV_PARTICIPANT_RULE/ig, 'SEV_PARTICIPANT_RULE_List')}`;
            }
            return ch;
        });
        return this.apiSrv.batch(changes, '').then(() => {
            return null;
        });
    }
    updateRecord(originalData: any, updates: any, appendToChanges: any = null): Promise<IRecordOperationResult[]> {
        return super.updateRecord(originalData, updates, appendToChanges).then(data => {
            if (!data || !data.length) {
                return [{ success: true, record: originalData.rec }];
            }
            return data;
        });
    }
    // updateStrToQuery(stringDue: any[]): string[] {
    //     const queries: any[] = [];
    //     if (stringDue.length > MAX_QUERY_DUES) { // разбиваем на куски по 177 кодов и делаем массив
    //         const step: number = 0;
    //         let finish: number = 0;
    //         while (step * MAX_QUERY_DUES < stringDue.length) {
    //             const start = MAX_QUERY_DUES * step;
    //             finish = step * MAX_QUERY_DUES + MAX_QUERY_DUES;
    //             if (finish > stringDue.length) {
    //                 finish = step * MAX_QUERY_DUES + (stringDue.length - MAX_QUERY_DUES);
    //             }
    //             const SELECTED_DUES = stringDue.slice(start, finish);
    //             const DUES_STR = SELECTED_DUES.join('|');
    //             queries.push(DUES_STR);
    //         }
    //     } else {
    //         queries.push(stringDue.join('|'));
    //     }
    //     return queries;
    // }
    public getData(query?: any, order?: string, limit?: number): Promise<any> {
        return super.getData(query, order, limit).then((sev_part: SEV_PARTICIPANT[]) => {
            const mapLinksOrganiz = new Map<string, SEV_PARTICIPANT>();
            const organizIds = [];
            const sevParticipan = [];
            const mapSevParticipan = new Map<string, string>();
            sev_part.forEach((sev: SEV_PARTICIPANT) => {
                sevParticipan.push(sev.ISN_LCLASSIF);
                mapSevParticipan.set('' + sev.ISN_LCLASSIF, '');
                if (sev.DUE_ORGANIZ) {
                    organizIds.push(sev.DUE_ORGANIZ);
                    mapLinksOrganiz.set(sev.DUE_ORGANIZ, sev);

                }
            });
            const query = [];
            if (organizIds.length) {
                query.push(this.apiSrv.read<ORGANIZ_CL>({ ORGANIZ_CL: organizIds }));
            } else {
                query.push(Promise.resolve([]));
            }
            if (sevParticipan.length) {
                const allQuery = this.apiSrv.splitStrQueryLength(sevParticipan);
                allQuery.forEach((quer) => {
                    query.push(this.apiSrv.read<SEV_SYNC_REPORT>({ 
                        SEV_SYNC_REPORT: {
                            criteries: { 
                                ISN_PARTICIPANT: quer
                            }
                        }
                    }));
                });
            } else {
                query.push(Promise.resolve([]));
            }
            return Promise.all(query)
            .then((queryAns) => {
                if (queryAns[0].length > 0) {
                    queryAns[0].forEach((o: ORGANIZ_CL) => {
                        const s: SEV_PARTICIPANT = mapLinksOrganiz.get(o.DUE);
                        s.DELETED = o.DELETED;
                        s.ORGANIZ_CL_NAME = o.CLASSIF_NAME;
                    });
                }
                for (let index = 1; index < queryAns.length; index++) {
                    queryAns[index].forEach((sync: SEV_SYNC_REPORT) => {
                        const oldDate = mapSevParticipan.get('' + sync.ISN_PARTICIPANT);
                        if (oldDate.length === 0) {
                            mapSevParticipan.set('' + sync.ISN_PARTICIPANT, '' + sync.FILE_SYNC_DATE);
                        } else {
                            const newData = new Date(sync.FILE_SYNC_DATE) > new Date(oldDate);
                            if (newData) {
                                mapSevParticipan.set('' + sync.ISN_PARTICIPANT, '' + sync.FILE_SYNC_DATE);
                            }
                        }
                    })
                }
                sev_part.forEach((part) => {
                    let date = '';
                    if (mapSevParticipan.get('' + part.ISN_LCLASSIF)) {
                        const time = mapSevParticipan.get('' + part.ISN_LCLASSIF);
                        const day = moment(time).format("DD.MM.YYYY");
                        const hours = `${moment(time).hours()}`.length === 1 ? '0' + moment(time).hours() : moment(time).hours();
                        const minutes = `${moment(time).minutes()}`.length === 1 ? '0' + moment(time).minutes() : moment(time).minutes();
                        const seconds = `${moment(time).seconds()}`.length === 1 ? '0' + moment(time).seconds() : moment(time).seconds();

                        date = `${day}, ${hours}:${minutes}:${seconds}`;
                    }
                    part['FILE_SYNC_DATE'] = date;
                });
                return sev_part;
            });
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

    getRelated(data): Promise<any> {
        return this.apiSrv.read<SEV_PARTICIPANT_RULE>({
            SEV_PARTICIPANT_RULE: {
                criteries: {
                    ISN_PARTICIPANT: data.ISN_LCLASSIF,
                }
            },
        }).then((sev_partisipant: SEV_PARTICIPANT_RULE[]) => {
            const sev_ruleID = [];
            sev_partisipant.forEach((rule: SEV_PARTICIPANT_RULE) => {
                sev_ruleID.push(rule.ISN_RULE);
            });
            return this.apiSrv.read<SEV_RULE>({
                SEV_RULE: sev_ruleID
            }).then((sev_rule: SEV_RULE[]) => {
                if (sev_rule.length) {
                    data.rules = sev_rule.map(e => e.CLASSIF_NAME).join('; ');
                }
                return { sev_partisipant, sev_rule };
            });
        });
    }

}
