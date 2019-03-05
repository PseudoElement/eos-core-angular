import { IBaseUsers} from '../../../shared/intrfaces/user-params.interfaces';
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
        'RCSEND_ORDERS_POINT_RESOLUTION'
    ],
    fields: [
        {
            key: 'RCSEND_HIDE_OPERATION_SEND_EMAIL',
            type: 'boolean',
            title: 'Скрыть операцию \'Отправить E-mail\'',
            keyPosition: 0,
            parent: null,
        },
        {
            key: 'RCSEND_ENCRYPTION',
            type: 'boolean',
            title: 'Шифрование',
            keyPosition: 1,
            parent: null,
        },
        {
            key: 'RCSEND_ELECTRONIC_SIGNATURE',
            type: 'boolean',
            title: 'Электронная подпись',
            keyPosition: 2,
            parent: null,
        },
        {
            key: 'RCSEND_COMPRESS_ATTACHED_FILES',
            type: 'boolean',
            title: 'Сжимать прикрепленные файлы',
            keyPosition: 3,
            parent: null,
        },
        {
            key: 'RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH',
            type: 'boolean',
            title: 'Учитывать вид отправки',
            keyPosition: 4,
            parent: null,
        },
        {
            key: 'RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE',
            type: 'boolean',
            title: 'Сообщить о доставке этого сообщения',
            keyPosition: 5,
            parent: null,
        },
        {
            key: 'RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
            type: 'boolean',
            title: 'Требуется уведомление о регистрации или отказе от нее',
            keyPosition: 6,
            parent: null,
        },
        {
            key: 'RECEIP_EMAIL',
            type: 'string',
            title: 'Адрес для квитанции о регистрации',
            parent: null,
            default: ''
        },
        {
            key: 'RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'весь документ'},
                {value: '1', title: 'выписку'}
            ],
            keyPosition: 7.8,
            parent: null,
        },
        {
            key: 'RCSEND_RESOLUTIONS',
            type: 'boolean',
            title: 'Резолюции',
            keyPosition: 9,
            parent: null,
        },
        {
            key: 'RCSEND_RESOLUTIONS_RADIO',
            type: 'radio',
            title: '',
         //   readonly: true,
            options: [
                {value: '0', title: '"свои"'},
                {value: '1', title: 'все'}
            ],
            keyPosition: 10.11,
            parent: null,
        },
        {
            key: 'RCSEND_ADDRESSEES',
            type: 'boolean',
            title: 'Адресаты',
            keyPosition: 168,
            parent: null,
        },
        {
            key: 'RCSEND_ADDRESSEES_RADIO',
            type: 'radio',
            title: '',
           // readonly: true,
            options: [
                {value: '0', title: '"свои"'},
                {value: '1', title: 'все'}
            ],
            keyPosition: '169.170',
            parent: null,
        },
        {
            key: 'RCSEND_GROUP_OF_DOCUMENTS',
            type: 'boolean',
            title: 'Группа документов',
            keyPosition: 12,
            parent: null,
        },
        {
            key: 'RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT',
            type: 'boolean',
            title: 'Состав документа',
            keyPosition: 13,
            parent: null,
        },
        {
            key: 'RCSEND_SUMMARY',
            type: 'boolean',
            title: 'Краткое содержание',
            keyPosition: 14,
            parent: null,
        },
        {
            key: 'RCSEND_SIGN_OF_COLLECTIVITY',
            type: 'boolean',
            title: 'Признак коллективности (письма гражданина)',
            keyPosition: 15,
            parent: null,
        },
        // --------------------------------------
        {
            key: 'RCSEND_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный номер',
            keyPosition: 16,
            parent: null,

        },
        {
            key: 'RCSEND_REGISTRATION_NUMBER_SUBSET',
            type: 'boolean',
            title: 'Регистрационный номер',
            keyPosition: 17,
            parent: 'RCSEND_REGISTRATION_NUMBER',
        },
        {
            key: 'RCSEND_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации',
            keyPosition: 18,
            parent: 'RCSEND_REGISTRATION_NUMBER',
        },
        // --------------------------------------
        {
            key: 'RCSEND_ACCESS_NECK',
            type: 'boolean',
            title: 'Гриф доступа',
            keyPosition: 19,
            parent: null,

        },
        {
            key: 'RCSEND_HEADINGS',
            type: 'boolean',
            title: 'Рубрики',
            keyPosition: 162,
            parent: null,
        },
        {
            key: 'RCSEND_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Сопроводительные документы',
            keyPosition: 166,
            parent: null,
        },
        {
            key: 'RCSEND_NOTE_TO_THE_RK',
            type: 'boolean',
            title: 'Примечание к РК',
            keyPosition: 163,
            parent: null,
        },
        {
            key: 'RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE',
            type: 'boolean',
            title: 'Примечание к адресату-получателю сообщения',
            keyPosition: 164,
            parent: null,
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR',
            type: 'boolean',
            title: 'Автор документа',
            keyPosition: 22,
            parent: null,
        },
        {
            key: 'RCSEND_VISAS',
            type: 'boolean',
            title: 'Визы',
            keyPosition: 53,
            parent: null,
        },
        {
            key: 'RCSEND_ADDRESSES',
            type: 'boolean',
            title: 'Адресаты',
            keyPosition: 71,
            parent: null,
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER',
            type: 'boolean',
            title: 'Исполнитель документа',
            keyPosition: 98,
            parent: null,
        },
        {
            key: 'RCSEND_ORDERS',
            type: 'boolean',
            title: 'Поручения',
            keyPosition: 115,
            parent: null,
        },
        {
            key: 'RCSEND_ADDITIONAL_DETAILS',
            type: 'boolean',
            title: 'Дополнительные реквизиты',
            keyPosition: 165,
            parent: null,
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 23,
            parent: 'RCSEND_DOCUMENT_AUTHOR',
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 24,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 25,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 26,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 27,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'

        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 28,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 29,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 30,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 31,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 32,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 33,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
            type: 'boolean',
            title: 'Подписал',
            keyPosition: 34,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'

        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 35,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 37,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 38,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 39,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
            type: 'boolean',
            title: 'Номер автора документа',
            keyPosition: 40,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
            type: 'boolean',
            title: 'Регистрационный номер',
            keyPosition: 41,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION',
            type: 'boolean',
            title: 'Дата регистрации',
            keyPosition: 42,
            parent: 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN',
            type: 'boolean',
            title: 'Гражданин',
            keyPosition: 43,
            parent: 'RCSEND_DOCUMENT_AUTHOR'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 44,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС',
            keyPosition: 45,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные',
            keyPosition: 46,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 47,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 48,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 49,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 50,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 51,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон',
            keyPosition: 52,
            parent: 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 54,
            parent: 'RCSEND_VISAS'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 55,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 56,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 57,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 58,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 59,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 60,
            parent: 'RCSEND_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 61,
            parent: 'RCSEND_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 62,
            parent: 'RCSEND_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 63,
            parent: 'RCSEND_VISAS_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 64,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 65,
            parent: 'RCSEND_VISAS_ORGANIZATION'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 66,
            parent: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 68,
            parent: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 69,
            parent: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE'
        },
        {
            key: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 70,
            parent: 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE'
        },
        // ---------------------------------------------------
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 72,
            parent: 'RCSEND_ADDRESSES'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 73,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 74,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 75,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 76,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 77,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 78,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 79,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 80,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 81,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 82,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
            type: 'boolean',
            title: 'Кому адресован',
            keyPosition: 83,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 84,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'

        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 86,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
        },
        {
            key: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 87,
            parent: 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
        },

        {
            key: 'RCSEND_ADDRESSES_CITIZEN',
            type: 'boolean',
            title: 'Гражданин',
            keyPosition: 88,
            parent: 'RCSEND_ADDRESSES'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 89,
            parent: 'RCSEND_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_INN_SNILS',
            type: 'boolean',
            title: 'ИНН, СНИЛС',
            keyPosition: 90,
            parent: 'RCSEND_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS',
            type: 'boolean',
            title: 'Паспортные данные',
            keyPosition: 91,
            parent: 'RCSEND_ADDRESSES_CITIZEN'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 92,
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 93,
            parent: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 94,
            parent: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 95,
            parent: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 96,
            parent: 'RCSEND_ADDRESSES_CITIZEN_ADDRESS'
        },
        {
            key: 'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE',
            type: 'boolean',
            title: 'E-mail, телефон',
            keyPosition: 98,
            parent: 'RCSEND_ADDRESSES_CITIZEN'
        },
        // Исполнитель документа
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 99,
            parent: 'RCSEND_DOCUMENT_PERFORMER'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 100,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 101,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 102,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 103,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 104,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 105,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 106,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 107,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 108,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 109,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 110,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 111,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 113,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 114,
            parent: 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },

        // Поручения
        {
            key: 'RCSEND_ORDERS_SYSTEM_NUMBER',
            type: 'boolean',
            title: 'Системный номер',
            keyPosition: 116,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_POINT_RESOLUTION',
            type: 'boolean',
            title: 'Пункт/резолюция',
            keyPosition: 117,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_ORDER_TEXT',
            type: 'boolean',
            title: 'Текст поручения',
            keyPosition: 118,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE',
            type: 'boolean',
            title: 'Плановая дата исполнения',
            keyPosition: 119,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_CREATION_DATE',
            type: 'boolean',
            title: 'Дата создания резолюции',
            keyPosition: 120,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_ITEM_NUMBER',
            type: 'boolean',
            title: 'Номер пункта',
            keyPosition: 121,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_PRIVACY_FEATURE',
            type: 'boolean',
            title: 'Признак конфиденциальности',
            keyPosition: 122,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR',
            type: 'boolean',
            title: 'Автор резолюции',
            keyPosition: 123,
            parent: 'RCSEND_ORDERS'
        },

        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 124,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 125,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 126,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 127,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 128,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 129,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 130,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 131,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 132,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 133,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 134,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 135,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 136,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 139,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 140,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
            type: 'boolean',
            title: 'Дата подписания',
            keyPosition: 141,
            parent: 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
        },

        {
            key: 'RCSEND_EXECUTOR',
            type: 'boolean',
            title: 'Исполнитель',
            keyPosition: 142,
            parent: 'RCSEND_ORDERS'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION',
            type: 'boolean',
            title: 'Организация',
            keyPosition: 143,
            parent: 'RCSEND_EXECUTOR'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE',
            type: 'boolean',
            title: 'Полное название',
            keyPosition: 144,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION',
            type: 'boolean',
            title: 'Сокращенное название',
            keyPosition: 145,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
            type: 'boolean',
            title: 'Код ОГРН',
            keyPosition: 146,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_INN',
            type: 'boolean',
            title: 'ИНН',
            keyPosition: 147,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS',
            type: 'boolean',
            title: 'Адрес',
            keyPosition: 148,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
            type: 'boolean',
            title: 'Город',
            keyPosition: 149,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
            type: 'boolean',
            title: 'Регион',
            keyPosition: 150,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
            type: 'boolean',
            title: 'Почтовый индекс',
            keyPosition: 151,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET',
            type: 'boolean',
            title: 'Улица, дом',
            keyPosition: 152,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL',
            type: 'boolean',
            title: 'E-mail',
            keyPosition: 153,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
            type: 'boolean',
            title: 'Должностное лицо',
            keyPosition: 154,
            parent: 'RCSEND_EXECUTOR_ORGANIZATION'
        },
        {
            key: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME',
            type: 'boolean',
            title: 'ФИО',
            keyPosition: 155,
            parent: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'

        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
            type: 'boolean',
            title: 'Подразделение',
            keyPosition: 156,
            parent: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION',
            type: 'boolean',
            title: 'Должность',
            keyPosition: 157,
            parent: 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
        },
        {
            key: 'RCSEND_OREDER_FILES',
            type: 'boolean',
            title: 'Файлы поручений',
            keyPosition: 167,
            parent: 'RCSEND_ORDERS'
        },
    ],
};

export const REGISTRATION_MAILRESIVE: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'MAILRECEIVE_DELETE_POST_AFTER_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после регистрации',
            keyPosition: 0,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_DELETE_POST_AFTER_CANCELING_REGISTRATION',
            type: 'boolean',
            title: 'Удалить сообщение после отказа от регистрации',
            keyPosition: 10,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT',
            type: 'boolean',
            title: 'Уведомлять о регистрации или отказе от нее',
            keyPosition: 1,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Всегда'},
                {value: '1', title: 'По заказу корреспондента'}
            ],
            keyPosition: '2.3',
            parent: 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'
        },
        {
            key: 'MAILRECEIVE_ATTACH_DOCUMENT_PASSPORT_TO_RK',
            type: 'boolean',
            title: 'Прикрепить к РК паспорт документа',
            keyPosition: 4,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_TAKE_RUBRICS_RK',
            type: 'boolean',
            title: 'Принимать рубрики РК',
            keyPosition: 5,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_TAKE_RUBRICS_RK_RADIO',
            type: 'radio',
            title: '',
            options: [
                {value: '0', title: 'Определять рубрику по Коду'},
                {value: '1', title: 'Определять рубрику по Наименованию'},
                {value: '-1', title: 'Определять рубрику по Коду и Наименованию'}
            ],
            keyPosition: '6.7.8',
            parent: 'MAILRECEIVE_TAKE_RUBRICS_RK'
        },
        {
            key: 'MAILRECEIVE_ACCOMPANYING_DOCUMENTS',
            type: 'boolean',
            title: 'Сопроводительные документы',
            keyPosition: 15,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES',
            type: 'boolean',
            title: 'Автоматически добавлять организации и представителей',
            keyPosition: 9,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_MESSAGES',
            type: 'boolean',
            title: 'Проверять ЭП сообщения',
            keyPosition: 11,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_FILE_ATTACHMENTS',
            type: 'boolean',
            title: 'Проверять ЭП вложенных файлов',
            keyPosition: 12,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_CHECK_EMAIL_RESOLUTION',
            type: 'boolean',
            title: 'Проверять ЭП резолюции',
            keyPosition: 16,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП не действительна',
            keyPosition: 13,
            parent: null,
        },
        {
            key: 'MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_VALID',
            type: 'boolean',
            title: 'Сообщать отправителю, если ЭП действительна',
            keyPosition: 14,
            parent: null,
        },
    ]
};

export const REGISTRATION_DOP_OPERATION: IBaseUsers = {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'AUTOSEND',
            type: 'boolean',
            title: 'Автоматически вызывать функцию переслать РК'
        },
        {
            key: 'AUTOLOAD_TO_EXEC_CURR_CAB',
            type: 'boolean',
            title: 'На исполнение текущего кабинета'
        },
        {
            key: 'AUTOLOAD_TO_DELO_CURR_CAB',
            type: 'boolean',
            title: 'В дело текущего кабинета'
        },
        {
            key: 'AUTOSTAMP',
            type: 'boolean',
            title: 'Автоматическая печать регистрационного штампа (входящий)'
        },
        {
            key: 'AUTOSTAMP1',
            type: 'boolean',
            title: 'Автоматическая печать регистрационного штампа (исходящий)'
        },
        {
            key: 'SECURLEVEL',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'DELIVERY_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'от предыдущей РК'},
                {value: '1', title: 'первый из справочника'}
            ]
        },
        {
            key: 'TESTRAPID_ONSAVE',
            type: 'boolean',
            title: 'Автоматически вызывать проверку повторности РК'
        },
        {
            key: 'TESTRAPID_USECORRESP',
            type: 'boolean',
            title: 'Проверять корреспондента'
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
            title: 'Запрет на редактирование прикрепляемых файлов'
        },
        {
            key: 'FILE_DONTDEL',
            type: 'boolean',
            title: 'Запрет на удаление прикрепляемых файлов'
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
            title: 'Заполнять поле "Подписал" (Корреспондент) из справочника'
        },
        {
            key: 'ADDR_WHOUM',
            type: 'boolean',
            title: 'Заполнять поле "Кому" (Адресат) из справочника '
        },
        {
            key: 'ORGGROUP',
            title: '',
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
            key: 'SHABLONBARCODE',
            type: 'select',
            title: '',
            options: [
            ]
        },
        {
            key: 'SHABLONBARCODEL',
            type: 'select',
            title: '',
            options: [
            ]
        },
        {
            key: 'SAVEFORMAT',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: ''},
                {value: '1', title: 'формат сохранения по умолчанию, rtf'}
            ]
        },
        {
            key: 'LOCKFILE_SSCAN',
            type: 'boolean',
            title: 'Запретить редактирование прикрепленного файла'
        }
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
                {value: '1', title: 'Точное'},
                {value: '2', title: 'Начало номера'},
                {value: '3', title: 'Подстрока'},
                {value: '4', title: 'Порядковый'}
            ]
        },
        {
            key: 'LINKED_SEARCHYEAR',
            type: 'select',
            title: '',
            options: [
                {value: '1', title: 'Нет'},
                {value: '2', title: 'Текущий'},
                {value: '3', title: 'Предыдущий'}
            ]
        },
        {
            key: 'LINKED_LINKTYPE',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: ''},
                {value: '1', title: 'Исполнено'},
                {value: '2', title: 'Во исполнение'},
                {value: '3', title: 'Первичный'},
                {value: '4', title: 'Повторный'},
                {value: '5', title: 'Зарегистрирован'},
                {value: '6', title: 'Проект'},
                {value: '3786', title: 'В дополнение'},
                {value: '3787', title: 'Дополнен'},
                {value: '4057035', title: 'В отмену'},
                {value: '4057036', title: 'Отменен'},
                {value: '3788', title: 'Общий автор'},
                {value: '3790', title: 'Ответ на'},
                {value: '3791', title: 'Обращение'},
                {value: '4410', title: 'Запрос'},
                {value: '4411', title: 'Ответ на запрос'},
                {value: '4057038', title: 'Факс'},
                {value: '4057039', title: 'Оригинал'}
            ]
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
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
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
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
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
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
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
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
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
                {value: '1', title: 'на вхождение'},
                {value: '2', title: 'на равенство'}
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
                {value: '3', title: 'по началу'},
                {value: '1', title: 'по подстроке'},
                {value: '2', title: 'на равенство'}
            ],
            keyPosition: 10,
        },
    ]
};

export const REGISTRATION_SEB: IBaseUsers =  {
    id: 'registration',
    title: 'Регистрация',
    apiInstance: 'USER_PARMS',
    fields: [{
        key: 'SEV_HIDE_SENDING',
        type: 'boolean',
        title: 'Скрыть операцию "Отправить сообщение СЭВ"'
    },
    {
        key: 'SEV_ALLOW_DELIVERY',
        type: 'boolean',
        title: 'Учитывать вид отправки'
    },
    ]
};
