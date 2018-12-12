import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const ABSOLUTE_RIGHTS = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_SYSTEM_TECHNOLOGIST',
        type: 'boolean',
        title: 'Системный технолог',
        index: 0,
        isSelected: false,
        data: {
            rightContent: 1
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_SEARCH_ALL_CARD_INDEXES',
        type: 'boolean',
        title: 'Поиск по всем картотекам',
        index: 1,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_SENDING_DOCUMENTS_IN_REGISTRIES',
        type: 'boolean',
        title: 'Отправка документов по реестрам',
        index: 2,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_VIEW_ALL_ORDERS',
        type: 'boolean',
        title: 'Просмотр всех поручений',
        index: 3,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_ENTERING_RESOLUTIONS',
        type: 'boolean',
        title: 'Ввод резолюций',
        index: 4,
        isSelected: false,
        data: {
            rightContent: 2
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_ENTER_DRAFT_RESOLUTIONS',
        type: 'boolean',
        title: 'Ввод проектов резолюций',
        index: 22,
        isSelected: false,
        data: {
            rightContent: 2
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_EXECUTION_OF_ORDERS',
        type: 'boolean',
        title: 'Исполнение поручений',
        index: 5,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_CREATION_OF_THE_RCPD',
        type: 'boolean',
        title: 'Создание РКПД',
        index: 28,
        isSelected: false,
        data: {
            rightContent: 4
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_CONTROL_OF_EXECUTION_OF_ORDERS',
        type: 'boolean',
        title: 'Контроль исполнения поручений',
        index: 6,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_ADDING_ORGANIZATIONS_AND_CITIZENS',
        type: 'boolean',
        title: 'Добавление организаций и граждан',
        index: 7,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_EDITING_ORGANIZATIONS_AND_CITIZENS',
        type: 'boolean',
        title: 'Редактирование организаций и граждан',
        index: 8,
        isSelected: false,
        data: {
            rightContent: 5
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_EDITING_THE_REGISTRATION_NUMBER_OF_THE_RC',
        type: 'boolean',
        title: 'Редактирование регистрационного номера РК',
        index: 9,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_VISITING_PROJECTS',
        type: 'boolean',
        title: 'Визировать проекты',
        index: 10,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_SIGN_PROJECTS',
        type: 'boolean',
        title: 'Подписывать проекты',
        index: 11,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_CREATE_SYSTEM_QUERIES',
        type: 'boolean',
        title: 'Создавать системные запросы',
        index: 15,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_GROUP_REMOVAL_OF_RC',
        type: 'boolean',
        title: 'Групповое удаление РК',
        index: 18,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_ALERT_SUBSCRIPTION_MANAGEMENT',
        type: 'boolean',
        title: 'Управление подпиской на оповещения',
        index: 19,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_READING_FILES_IN_ALL_CARDS',
        type: 'boolean',
        title: 'Чтение файлов во всех картотеках',
        index: 23,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_READING_RC_PERSONAL_ACCESS',
        type: 'boolean',
        title: 'Чтение РК персон. доступа',
        index: 24,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_READING_PERSONAL_ACCESS_FILES',
        type: 'boolean',
        title: 'Чтение файлов персон. доступа',
        index: 25,
        isSelected: false,
        data: {
            rightContent: 3
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_UPLOADING_INFORMATION_TO_THE_SSTU',
        type: 'boolean',
        title: 'Выгрузка информации на ССТУ',
        index: 29,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_ADD_NP',
        type: 'boolean',
        title: 'Добавление НП',
        index: 13,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'ABSOLUTE_RIGHTS_EDITING_NP',
        type: 'boolean',
        title: 'Редактирование НП',
        index: 14,
        isSelected: false,
        data: {
            rightContent: 0
        }
    },
];
