import { E_TECH_RIGHTS, E_TECH_USER_CLASSIF_CONTENT, ITechUserClassifConst } from './tech-user-classif.interface';

export const TECH_USER_CLASSIF: ITechUserClassifConst[] = [
    {
        key: E_TECH_RIGHTS.Users,
        label: 'Пользователи',
        expandable: E_TECH_USER_CLASSIF_CONTENT.limitation,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.CurrentOrganization,
        label: 'Текущая организация',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.ListOfOrganizations,
        label: 'Список организаций',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.OrganizationTypes,
        label: 'Типы организаций',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Regions,
        label: 'Регионы',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.DestinationCategories,
        label: 'Категории адресатов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.CalendarManagement,
        label: 'Ведение календаря',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Rubricator,
        label: 'Рубрикатор',
        expandable: E_TECH_USER_CLASSIF_CONTENT.rubric,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.DocumentGroups,
        label: 'Группы документов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.docGroup,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Subdivisions,
        label: 'Подразделения',
        expandable: E_TECH_USER_CLASSIF_CONTENT.department,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.DeliveryTypes,
        label: 'Виды доставки',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.RegistryTypes,
        label: 'Типы реестров',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.LinkTypes,
        label: 'Типы связок',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.CaseNomenclature,
        label: 'Номенклатура дел',
        expandable: E_TECH_USER_CLASSIF_CONTENT.department,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.AccessBars,
        label: 'Грифы доступа',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Citizens,
        label: 'Граждане',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.ApplicantStatus,
        label: 'Статус заявителя',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Cabinets,
        label: 'Кабинеты',
        expandable: E_TECH_USER_CLASSIF_CONTENT.department,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.SettingDetails,
        label: 'Настройка реквизитов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.Templates,
        label: 'Шаблоны',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    // {
    //     key: 21,
    //     label: 'Протокол редактирования пользователей',
    //     expandable: E_TECH_USER_CLASSIF_CONTENT.none
    // },
    // {
    //     key: 22,
    //     label: 'Управление сертификатами',
    //     expandable: E_TECH_USER_CLASSIF_CONTENT.none
    // },
    {
        key: E_TECH_RIGHTS.VisaTypes,
        label: 'Типы виз',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.TypesOfSignatures,
        label: 'Виды подписей',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.OrderCategories,
        label: 'Категории поручений',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.SystemSettings,
        label: 'Параметры системы',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.StatusOfExecutionOrder,
        label: 'Состояние исполнения (поручение)',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.PerformancestatusPerformer,
        label: 'Состояние исполнения (исполнитель)',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.ProcedureForSubmittingDocuments,
        label: 'Процедура передачи документов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.department,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.SettingTheBrowsingProtocol,
        label: 'Настройка протокола просмотра',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.CleanupOfProtocols,
        label: 'Зачистка протоколов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.ConfiguringTheAlertAndNotificationSubsystem,
        label: 'Настройка подсистемы оповещения и уведомления',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.BatchMailSetup,
        label: 'Настройка партионной почты',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.DirectoriesSEV,
        label: 'Справочники СЭВ',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.DirectoriesMEDO,
        label: 'Справочники МЭДО',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo'
    },
    {
        key: E_TECH_RIGHTS.EmailBuffer,
        label: 'Буфер электронных сообщений',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.PrioritiesOfDraftResolutions,
        label: 'Приоритеты проектов резолюций',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.CategoriesEP,
        label: 'Категории ЭП',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.FileTypes,
        label: 'Типы файлов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.AddressTypes,
        label: 'Типы адреса',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo,nadzor'
    },
    {
        key: E_TECH_RIGHTS.FileCategories,
        label: 'Категории файлов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo'
    },
    {
        key: E_TECH_RIGHTS.BackgroundTaskManagement,
        label: 'Управление фоновыми задачами',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo'
    },
    {
        key: E_TECH_RIGHTS.DocumentTypes,
        label: 'Виды документов',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo'
    },
    {
        key: E_TECH_RIGHTS.SettingGeneralLists,
        label: 'Настройка общих списков',
        expandable: E_TECH_USER_CLASSIF_CONTENT.none,
        useInProject: 'delo'
    },
];

export const E_CLASSIF_ID = {
    1: 104,
    8: 107,
    9: 105,
    10: 104,
    14: 119,
    18: 120,
    29: 104,
};
