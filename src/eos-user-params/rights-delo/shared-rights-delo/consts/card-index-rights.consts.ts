import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const CARD_INDEXS_RIGHTS = [
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_RESTRICT_REGISTRATION_FILING',
            type: 'boolean',
            title: 'Ораничить картотекой регистрации',
            index: -2,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_REGISTRATION_OF_DOCUMENTS',
            type: 'boolean',
            title: 'Регистрация документов',
            index: 0,
            isSelected: false,
            data: {
                rightContent: 2
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_DOCUMENT_SEARCH',
            type: 'boolean',
            title: 'Поиск документов',
            index: 1,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_EDITING_RC',
            type: 'boolean',
            title: 'Редактирование РК',
            index: 2,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_EDITING_ADDITIONAL_DETAILS',
            type: 'boolean',
            title: 'Редактирование доп.реквизитов',
            index: 3,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_EDITING_RUBRICS',
            type: 'boolean',
            title: 'Редактирование рубрик',
            index: 4,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_EDITING_BUNDLE',
            type: 'boolean',
            title: 'Редактирование связок',
            index: 5,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_RC_REMOVAL',
            type: 'boolean',
            title: 'Удаление РК',
            index: 6,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_RC_SHIPMENT',
            type: 'boolean',
            title: 'Пересылка РК',
            index: 7,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_RECEIVE_REPORTS',
            type: 'boolean',
            title: 'Получение отчетов',
            index: 8,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_DOCUMENT_REWIND',
            type: 'boolean',
            title: 'Переотметка документов',
            index: 9,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_WRITING_OFF_OF_DOCUMENTS_IN_DELO',
            type: 'boolean',
            title: 'Списание документов в дело',
            index: 10,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_MARK_FAMILIARIZATION',
            type: 'boolean',
            title: 'Отметка ознакомления',
            index: 11,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_SENDING_BY_EMAIL',
            type: 'boolean',
            title: 'Отправка по e-mail',
            index: 12,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_MARK_SENDING_DOCUMENTS',
            type: 'boolean',
            title: 'Отметка отправки документов',
            index: 13,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_INVENTORY_OF_CASES',
            type: 'boolean',
            title: 'Опись дел',
            index: 14,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_ADD_FILES',
            type: 'boolean',
            title: 'Добавлять файлы',
            index: 15,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_READ_FILES',
            type: 'boolean',
            title: 'Читать файлы',
            index: 16,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_EDIT_FILES',
            type: 'boolean',
            title: 'Редактировать файлы',
            index: 17,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_DELETE_FILES',
            type: 'boolean',
            title: 'Удалять файлы',
            index: 18,
            isSelected: false,
            data: {
                rightContent: 1
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_VIEW_ORDERS',
            type: 'boolean',
            title: 'Просмотр поручений',
            index: 19,
            isSelected: false,
            data: {
                rightContent: 0
            }
        },
        {
            controlType: E_FIELD_TYPE.boolean,
            key: 'CARD_INDEX_RIGHTS_SENDING_MESSAGES_SEV',
            type: 'boolean',
            title: 'Отправка сообщений СЭВ',
            index: 20,
            isSelected: false,
            data: {
                rightContent: 2
            }
        }
];
