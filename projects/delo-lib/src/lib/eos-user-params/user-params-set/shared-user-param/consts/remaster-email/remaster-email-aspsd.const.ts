import { IBaseUsers } from "../../../../shared/intrfaces/user-params.interfaces";

export const REGISTRATION_ASPSD: IBaseUsers = {
    id: 'ext-app',
    title: 'Внешний обмен',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'RCSEND_ASPSD_HIDE_OPERATION_SEND_EMAIL',
            type: 'boolean',
            title: 'Скрыть операцию \"Отправить E-mail\"',
            keyPosition: 0,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_EMAIL',
            type: 'boolean',
            title: 'Скрыть операцию отправки по АС ПСД без подготовки',
            keyPosition: 1,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_COMPRESS_ATTACHED_FILES',
            type: 'boolean',
            title: 'Сжимать прикрепленные файлы',
            keyPosition: 3,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_CONSIDER_THE_TYPE_OF_DISPATCH',
            type: 'boolean',
            title: 'Учитывать вид отправки',
            keyPosition: 4,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
            type: 'boolean',
            title: 'Требуется уведомление о регистрации или отказе от нее',
            keyPosition: 6,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Весь документ'},
                {value: '1', title: 'Выписку'}
            ],
            keyPosition: 7.8,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_RESOLUTIONS',
            type: 'boolean',
            title: 'Резолюции',
            keyPosition: 9,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_RESOLUTIONS_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Где адресат - исполнитель'},
                {value: '1', title: 'Все'}
            ],
            keyPosition: 10.11,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSEES',
            type: 'boolean',
            title: 'Адресаты',
            keyPosition: 168,
            readonly: true,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSEES_RADIO',
            type: 'radio',
            title: '',
            readonly: true,
            options: [
                {value: '0', title: 'Адресату - информация о себе'},
                {value: '1', title: 'Все'},
                {value: '-1', title: 'Свои'}
            ],
            keyPosition: '169.170.171',
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_GROUP_OF_DOCUMENTS',
            type: 'boolean',
            title: 'Группа документов',
            keyPosition: 12,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_THE_COMPOSITION_OF_THE_DOCUMENT',
            type: 'boolean',
            title: 'Состав документа',
            keyPosition: 13,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_SUMMARY',
            type: 'boolean',
            title: 'Содержание',
            keyPosition: 14,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_SIGN_OF_COLLECTIVITY',
            type: 'boolean',
            title: 'Признак коллективности (обращения гражданина)',
            keyPosition: 15,
            parent: null,
        },
        // --------------------------------------
        {
            key: 'RCSEND_ASPSD_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный №',
            keyPosition: 16,
            parent: null,

        },
        {
            key: 'RCSEND_ASPSD_REGISTRATION_NUMBER_SUBSET',
            type: 'boolean',
            title: 'Регистрационный №',
            keyPosition: 17,
            parent: 'RCSEND_ASPSD_REGISTRATION_NUMBER',
        },
        {
            key: 'RCSEND_ASPSD_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации',
            keyPosition: 18,
            parent: 'RCSEND_ASPSD_REGISTRATION_NUMBER',
        },
        // --------------------------------------
        {
            key: 'RCSEND_ASPSD_ACCESS_NECK',
            type: 'boolean',
            title: 'Гриф доступа',
            keyPosition: 19,
            parent: null,

        },
        {
            key: 'RCSEND_ASPSD_HEADINGS',
            type: 'boolean',
            title: 'Рубрики',
            keyPosition: 162,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Сопроводительные документы',
            keyPosition: 166,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_NOTE_TO_THE_RK',
            type: 'boolean',
            title: 'Примечание к РК',
            keyPosition: 163,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE',
            type: 'boolean',
            title: 'Примечание к адресату сообщения',
            keyPosition: 164,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR',
            type: 'boolean',
            title: 'Автор документа',
            keyPosition: 22,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_VISAS',
            type: 'boolean',
            title: 'Визы',
            keyPosition: 53,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES',
            type: 'boolean',
            title: 'Адресаты',
            keyPosition: 71,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER',
            type: 'boolean',
            title: 'Исполнитель документа',
            keyPosition: 98,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ORDERS',
            type: 'boolean',
            title: 'Поручения',
            keyPosition: 115,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_ADDITIONAL_DETAILS',
            type: 'boolean',
            title: 'Дополнительные реквизиты',
            keyPosition: 165,
            parent: null,
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 23,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR',
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 24,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 25,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 26,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 27,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'

        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 28,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 29,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 30,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 31,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 32,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 33,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
            type: 'boolean',
            title: 'Подписал',
            keyPosition: 34,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'

        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 35,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 37,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 38,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 39,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
            type: 'boolean',
            title: 'Номер автора документа',
            keyPosition: 40,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный номер',
            keyPosition: 41,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации',
            keyPosition: 42,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN',
            type: 'boolean',
            title: 'Гражданин',
            keyPosition: 43,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 44,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС',
            keyPosition: 45,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные',
            keyPosition: 46,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 47,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 48,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 49,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 50,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 51,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон',
            keyPosition: 52,
            parent: 'RCSEND_ASPSD_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 54,
            parent: 'RCSEND_ASPSD_VISAS'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 55,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 56,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 57,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 58,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 59,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 60,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 61,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 62,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 63,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 64,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 65,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 66,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 68,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 69,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 70,
            parent: 'RCSEND_ASPSD_VISAS_ORGANIZATION_EXECUTIVE'
        },
        // ---------------------------------------------------
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 72,
            parent: 'RCSEND_ASPSD_ADDRESSES'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 73,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 74,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 75,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 76,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 77,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 78,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 79,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 80,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 81,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 82,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
            type: 'boolean',
            title: 'Кому адресован',
            keyPosition: 83,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 84,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'

        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 86,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 87,
            parent: 'RCSEND_ASPSD_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
        },

        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN',
            type: 'boolean',
            title: 'Гражданин',
            keyPosition: 88,
            parent: 'RCSEND_ASPSD_ADDRESSES'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 89,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС',
            keyPosition: 90,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные',
            keyPosition: 91,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 92,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN'

        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 93,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 94,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 95,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 96,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ADDRESSES_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон',
            keyPosition: 98,
            parent: 'RCSEND_ASPSD_ADDRESSES_CITIZEN'
        },
        // Исполнитель документа
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 99,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 100,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 101,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 102,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 103,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 104,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 105,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 106,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 107,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 108,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 109,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 110,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 111,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 113,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 114,
            parent: 'RCSEND_ASPSD_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },

        // Поручения
        {
            key: 'RCSEND_ASPSD_ORDERS_SYSTEM_NUMBER',
            type: 'boolean',
            title: 'Системный номер',
            keyPosition: 116,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_POINT_RESOLUTION',
            type: 'boolean',
            title: 'Пункт/резолюция',
            keyPosition: 117,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_ORDER_TEXT',
            type: 'boolean',
            title: 'Текст поручения',
            keyPosition: 118,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_PLANNED_DATE_OF_PERFORMANCE',
            type: 'boolean',
            title: 'Плановая дата исполнения',
            keyPosition: 119,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_CREATION_DATE',
            type: 'boolean',
            title: 'Дата создания резолюции',
            keyPosition: 120,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_ITEM_NUMBER',
            type: 'boolean',
            title: 'Номер пункта',
            keyPosition: 121,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_PRIVACY_FEATURE',
            type: 'boolean',
            title: 'Признак конфиденциальности',
            keyPosition: 122,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR',
            type: 'boolean',
            title: 'Автор резолюции',
            keyPosition: 123,
            parent: 'RCSEND_ASPSD_ORDERS'
        },

        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 124,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 125,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 126,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 127,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 128,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 129,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 130,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 131,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 132,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 133,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 134,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 135,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 136,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 139,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 140,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 141,
            parent: 'RCSEND_ASPSD_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR',
            type: 'boolean',
            title: 'Исполнитель',
            keyPosition: 142,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 143,
            parent: 'RCSEND_ASPSD_EXECUTOR'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 144,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 145,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 146,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 147,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 148,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 149,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 150,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 151,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 152,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 153,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 154,
            parent: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 155,
            parent: 'RCSEND_ASPSD_EXECUTOR_EXECUTIVE_ADDRESSED'

        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 156,
            parent: 'RCSEND_ASPSD_EXECUTOR_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 157,
            parent: 'RCSEND_ASPSD_EXECUTOR_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ASPSD_OREDER_FILES',
            type: 'boolean',
            title: 'Файлы поручений',
            keyPosition: 167,
            parent: 'RCSEND_ASPSD_ORDERS'
        },
    ]
}

export const REGISTRATION_MAILRESIVE_ASPSD: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'MAILRECEIVE_ASPSD_DELETE_POST_AFTER_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после регистрации',
            keyPosition: 0,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_DELETE_POST_AFTER_CANCELING_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после отказа от регистрации',
            keyPosition: 10,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT',
            type: 'boolean',
            title: 'Уведомлять о регистрации или отказе от нее',
            keyPosition: 1,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Всегда'},
                {value: '1', title: 'По заказу корреспондента'}
            ],
            keyPosition: '2.3',
            parent: 'MAILRECEIVE_ASPSD_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'
        },
        {
            key: 'MAILRECEIVE_ASPSD_ATTACH_DOCUMENT_PASSPORT_TO_RK',
            type: 'boolean',
            title: 'Прикрепить к РК паспорт документа',
            keyPosition: 4,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_TAKE_RUBRICS_RK',
            type: 'boolean',
            title: 'Принимать рубрики РК',
            keyPosition: 5,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_TAKE_RUBRICS_RK_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Определять рубрику по Коду'},
                {value: '1', title: 'Определять рубрику по Наименованию'},
                {value: '-1', title: 'Определять рубрику по Коду и Наименованию'}
            ],
            keyPosition: '6.7.8',
            parent: 'MAILRECEIVE_ASPSD_TAKE_RUBRICS_RK'
        },
        {
            key: 'MAILRECEIVE_ASPSD_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Заполнять информацию о сопроводительных документах',
            keyPosition: 15,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES',
            type: 'boolean',
            title: 'Автоматически добавлять организации и представителей в справочник «Организации»',
            keyPosition: 9,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_CHECK_EMAIL_MESSAGES',
            type: 'boolean',
            title: 'Проверять ЭП сообщения',
            keyPosition: 11,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_CHECK_EMAIL_FILE_ATTACHMENTS',
            type: 'boolean',
            title: 'Проверять ЭП вложенных файлов',
            keyPosition: 12,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_CHECK_EMAIL_RESOLUTION',
            type: 'boolean',
            title: 'Проверять ЭП резолюции',
            keyPosition: 16,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП не действительна',
            keyPosition: 13,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_ASPSD_LK_NOTIFY_SENDER_IF_EMAIL_IS_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП действительна',
            keyPosition: 14,
            parent: null,
        },
    ]
};
