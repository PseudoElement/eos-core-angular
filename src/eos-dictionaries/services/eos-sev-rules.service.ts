import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';

@Injectable()
export class EosSevRulesService {
    private _scriptConfig: string;
    private _data: any;

    scriptConfigToXml(): string {
        const kind = (this._data['type'] - 1) * 4 + this._data['kind'];
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
        // this._data['FilterConfig']
        // TODO foreach filter
        result += '';
        return result;
    }

    parseSendDocumentRule(scriptConfig, kindRule): Promise<any> {
        const parseString = xml2js.parseString;
        this._scriptConfig = scriptConfig;
        if (this._scriptConfig) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._scriptConfig, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const sendDocumentRule = result['SendDocumentRule'];
                    const document = sendDocumentRule['ScriptConfig'][0]['Document'][0];
                    this._data = {};
                    this._data['type'] = (kindRule - kindRule % 4) / 4;
                    this._data['kind'] = kindRule % 4;
                    this._data['link'] = !(document['Link'][0].$['Include'] === 'None');
                    this._data['linkKind'] = document['Link'][0].$['Include'] === 'All' ? 0 : 1;
                    // this._data['linkTypeList'] = document['Link'][0].$['LinkTypeList'];
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
                    this._data['fileExtensions'] = document['File'][0].$['Extensions'];
                    this._data['fileAccessList'] = document['File'][0].$['AccessList'];
                    this._data['fileMaxLength'] = document['File'][0].$['MaxLength'];
                    this._data['item'] = !(document['Item'][0].$['Include'] === 'None');
                    this._data['itemKind'] = document['Item'][0].$['Include'] === 'All' ? 0 : 1;
                    this._data['resolution'] = !(document['Resolution'][0].$['Include'] === 'None');
                    const itemInclude = document['Item'][0].$['Include'];
                    this._data['resolutionKind'] = itemInclude === 'All' ? 0 : (itemInclude === 'ExtractionWithParent' ? 1 : 2);
                    const task = sendDocumentRule['ScriptConfig'][0]['Task'][0];
                    this._data['taskCategory'] = task['Category'][0].$['Include'] === 'true';
                    this._data['taskController'] = task['Controller'][0].$['Include'] === 'true';
                    this._data['taskNote'] = task['Note'][0].$['Include'] === 'true';
                    this._data['taskFile'] = task['File'][0].$['Include'] === 'true';
                    this._data['taskFileExtensions'] = task['File'][0].$['Extensions'];
                    this._data['taskFileMaxLength'] = task['File'][0].$['MaxLength'];
                    const subscriptions = sendDocumentRule['Subscriptions'][0];
                    this._data['reception'] = subscriptions['Reception'][0].$['Include'] === 'true';
                    this._data['registration'] = subscriptions['Registration'][0].$['Include'] === 'true';
                    this._data['forwarding'] = subscriptions['Forwarding'][0].$['Include'] === 'true';
                    this._data['consideration'] = subscriptions['Consideration'][0].$['Include'] === 'true';
                    this._data['report'] = subscriptions['Report'][0].$['Include'] === 'true';
                    this._data['redirection'] = subscriptions['Redirection'][0].$['Include'] === 'true';
                    this._data['answer'] = subscriptions['Answer'][0].$['Include'] === 'true';
                    this._data['stopDayCount'] = subscriptions.$['StopDayCount'];
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
        const itemInculde = this._data['item'] ? ((this._data['itemKind'] === 0) ? 'All' : 'Extraction') : 'None';
        const resolutionKind =  this._data['resolutionKind'];
        const resolutionKindText = ((resolutionKind === 0) ? 'All' : ((resolutionKind === 1) ? 'ExtractionWithParent' : 'Extraction'));
        const resolutionInclude = this._data['resolution'] ? resolutionKindText : 'None';

        const linkTypeList = ''; // TODO список link_cl.isn_lclassif через символ |

        return `<?xml version="1.0"?>
        <SendDocumentRule>
            <ScriptConfig>
                <Contact>
                    <Address Include="${(!!this._data['address']).toString()}">
                        <Region Include="${(!!this._data['region']).toString()}"/>
                    </Address>
                </Contact>
                <Document UserGrantedOnly="${(!!this._data['userGrantedOnly']).toString()}">
                    <Link Include="${linkInclude}" LinkTypeList="${linkTypeList}"/>
                    <Access Include="${(!!this._data['access']).toString()}"/>
                    <Rubric Include="${(!!this._data['rubric']).toString()}"/>
                    <Visa Include="${(!!this._data['visa']).toString()}"/>
                    <Addressee Include="${addresseeInclude}"/>
                    <AdditionalField Include="${(!!this._data['additionalField']).toString()}"/>
                    <File Include="${(!!this._data['file']).toString()}" Extensions="${this._data['fileExtensions']}"
                        AccessList="${this._data['fileAccessList']}" MaxLength="${this._data['fileMaxLength']}"/>
                    <Item Include="${itemInculde}"/>
                    <Resolution Include="${resolutionInclude}"/>
                </Document>
                <Task>
                    <Text Include="true"/>
                    <Category Include="${(!!this._data['taskCategory']).toString()}"/>
                    <Note Include="${(!!this._data['taskNote']).toString()}"/>
                    <ControlState Include="true"/>
                    <PlanDate Include="true"/>
                    <Controller Include="${(!!this._data['taskController']).toString()}"/>
                    <Summary Include="true"/>
                    <FactDate Include="true"/>
                    <Status Include="true"/>
                    <Resume Include="true"/>
                    <Executor Include="All">
                        <Report Include="true"/>
                    </Executor>
                    <File Include="${(!!this._data['taskFile']).toString()}"/>
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
        const link = ''; // TODO All(Все)|List(Определенного типа)|None(Не посылать)
        const linkTypeList = ''; // TODO список link_cl.isn_lclassif через символ |
        const task = ''; // TODO All(Все)|Own(Только свои)
        const correspondent = ''; // TODO Use: Sender(Из отправителя)|Author(Из автора документа)
        const updateParamsFile = ''; // TODO All(Все)|ExtractionWithParent(Свои + родительские)|Extraction(Только свои)|
        const updateParamsTask = true; // TODO непонятное поле

        return `<?xml version="1.0"?>
        <ReceiveDocumentRule>
            <ScriptConfig>
                <!-- Субъект документа -->
                <Contact>
                    <!-- Вершина в которой будут добавляться новые организации -->
                    <OrganizationFolder>${this._data['OrganizationFolder']}</OrganizationFolder>
                    <!--Адрес субъекта документа.
                    Заполнять адрес субъекта. Use: IfEmpty(Если поля пустые)|Always(Всегда)|DoNotUse(Не заполнять) -->
                    <Address Use="${this._data['Address']}">
                        <!--Регион субъекта документа.					Загружать. Use: true|false -->
                        <Region Use="${this._data['Region']}"/>
                    </Address>
                </Contact>
                <!-- Документ -->
                <Document>
                    <!-- Гриф доступа.				Загружать. Use: true|false -->
                    <Access Use="${this._data['Access']}"/>
                    <!-- Рубрики.				Загружать. Use: true|false -->
                    <Rubric Use="${this._data['Rubric']}"/>
                    <!-- Допреквизиты.				Загружать. Use: true|false -->
                    <AdditionalField Use="${this._data['AdditionalField']}"/>
                    <!-- Файлы РК.				Загружать. Use: true|false
                    Расширения файлов. Extensions: список расширений через символ ,
                    Грифы доступа. AccessList: список security_cl.securlevel через символ |
                    Максимальная величина файлов. MaxLength: число -->
                    <File Use="${this._data['File']}" AccessList="${this._data['AccessList']}"/>
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
                    <Category Use="${this._data['Category']}"/>
                    <!-- Примечания.				Загружать. Use: true|false -->
                    <Note Use="${this._data['Note']}"/>
                    <File Use="${this._data['File']}"/>
                </Task>
                <!-- Параметры регистрации -->
                <RegistrationParams>
                    <!-- Картотека в которой будут регистрироваться новые РК -->
                    <Card>${this._data['Card']}</Card>
                    <!-- Кабинет в котором будут регистрироваться новые РК -->
                    <Cabinet>${this._data['Cabinet']}</Cabinet>
                </RegistrationParams>
                <SendToManualQueue>${this._data['SendToManualQueue']}</SendToManualQueue>
                <UpdateParams>
                    <File Use="${updateParamsFile}"/><Task Use="${updateParamsTask}"/>
                </UpdateParams>
            </ScriptConfig>
        </ReceiveDocumentRule>`;
    }

    private sendReportRule(): string {
        return `<?xml version="1.0"?>
        <SendReportRule>
            <ScriptConfig>
                <!-- Субъект документа -->
                <Contact>
                    <!--Адрес субъекта документа.				Включать в паспорт. Include: true|false -->
                    <Address Include="${this._data['Address']}">
                        <!--Регион субъекта документа.					Включать в паспорт. Include: true|false -->
                        <Region Include="${this._data['Address']}"/>
                    </Address>
                </Contact>
                <!-- Поручения. -->
                <Task>
                    <!-- Текст				Включать в паспорт. Include: true|false -->
                    <Text Include="${this._data['Address']}"/>
                    <!-- Категория поручения.				Включать в паспорт. Include: true|false -->
                    <Category Include="${this._data['Address']}"/>
                    <!-- Примечание.				Включать в паспорт. Include: true|false -->
                    <Note Include="${this._data['Address']}"/>
                    <!-- Контрольность резолюции				Включать в паспорт. Include: true|false -->
                    <ControlState Include="${this._data['Address']}"/>
                    <!-- План. дата				Включать в паспорт. Include: true|false -->
                    <PlanDate Include="${this._data['Address']}"/>
                    <!-- Контролер поручения.				Включать в паспорт. Include: true|false -->
                    <Controller Include="${this._data['Address']}"/>
                    <!-- Ход исполнения				Включать в паспорт. Include: true|false -->
                    <Summary Include="${this._data['Address']}"/>
                    <!-- Дата снятия с контроля				Включать в паспорт. Include: true|false -->
                    <FactDate Include="${this._data['Address']}"/>
                    <!-- Состояние исполнения				Включать в паспорт. Include: true|false -->
                    <Status Include="${this._data['Address']}"/>
                    <!-- Основание для снятия с контроля				Включать в паспорт. Include: true|false -->
                    <Resume Include="${this._data['Address']}"/>
                    <!-- Исполнители резолюции				Включать в паспорт. Include: All(Все)|Responsible(Ответственные)|None(Не включать) -->
                    <Executor Include="${this._data['Address']}">
                        <!-- Отчеты исполнителей					Включать в паспорт. Include: true|false -->
                        <Report Include="${this._data['Address']}"/>
                        <!-- Файлы отчетов исполнителей					Включать в паспорт. Include: true|false -->
                        <File Include="${this._data['Address']}"/>
                        <FileOptions Extensions="${this._data['Address']}" MaxLength="${this._data['Address']}"/>
                    </Executor>
                    <!-- ЭП поручения				Включать в паспорт. Include: true|false -->
                    <Eds Include="${this._data['Address']}"/>
                </Task>
            </ScriptConfig>
            <!-- Состав докладов. -->
            <NotificationConfig StopDayCount="${this._data['Address']}">
                <!-- Уведомление о приеме.			Включить в доклад. Include: true|false -->
                <Reception Include="${this._data['Address']}"/>
                <!-- Уведомление о регистрации.			Включить в доклад. Include: true|false -->
                <Registration Include="${this._data['Address']}"/>
                <!-- Уведомление о направлении документа.			Включить в доклад. Include: All(Все)|None(Не включать)|First(Первые) -->
                <Forwarding Include="${this._data['Address']}"/>
                <!--Уведомление о работе с документом
                Включить в доклад. Include: None(Не включать)|First(Первые)|All(Все)|Last(Последние) -->
                <Consideration Include="${this._data['Address']}"/>
                <!--Уведомление об отчете исполнения.			Включить в доклад. Include: true|false -->
                <Report Include="${this._data['Address']}"/>
                <!--Уведомление о перенаправлении документа.			Включить в доклад. Include: true|false -->
                <Redirection Include="${this._data['Address']}"/>
                <!--Уведомление об отправке документа-ответа.			Включить в доклад. Include: true|false -->
                <Answer Include="${this._data['Address']}"/>
                <NotificationUpdateOptions Update="${this._data['Address']}" StopDayCalc="${this._data['Address']}"/>
            </NotificationConfig>
        </SendReportRule>`;
    }

    private receiveReportRule(): string {
        return `<?xml version="1.0"?>
        <ReceiveReportRule>
            <ScriptConfig>
                <Contact>
                    <Address Use="${this._data['Address']}">
                        <Region Use="${this._data['Address']}"/>
                    </Address>
                    <OrganizationFolder>${this._data['Address']}</OrganizationFolder>
                </Contact>
                <Registration MarkAddresse="${this._data['Address']}"/>
                <Task MarkExecutor="${this._data['Address']}"><ExecutorFile Use="${this._data['Address']}"/></Task>
            </ScriptConfig>
        </ReceiveReportRule>`;
    }

    private sendProjectRule(): string {
        return `<?xml version="1.0"?>
        <SendProjectRule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <ScriptConfig>
                <Contact>
                    <Address Include="${this._data['Address']}"><Region Include="true"/></Address>
                </Contact>
                <Project>
                    <Link Include="${this._data['Address']}" LinkTypeList="${this._data['Address']}"/>
                    <Access Include="${this._data['Address']}"/>
                    <Rubric Include="${this._data['Address']}"/>
                    <Addressee Include="${this._data['Address']}"/>
                    <AdditionalField Include="${this._data['Address']}"/>
                    <Executor Include="${this._data['Address']}"/>
                    <Term Include="${this._data['Address']}"/>
                    <FileOptions Extensions="${this._data['Address']}" MaxLength="${this._data['Address']}"/>
                    <File Include="${this._data['Address']}"/>
                    <Visa Include="${this._data['Address']}">
                        <Content Include="${this._data['Address']}"><File Include="${this._data['Address']}"/></Content>
                    </Visa>
                    <Sign Include="${this._data['Address']}">
                        <Content Include="${this._data['Address']}"><File Include="${this._data['Address']}"/></Content>
                    </Sign>
                </Project>
            </ScriptConfig>
            <Subscriptions StopDayCount="${this._data['Address']}">
                <Reception Include="${this._data['Address']}"/>
                <Registration Include="${this._data['Address']}"/>
                <VisaDirection Include="${this._data['Address']}"/>
                <SignDirection Include="${this._data['Address']}"/>
                <VisaInformation Include="${this._data['Address']}"/>
                <SignInformation Include="${this._data['Address']}"/>
            </Subscriptions>
        </SendProjectRule>`;
    }

    private receiveProjectRule(): string {
        return `<?xml version="1.0"?>
        <ReceiveProjectRule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
            <ScriptConfig>
                <Contact>
                    <Address Use="${this._data['Address']}"><Region Use="${this._data['Address']}"/></Address>
                    <OrganizationFolder>${this._data['Address']}</OrganizationFolder>
                </Contact>
                <Project>
                    <Link Use="${this._data['Address']}" LinkTypeList="${this._data['Address']}"/>
                    <Access Use="${this._data['Address']}"/>
                    <Rubric Use="${this._data['Address']}"/>
                    <Addressee Use="${this._data['Address']}"/>
                    <AdditionalField Use="${this._data['Address']}"/>
                    <Executor Use="${this._data['Address']}"/>
                    <File Use="${this._data['Address']}"/>
                    <Visa Use="${this._data['Address']}">
                        <Content Use="${this._data['Address']}"><File Use="${this._data['Address']}"/></Content>
                        <SendOptions Send="${this._data['Address']}" TermFlag="${this._data['Address']}" Term="${this._data['Address']}"/>
                    </Visa>
                    <Sign Use="${this._data['Address']}">
                        <Content Use="${this._data['Address']}"><File Use="${this._data['Address']}"/></Content>
                        <SendOptions Send="${this._data['Address']}" TermFlag="${this._data['Address']}" Term="${this._data['Address']}"/>
                    </Sign>
                </Project>
                <RegistrationParams>
                    <ExecutorListID>${this._data['Address']}</ExecutorListID>
                    <RepresentativePerson>${this._data['Address']}</RepresentativePerson>
                </RegistrationParams>
            </ScriptConfig>
        </ReceiveProjectRule>`;
    }

    private sendProjectReportRule(): string {
        return `<?xml version="1.0"?>
        <SendProjectReportRule>
            <ScriptConfig>
                <Contact>
                    <Address Include="${this._data['Address']}"><Region Include="${this._data['Address']}"/></Address>
                </Contact>
            </ScriptConfig>
            <NotificationConfig StopDayCount="${this._data['Address']}">
                <Reception Include="${this._data['Address']}"/>
                <Registration Include="${this._data['Address']}"/>
                <VisaDirection Include="${this._data['Address']}"/>
                <SignDirection Include="${this._data['Address']}"/>
                <Visa Include="${this._data['Address']}"><File Include="${this._data['Address']}"/></Visa>
                <Sign Include="${this._data['Address']}"><File Include="${this._data['Address']}"/></Sign>
                <FileOptions Extensions="${this._data['Address']}" MaxLength="${this._data['Address']}"/>
            </NotificationConfig>
        </SendProjectReportRule>`;
    }

    private receiveProjectReportRule(): string {
        return `<?xml version="1.0"?>
        <ReceiveProjectReportRule>
            <ScriptConfig>
                <Executor Use="${this._data['Executor']}"/>
                <VisaSign Use="${this._data['Executor']}">
                    <File Use="${this._data['Executor']}"/>
                </VisaSign>
                <VisaSignPersonUpdate Use="${this._data['Executor']}"/>
            </ScriptConfig>
        </ReceiveProjectReportRule>`;
    }
}
