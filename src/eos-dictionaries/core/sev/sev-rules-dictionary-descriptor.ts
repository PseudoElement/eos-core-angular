import { ALL_ROWS } from '../../../eos-rest/core/consts';
import { IDictionaryDescriptor } from '../../interfaces';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { EosSevRulesService } from '../../services/eos-sev-rules.service';
import { SevDictionaryDescriptor } from './sev-dictionary-descriptor';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
/* import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component'; */
import { /*BUTTON_RESULT_CANCEL,*/ CONFIRM_NOT_CONSLITE } from 'app/consts/confirms.const';

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
                            if (value['RULE_KIND'] === 2) {
                                 return this._rulesSrv.parseReseiveDocumentRule(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
                            if (value['RULE_KIND'] === 3) {
                                return this._rulesSrv.parseSendDocludDocumentRule(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
                            if (value['RULE_KIND'] === 4) {
                                return this._rulesSrv.parseReceptionDocludDocument(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
                            if (value['RULE_KIND'] === 6) {
                                return this._rulesSrv.parseReseiveProjectRule(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
                           if (value['RULE_KIND'] === 7) {
                            return this._rulesSrv.parseReseiveDoclad(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
                            if (value['RULE_KIND'] === 8) {
                                return this._rulesSrv.parseTakeDoclad(value['SCRIPT_CONFIG'], value['RULE_KIND'], value)
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
            case 'DOCGROUP_CL':
                query = {DOCGROUP_CL: [names]};
                break;
            case 'ORGANIZ_CL':
                query = {ORGANIZ_CL: [names]};
                break;
            case 'LINK_CL':
                query = {LINK_CL: [names]};
                break;
            case 'DEPARTMENT':
                query = {DEPARTMENT: [names]};
                break;
        }
        return this.apiSrv.read(query);
    }
    confirmSave(data: any, confirmSrv: ConfirmWindowService, isNewRecord: boolean): Promise<boolean> {
        const errors = [];
        if (data.rec['RULE_KIND'] === 2 && data.rec.DUE_DEP && data.rec.DUE_DEP !== '0.' && String(data.rec.cardFile).indexOf(data.rec.DUE_DEP) !== 0) {
           errors.push('Подразделение, образующее \"Картотеку автомата\", не входит в состав организации \"Получателя\".\n');
        }
        if (errors.length > 0) {
            return confirmSrv.confirm2(Object.assign({}, CONFIRM_NOT_CONSLITE)).then((button) => {
                if (button['result'] === 1) {
                    return true;
                }
                return false;
            })
            .catch(er => {
                return false;
            });
        } else {
            return Promise.resolve(true);
        }


    }

    readUserLists(query): Promise<any> {
        return this.apiSrv.read(query);
    }
    readDepartmentLists(query): Promise<any> {
        return this.apiSrv.read(query);
    }
    readCabinetLists(query): Promise<any> {
        return this.apiSrv.read(query);
    }
}
