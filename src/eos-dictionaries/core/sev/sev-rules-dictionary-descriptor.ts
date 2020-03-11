import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { IDictionaryDescriptor } from '../../interfaces';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { EosSevRulesService } from '../../services/eos-sev-rules.service';
import { SevDictionaryDescriptor } from './sev-dictionary-descriptor';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';
import { BUTTON_RESULT_CANCEL } from 'app/consts/confirms.const';

export class SevRulesDictionaryDescriptor extends SevDictionaryDescriptor {

    constructor(
        descriptor: IDictionaryDescriptor,
        apiSrv: PipRX,
        private _rulesSrv: EosSevRulesService
    ) {
        super(descriptor, apiSrv);
    }

    getData(query?: any, order?: string, limit?: number): Promise<any[]> {
        if (!query) {
            query = ALL_ROWS;
        }

        // console.warn('getData', query, order, limit);

        const req = { [this.apiInstance]: query };

        if (limit) {
            req.top = limit;
        }

        if (order) {
            req.orderby = order;
        }

        return this.apiSrv
            .read(req)
            .then((data: any[]) => {
                this.prepareForEdit(data);
                const processors = [];
                for (let i = 0; i < data.length; i++) {
                    const value = data[i];
                    processors.push(
                        new Promise<any>((resolve) => {
                            if (value['RULE_KIND'] === 1) {
                                return this._rulesSrv.parseSendDocumentRule(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
                                    .then(result => {
                                        if (result) {
                                            for (const prop in result) {
                                                if (result.hasOwnProperty(prop)) {
                                                    value[prop] = result[prop];
                                                }
                                            }
                                        }
                                        return resolve(value);
                                    });
                            }
                            // if (value['RULE_KIND'] === 2) {
                            //     return this._rulesSrv.parseReseiveDocumentRule(value['SCRIPT_CONFIG'], value['RULE_KIND'])
                            //         .then(result => {
                            //             if (result) {
                            //                 for (const prop in result) {
                            //                     if (result.hasOwnProperty(prop)) {
                            //                         value[prop] = result[prop];
                            //                     }
                            //                 }
                            //             }
                            //             return resolve(value);
                            //         });
                            // }
                            if (value['RULE_KIND'] === 5) {
                                return this._rulesSrv.parsesendProjectRule(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
                                    .then(result => {
                                        if (result) {
                                            for (const prop in result) {
                                                if (result.hasOwnProperty(prop)) {
                                                    value[prop] = result[prop];
                                                }
                                            }
                                        }
                                        return resolve(value);
                                    });
                            }
                            return resolve(value);
                        })
                    );
                }
                return Promise.all(processors);
            });
    }
    public loadNames(type, names: string) {
        let query;
        switch (type) {
            case 'LINK_CL':
                query = { LINK_CL: [names.split('|')] };
                break;
            case 'SECURITY_CL':
                query = { SECURITY_CL: [names.split('|')] };
                break;
        }
        return this.apiSrv.read(query);
    }
    confirmSave(data: any, confirmSrv: ConfirmWindowService, isNewRecord: boolean): Promise<boolean> {
        if ((data.rec.link && data.rec.linkKind === 1 && String( data.rec.type) === '1' && (data.rec.linkTypeList === 'null' || !data.rec.linkTypeList)) ||
        (data.rec.LinkPD && data.rec.linkKind === 1 && String(data.rec.type) === '2' && (data.rec.linkTypeList === 'null' || !data.rec.linkTypeList))
        ) {
            const uniqueMessage: IConfirmWindow2 = {
                title: 'Предупреждение',
                body: 'Тип связки должен быть выбран',
                buttons: [{
                    title: 'ОК',
                    result: BUTTON_RESULT_CANCEL,
                    isDefault: true,
                }],
            };
            return confirmSrv.confirm2(uniqueMessage).then((button) => {
                return false;
            });
        }
        return Promise.resolve(true);


    }
}
