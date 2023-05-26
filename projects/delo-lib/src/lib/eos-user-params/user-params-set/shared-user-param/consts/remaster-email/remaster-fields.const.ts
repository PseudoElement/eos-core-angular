// Внешний обмен Эл. почта
/** Скрыть операцию \"Отправить E-mail\" */
export const HIDE_OPERATION_SEND_EMAIL = {
    key: 'HIDE_OPERATION_SEND_EMAIL',
    type: 'boolean',
    title: 'Скрыть операцию \"Отправить E-mail\"',
    keyPosition: 0,
    parent: null,
}
/** Шифрование */
export const ENCRYPTION = {
    key: 'ENCRYPTION',
    type: 'boolean',
    title: 'Шифрование',
    keyPosition: 1,
    parent: null,
}
/** Электронная подпись */
export const ELECTRONIC_SIGNATURE = {
    key: 'ELECTRONIC_SIGNATURE',
    type: 'boolean',
    title: 'Электронная подпись',
    keyPosition: 2,
    parent: null,
};
/** Сжимать прикрепленные файлы */
export const COMPRESS_ATTACHED_FILES =  {
    key: 'COMPRESS_ATTACHED_FILES',
    type: 'boolean',
    title: 'Сжимать прикрепленные файлы',
    keyPosition: 3,
    parent: null,
};
/** Учитывать вид отправки */
export const CONSIDER_THE_TYPE_OF_DISPATCH = {
    key: 'CONSIDER_THE_TYPE_OF_DISPATCH',
    type: 'boolean',
    title: 'Учитывать вид отправки',
    keyPosition: 4,
    parent: null,
}
/** Скрыть операцию отправки по e-mail без подготовки */
export const EMAIL = {
    key: 'EMAIL',
    type: 'boolean',
    title: 'Скрыть операцию отправки по e-mail без подготовки',
    keyPosition: 1,
    parent: null,
};
/** Требуется уведомление о регистрации или отказе от нее */
export const REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT = {
    key: 'REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
    type: 'boolean',
    title: 'Требуется уведомление о регистрации или отказе от нее',
    keyPosition: 6,
    parent: null,
};
/** Адрес для квитанции о регистрации */
export const RECEIP_EMAIL = {
    key: 'RECEIP_EMAIL',
    type: 'string',
    title: 'Адрес для квитанции о регистрации',
    parent: null,
    default: ''
};
/** FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO */
export const FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO = {
    key: 'FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO',
    type: 'radio',
    title: '',
    options: [
        {value: '0', title: 'Весь документ'},
        {value: '1', title: 'Выписку'}
    ],
    keyPosition: 7.8,
    parent: null,
};
/** Резолюции */
export const RESOLUTIONS = {
    key: 'RESOLUTIONS',
    type: 'boolean',
    title: 'Резолюции',
    keyPosition: 9,
    parent: null,
};
/** RESOLUTIONS_RADIO */
export const RESOLUTIONS_RADIO = {
    key: 'RESOLUTIONS_RADIO',
    type: 'radio',
    title: '',
    options: [
        {value: '0', title: 'Где адресат - исполнитель'},
        {value: '1', title: 'Все'}
    ],
    keyPosition: 10.11,
    parent: null,
};
/** Адресаты */
export const ADDRESSEES = {
    key: 'ADDRESSEES',
    type: 'boolean',
    title: 'Адресаты',
    keyPosition: 168,
    parent: null,
};
/** ADDRESSEES_RADIO */
export const ADDRESSEES_RADIO = {
    key: 'ADDRESSEES_RADIO',
    type: 'radio',
    title: '',
    options: [
        {value: '0', title: 'Адресату - информация о себе'},
        {value: '1', title: 'Все'}
    ],
    keyPosition: '169.170',
    parent: null,
};
/** Группа документов */
export const GROUP_OF_DOCUMENTS = {
    key: 'GROUP_OF_DOCUMENTS',
    type: 'boolean',
    title: 'Группа документов',
    keyPosition: 12,
    parent: null,
};
/** Состав документа */
export const THE_COMPOSITION_OF_THE_DOCUMENT = {
    key: 'THE_COMPOSITION_OF_THE_DOCUMENT',
    type: 'boolean',
    title: 'Состав документа',
    keyPosition: 13,
    parent: null,
};
/** Содержание */
export const SUMMARY = {
    key: 'SUMMARY',
    type: 'boolean',
    title: 'Содержание',
    keyPosition: 14,
    parent: null,
};
/** Признак коллективности (обращения гражданина) */
export const SIGN_OF_COLLECTIVITY = {
    key: 'SIGN_OF_COLLECTIVITY',
    type: 'boolean',
    title: 'Признак коллективности (обращения гражданина)',
    keyPosition: 15,
    parent: null,
};
/** Регистрационный № */
export const REGISTRATION_NUMBER = {
    key: 'REGISTRATION_NUMBER',
    type: 'boolean',
    title: 'Регистрационный №',
    keyPosition: 16,
    parent: null,
};
/** Регистрационный № */
export const REGISTRATION_NUMBER_SUBSET = {
    key: 'REGISTRATION_NUMBER_SUBSET',
    type: 'boolean',
    title: 'Регистрационный №',
    keyPosition: 17,
    parent: 'REGISTRATION_NUMBER',
};
/** Дата регистрации */
export const DATE_OF_REGISTRATION = {
    key: 'DATE_OF_REGISTRATION',
    type: 'boolean',
    title: 'Дата регистрации',
    keyPosition: 18,
    parent: 'REGISTRATION_NUMBER',
};

/** Гриф доступа */
export const ACCESS_NECK = {
    key: 'ACCESS_NECK',
    type: 'boolean',
    title: 'Гриф доступа',
    keyPosition: 19,
    parent: null,

};
/** Рубрики */
export const HEADINGS = {
    key: 'HEADINGS',
    type: 'boolean',
    title: 'Рубрики',
    keyPosition: 162,
    parent: null,
};
/** Сопроводительные документы */
export const ACCOMPANYING_DOCUMENTS = {
    key: 'ACCOMPANYING_DOCUMENTS',
    type: 'boolean',
    title: 'Сопроводительные документы',
    keyPosition: 166,
    parent: null,
};
/** Примечание к РК */
export const NOTE_TO_THE_RK = {
    key: 'NOTE_TO_THE_RK',
    type: 'boolean',
    title: 'Примечание к РК',
    keyPosition: 163,
    parent: null,
};
/** Примечание к адресату сообщения */
export const NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE = {
    key: 'NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE',
    type: 'boolean',
    title: 'Примечание к адресату сообщения',
    keyPosition: 164,
    parent: null,
};
/** Автор документа */
export const DOCUMENT_AUTHOR = {
    key: 'DOCUMENT_AUTHOR',
    type: 'boolean',
    title: 'Автор документа',
    keyPosition: 22,
    parent: null,
};
/** Визы */
export const VISAS = {
    key: 'VISAS',
    type: 'boolean',
    title: 'Визы',
    keyPosition: 53,
    parent: null,
};
/** Адресаты */
export const ADDRESSES = {
    key: 'ADDRESSES',
    type: 'boolean',
    title: 'Адресаты',
    keyPosition: 71,
    parent: null,
};
/** Исполнитель документа */
export const DOCUMENT_PERFORMER = {
    key: 'DOCUMENT_PERFORMER',
    type: 'boolean',
    title: 'Исполнитель документа',
    keyPosition: 98,
    parent: null,
};
/** Поручения */
export const ORDERS = {
    key: 'ORDERS',
    type: 'boolean',
    title: 'Поручения',
    keyPosition: 115,
    parent: null,
};
/** Дополнительные реквизиты */
export const ADDITIONAL_DETAILS = {
    key: 'ADDITIONAL_DETAILS',
    type: 'boolean',
    title: 'Дополнительные реквизиты',
    keyPosition: 165,
    parent: null,
};
/** Организация */
export const DOCUMENT_AUTHOR_ORGANIZATION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 23,
    parent: 'DOCUMENT_AUTHOR',
};
/** Полное название */
export const DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 24,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Сокращенное название */
export const DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 25,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Код ОГРН */
export const DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 26,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** ИНН */
export const DOCUMENT_AUTHOR_ORGANIZATION_INN = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 27,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Адрес */
export const DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 28,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Город */
export const DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 29,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Регион */
export const DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 30,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 31,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 32,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'
};
/** E-mail */
export const DOCUMENT_AUTHOR_ORGANIZATION_EMAIL = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 33,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Подписал */
export const DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
    type: 'boolean',
    title: 'Подписал',
    keyPosition: 34,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'

};
/** ФИО */
export const DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 35,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
};
/** Подразделение */
export const DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 37,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
};
/** Должность */
export const DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 38,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
};
/** Дата подписания */
export const DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
    type: 'boolean',
    title: 'Дата подписания',
    keyPosition: 39,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'
};
/** Номер автора документа */
export const DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
    type: 'boolean',
    title: 'Номер автора документа',
    keyPosition: 40,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION'
};
/** Регистрационный номер */
export const DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
    type: 'boolean',
    title: 'Регистрационный номер',
    keyPosition: 41,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
};
/** Дата регистрации */
export const DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION = {
    key: 'DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION',
    type: 'boolean',
    title: 'Дата регистрации',
    keyPosition: 42,
    parent: 'DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'
};
/** Гражданин */
export const DOCUMENT_AUTHOR_CITIZEN = {
    key: 'DOCUMENT_AUTHOR_CITIZEN',
    type: 'boolean',
    title: 'Гражданин',
    keyPosition: 43,
    parent: 'DOCUMENT_AUTHOR'
};
/** ФИО */
export const DOCUMENT_AUTHOR_CITIZEN_FULL_NAME = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 44,
    parent: 'DOCUMENT_AUTHOR_CITIZEN'
};
/** ИНН, СНИЛС */
export const DOCUMENT_AUTHOR_CITIZEN_INN_SNILS = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
    type: 'boolean',
    title: 'ИНН, СНИЛС',
    keyPosition: 45,
    parent: 'DOCUMENT_AUTHOR_CITIZEN'
};
/** Паспортные данные */
export const DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS',
    type: 'boolean',
    title: 'Паспортные данные',
    keyPosition: 46,
    parent: 'DOCUMENT_AUTHOR_CITIZEN'
};
/** Адрес */
export const DOCUMENT_AUTHOR_CITIZEN_ADDRESS = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 47,
    parent: 'DOCUMENT_AUTHOR_CITIZEN'
};
/** Город */
export const DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 48,
    parent: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
};
/** Регион */
export const DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 49,
    parent: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
};
/** Почтовый индекс */
export const DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 50,
    parent: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
};
/** Улица, дом */
export const DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 51,
    parent: 'DOCUMENT_AUTHOR_CITIZEN_ADDRESS'
};
/** E-mail, телефон */
export const DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE = {
    key: 'DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE',
    type: 'boolean',
    title: 'E-mail, телефон',
    keyPosition: 52,
    parent: 'DOCUMENT_AUTHOR_CITIZEN'
};
/** Организация */
export const VISAS_ORGANIZATION = {
    key: 'VISAS_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 54,
    parent: 'VISAS'
};
/** Полное название */
export const VISAS_ORGANIZATION_FULL_TITLE = {
    key: 'VISAS_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 55,
    parent: 'VISAS_ORGANIZATION'
};
/** Сокращенное название */
export const VISAS_ORGANIZATION_ABBREVIATION = {
    key: 'VISAS_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 56,
    parent: 'VISAS_ORGANIZATION'
};
/** Код ОГРН */
export const VISAS_ORGANIZATION_OGRN_CODE = {
    key: 'VISAS_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 57,
    parent: 'VISAS_ORGANIZATION'
};
/** ИНН */
export const VISAS_ORGANIZATION_INN = {
    key: 'VISAS_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 58,
    parent: 'VISAS_ORGANIZATION'
};
/** Адрес */
export const VISAS_ORGANIZATION_ADDRESS = {
    key: 'VISAS_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 59,
    parent: 'VISAS_ORGANIZATION'
};
/** Город */
export const VISAS_ORGANIZATION_ADDRESS_CITY = {
    key: 'VISAS_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 60,
    parent: 'VISAS_ORGANIZATION_ADDRESS'
};
/** Регион */
export const VISAS_ORGANIZATION_ADDRESS_REGION = {
    key: 'VISAS_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 61,
    parent: 'VISAS_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const VISAS_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'VISAS_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 62,
    parent: 'VISAS_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const VISAS_ORGANIZATION_ADDRESS_STREET = {
    key: 'VISAS_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 63,
    parent: 'VISAS_ORGANIZATION_ADDRESS'
};
/** E-mail */
export const VISAS_ORGANIZATION_EMAIL = {
    key: 'VISAS_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 64,
    parent: 'VISAS_ORGANIZATION'
};
/** Должностное лицо */
export const VISAS_ORGANIZATION_EXECUTIVE = {
    key: 'VISAS_ORGANIZATION_EXECUTIVE',
    type: 'boolean',
    title: 'Должностное лицо',
    keyPosition: 65,
    parent: 'VISAS_ORGANIZATION'
};
/** ФИО */
export const VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME = {
    key: 'VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 66,
    parent: 'VISAS_ORGANIZATION_EXECUTIVE'
};
/** Подразделение */
export const VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION = {
    key: 'VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 68,
    parent: 'VISAS_ORGANIZATION_EXECUTIVE'
};
/** Должность */
export const VISAS_ORGANIZATION_EXECUTIVE_POSITION = {
    key: 'VISAS_ORGANIZATION_EXECUTIVE_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 69,
    parent: 'VISAS_ORGANIZATION_EXECUTIVE'
};
/** Дата подписания */
export const VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING = {
    key: 'VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
    type: 'boolean',
    title: 'Дата подписания',
    keyPosition: 70,
    parent: 'VISAS_ORGANIZATION_EXECUTIVE'
};
/** Организация */
export const ADDRESSES_ORGANIZATION = {
    key: 'ADDRESSES_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 72,
    parent: 'ADDRESSES'
};
/** Полное название */
export const ADDRESSES_ORGANIZATION_FULL_TITLE = {
    key: 'ADDRESSES_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 73,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** Сокращенное название */
export const ADDRESSES_ORGANIZATION_ABBREVIATION = {
    key: 'ADDRESSES_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 74,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** Код ОГРН */
export const ADDRESSES_ORGANIZATION_OGRN_CODE = {
    key: 'ADDRESSES_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 75,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** ИНН */
export const ADDRESSES_ORGANIZATION_INN = {
    key: 'ADDRESSES_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 76,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** Адрес */
export const ADDRESSES_ORGANIZATION_ADDRESS = {
    key: 'ADDRESSES_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 77,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** Город */
export const ADDRESSES_ORGANIZATION_ADDRESS_CITY = {
    key: 'ADDRESSES_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 78,
    parent: 'ADDRESSES_ORGANIZATION_ADDRESS'
};
/** Регион */
export const ADDRESSES_ORGANIZATION_ADDRESS_REGION = {
    key: 'ADDRESSES_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 79,
    parent: 'ADDRESSES_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 80,
    parent: 'ADDRESSES_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const ADDRESSES_ORGANIZATION_ADDRESS_STREET = {
    key: 'ADDRESSES_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 81,
    parent: 'ADDRESSES_ORGANIZATION_ADDRESS'
};
/** E-mail */
export const ADDRESSES_ORGANIZATION_EMAIL = {
    key: 'ADDRESSES_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 82,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** Кому адресован */
export const ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED = {
    key: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
    type: 'boolean',
    title: 'Кому адресован',
    keyPosition: 83,
    parent: 'ADDRESSES_ORGANIZATION'
};
/** ФИО */
export const ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME = {
    key: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 84,
    parent: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
};
/** Подразделение */
export const ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION = {
    key: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 86,
    parent: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
};
/** Должность */
export const ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION = {
    key: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 87,
    parent: 'ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
};
/** Гражданин */
export const ADDRESSES_CITIZEN = {
    key: 'ADDRESSES_CITIZEN',
    type: 'boolean',
    title: 'Гражданин',
    keyPosition: 88,
    parent: 'ADDRESSES'
};
/** ФИО */
export const ADDRESSES_CITIZEN_FULL_NAME = {
    key: 'ADDRESSES_CITIZEN_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 89,
    parent: 'ADDRESSES_CITIZEN'
};
/** ИНН, СНИЛС */
export const ADDRESSES_CITIZEN_INN_SNILS = {
    key: 'ADDRESSES_CITIZEN_INN_SNILS',
    type: 'boolean',
    title: 'ИНН, СНИЛС',
    keyPosition: 90,
    parent: 'ADDRESSES_CITIZEN'
};
/** Паспортные данные */
export const ADDRESSES_CITIZEN_PASSPORT_DETAILS = {
    key: 'ADDRESSES_CITIZEN_PASSPORT_DETAILS',
    type: 'boolean',
    title: 'Паспортные данные',
    keyPosition: 91,
    parent: 'ADDRESSES_CITIZEN'
};
/** Адрес */
export const ADDRESSES_CITIZEN_ADDRESS = {
    key: 'ADDRESSES_CITIZEN_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 92,
    parent: 'ADDRESSES_CITIZEN'
};
/** Город */
export const ADDRESSES_CITIZEN_ADDRESS_CITY = {
    key: 'ADDRESSES_CITIZEN_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 93,
    parent: 'ADDRESSES_CITIZEN_ADDRESS'
};
/** Регион */
export const ADDRESSES_CITIZEN_ADDRESS_REGION = {
    key: 'ADDRESSES_CITIZEN_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 94,
    parent: 'ADDRESSES_CITIZEN_ADDRESS'
};
/** Почтовый индекс */
export const ADDRESSES_CITIZEN_ADDRESS_POSTCODE = {
    key: 'ADDRESSES_CITIZEN_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 95,
    parent: 'ADDRESSES_CITIZEN_ADDRESS'
};
/** Улица, дом */
export const ADDRESSES_CITIZEN_ADDRESS_STREET = {
    key: 'ADDRESSES_CITIZEN_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 96,
    parent: 'ADDRESSES_CITIZEN_ADDRESS'
};
/** E-mail, телефон */
export const ADDRESSES_CITIZEN_EMAIL_PHONE = {
    key: 'ADDRESSES_CITIZEN_EMAIL_PHONE',
    type: 'boolean',
    title: 'E-mail, телефон',
    keyPosition: 98,
    parent: 'ADDRESSES_CITIZEN'
};
/** Организация */
export const DOCUMENT_PERFORMER_ORGANIZATION = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 99,
    parent: 'DOCUMENT_PERFORMER'
};
/** Полное название */
export const DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 100,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** Сокращенное название*/
export const DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 101,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** Код ОГРН */
export const DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 102,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** ИНН */
export const DOCUMENT_PERFORMER_ORGANIZATION_INN = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 103,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** Адрес */
export const DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 104,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** Город */
export const DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 105,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
};
/** Регион */
export const DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 106,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 107,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 108,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'
};
/** E-mail */
export const DOCUMENT_PERFORMER_ORGANIZATION_EMAIL = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 109,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** Должностное лицо */
export const DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
    type: 'boolean',
    title: 'Должностное лицо',
    keyPosition: 110,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION'
};
/** ФИО */
export const DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 111,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Подразделение */
export const DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 113,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Должность */
export const DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION = {
    key: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 114,
    parent: 'DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Системный номер */
export const ORDERS_SYSTEM_NUMBER = {
    key: 'ORDERS_SYSTEM_NUMBER',
    type: 'boolean',
    title: 'Системный номер',
    keyPosition: 116,
    parent: 'ORDERS'
};
/** Пункт/резолюция */
export const ORDERS_POINT_RESOLUTION = {
    key: 'ORDERS_POINT_RESOLUTION',
    type: 'boolean',
    title: 'Пункт/резолюция',
    keyPosition: 117,
    parent: 'ORDERS'
};
/** Текст поручения */
export const ORDERS_ORDER_TEXT = {
    key: 'ORDERS_ORDER_TEXT',
    type: 'boolean',
    title: 'Текст поручения',
    keyPosition: 118,
    parent: 'ORDERS'
};
/** Плановая дата исполнения */
export const ORDERS_PLANNED_DATE_OF_PERFORMANCE = {
    key: 'ORDERS_PLANNED_DATE_OF_PERFORMANCE',
    type: 'boolean',
    title: 'Плановая дата исполнения',
    keyPosition: 119,
    parent: 'ORDERS'
};
/** Дата создания резолюции */
export const ORDERS_RESOLUTION_CREATION_DATE = {
    key: 'ORDERS_RESOLUTION_CREATION_DATE',
    type: 'boolean',
    title: 'Дата создания резолюции',
    keyPosition: 120,
    parent: 'ORDERS'
};
/** Номер пункта */
export const ORDERS_ITEM_NUMBER = {
    key: 'ORDERS_ITEM_NUMBER',
    type: 'boolean',
    title: 'Номер пункта',
    keyPosition: 121,
    parent: 'ORDERS'
};
/** Признак конфиденциальности */
export const ORDERS_PRIVACY_FEATURE = {
    key: 'ORDERS_PRIVACY_FEATURE',
    type: 'boolean',
    title: 'Признак конфиденциальности',
    keyPosition: 122,
    parent: 'ORDERS'
};
/** Автор резолюции */
export const ORDERS_RESOLUTION_AUTHOR = {
    key: 'ORDERS_RESOLUTION_AUTHOR',
    type: 'boolean',
    title: 'Автор резолюции',
    keyPosition: 123,
    parent: 'ORDERS'
};
/** Организация */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 124,
    parent: 'ORDERS_RESOLUTION_AUTHOR'
};
/** Полное название */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 125,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** Сокращенное название */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 126,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** Код ОГРН */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 127,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** ИНН */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 128,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** Адрес */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 129,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** Город */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 130,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Регион */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 131,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 132,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 133,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
};
/** E-mail'*/
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 134,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** Должностное лицо */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
    type: 'boolean',
    title: 'Должностное лицо',
    keyPosition: 135,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'
};
/** ФИО */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 136,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Подразделение */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 139,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Должность */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 140,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Дата подписания */
export const ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING = {
    key: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING',
    type: 'boolean',
    title: 'Дата подписания',
    keyPosition: 141,
    parent: 'ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
};
/** Исполнитель */
export const EXECUTOR = {
    key: 'EXECUTOR',
    type: 'boolean',
    title: 'Исполнитель',
    keyPosition: 142,
    parent: 'ORDERS'
};
/** Организация */
export const EXECUTOR_ORGANIZATION = {
    key: 'EXECUTOR_ORGANIZATION',
    type: 'boolean',
    title: 'Организация',
    keyPosition: 143,
    parent: 'EXECUTOR'
};
/** Полное название */
export const EXECUTOR_ORGANIZATION_FULL_TITLE = {
    key: 'EXECUTOR_ORGANIZATION_FULL_TITLE',
    type: 'boolean',
    title: 'Полное название',
    keyPosition: 144,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** Сокращенное название */
export const EXECUTOR_ORGANIZATION_ABBREVIATION = {
    key: 'EXECUTOR_ORGANIZATION_ABBREVIATION',
    type: 'boolean',
    title: 'Сокращенное название',
    keyPosition: 145,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** Код ОГРН */
export const EXECUTOR_ORGANIZATION_OGRN_CODE = {
    key: 'EXECUTOR_ORGANIZATION_OGRN_CODE',
    type: 'boolean',
    title: 'Код ОГРН',
    keyPosition: 146,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** ИНН */
export const EXECUTOR_ORGANIZATION_INN = {
    key: 'EXECUTOR_ORGANIZATION_INN',
    type: 'boolean',
    title: 'ИНН',
    keyPosition: 147,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** Адрес */
export const EXECUTOR_ORGANIZATION_ADDRESS = {
    key: 'EXECUTOR_ORGANIZATION_ADDRESS',
    type: 'boolean',
    title: 'Адрес',
    keyPosition: 148,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** Город */
export const ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY = {
    key: 'ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
    type: 'boolean',
    title: 'Город',
    keyPosition: 149,
    parent: 'EXECUTOR_ORGANIZATION_ADDRESS'
};
/** Регион */
export const ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION = {
    key: 'ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
    type: 'boolean',
    title: 'Регион',
    keyPosition: 150,
    parent: 'EXECUTOR_ORGANIZATION_ADDRESS'
};
/** Почтовый индекс */
export const EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE = {
    key: 'EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
    type: 'boolean',
    title: 'Почтовый индекс',
    keyPosition: 151,
    parent: 'EXECUTOR_ORGANIZATION_ADDRESS'
};
/** Улица, дом */
export const EXECUTOR_ORGANIZATION_ADDRESS_STREET = {
    key: 'EXECUTOR_ORGANIZATION_ADDRESS_STREET',
    type: 'boolean',
    title: 'Улица, дом',
    keyPosition: 152,
    parent: 'EXECUTOR_ORGANIZATION_ADDRESS'
};
/** E-mail */
export const EXECUTOR_ORGANIZATION_EMAIL = {
    key: 'EXECUTOR_ORGANIZATION_EMAIL',
    type: 'boolean',
    title: 'E-mail',
    keyPosition: 153,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** Должностное лицо */
export const EXECUTOR_EXECUTIVE_ADDRESSED = {
    key: 'EXECUTOR_EXECUTIVE_ADDRESSED',
    type: 'boolean',
    title: 'Должностное лицо',
    keyPosition: 154,
    parent: 'EXECUTOR_ORGANIZATION'
};
/** ФИО */
export const EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME = {
    key: 'EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME',
    type: 'boolean',
    title: 'ФИО',
    keyPosition: 155,
    parent: 'EXECUTOR_EXECUTIVE_ADDRESSED'
};
/** Подразделение */
export const EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION = {
    key: 'EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
    type: 'boolean',
    title: 'Подразделение',
    keyPosition: 156,
    parent: 'EXECUTOR_EXECUTIVE_ADDRESSED'
};
/** Должность */
export const EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION = {
    key: 'EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION',
    type: 'boolean',
    title: 'Должность',
    keyPosition: 157,
    parent: 'EXECUTOR_EXECUTIVE_ADDRESSED'
};
/** Файлы поручений */
export const OREDER_FILES = {
    key: 'OREDER_FILES',
    type: 'boolean',
    title: 'Файлы поручений',
    keyPosition: 167,
    parent: 'ORDERS'
};


 // Внешний обмен Эл. почта -> Параметры регистрации
 /** Удалить сообщение после регистрации */
export const DELETE_POST_AFTER_REGISTRATION = {
    key: 'DELETE_POST_AFTER_REGISTRATION',
    type: 'boolean',
    title: 'Удалить сообщение после регистрации',
    keyPosition: 0,
    parent: null,
};
/** Удалить сообщение после отказа от регистрации */
export const DELETE_POST_AFTER_CANCELING_REGISTRATION = {
    key: 'DELETE_POST_AFTER_CANCELING_REGISTRATION',
    type: 'boolean',
    title: 'Удалить сообщение после отказа от регистрации',
    keyPosition: 10,
    parent: null,
};
/** Уведомлять о регистрации или отказе от нее */
export const NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT = {
    key: 'NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT',
    type: 'boolean',
    title: 'Уведомлять о регистрации или отказе от нее',
    keyPosition: 1,
    parent: null,
};
/** NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO */
export const NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO = {
    key: 'NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO',
    type: 'radio',
    title: '',
    options: [
        {value: '0', title: 'Всегда'},
        {value: '1', title: 'По заказу корреспондента'}
    ],
    keyPosition: '2.3',
    parent: 'NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'
};
/** Прикрепить к РК паспорт документа */
export const ATTACH_DOCUMENT_PASSPORT_TO_RK = {
    key: 'ATTACH_DOCUMENT_PASSPORT_TO_RK',
    type: 'boolean',
    title: 'Прикрепить к РК паспорт документа',
    keyPosition: 4,
    parent: null,
};
/** Принимать рубрики РК */
export const TAKE_RUBRICS_RK = {
    key: 'TAKE_RUBRICS_RK',
    type: 'boolean',
    title: 'Принимать рубрики РК',
    keyPosition: 5,
    parent: null,
};
/** TAKE_RUBRICS_RK_RADIO */
export const TAKE_RUBRICS_RK_RADIO = {
    key: 'TAKE_RUBRICS_RK_RADIO',
    type: 'radio',
    title: '',
    options: [
        {value: '0', title: 'Определять рубрику по Коду'},
        {value: '1', title: 'Определять рубрику по Наименованию'},
        {value: '-1', title: 'Определять рубрику по Коду и Наименованию'}
    ],
    keyPosition: '6.7.8',
    parent: 'TAKE_RUBRICS_RK'
};
/** Заполнять информацию о сопроводительных документах */
export const COMPLETE_INFORMATION_ABOUT_ACCOMPANYING_DOCUMENTS = {
    key: 'COMPLETE_INFORMATION_ABOUT_ACCOMPANYING_DOCUMENTS',
    type: 'boolean',
    title: 'Заполнять информацию о сопроводительных документах',
    keyPosition: 15,
    parent: null,
};
/** Автоматически добавлять организации и представителей в справочник «Организации» */
export const AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES = {
    key: 'AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES',
    type: 'boolean',
    title: 'Автоматически добавлять организации и представителей в справочник «Организации»',
    keyPosition: 9,
    parent: null,
};
/** Проверять ЭП сообщения */
export const CHECK_EMAIL_MESSAGES = {
    key: 'CHECK_EMAIL_MESSAGES',
    type: 'boolean',
    title: 'Проверять ЭП сообщения',
    keyPosition: 11,
    parent: null,
};
/** Проверять ЭП вложенных файлов */
export const CHECK_EMAIL_FILE_ATTACHMENTS = {
    key: 'CHECK_EMAIL_FILE_ATTACHMENTS',
    type: 'boolean',
    title: 'Проверять ЭП вложенных файлов',
    keyPosition: 12,
    parent: null,
};
/** Проверять ЭП резолюции */
export const CHECK_EMAIL_RESOLUTION = {
    key: 'CHECK_EMAIL_RESOLUTION',
    type: 'boolean',
    title: 'Проверять ЭП резолюции',
    keyPosition: 16,
    parent: null,
};
/** Сообщать отправителю, если ЭП не действительна */
export const NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID = {
    key: 'NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID',
    type: 'boolean',
    title: 'Сообщать отправителю, если ЭП не действительна',
    keyPosition: 13,
    parent: null,
};
/** Сообщать отправителю, если ЭП действительна */
export const NOTIFY_SENDER_IF_EMAIL_IS_VALID = {
    key: 'NOTIFY_SENDER_IF_EMAIL_IS_VALID',
    type: 'boolean',
    title: 'Сообщать отправителю, если ЭП действительна',
    keyPosition: 14,
    parent: null,
};
/** Взводить флаг "Оригинал в эл. виде" для РК с признаком "Без досылки бум. экз. */
export const ORIGINAL_IN_ELECTRONIC_FORM = {
    key: 'ORIGINAL_IN_ELECTRONIC_FORM',
    type: 'boolean',
    title: 'Взводить флаг "Оригинал в эл. виде" для РК с признаком "Без досылки бум. экз."',
    keyPosition: 17,
    readonly: false,
    parent: null,
};

