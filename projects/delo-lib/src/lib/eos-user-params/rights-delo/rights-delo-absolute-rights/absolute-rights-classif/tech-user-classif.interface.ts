import { IOpenClassifParams } from '../../../../eos-common/interfaces';

export enum E_TECH_RIGHTS {
    Users = 1, // Пользователи
    CurrentOrganization = 2, // Текущая организация
    ListOfOrganizations = 3, // Список организаций
    OrganizationTypes = 4, // Типы организаций
    Regions = 5, // Регионы
    DestinationCategories = 6, // Категории адресатов
    CalendarManagement = 7, // Ведение календаря
    Rubricator = 8, // Рубрикатор
    DocumentGroups = 9, // Группы документов
    Subdivisions = 10, // Подразделения
    DeliveryTypes = 11, // Виды доставки
    RegistryTypes = 12, // Типы реестров
    LinkTypes = 13, // Типы связок
    CaseNomenclature = 14, // Номенклатура дел
    AccessBars = 15, // Грифы доступа
    Citizens = 16, // Граждане
    ApplicantStatus = 17, // Статус заявителя
    Cabinets = 18, // Кабинеты
    SettingDetails = 19, // Настройка реквизитов
    Templates = 20, // Шаблоны
    VisaTypes = 23, // Типы виз
    TypesOfSignatures = 24, // Виды подписей
    OrderCategories = 25, // Категории поручений
    SystemSettings = 26, // Параметры системы
    StatusOfExecutionOrder = 27, // Состояние исполнения (поручение)
    PerformancestatusPerformer = 28, // Состояние исполнения (исполнитель)
    ProcedureForSubmittingDocuments = 29, // Процедура передачи документов
    SettingTheBrowsingProtocol = 30, // Настройка протокола просмотра
    CleanupOfProtocols = 31, // Зачистка протоколов
    ConfiguringTheAlertAndNotificationSubsystem = 32, // Настройка подсистемы оповещения и уведомления
    BatchMailSetup = 33, // Настройка партионной почты
    DirectoriesSEV = 34, // Справочники СЭВ
    EmailBuffer = 35, // Буфер электронных сообщений
    PrioritiesOfDraftResolutions = 36, // Приоритеты проектов резолюций
    CategoriesEP = 37, // Категории ЭП
    FileTypes = 41, // Типы файлов
    FileCategories = 43, // Категории файлов
    AddressTypes = 47, // Типы адреса
    BackgroundTaskManagement = 48, // Управление фоновыми задачами
    DirectoriesMEDO = 50, // Справочники МЭДО
    DocumentTypes = 51, // Виды документов
    SettingGeneralLists = 52, // Настройка общих списков
    CustomizeReports = 57, // Настройка отчетов
    ConfigurConfigToReports = 58, // Настройка доступа к отчетам
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
    no_right = "0",
    have_right = "1"
}
