import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/interfaces';
import { SEV_RULE } from 'eos-rest';

@Injectable()
export class EosSevRulesService {
    private _scriptConfig: string;
    private _data: any;
    constructor(private _msgSrv: EosMessageService) {

    }

    scriptConfigToXml(): string {
        const kind = (this._data['type'] - 1) * 4 + +this._data['kind'];
        if (kind === 1) {
            return this.sendDocumentRule();
        } else if (kind === 2) {
            return this.receiveDocumentRule();
        } else if (kind === 3) {
            return this.sendReportRule();
        } else if (kind === 4) {
            return this.receiveReportRule();
        } else if (kind === 5) {
            return this.sendProjectRule();
        } else if (kind === 6) {
            return this.receiveProjectRule();
        } else if (kind === 7) {
            return this.sendProjectReportRule();
        } else if (kind === 8) {
            return this.receiveProjectReportRule();
        } else {
            return '';
        }
    }

    filterConfigToXml(): string {
        let result = ``;
        if (this._data['groupDocument']) {
            result = `<FilterConfig>`;
            const allDoc: string[] = this._data['groupDocument'].split('|');
            allDoc.forEach(doc => {
                result += `<DocType><Field>NAME</Field><Etalon>${doc}</Etalon></DocType>`;
            });
            result += '</FilterConfig>';
        }
        return result;
    }

    parseSendDocumentRule(scriptConfig, kindRule, data: SEV_RULE): Promise<any> {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        const mess = err.message ? err.message : 'ошибка в файле Вид правила';
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: mess };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const sendDocumentRule = result['SendDocumentRule'];
                    if (!sendDocumentRule) {
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: `Для правила ${data.CLASSIF_NAME}, установлен не верный вид правила, пересохраните документ.` };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    try {
                        const document = sendDocumentRule['ScriptConfig'][0]['Document'][0];
                        this._data = {};
                        this._data['type'] = kindRule >= 5 ? 2 : 1;
                        this._data['kind'] = kindRule >= 5 ? kindRule - 4 : kindRule;
                        this._data['link'] = !(document['Link'][0].$['Include'] === 'None');
                        this._data['linkKind'] = document['Link'][0].$['Include'] === 'List' ? 1 : 0;
                        this._data['linkTypeList'] = document['Link'][0].$['LinkTypeList'];
                        this._data['access'] = document['Access'][0].$['Include'] === 'true';
                        this._data['rubric'] = document['Rubric'][0].$['Include'] === 'true';
                        this._data['address'] = sendDocumentRule['ScriptConfig'][0]['Contact'][0]['Address'][0].$['Include'] === 'true';
                        this._data['region'] = sendDocumentRule['ScriptConfig'][0]['Contact'][0]['Address'][0]['Region'][0]
                            .$['Include'] === 'true';
                        this._data['visa'] = document['Visa'][0].$['Include'] === 'true';
                        this._data['addressee'] = !(document['Addressee'][0].$['Include'] === 'None');
                        this._data['addresseeKind'] = document['Addressee'][0].$['Include'] === 'All' ? 0 : 1;
                        this._data['additionalField'] = document['AdditionalField'][0].$['Include'] === 'true';
                        this._data['userGrantedOnly'] = document.$['UserGrantedOnly'] === 'true';
                        this._data['file'] = document['File'][0].$['Include'] === 'true';
                        const ext1 = document['File'][0].$['Extensions'];
                        this._data['fileExtensions'] = ext1 && ext1 !== 'null' ? ext1 : '';
                        this._data['fileAccessList'] = document['File'][0].$['AccessList'];
                        this._data['fileMaxLength'] = document['File'][0].$['MaxLength'] === 'null' ? '' : document['File'][0].$['MaxLength'];
                        this._data['item'] = document['Item'][0].$['Include'] !== 'None';
                        this._data['itemKind'] = document['Item'][0].$['Include'] === 'Extraction' ? 2 : 1;
                        this._data['resolution'] = !(document['Resolution'][0].$['Include'] === 'None');
                        const resolution = document['Resolution'][0].$['Include'];
                        this._data['resolutionKind'] = resolution === 'None' ? 3 : resolution === 'All' ? 1 : resolution === 'ExtractionWithParent' ? 2 : 3;
                        const task = sendDocumentRule['ScriptConfig'][0]['Task'][0];
                        this._data['taskCategory'] = task['Category'][0].$['Include'] === 'true';
                        this._data['taskController'] = task['Controller'][0].$['Include'] === 'true';
                        this._data['taskNote'] = task['Note'][0].$['Include'] === 'true';
                        this._data['taskFile'] = task['File'][0].$['Include'] === 'true';
                        const ext = task['FileOptions'][0].$['Extensions'];
                        this._data['taskFileExtensions'] = ext && ext !== 'null' ? ext : '';
                        const maxLength = task['FileOptions'][0].$['MaxLength'];
                        this._data['taskFileMaxLength'] = maxLength && maxLength !== 'null' ? maxLength : '';
                        const subscriptions = sendDocumentRule['Subscriptions'][0];
                        this._data['reception'] = subscriptions['Reception'][0].$['Include'] === 'true';
                        this._data['registration'] = subscriptions['Registration'][0].$['Include'] === 'true';
                        this._data['forwarding'] = subscriptions['Forwarding'][0].$['Include'] === 'true';
                        this._data['consideration'] = subscriptions['Consideration'][0].$['Include'] === 'true';
                        this._data['report'] = subscriptions['Report'][0].$['Include'] === 'true';
                        this._data['redirection'] = subscriptions['Redirection'][0].$['Include'] === 'true';
                        this._data['answer'] = subscriptions['Answer'][0].$['Include'] === 'true';
                        this._data['stopDayCount'] = subscriptions.$['StopDayCount'];
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseReseiveDocumentRule(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        let filterconfig;
        let filter = '';
        if (data['FILTER_CONFIG']) {
            parseString(data['FILTER_CONFIG'], (err, result) => {
                filterconfig = result;
                filterconfig['FilterConfig']['DocType'].forEach(elem => {
                    filter += elem['Etalon'] + '|';
                });
            });
        }
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const receiveDocumentRule = result['ReceiveDocumentRule'];
                    if (!receiveDocumentRule) {
                        const e = { message: 'отсутствует ReceiveDocumentRule' };
                        return reject(e);
                    }
                    this._data = {};
                    try {
                        const document = receiveDocumentRule['ScriptConfig'][0]['Document'][0];
                        const Contact = receiveDocumentRule['ScriptConfig'][0]['Contact'][0];
                        const Task = receiveDocumentRule['ScriptConfig'][0]['Task'][0];
                        const UpdateParams = receiveDocumentRule['ScriptConfig'][0]['UpdateParams'][0];
                        this._data['type'] = 1;
                        this._data['kind'] = 2;
                        this._data['DUE_DEP'] = data['DUE_DEP'];
                        this._data['departmentReceive'] = data['DUE_DEP'] && data['DUE_DEP'] !== '0.' ? 2 : 1;
                        // и скорее всего нужно ещё забрать все картотеки и кабинеты
                        // cabinetFile
                        this._data['takeFileRK'] = document['File'][0].$['Use'] === 'true'; //  принимать файлы   // takeFileRK принимать файлы
                        this._data['fileAccessList'] = document['File'][0].$['AccessList']; // пока не знаю зачем этот параметр так и не смог его изменить
                        this._data['cardFile'] = receiveDocumentRule['ScriptConfig'][0]['RegistrationParams'][0]['Card'][0];
                        this._data['cabinetFile'] = receiveDocumentRule['ScriptConfig'][0]['RegistrationParams'][0]['Cabinet'][0]; // кабинет автомата cabinetFile
                        this._data['groupDocument'] = filter;
                        this._data['OrganizationFolderInput'] = Contact['OrganizationFolder'][0]; // организаци
                        this._data['handRegistration'] = receiveDocumentRule['ScriptConfig'][0]['SendToManualQueue'][0] === 'true'; // handRegistration направлять на ручную регистрацию
                        this._data['link'] = document['Link'][0].$['Use'] !== 'None'; // link Связки РК
                        this._data['linkKind'] = document['Link'][0].$['Use'] === 'List' ? 1 : 0; // linkKind кнопки после
                        this._data['linkTypeList'] = document['Link'][0].$['LinkTypeList']; // linkTypeList поле после
                        this._data['access'] = document['Access'][0].$['Use'] === 'true'; // access грифы
                        this._data['rubric'] = document['Rubric'][0].$['Use'] === 'true'; //  рубрики
                        this._data['address'] = Contact['Address'][0].$['Use'] !== 'DoNotUse'; // Адрес субьекта address
                        this._data['adrReplace'] = Contact['Address'][0].$['Use'] === 'IfEmpty' ? 2 : 1; // переключашка после адреса adrReplace
                        this._data['region'] = Contact['Address'][0]['Region'][0].$['Use'] === 'true'; // регионы субьекта region
                        this._data['additionalField'] = document['AdditionalField'][0].$['Use'] === 'true'; // additionalField Доп реквизит
                        this._data['orders'] = document['Task'][0].$['Use'] !== 'None';
                        this._data['ordersKind'] = document['Task'][0].$['Use'] === 'Own' ? 1 : 0;
                        this._data['taskCategory'] = Task['Category'][0].$['Use'] === 'true';
                        this._data['noteOrders'] = Task['Note'][0].$['Use'] === 'true';
                        this._data['takeFileOrders'] = Task['File'][0].$['Use'] === 'true';
                        this._data['FileRK'] = UpdateParams['File'][0].$['Use'] === 'true'; // файлы РК
                        this._data['takeOrdersRK'] = UpdateParams['Task'][0].$['Use'] === 'true'; // поручения РК
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseSendDocludDocumentRule(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const SendReportRule = result['SendReportRule'];
                    if (!SendReportRule) {
                        const e = { message: 'отсутствует SendReportRule' };
                        return reject(e);
                    }
                    const Task = SendReportRule['ScriptConfig'][0]['Task'][0];
                    const Contakt = SendReportRule['ScriptConfig'][0]['Contact'][0];
                    const Notification = SendReportRule['NotificationConfig'][0];
                    this._data = {};
                    const kindConsideration = Notification['Consideration'][0].$['Include'];
                    let kindConsiderationId = 0;
                    if (kindConsideration === 'Last') {
                        kindConsiderationId = 2;
                    } else if (kindConsideration === 'First') {
                        kindConsiderationId = 1;
                    } else {
                        kindConsiderationId = 0;
                    }
                    try {
                        this._data['type'] = 1;
                        this._data['kind'] = 3;
                        this._data['kindConsideration'] = kindConsiderationId;
                        this._data['textConsideration'] = Task['Text'][0].$['Include'] === 'true'; // Текст резолюции
                        this._data['consideration'] = Notification['Consideration'][0].$['Include'] !== 'None'; ///////////////
                        this._data['categoryConsideration'] = Task['Category'][0].$['Include'] === 'true'; // Категория резолюции
                        this._data['noteConsideration'] = Task['Note'][0].$['Include'] === 'true'; // Примечание
                        this._data['controlConsideration'] = Task['ControlState'][0].$['Include'] === 'true'; // Контрольность резолюции
                        this._data['planConsideration'] = Task['PlanDate'][0].$['Include'] === 'true'; // План. дата
                        this._data['controllerMission'] = Task['Controller'][0].$['Include'] === 'true'; // Контролёр поручения
                        this._data['Summary'] = Task['Summary'][0].$['Include'] === 'true'; // Ход исполнения
                        this._data['FactDate'] = Task['FactDate'][0].$['Include'] === 'true'; // Дата снятия с контроля
                        this._data['Status'] = Task['Status'][0].$['Include'] === 'true'; // Состояние исполненения
                        this._data['Resume'] = Task['Resume'][0].$['Include'] === 'true'; // Основание для снятия с контроля
                        this._data['executors'] = !(Task['Executor'][0].$['Include'] === 'None'); // Исполнители резолюции
                        this._data['kindExecutorConsideration'] = Task['Executor'][0].$['Include'] === 'All' ? 0 : 1; // kindExecutorConsideration
                        this._data['NotificationConfigReport'] = Notification['Report'][0].$['Include'] === 'true'; // NotificationConfigReport Доклад об исполнении поручений
                        this._data['executorFile'] = Task['Executor'][0]['File'][0].$['Include'] === 'true';
                        const ext1 = Task['Executor'][0]['FileOptions'][0].$['Extensions'];
                        this._data['fileExtensions'] = ext1 && ext1 !== 'null' ? ext1 : '';
                        const maxLength = Task['Executor'][0]['FileOptions'][0].$['MaxLength'];
                        this._data['fileMaxLength'] = maxLength && maxLength !== 'null' ? maxLength : '';
                        this._data['redirection'] = Notification['Redirection'][0].$['Include'] === 'true'; // Доклад об отправке документов
                        this._data['answer'] = Notification['Answer'][0].$['Include'] === 'true'; // Доклад об отправке документа ответа
                        this._data['address'] = Contakt['Address'][0].$['Include'] === 'true'; // Адрес субъекта документа
                        this._data['region'] = Contakt['Address'][0]['Region'][0].$['Include'] === 'true'; // Регион субьекта документа
                        this._data['stopDayCount'] = Notification.$['StopDayCount'];
                        this._data['reception'] = Notification['Reception'][0].$['Include'] === 'true'; // уведомление о приёме
                        this._data['registration'] = Notification['Registration'][0].$['Include'] === 'true'; // Доклад о регистрации
                        this._data['forwardingDocs'] = Notification['Forwarding'][0].$['Include'] !== 'None'; // forwardingDocs Доклад о направлениях документа
                        const kindForwardingDocs = Notification['Forwarding'][0].$['Include'] === 'First' ? 1 : 0;
                        this._data['kindForwardingDocs'] = kindForwardingDocs;

                        this._data['editSet'] = Notification['NotificationUpdateOptions'][0].$['Update'] === 'true';
                        this._data['calcDate'] = Notification['NotificationUpdateOptions'][0].$['StopDayCalc'] === 'true';

                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseReceptionDocludDocument(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        const mess = err.message ? err.message : 'ошибка в файле Вид правила';
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: mess };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const ReceiveReportRule = result['ReceiveReportRule'];
                    if (!ReceiveReportRule) {
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: `Для правила ${data.CLASSIF_NAME}, установлен не верный вид правила, пересохраните документ.` };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    this._data = {};
                    const ScriptConfig = ReceiveReportRule['ScriptConfig'][0];
                    try {
                        this._data['type'] = 1;
                        this._data['kind'] = 4;
                        this._data['OrganizationFolderInput'] = ScriptConfig['Contact'][0]['OrganizationFolder'][0];
                        this._data['reportExecution'] = ScriptConfig['Task'][0].$['MarkExecutor'] === 'true'; // Отчёт об исполнении в поручение
                        this._data['address'] = ScriptConfig['Contact'][0]['Address'][0].$['Use'] !== 'DoNotUse';
                        const adrReplace = ScriptConfig['Contact'][0]['Address'][0].$['Use'] === 'IfEmpty' ? 2 : 1;
                        this._data['adrReplace'] = adrReplace;
                        this._data['region'] = ScriptConfig['Contact'][0]['Address'][0]['Region'][0].$['Use'] === 'true';
                        this._data['executorFile'] = ScriptConfig['Task'][0]['ExecutorFile'][0].$['Use'] === 'true';
                        this._data['regNumber'] = ScriptConfig['Registration'][0].$['MarkAddresse'] === 'true';
                        // regNumber Рег.№ в 'Адресат'
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parsesendProjectRule(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        const mess = err.message ? err.message : 'ошибка в файле Вид правила';
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: mess };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const sendProjectRule = result['SendProjectRule'];
                    if (!sendProjectRule) {
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: `Для правила ${data.CLASSIF_NAME}, установлен не верный вид правила, пересохраните документ.` };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    try {
                        this._data = {};
                        this._data['type'] = kindRule >= 5 ? 2 : 1;
                        this._data['kind'] = kindRule >= 5 ? kindRule - 4 : kindRule;
                        const document = sendProjectRule['ScriptConfig'];
                        this._data['LinkPD'] = !!(document[0]['Project'][0]['Link'][0].$.Include !== 'None');
                        this._data['linkKind'] = !this._data['LinkPD'] ? 0 : document[0]['Project'][0]['Link'][0].$.Include === 'All' ? 0 : 1;
                        this._data['linkTypeList'] = document[0]['Project'][0]['Link'][0].$.LinkTypeList;
                        this._data['access'] = document[0]['Project'][0]['Access'][0].$.Include === 'true';
                        this._data['rubric'] = document[0]['Project'][0]['Rubric'][0].$.Include === 'true';

                        this._data['address'] = document[0]['Contact'][0]['Address'][0].$.Include === 'true';
                        this._data['region'] = document[0]['Contact'][0]['Address'][0]['Region'][0].$.Include === 'true';


                        this._data['addressee'] = document[0]['Project'][0]['Addressee'][0].$.Include === 'true';
                        this._data['additionalField'] = document[0]['Project'][0]['AdditionalField'][0].$.Include === 'true';


                        this._data['executorsProject'] = !!(document[0]['Project'][0]['Executor'][0].$.Include !== 'None');
                        this._data['kindExecutorProject'] = !this._data['executorsProject'] ? 0 : document[0]['Project'][0]['Executor'][0].$.Include === 'All' ? 0 : 1;


                        this._data['dateExecutionProject'] = !!(document[0]['Project'][0]['Term'][0].$.Include !== 'None');
                        this._data['kindDateExecutionProject'] = document[0]['Project'][0]['Term'][0].$.Include === 'Plan' ? 0 : 1;

                        const ext = document[0]['Project'][0]['FileOptions'][0].$.Extensions;
                        this._data['taskFileExtensions'] = ext && ext !== 'null' ? ext : '';
                        const maxLength = document[0]['Project'][0]['FileOptions'][0].$.MaxLength;
                        this._data['taskFileMaxLength'] = maxLength && maxLength !== 'null' ? maxLength : '';

                        this._data['FileRKPD'] = !!(document[0]['Project'][0]['File'][0].$.Include !== 'None');
                        this._data['fileAccessListRk'] = document[0]['Project'][0]['FileOptions'][0].$.AccessList;
                        this._data['visa'] = !!(document[0]['Project'][0]['Visa'][0].$.Include !== 'None');
                        const visaKind = { 'Addressee': 2, 'Primary': 1, 'All': 0, 'None': 0 };
                        this._data['VisaKind'] = visaKind[document[0]['Project'][0]['Visa'][0].$.Include];
                        this._data['VisaInfo'] = !!(document[0]['Project'][0]['Visa'][0].Content[0].$.Include === 'true');
                        this._data['VisaFile'] = !!(document[0]['Project'][0]['Visa'][0].Content[0].File[0].$.Include === 'true');

                        this._data['signatures'] = !!(document[0]['Project'][0]['Sign'][0].$.Include !== 'None');
                        this._data['signaturesKind'] = !this._data['signatures'] ? 0 : document[0]['Project'][0]['Sign'][0].$.Include === 'All' ? 0 : 1;
                        this._data['signaturesInfo'] = !!(document[0]['Project'][0]['Sign'][0].Content[0].$.Include === 'true');
                        this._data['signaturesFile'] = !!(document[0]['Project'][0]['Sign'][0].Content[0].File[0].$.Include === 'true');
                        const document2 = sendProjectRule['Subscriptions'];
                        this._data['reception'] = !!(document2[0]['Reception'][0].$.Include === 'true');
                        this._data['registrationProject'] = !!(document2[0]['Registration'][0].$.Include === 'true');
                        this._data['forwardingVisa'] = !!(document2[0]['VisaDirection'][0].$.Include === 'true');
                        this._data['forwardingSign'] = !!(document2[0]['SignDirection'][0].$.Include === 'true');
                        this._data['reportVisa'] = !!(document2[0]['VisaInformation'][0].$.Include === 'true');
                        this._data['reportSign'] = !!(document2[0]['SignInformation'][0].$.Include === 'true');
                        this._data['progectRegistration'] = !!(document2[0]['ProjectRegistrationSubscription'][0].$.Include === 'true');
                        this._data['stopDayCount'] = isNaN(document2[0].$.StopDayCount) ? 1 : document2[0].$.StopDayCount;
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseReseiveProjectRule(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        let filterconfig;
        let filter = '';
        if (data['FILTER_CONFIG']) {
            parseString(data['FILTER_CONFIG'], (err, result) => {
                filterconfig = result;
                filterconfig['FilterConfig']['DocType'].forEach(elem => {
                    filter += elem['Etalon'] + '|';
                });
            });
        }
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const ReceiveProjectRule = result['ReceiveProjectRule'];
                    if (!ReceiveProjectRule) {
                        const e = { message: 'отсутствует ReceiveProjectRule' };
                        return reject(e);
                    }
                    const Contact = ReceiveProjectRule['ScriptConfig'][0]['Contact'][0];
                    const Project = ReceiveProjectRule['ScriptConfig'][0]['Project'][0];
                    const RegistrationParams = ReceiveProjectRule['ScriptConfig'][0]['RegistrationParams'][0];
                    this._data = {};
                    try {
                        this._data['type'] = 2;
                        this._data['kind'] = 2;
                        this._data['groupDocument'] = filter;
                        this._data['executor'] = RegistrationParams['ExecutorListID'][0]; // Исполнитель executor
                        this._data['executiveInput'] = RegistrationParams['RepresentativePerson'][0]; // executive ДЛ за текущую организацию
                        // организации создавать OrganizationFolderInput
                        this._data['DUE_DEP'] = data['DUE_DEP'];
                        this._data['departmentReceive'] = data['DUE_DEP'] && data['DUE_DEP'] !== '0.' ? 2 : 1;
                        this._data['linkTypeList'] = Project['Link'][0].$.LinkTypeList;
                        this._data['OrganizationFolderInput'] = Contact['OrganizationFolder'][0];
                        this._data['LinkPD'] = Project['Link'][0].$['Use'] !== 'None'; // Связки РКПД LinkPD
                        this._data['linkKind'] = Project['Link'][0].$['Use'] === 'List' ? 1 : 0; // linkTypeListInput Связки с типом
                        this._data['access'] = Project['Access'][0].$['Use'] === 'true'; // access Гриф доступа
                        this._data['rubric'] = Project['Rubric'][0].$['Use'] === 'true'; // Рубрики rubric
                        this._data['address'] = Contact['Address'][0].$['Use'] !== 'DoNotUse'; // Адрес субьекта address
                        this._data['adrReplace'] = Contact['Address'][0].$['Use'] === 'IfEmpty' ? 2 : 1; // переключашка после адреса adrReplace
                        this._data['region'] = Contact['Address'][0]['Region'][0].$['Use'] === 'true'; // регионы субьекта region
                        this._data['addressee'] = Project['Addressee'][0].$['Use'] === 'true'; // адресаты
                        this._data['additionalField'] = Project['AdditionalField'][0].$['Use'] === 'true'; // AdditionalField доп реквиз
                        this._data['executorsProject'] = Project['Executor'][0].$['Use'] !== 'None';
                        this._data['kindExecutorProject'] = Project['Executor'][0].$['Use'] === 'First' ? 1 : 0; // переключашка kindExecutorProject
                        this._data['FileRKPD'] = Project['File'][0].$['Use'] === 'true'; // FileRKPD Файлы РКПД
                        // для визы
                        this._data['visa'] = Project['Visa'][0].$['Use'] !== 'None'; // visa Визы
                        this._data['VisaKindTake'] = Project['Visa'][0].$['Use'] === 'Extraction' ? 1 : 0;
                        this._data['VisaInfo'] = Project['Visa'][0]['Content'][0].$['Use'] === 'true'; // информация о визе VisaInfo
                        this._data['VisaFile'] = Project['Visa'][0]['Content'][0]['File'][0].$['Use'] === 'true'; // файл визы VisaFile
                        this._data['visaForward'] = Project['Visa'][0]['SendOptions'][0].$['Send'] === 'true'; // направить на визирование visaForward
                        this._data['visaDays'] = Project['Visa'][0]['SendOptions'][0].$['TermFlag'] === '1'; // чекбокс за визой visaDays
                        this._data['visaDate'] = Project['Visa'][0]['SendOptions'][0].$['Term']; // срок визы visaDate
                        // Подписи signatures
                        this._data['signatures'] = Project['Sign'][0].$['Use'] !== 'None'; // visa Визы
                        this._data['signatureKindTake'] = Project['Sign'][0].$['Use'] === 'Extraction' ? 1 : 0;
                        this._data['signaturesInfo'] = Project['Sign'][0]['Content'][0].$['Use'] === 'true'; // информация о визе VisaInfo
                        this._data['signaturesFile'] = Project['Sign'][0]['Content'][0]['File'][0].$['Use'] === 'true'; // файл визы VisaFile
                        this._data['signatureForward'] = Project['Sign'][0]['SendOptions'][0].$['Send'] === 'true'; // направить на визирование visaForward
                        this._data['signatureDays'] = Project['Sign'][0]['SendOptions'][0].$['TermFlag'] === '1'; // чекбокс за визой visaDays
                        this._data['signatureDate'] = Project['Sign'][0]['SendOptions'][0].$['Term']; // срок визы visaDate
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseReseiveDoclad(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        const mess = err.message ? err.message : 'ошибка в файле Вид правила';
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: mess };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const SendProjectReportRule = result['SendProjectReportRule'];
                    if (!SendProjectReportRule) {
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: `Для правила ${data.CLASSIF_NAME}, установлен не верный вид правила, пересохраните документ.` };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const ScriptConfig =  SendProjectReportRule['ScriptConfig'][0];
                    const NotificationConfig = SendProjectReportRule['NotificationConfig'][0];
                    try {
                        this._data = {};
                        this._data['type'] = 2;
                        this._data['kind'] = 3;
                        this._data['reception'] = NotificationConfig['Reception'][0].$['Include'] === 'true'; // Уведомление о приёме reception
                        this._data['registrationProject'] = NotificationConfig['Registration'][0].$['Include'] === 'true'; // доклад о регистрации registrationProject
                        this._data['forwardingVisa'] = NotificationConfig['VisaDirection'][0].$['Include'] !== 'None'; // forwardingVisa Доклад о направлении документа на визирование
                        this._data['forwardingVisaKind'] = NotificationConfig['VisaDirection'][0].$['Include'] === 'Sent' ? 1 : 0; // кнопки после forwardingVisaKind
                        this._data['forwardingSign'] = NotificationConfig['SignDirection'][0].$['Include'] !== 'None'; //  Доклад о направлении документа на подписание
                        this._data['forwardingSignKind'] = NotificationConfig['SignDirection'][0].$['Include'] === 'Sent' ? 1 : 0; // кнопочки после reportVisa
                        this._data['reportVisa'] = NotificationConfig['Visa'][0].$['Include'] !== 'None'; //  Доклад о направлении документа на подписание
                        this._data['reportVisaKind'] = NotificationConfig['Visa'][0].$['Include'] === 'Sent' ? 1 : 0; // кнопочки после reportVisa
                        this._data['VisaFile'] = NotificationConfig['Visa'][0]['File'][0].$['Include'] === 'true';
                        this._data['reportSign'] = NotificationConfig['Sign'][0].$['Include'] !== 'None'; //  Доклад о направлении документа на подписание
                        this._data['reportSignKind'] = NotificationConfig['Sign'][0].$['Include'] === 'Sent' ? 1 : 0; // кнопочки после reportVisa
                        this._data['signaturesFile'] = NotificationConfig['Sign'][0]['File'][0].$['Include'] === 'true';
                        this._data['progectRegistration'] = NotificationConfig['ProjectRegistration'][0].$['Include'] === 'true'; //
                        this._data['fileDocument'] = NotificationConfig['ProjectRegistration'][0]['File'][0].$['Include'] === 'true'; //

                        this._data['address'] = ScriptConfig['Contact'][0]['Address'][0].$['Include'] === 'true'; //
                        this._data['region'] = ScriptConfig['Contact'][0]['Address'][0]['Region'][0].$['Include'] === 'true'; //
                        this._data['stopDayCount'] = NotificationConfig.$['StopDayCount'];

                        this._data['fileExtensions'] = NotificationConfig['FileOptions'][0].$['Extensions']; //
                        this._data['fileMaxLength'] = NotificationConfig['FileOptions'][0].$['MaxLength'];
                        // Доклад о визировании reportVisa
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    parseTakeDoclad(scriptConfig, kindRule, data: SEV_RULE) {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        const mess = err.message ? err.message : 'ошибка в файле Вид правила';
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: mess };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const ReceiveProjectReportRule = result['ReceiveProjectReportRule'];
                    if (!ReceiveProjectReportRule) {
                        const e: IMessage = { title: 'Предупреждение', type: 'warning', msg: `Для правила ${data.CLASSIF_NAME}, установлен не верный вид правила, пересохраните документ.` };
                        this._msgSrv.addNewMessage(e);
                        return resolve({});
                    }
                    const ScriptConfig =  ReceiveProjectReportRule['ScriptConfig'][0];
                    try {
                        this._data = {};
                        this._data['type'] = 2;
                        this._data['kind'] = 4;
                        this._data['executorsProject'] = ScriptConfig['Executor'][0].$['Use'] !== 'None';
                        this._data['kindExecutorProject'] = ScriptConfig['Executor'][0].$['Use'] === 'First' ? 1 : 0;
                        this._data['infoVisaign'] = ScriptConfig['VisaSign'][0].$['Use'] === 'true';
                        this._data['fileVisaign'] = ScriptConfig['VisaSign'][0]['File'][0].$['Use'] === 'true';
                        this._data['correctingVisaign'] = ScriptConfig['VisaSignPersonUpdate'][0].$['Use'] === 'true';
                    } catch (e) {
                        console.dir(e);
                        const error: IMessage = { title: 'Ошибка', type: 'danger', msg: `Не верный формат документа: ${data.CLASSIF_NAME}` };
                        this._msgSrv.addNewMessage(error);
                        return resolve({});
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve) => {
            resolve();
        });
    }
    get data() {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

    private sendDocumentRule(): string {
        const linkInclude = this._data['link'] ? ((this._data['linkKind'] === 0) ? 'All' : 'List') : 'None';
        const addresseeInclude = this._data['addressee'] ? ((this._data['addresseeKind'] === 0) ? 'All' : 'EDMS') : 'None';
        const itemInculde = !this._data['item'] ? 'None' : this._data['itemKind'] === 1 ? 'All' : 'Extraction';
        const resolutionKind = this._data['resolutionKind'];
        const resolutionKindText = ((resolutionKind === 1) ? 'All' : ((resolutionKind === 2) ? 'ExtractionWithParent' : 'Extraction'));
        const resolutionInclude = this._data['resolution'] ? resolutionKindText : 'None';
        const linkTypeList = linkInclude === 'List' ? this.data['linkTypeList'] : ''; // TODO список link_cl.isn_lclassif через символ |
        return `<?xml version="1.0"?>
        <SendDocumentRule>
            <ScriptConfig>
                <Contact>
                    <Address Include="${Boolean(this._data['address'])}">
                        <Region Include="${Boolean(this._data['region'])}"/>
                    </Address>
                </Contact>
                <Document UserGrantedOnly="${Boolean(this._data['userGrantedOnly'])}">
                    <Link Include="${linkInclude}" LinkTypeList="${linkTypeList}"/>
                    <Access Include="${Boolean(this._data['access'])}"/>
                    <Rubric Include="${Boolean(this._data['rubric'])}"/>
                    <Visa Include="${Boolean(this._data['visa'])}"/>
                    <Addressee Include="${addresseeInclude}"/>
                    <AdditionalField Include="${Boolean(this._data['additionalField'])}"/>
                    <File Include="${Boolean(this._data['file'])}" Extensions="${this._data['fileExtensions']}"
                        AccessList="${this._data['fileAccessList']}" MaxLength="${this._data['fileMaxLength']}"/>
                    <Item Include="${itemInculde}"/>
                    <Resolution Include="${resolutionInclude}"/>
                </Document>
                <Task>
                    <Text Include="true"/>
                    <Category Include="${Boolean(this._data['taskCategory'])}"/>
                    <Note Include="${Boolean(this._data['taskNote'])}"/>
                    <ControlState Include="true"/>
                    <PlanDate Include="true"/>
                    <Controller Include="${Boolean(this._data['taskController'])}"/>
                    <Summary Include="true"/>
                    <FactDate Include="true"/>
                    <Status Include="true"/>
                    <Resume Include="true"/>
                    <Executor Include="All">
                        <Report Include="true"/>
                    </Executor>
                    <File Include="${Boolean(this._data['taskFile'])}"/>
                    <FileOptions Extensions="${this._data['taskFileExtensions']}" MaxLength="${this._data['taskFileMaxLength']}"/>
                </Task>
            </ScriptConfig>
            <Subscriptions StopDayCount="${this._data['stopDayCount']}">
                <Reception Include="${(!!this._data['reception']).toString()}"/>
                <Registration Include="${(!!this._data['registration']).toString()}"/>
                <Forwarding Include="${(!!this._data['forwarding']).toString()}"/>
                <Consideration Include="${(!!this._data['consideration']).toString()}"/>
                <Report Include="${(!!this._data['report']).toString()}"/>
                <Redirection Include="${(!!this._data['redirection']).toString()}"/>
                <Answer Include="${(!!this._data['answer']).toString()}"/>
            </Subscriptions>
        </SendDocumentRule>`;
    }

    private receiveDocumentRule(): string {
        const link = !this._data['link'] ? 'None' : this._data['linkKind'] === 1 ? 'List' : 'All'; // TODO All(Все)|List(Определенного типа)|None(Не посылать)
        const linkTypeList = this._data['linkTypeList']; // TODO список link_cl.isn_lclassif через символ |
        const task = !this._data['orders'] ? 'None' : this._data['ordersKind'] === 1 ? 'Own' : 'All'; // TODO All(Все)|Own(Только свои)
        const correspondent = 'Author'; // TODO Use: Sender(Из отправителя)|Author(Из автора документа)
        const Address = !this._data['address'] ? 'DoNotUse' : this._data['adrReplace'] === 2 ? 'IfEmpty' : 'Always';
        return `<?xml version="1.0"?>
        <ReceiveDocumentRule>
            <ScriptConfig>
                <!-- Субъект документа -->
                <Contact>
                    <!-- Вершина в которой будут добавляться новые организации -->
                    <OrganizationFolder>${this._data['OrganizationFolderInput'] || ''}</OrganizationFolder>
                    <!--Адрес субъекта документа.
                    Заполнять адрес субъекта. Use: IfEmpty(Если поля пустые)|Always(Всегда)|DoNotUse(Не заполнять) -->
                    <Address Use="${Address}">
                        <!--Регион субъекта документа.					Загружать. Use: true|false -->
                        <Region Use="${Boolean(this._data['region'])}"/>
                    </Address>
                </Contact>
                <!-- Документ -->
                <Document>
                    <!-- Гриф доступа.				Загружать. Use: true|false -->
                    <Access Use="${Boolean(this._data['access'])}"/>
                    <!-- Рубрики.				Загружать. Use: true|false -->
                    <Rubric Use="${Boolean(this._data['rubric'])}"/>
                    <!-- Допреквизиты.				Загружать. Use: true|false -->
                    <AdditionalField Use="${Boolean(this._data['additionalField'])}"/>
                    <!-- Файлы РК.				Загружать. Use: true|false
                    Расширения файлов. Extensions: список расширений через символ ,
                    Грифы доступа. AccessList: список security_cl.securlevel через символ |
                    Максимальная величина файлов. MaxLength: число -->
                    <File Use="${Boolean(this._data['takeFileRK'])}" AccessList="${this._data['fileAccessList'] || ''}"/>
                    <!--Связанные РК:				Загружать. Use: None(Не загружать)|All(Все)|List
                    Типы связок. LinkTypeList: список link_cl.isn_lclassif через символ | -->
                    <Link Use="${link}" LinkTypeList="${linkTypeList}"/>
                    <!-- Поручения.				Загружать. Use: All(Все)|Own(Только свои) -->
                    <Task Use="${task}"/>
                    <!-- Корреспондент.				Загружать. Use: Sender(Из отправителя)|Author(Из автора документа) -->
                    <Correspondent Use="${correspondent}"/>
                </Document>
                <!-- Поручения -->
                <Task>
                    <!-- Категория.				Загружать. Use: true|false -->
                    <Category Use="${Boolean(this._data['taskCategory'])}"/>
                    <!-- Примечания.				Загружать. Use: true|false -->
                    <Note Use="${Boolean(this._data['noteOrders'])}"/>
                    <File Use="${Boolean(this._data['takeFileOrders'])}"/>
                </Task>
                <!-- Параметры регистрации -->
                <RegistrationParams>
                    <!-- Картотека в которой будут регистрироваться новые РК -->
                    <Card>${this._data['cardFile'] || ''}</Card>
                    <!-- Кабинет в котором будут регистрироваться новые РК -->
                    <Cabinet>${this._data['cabinetFile'] || ''}</Cabinet>
                </RegistrationParams>
                <SendToManualQueue>${Boolean(this._data['handRegistration'])}</SendToManualQueue>
                <UpdateParams>
                    <File Use="${Boolean(this._data['FileRK'])}"/><Task Use="${Boolean(this._data['takeOrdersRK'])}"/>
                </UpdateParams>
            </ScriptConfig>
        </ReceiveDocumentRule>`;
    }
    private considerationInclude(): string {
        if (!this._data['consideration']) {
            return 'None';
        } else {
            const  kindConsideration = this._data['kindConsideration'];
            if (kindConsideration === 0) {
                return 'All';
            } else if (kindConsideration === 1) {
                return 'First';
            } else {
                return 'Last';
            }
        }
    }
    private sendReportRule(): string {
        const kindForwardingDocs = !this._data['forwardingDocs'] ? 'None' : this._data['kindForwardingDocs'] === 1 ? 'First' : 'All';
        const update = this._data['editSet'] ? 'true' : 'None';
        const updateCalc = this._data['calcDate'] ? 'true' : 'None';
        return `<?xml version="1.0"?>
        <SendReportRule>
            <ScriptConfig>
                <!-- Субъект документа -->
                <Contact>
                    <!--Адрес субъекта документа.				Включать в паспорт. Include: true|false -->
                    <Address Include="${Boolean(this._data['address'])}">
                        <!--Регион субъекта документа.					Включать в паспорт. Include: true|false -->
                        <Region Include="${Boolean(this._data['region'])}"/>
                    </Address>
                </Contact>
                <!-- Поручения. -->
                <Task>
                    <!-- Текст				Включать в паспорт. Include: true|false -->
                    <Text Include="${Boolean(this._data['textConsideration'])}"/>
                    <!-- Категория поручения.				Включать в паспорт. Include: true|false -->
                    <Category Include="${Boolean(this._data['categoryConsideration'])}"/>
                    <!-- Примечание.				Включать в паспорт. Include: true|false -->
                    <Note Include="${Boolean(this._data['noteConsideration'])}"/>
                    <!-- Контрольность резолюции				Включать в паспорт. Include: true|false -->
                    <ControlState Include="${Boolean(this._data['controlConsideration'])}"/>
                    <!-- План. дата				Включать в паспорт. Include: true|false -->
                    <PlanDate Include="${Boolean(this._data['planConsideration'])}"/>
                    <!-- Контролер поручения.				Включать в паспорт. Include: true|false -->
                    <Controller Include="${Boolean(this._data['controllerMission'])}"/>
                    <!-- Ход исполнения				Включать в паспорт. Include: true|false -->
                    <Summary Include="${Boolean(this._data['Summary'])}"/>
                    <!-- Дата снятия с контроля				Включать в паспорт. Include: true|false -->
                    <FactDate Include="${Boolean(this._data['FactDate'])}"/>
                    <!-- Состояние исполнения				Включать в паспорт. Include: true|false -->
                    <Status Include="${Boolean(this._data['Status'])}"/>
                    <!-- Основание для снятия с контроля				Включать в паспорт. Include: true|false -->
                    <Resume Include="${Boolean(this._data['Resume'])}"/>
                    <!-- Исполнители резолюции				Включать в паспорт. Include: All(Все)|Responsible(Ответственные)|None(Не включать) -->
                    <Executor Include="${'' + this._data['executors']}">
                        <!-- Отчеты исполнителей					Включать в паспорт. Include: true|false -->
                        <Report Include="${Boolean(this._data['NotificationConfigReport'])}"/>
                        <!-- Файлы отчетов исполнителей					Включать в паспорт. Include: true|false -->
                        <File Include="${Boolean(this._data['executorFile'])}"/>
                        <FileOptions Extensions="${'' + this._data['fileExtensions']}" MaxLength="${this._data['fileMaxLength'] || ''}"/>
                    </Executor>
                    <!-- ЭП поручения				Включать в паспорт. Include: true|false -->
                    <Eds Include="${'undefined'}"/>
                </Task>
            </ScriptConfig>
            <!-- Состав докладов. -->
            <NotificationConfig StopDayCount="${this._data['stopDayCount'] || ''}">
                <!-- Уведомление о приеме.			Включить в доклад. Include: true|false -->
                <Reception Include="${Boolean(this._data['reception'])}"/>
                <!-- Уведомление о регистрации.			Включить в доклад. Include: true|false -->
                <Registration Include="${Boolean(this._data['registration'])}"/>
                <!-- Уведомление о направлении документа.			Включить в доклад. Include: All(Все)|None(Не включать)|First(Первые) -->
                <Forwarding Include="${kindForwardingDocs}"/>
                <!--Уведомление о работе с документом
                Включить в доклад. Include: None(Не включать)|First(Первые)|All(Все)|Last(Последние) -->
                <Consideration Include="${this.considerationInclude()}"/>
                <!--Уведомление об отчете исполнения.			Включить в доклад. Include: true|false -->
                <Report Include="${Boolean(this._data['NotificationConfigReport'])}"/>
                <!--Уведомление о перенаправлении документа.			Включить в доклад. Include: true|false -->
                <Redirection Include="${Boolean(this._data['redirection'])}"/>
                <!--Уведомление об отправке документа-ответа.			Включить в доклад. Include: true|false -->
                <Answer Include="${Boolean(this._data['answer'])}"/>
                <NotificationUpdateOptions Update="${update}" StopDayCalc="${updateCalc}"/>
            </NotificationConfig>
        </SendReportRule>`;
    }

    private receiveReportRule(): string {
        const addresUse = !this._data['address'] ? 'DoNotUse' : this._data['adrReplace'] === 1 ? 'Always' : 'IfEmpty';

        return `<?xml version="1.0"?>
        <ReceiveReportRule>
            <ScriptConfig>
                <Contact>
                    <Address Use="${addresUse}">
                        <Region Use="${Boolean(this._data['region'])}"/>
                    </Address>
                    <OrganizationFolder>${this._data['OrganizationFolderInput'] || ''}</OrganizationFolder>
                </Contact>
                <Registration MarkAddresse="${Boolean(this._data['regNumber'])}"/>
                <Task MarkExecutor="${Boolean(this._data['reportExecution'])}"><ExecutorFile Use="${Boolean(this._data['executorFile'])}"/></Task>
            </ScriptConfig>
        </ReceiveReportRule>`;
    }

    private sendProjectRule(): string {
        const linkRk = !this._data['LinkPD'] ? 'None' : this._data['linkKind'] === 0 ? 'All' : 'List';
        const executor = !this._data['executorsProject'] ? 'None' : this._data['kindExecutorProject'] === 0 ? 'All' : 'First';
        const dateExecutionProject = !this._data['dateExecutionProject'] ? 'None' : this._data['kindDateExecutionProject'] === 0 ? 'Plan' : 'Direction';
        const visa = !this._data['visa'] ? 'None' : this._data['VisaKind'] === 0 ? 'All' : this._data['VisaKind'] === 1 ? 'Primary' : 'Addressee';
        const signatures = !this._data['signatures'] ? 'None' : this._data['signaturesKind'] === 0 ? 'All' : 'Addressee';
        const linkTypeList = linkRk === 'List' ? this.data['linkTypeList'] : '';
        const eccessList = this._data['fileAccessListRk'] ? this._data['fileAccessListRk'] : '';
        const taskFileExt = this._data['taskFileExtensions'] !== 'null' ? this._data['taskFileExtensions'] : '';
        return `<?xml version="1.0"?>
        <SendProjectRule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <ScriptConfig>
                <Contact>
                    <Address Include="${Boolean(this._data['address'])}"><Region Include="${Boolean(this._data['region'])}"/></Address>
                </Contact>
                <Project>
                    <Link Include="${linkRk}" LinkTypeList="${linkTypeList}"/>
                    <Access Include="${Boolean(this._data['access'])}"/>
                    <Rubric Include="${Boolean(this._data['rubric'])}"/>
                    <Addressee Include="${Boolean(this._data['addressee'])}"/>
                    <AdditionalField Include="${Boolean(this._data['additionalField'])}"/>
                    <Executor Include="${executor}"/>
                    <Term Include="${dateExecutionProject}"/>
                    <FileOptions Extensions="${taskFileExt}" AccessList="${eccessList}" MaxLength="${this._data['taskFileMaxLength']}"/>
                    <File Include="${Boolean(this._data['FileRKPD'])}"/>
                    <Visa Include="${visa}">
                        <Content Include="${Boolean(this._data['VisaInfo'])}"><File Include="${Boolean(this._data['VisaFile'])}"/></Content>
                    </Visa>
                    <Sign Include="${signatures}">
                        <Content Include="${Boolean(this._data['signaturesInfo'])}"><File Include="${Boolean(this._data['signaturesFile'])}"/></Content>
                    </Sign>
                </Project>
            </ScriptConfig>
            <Subscriptions StopDayCount="${this._data['stopDayCount']}">
                <Reception Include="${Boolean(this._data['reception'])}"/>
                <Registration Include="${Boolean(this._data['registrationProject'])}"/>
                <VisaDirection Include="${Boolean(this._data['forwardingVisa'])}"/>
                <SignDirection Include="${Boolean(this._data['forwardingSign'])}"/>
                <VisaInformation Include="${Boolean(this._data['reportVisa'])}"/>
                <SignInformation Include="${Boolean(this._data['reportSign'])}"/>
                <ProjectRegistrationSubscription Include="${Boolean(this._data['progectRegistration'])}"/>
            </Subscriptions>
        </SendProjectRule>`;
    }

    private receiveProjectRule(): string {
        const Link = !this._data['LinkPD'] ? 'None' : this._data['linkKind'] === 1 ? 'List' : 'All'; // Связки РКПД LinkPD
        const Executor = !this._data['executorsProject'] ? 'None' : this._data['kindExecutorProject'] === 1 ? 'First' : 'All';
        const Visa = !this._data['visa'] ? 'None' : this._data['VisaKindTake'] === 1 ? 'Extraction' : 'All';
        const Sign = !this._data['signatures'] ? 'None' : this._data['signatureKindTake'] === 1 ? 'Extraction' : 'All';
        return `<?xml version="1.0"?>
        <ReceiveProjectRule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <ScriptConfig>
                <Contact>
                    <Address Use="${Boolean(this._data['address'])}"><Region Use="${Boolean(this._data['region'])}"/></Address>
                    <OrganizationFolder>${this._data['OrganizationFolderInput'] || ''}</OrganizationFolder>
                </Contact>
                <Project>
                    <Link Use="${Link}" LinkTypeList="${this._data['linkTypeList'] || ''}"/>
                    <Access Use="${Boolean(this._data['access'])}"/>
                    <Rubric Use="${Boolean(this._data['rubric'])}"/>
                    <Addressee Use="${Boolean(this._data['addressee'])}"/>
                    <AdditionalField Use="${Boolean(this._data['additionalField'])}"/>
                    <Executor Use="${Executor}"/>
                    <File Use="${Boolean(this._data['FileRKPD'])}"/>
                    <Visa Use="${Visa}">
                        <Content Use="${Boolean(this._data['VisaInfo'])}"><File Use="${Boolean(this._data['VisaFile'])}"/></Content>
                        <SendOptions Send="${Boolean(this._data['visaForward'])}" TermFlag="${this._data['visaDays'] || ''}" Term="${this._data['visaDate'] || ''}"/>
                    </Visa>
                    <Sign Use="${Sign}">
                        <Content Use="${Boolean(this._data['signaturesInfo'])}"><File Use="${Boolean(this._data['signaturesFile'])}"/></Content>
                        <SendOptions Send="${Boolean(this._data['signatureForward'])}" TermFlag="${this._data['signatureDays'] || ''}" Term="${this._data['signatureDate'] || ''}"/>
                    </Sign>
                </Project>
                <RegistrationParams>
                    <ExecutorListID>${this._data['executor'] || ''}</ExecutorListID>
                    <RepresentativePerson>${this._data['executiveInput'] || ''}</RepresentativePerson>
                </RegistrationParams>
            </ScriptConfig>
        </ReceiveProjectRule>`;
    }

    private sendProjectReportRule(): string {
        const VisaDirection = !this._data['forwardingVisa'] ? 'None' : this._data['forwardingVisaKind'] === 1 ? 'Sent' : 'All';
        const SignDirection = !this._data['forwardingSign'] ? 'None' : this._data['forwardingSignKind'] === 1 ? 'Sent' : 'All';
        const Visa = !this._data['reportVisa'] ? 'None' : this._data['reportVisaKind'] === 1 ? 'Sent' : 'All';
        const Sign = !this._data['reportSign'] ? 'None' : this._data['reportSignKind'] === 1 ? 'Sent' : 'All';
        return `<?xml version="1.0"?>
        <SendProjectReportRule>
            <ScriptConfig>
                <Contact>
                    <Address Include="${Boolean(this._data['address'])}"><Region Include="${Boolean(this._data['region'])}"/></Address>
                </Contact>
            </ScriptConfig>
            <NotificationConfig StopDayCount="${this._data['stopDayCount'] || ''}">
                <Reception Include="${Boolean(this._data['reception'])}"/>
                <Registration Include="${Boolean(this._data['registrationProject'])}"/>
                <VisaDirection Include="${VisaDirection}"/>
                <SignDirection Include="${SignDirection}"/>
                <Visa Include="${Visa}"><File Include="${Boolean(this._data['VisaFile'])}"/></Visa>
                <Sign Include="${Sign}"><File Include="${Boolean(this._data['signaturesFile'])}"/></Sign>
                <FileOptions Extensions="${this._data['fileExtensions'] || ''}" MaxLength="${this._data['fileMaxLength'] || ''}"/>
                <ProjectRegistration Include="${Boolean(this._data['progectRegistration'])}"><File Include="${Boolean(this._data['fileDocument'])}"/></ProjectRegistration>
                </NotificationConfig>
        </SendProjectReportRule>`;
    }

    private receiveProjectReportRule(): string {
        const Executor = !this._data['executorsProject'] ? 'None' : this._data['kindExecutorProject'] === 1 ? 'First' : 'All';
        return `<?xml version="1.0"?>
        <ReceiveProjectReportRule>
            <ScriptConfig>
                <Executor Use="${Executor}"/>
                <VisaSign Use="${Boolean(this._data['infoVisaign'])}">
                    <File Use="${Boolean(this._data['fileVisaign'])}"/>
                </VisaSign>
                <VisaSignPersonUpdate Use="${Boolean(this._data['correctingVisaign'])}"/>
            </ScriptConfig>
        </ReceiveProjectReportRule>`;
    }
}
