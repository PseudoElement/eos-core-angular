import { IOpenClassifParams } from '../../../../eos-common/interfaces';

export enum E_TECH_RIGHTS {
    /** Пользователи */
    Users = 1,
    /** Текущая организация */
    CurrentOrganization = 2,
    /** Список организаций */
    ListOfOrganizations = 3,
    /** Типы организаций */
    OrganizationTypes = 4,
    /** Регионы */
    Regions = 5,
    /** Категории адресатов */
    DestinationCategories = 6,
    /** Ведение календаря */
    CalendarManagement = 7,
    /** Рубрикатор */ 
    Rubricator = 8,
    /** Группы документов */
    DocumentGroups = 9,
    /** Подразделения */
    Subdivisions = 10,
    /** Виды доставки */
    DeliveryTypes = 11,
    /** Типы реестров */
    RegistryTypes = 12,
    /** Типы связок */
    LinkTypes = 13,
    /** Номенклатура дел */
    CaseNomenclature = 14,
    /** Грифы доступа */
    AccessBars = 15,
    /** Граждане */
    Citizens = 16,
    /** Статус заявителя */
    ApplicantStatus = 17,
    /** Кабинеты */
    Cabinets = 18,
    /** Настройка реквизитов */
    SettingDetails = 19,
    /** Шаблоны */
    Templates = 20,
    /** Типы виз */
    VisaTypes = 23,
    /** Виды подписей */
    TypesOfSignatures = 24,
    /** Категории поручений */
    OrderCategories = 25,
    /** Параметры системы */
    SystemSettings = 26,
    /** Состояние исполнения (поручение) */
    StatusOfExecutionOrder = 27,
    /** Состояние исполнения (исполнитель) */
    PerformancestatusPerformer = 28,
    /** Процедура передачи документов */
    ProcedureForSubmittingDocuments = 29,
    /** Настройка протокола просмотра */
    SettingTheBrowsingProtocol = 30,
    /** Зачистка протоколов */
    CleanupOfProtocols = 31,
    /** Настройка подсистемы оповещения и уведомления */
    ConfiguringTheAlertAndNotificationSubsystem = 32,
    /** Настройка партионной почты */
    BatchMailSetup = 33,
    /** Справочники СЭВ */
    DirectoriesSEV = 34,
    /** Буфер электронных сообщений */
    EmailBuffer = 35,
    /** Приоритеты проектов резолюций */
    PrioritiesOfDraftResolutions = 36,
    /** Категории ЭП */
    CategoriesEP = 37,
    /** Типы файлов */ 
    FileTypes = 41,
    /** Категории файлов */
    FileCategories = 43,
    /** Типы адреса данная опция пока скрыта по таску @171201 */ 
    AddressTypes = 47,
    /** Управление фоновыми задачами */
    BackgroundTaskManagement = 48,
    /** Справочники МЭДО */
    DirectoriesMEDO = 50,
    /** Виды документов */
    DocumentTypes = 51,
    /** Настройка общих списков */
    SettingGeneralLists = 52,
    /** Настройка отчетов */
    CustomizeReports = 57,
    /** Настройка доступа к отчетам */
    ConfigurConfigToReports = 58,
}
export type ETypeTechRight = E_TECH_RIGHTS;

export enum E_TECH_USER_CLASSIF_CONTENT {
    none,
    limitation,
    rubric,
    docGroup,
    department
}
export interface ITechUserClassifConst {
    key: number;
    label: string;
    expandable: E_TECH_USER_CLASSIF_CONTENT;
    useInProject?: string;
}
export interface IConfigUserTechClassif {
    apiInstance: 'DEPARTMENT' | 'DOCGROUP_CL' | 'RUBRIC_CL';
    waitClassif: IOpenClassifParams;
    label: 'CLASSIF_NAME' | 'CARD_NAME';
    rootLabel?: string;
}


export enum ETypeRule {
    /** Нет права */
    no_right = "0",
    /** Имется право */
    have_right = "1"
}
