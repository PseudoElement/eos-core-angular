import { IBaseUsers} from '../../../../shared/intrfaces/user-params.interfaces';
import * as Fields from './remaster-fields.const';
// const REG_MIN_VAL: RegExp = /^([1-9]{1}[0-9]{0,1})$/;

export const REGISTRATION_REMASTER_USER: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    disabledFields: [
        'RCSEND_REGISTRATION_NUMBER',
        'RCSEND_REGISTRATION_NUMBER_SUBSET',
        'RCSEND_DATE_OF_REGISTRATION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
        'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION',
        'RCSEND_ORDERS_SYSTEM_NUMBER',
        'RCSEND_ORDERS_POINT_RESOLUTION',
    ],
    fields: [
        Fields.EMAIL,
        Fields.ENCRYPTION,
        Fields.ELECTRONIC_SIGNATURE,
        Fields.COMPRESS_ATTACHED_FILES,
        Fields.CONSIDER_THE_TYPE_OF_DISPATCH,
        Fields.REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT,
        Fields.RECEIP_EMAIL,
        Fields.FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO,
        Fields.RESOLUTIONS,
        Fields.RESOLUTIONS_RADIO,
        Fields.ADDRESSEES,
        Fields.ADDRESSEES_RADIO,
        Fields.GROUP_OF_DOCUMENTS,
        Fields.THE_COMPOSITION_OF_THE_DOCUMENT,
        Fields.SUMMARY,
        Fields.SIGN_OF_COLLECTIVITY,
        // --------------------------------------
        Fields.REGISTRATION_NUMBER,
        Fields.REGISTRATION_NUMBER_SUBSET,
        Fields.DATE_OF_REGISTRATION,
        // --------------------------------------
        Fields.ACCESS_NECK,
        Fields.HEADINGS,
        Fields.ACCOMPANYING_DOCUMENTS,
        Fields.NOTE_TO_THE_RK,
        Fields.NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE,
        Fields.DOCUMENT_AUTHOR,
        Fields.VISAS,
        Fields.ADDRESSES,
        Fields.DOCUMENT_PERFORMER,
        Fields.ORDERS,
        Fields.ADDITIONAL_DETAILS,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_INN,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_EMAIL,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER,
        Fields.DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION,
        Fields.DOCUMENT_AUTHOR_CITIZEN,
        Fields.DOCUMENT_AUTHOR_CITIZEN_FULL_NAME,
        Fields.DOCUMENT_AUTHOR_CITIZEN_INN_SNILS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE,
        Fields.DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET,
        Fields.DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE,
        Fields.VISAS_ORGANIZATION,
        Fields.VISAS_ORGANIZATION_FULL_TITLE,
        Fields.VISAS_ORGANIZATION_ABBREVIATION,
        Fields.VISAS_ORGANIZATION_OGRN_CODE,
        Fields.VISAS_ORGANIZATION_INN,
        Fields.VISAS_ORGANIZATION_ADDRESS,
        Fields.VISAS_ORGANIZATION_ADDRESS_CITY,
        Fields.VISAS_ORGANIZATION_ADDRESS_REGION,
        Fields.VISAS_ORGANIZATION_ADDRESS_POSTCODE,
        Fields.VISAS_ORGANIZATION_ADDRESS_STREET,
        Fields.VISAS_ORGANIZATION_EMAIL,
        Fields.VISAS_ORGANIZATION_EXECUTIVE,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_POSITION,
        Fields.VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING,
        // ---------------------------------------------------
        Fields.ADDRESSES_ORGANIZATION,        
        Fields.ADDRESSES_ORGANIZATION_FULL_TITLE,        
        Fields.ADDRESSES_ORGANIZATION_ABBREVIATION,        
        Fields.ADDRESSES_ORGANIZATION_OGRN_CODE,        
        Fields.ADDRESSES_ORGANIZATION_INN,        
        Fields.ADDRESSES_ORGANIZATION_ADDRESS,        
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_CITY,        
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_REGION,        
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE,        
        Fields.ADDRESSES_ORGANIZATION_ADDRESS_STREET,        
        Fields.ADDRESSES_ORGANIZATION_EMAIL,        
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED,        
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME,        
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION,        
        Fields.ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION,        
        Fields.ADDRESSES_CITIZEN,        
        Fields.ADDRESSES_CITIZEN_FULL_NAME,        
        Fields.ADDRESSES_CITIZEN_INN_SNILS,        
        Fields.ADDRESSES_CITIZEN_PASSPORT_DETAILS,        
        Fields.ADDRESSES_CITIZEN_ADDRESS,        
        Fields.ADDRESSES_CITIZEN_ADDRESS_CITY,        
        Fields.ADDRESSES_CITIZEN_ADDRESS_REGION,        
        Fields.ADDRESSES_CITIZEN_ADDRESS_POSTCODE,        
        Fields.ADDRESSES_CITIZEN_ADDRESS_STREET,        
        Fields.ADDRESSES_CITIZEN_EMAIL_PHONE ,
        // Исполнитель документа
        Fields.DOCUMENT_PERFORMER_ORGANIZATION,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_INN,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EMAIL,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,        
        Fields.DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION ,
        // Поручения
        Fields.ORDERS_SYSTEM_NUMBER,        
        Fields.ORDERS_POINT_RESOLUTION,        
        Fields.ORDERS_ORDER_TEXT,        
        Fields.ORDERS_PLANNED_DATE_OF_PERFORMANCE,        
        Fields.ORDERS_RESOLUTION_CREATION_DATE,        
        Fields.ORDERS_ITEM_NUMBER,        
        Fields.ORDERS_PRIVACY_FEATURE,        
        Fields.ORDERS_RESOLUTION_AUTHOR,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION,
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION,        
        Fields.ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING,        
        Fields.EXECUTOR,        
        Fields.EXECUTOR_ORGANIZATION,        
        Fields.EXECUTOR_ORGANIZATION_FULL_TITLE,
        Fields.EXECUTOR_ORGANIZATION_ABBREVIATION,        
        Fields.EXECUTOR_ORGANIZATION_OGRN_CODE,        
        Fields.EXECUTOR_ORGANIZATION_INN,        
        Fields.EXECUTOR_ORGANIZATION_ADDRESS,        
        Fields.ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY,        
        Fields.ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION,        
        Fields.EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE,        
        Fields.EXECUTOR_ORGANIZATION_ADDRESS_STREET,        
        Fields.EXECUTOR_ORGANIZATION_EMAIL,        
        Fields.EXECUTOR_EXECUTIVE_ADDRESSED,        
        Fields.EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME,        
        Fields.EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION,        
        Fields.EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION,        
        Fields.OREDER_FILES,
    ],
}; // Внешний обмен Эл. почта

export const REGISTRATION_MAILRESIVE: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    disabledFields: [
        //'MAILRECEIVE_ORIGINAL_IN_ELECTRONIC_FORM'
    ],
    fields: [
       Fields.DELETE_POST_AFTER_REGISTRATION,        
       Fields.DELETE_POST_AFTER_CANCELING_REGISTRATION,        
       Fields.NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT,        
       Fields.NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO,        
       Fields.ATTACH_DOCUMENT_PASSPORT_TO_RK,        
       Fields.TAKE_RUBRICS_RK,        
       Fields.TAKE_RUBRICS_RK_RADIO,        
       Fields.COMPLETE_INFORMATION_ABOUT_ACCOMPANYING_DOCUMENTS,        
       Fields.AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES,        
       Fields.CHECK_EMAIL_MESSAGES,        
       Fields.CHECK_EMAIL_FILE_ATTACHMENTS,        
       Fields.CHECK_EMAIL_RESOLUTION,        
       Fields.NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID,        
       Fields.NOTIFY_SENDER_IF_EMAIL_IS_VALID,        
       Fields.ORIGINAL_IN_ELECTRONIC_FORM,        
    ]
}; // Внешний обмен Эл. почта -> Параметры регистрации
    
export const REGISTRATION_DOP_OPERATION: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'AUTOSEND',
            type: 'boolean',
            title: 'Вызывать функцию "Переслать документ"' /*  в приложении Документы */
        },
        {
            key: 'AUTOLOAD_TO_EXEC_CURR_CAB',
            type: 'boolean',
            title: 'На исполнении'
        },
        {
            key: 'AUTOLOAD_TO_DELO_CURR_CAB',
            type: 'boolean',
            title: 'В дело'
        },
        {
            key: 'DOC_EXE_FROM_PREVIOUS_RC',
            type: 'boolean',
            title: 'Исполнители'
        },
        {
            key: 'DOC_SIGN_FROM_PREVIOUS_RC',
            type: 'boolean',
            title: 'Подписывающие'
        },
        {
            key: 'AUTOSTAMP',
            type: 'boolean',
            title: 'Входящий'
        },
        {
            key: 'AUTOSTAMP1',
            type: 'boolean',
            title: 'Исходящий'
        },
        {
            key: 'SECURLEVEL',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'От предыдущего документа'},
                {value: '1', title: 'Первый из справочника'}
            ]
        },
        {
            key: 'DELIVERY_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'От предыдущего документа'},
                {value: '1', title: 'Первый из справочника'}
            ]
        },
        {
            key: 'TESTRAPID_ONSAVE',
            type: 'boolean',
            title: 'Выполнять проверку автоматически'
        },
        {
            key: 'TESTRAPID_USECORRESP',
            type: 'boolean',
            title: 'Выполнять проверку по полю "Корреспондент"'
        },
        {
            key: 'PRJ2RC_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'FILELOCK',
            type: 'boolean',
            title: 'На редактирование прикрепляемых файлов'
        },
        {
            key: 'FILE_DONTDEL',
            type: 'boolean',
            title: 'На удаление прикрепляемых файлов'
        },
    ]
};

export const REGISTRATION_ADDRESSES: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'CORR_SIGN',
            type: 'boolean',
            title: '"Подписал (Корреспондент)"'
        },
        {
            key: 'ADDR_WHOUM',
            type: 'boolean',
            title: '"Кому (Адресаты)"'
        },
        {
            key: 'ORGGROUP',
            title: 'Помещать новые организации в вершину справочника "Организации"',
            type: 'string'
        },
    ]
};

export const REGISTRATION_SCAN: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SAVE_FORMAT',
            type: 'select',
            title: 'ФОРМАТ СОХРАНЕНИЯ ЭЛЕКТРОННОГО ОБРАЗА ДОКУМЕНТА:',
            options: [
                {value: '0', title: 'Простой текстовый файл (.txt)'},
                {value: '1', title: 'Rich Text Format (.rtf)'},
                {value: '2', title: 'MS Office (.docx)'},
                {value: '3', title: 'Open formats (.odt)'},
                {value: '4', title: 'Portable Document Format (.pdf)'}
            ]
        },
        {
            key: 'FIRST_PAGE_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал'},
                {value: '1', title: 'Отдельный лист'},
                {value: '2', title: 'Обратная сторона'}
            ]
        },
        {
            key: 'BARCODE_LOCATION',
            type: 'select',
            title: '',
            options: [
                {value: '4', title: 'На ленте'},
                {value: '0', title: 'Правый нижний'},
                {value: '1', title: 'Правый верхний'},
                {value: '2', title: 'Левый нижний'},
                {value: '3', title: 'Левый верхний'},
            ]
        },
        {
            key: 'SAERCH_ONLY',
            type: 'boolean',
            title: 'Штрих-код только для поиска'
        },
        {
            key: 'ORIENTATION_TYPE',
            type: 'radio',
            title: 'Ориентация листа',
            readonly: false,
            options: [
                {value: '0', title: 'Книжная'},
                {value: '1', title: 'Альбомная'}
            ]
        },
        {
            key: 'DEFAULT_VISUALITY',
            type: 'boolean',
            title: 'Визуальный контроль'
        },
        {
            key: 'LOCKFILE_SSCAN',
            type: 'boolean',
            title: 'Запретить редактирование прикрепленного файла'
        },
        // {
        //     key: 'SHABLONBARCODEL',
        //     type: 'select',
        //     title: '',
        //     options: [
        //     ]
        // },
        // {
        //     key: 'SAVEFORMAT',
        //     type: 'select',
        //     title: '',
        //     options: [

        //     ]
        // },
        
        // {
        //     key: 'TYPE_PRINT_BARCODE',
        //     type: 'radio',
        //     title: '',
        //     readonly: false,
        //     options: [
        //         {value: '0', title: 'Документе'},
        //         {value: '2', title: 'Обороте документа'},
        //         {value: '1', title: 'Чистом листе'}
        //     ]
        // },
        // {
        //     key: 'COUNT_PAGES_FOR_PRINT_BARCODE',
        //     type: 'numberIncrement',
        //     title: 'С пояснительной строкой',
        //     pattern: REG_MIN_VAL
        // },
        // {
        //     key: 'EXPLANATION_STRING_FOR_PRINT_BARCODE',
        //     type: 'boolean',
        //     title: 'С пояснительной строкой'
        // },
        // {
        //     key: 'FORM_BARCODE_FOR_SEARCH',
        //     type: 'boolean',
        //     title: 'Формировать штрих-код только для поиска'
        // },
    ]
};

export const REGISTRATION_AUTO_SEARCH: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'LINKED_SEARCHPARAM',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Рег. № всех видов документов'},
                {value: '2', title: 'Рег. № входящих документов'},
                {value: '3', title: 'Рег. № писем граждан'},
                {value: '4', title: 'Рег. № входящих документов и писем граждан'},
                {value: '5', title: 'Рег. № исходящих документов'},
                {value: '6', title: 'Исходящему № корреспондента'},
                {value: '7', title: 'Исходящему № сопроводительного документа'},
                {value: '8', title: 'Исходящему № корреспондента и сопр. документа'},
                {value: '9', title: 'Рег. № проектов документов'}
            ]
        },
        {
            key: 'LINKED_SEARCHVALUE',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'На равенство'},
                {value: '2', title: 'По началу №'},
                {value: '3', title: 'На вхождение'},
                {value: '4', title: 'Порядковый №'}
            ]
        },
        {
            key: 'LINKED_SEARCHYEAR',
            type: 'select',
            title: '', // 'Год регистрации:',
            options: [
                {value: '1', title: 'Нет'},
                {value: '2', title: 'Текущий'},
                {value: '3', title: 'Предыдущий'}
            ]
        },
        {
            key: 'LINKED_LINKTYPE',
            type: 'select',
            title: '', // 'Создавать связку с типом:',
            options: [
                {value: '0', title: ''},
                // {value: '1', title: 'Исполнено'},
                // {value: '2', title: 'Во исполнение'},
                // {value: '3', title: 'Первичный'},
                // {value: '4', title: 'Повторный'},
                // {value: '5', title: 'Зарегистрирован'},
                // {value: '6', title: 'Проект'},
                // {value: '3786', title: 'В дополнение'},
                // {value: '3787', title: 'Дополнен'},
                // {value: '4057035', title: 'В отмену'},
                // {value: '4057036', title: 'Отменен'},
                // {value: '3788', title: 'Общий автор'},
                // {value: '3790', title: 'Ответ на'},
                // {value: '3791', title: 'Обращение'},
                // {value: '4410', title: 'Запрос'},
                // {value: '4411', title: 'Ответ на запрос'},
                // {value: '4057038', title: 'Факс'},
                // {value: '4057039', title: 'Оригинал'}
            ]
        },
        {
            key: 'LINKS_SHOW_DG',
            type: 'boolean',
            title: 'Только рег.№ и дату регистрации'
        },
        {
            key: 'LINKS_SHOW_FIRST',
            type: 'boolean',
            title: 'Корр./Подписал/Исполнитель/Адресат'
        }, {
            key: 'LINKS_SHOW_CONTENT',
            type: 'boolean',
            title: 'Содержание'
        }, {
            key: 'LINKS_SHOW_FILES',
            type: 'boolean',
            title: 'Файлы'
        },
        {
            key: 'LINKED_WIN_SHOW',
            type: 'boolean',
            title: 'Всегда показывать список найденных документов'
        },
        {
            key: 'DEF_SEARCH_CITIZEN_SURNAME',
            type: 'boolean',
            title: 'Фамилия',
            keyPosition: 5
        },
        {
            key: 'DEF_SEARCH_CITIZEN_SURNAME_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'По началу'},
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 0,
        },
        {
            key: 'LINKS_SORT',
            type: 'radio',
            title: 'Сортировать связки:',
            options: [
                {value: 'ORDERNUM', title: 'По порядку'},
                {value: 'DOC_DATE', title: 'По дате регистрации документа (проекта)'}
            ],
            keyPosition: 0,
        },
        {
            key: 'LINKS_SORT_ORDER1',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: 'По возрастанию'},
                {value: '1', title: 'По убыванию'},
            ]
        },
        {
            key: 'LINKS_SORT_ORDER2',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: 'Сначала новые'},
                {value: '1', title: 'Сначала старые'},
            ]
        },
        {
            key: 'CORRESPONDENCE_SORT_ORDER',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: 'Сначала новые '},
                {value: '1', title: 'Сначала старые '}
            ],
            keyPosition: 0,
        },
        {
            key: 'DEF_SEARCH_CITIZEN_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 6
        },
        {
            key: 'DEF_SEARCH_CITIZEN_CITY_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'По началу'},
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 1,
        },
        {
            key: 'DEF_SEARCH_CITIZEN_INDEX',
            type: 'boolean',
            title: 'Индекс',
            keyPosition: 7
        },
        {
            key: 'DEF_SEARCH_CITIZEN_INDEX_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'По началу'},
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 2
        },
        {
            key: 'DEF_SEARCH_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 8,
        },
        {
            key: 'DEF_SEARCH_CITIZEN_ADDRESS_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'По началу'},
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 3
        },
        {
            key: 'DEF_SEARCH_CITIZEN_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 9,
        },
        {
            key: 'DEF_SEARCH_CITIZEN_REGION_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 4
        },
        {
            key: 'DEF_SEARCH_CITIZEN_OTHER',
            type: 'boolean',
            title: 'Прочие',
            keyPosition: 11
        },
        {
            key: 'DEF_SEARCH_CITIZEN_OTHER_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '3', title: 'По началу'},
                {value: '1', title: 'На вхождение'},
                {value: '2', title: 'На равенство'}
            ],
            keyPosition: 10,
        },
    ]
};

export const REGISTRATION_RC: IBaseUsers =  {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [  {
        key: 'FIRST_PRJEXEC_FROM_PREV',
        type: 'boolean',
        title: 'Автоматически копировать исполнителя от предыдущего проекта документа'
    },
    {
        key: 'DONT_SHOW_PRJ_HIDDEN_FILES',
        type: 'boolean',
        title: 'Не показывать скрытые файлы'
    },
    {
        key: 'SHOW_PRJ_FILE_VERSIONS',
        type: 'boolean',
        title: 'Показывать версии файлов'
    },
    {
        key: 'SHOW_PRJ_VISA_FILES',
        type: 'boolean',
        title: 'Показывать файлы визы'
    },
    {
        key: 'SHOW_PRJ_SIGN_FILES',
        type: 'boolean',
        title: 'Показывать файлы подписи'
    },
    {
        key: 'CLOSE_PRJ_AFTER_SAVE_VISA_SING_AND_ADD_SUBVISA',
        type: 'boolean',
        title: 'Закрывать проект документа после визирования, подписания или добавления подчиненной визы'
    },
    {
        key: 'USE_NEW_PRJ_RC',
        type: 'boolean',
        title: 'Использовать новый интерфейс для РКПД'
    }
    ]
};
