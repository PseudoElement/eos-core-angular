import {E_DICT_TYPE, IDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {NOT_EMPTY_STRING} from '../input-validation';
import {COMMON_FIELDS} from './_common';
import {LINEAR_TEMPLATE} from './_linear-template';

/* tslint:disable:max-line-length */
export const CITIZENS_DICT: IDictionaryDescriptor = {
    id: 'citizens',
    apiInstance: 'CITIZEN',
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'CITIZEN_SURNAME',
    title: 'Граждане',
    visible: true,
    iconName: '',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    keyField: 'ISN_CITIZEN',
    searchConfig: [],
    fields: COMMON_FIELDS.concat([{
        key: 'ISN_CITIZEN',
        title: 'ISN',
        type: 'number'
    }, {
        key: 'CITIZEN_SURNAME',
        title: 'Фамилия И.О.',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
        required: true,
    }, {
        key: 'CITIZEN_CITY',
        title: 'Город',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        required: true,
    }, {
        key: 'ISN_REGION',
        title: 'ISN_Регион',
        type: 'number',
    }, {
        key: 'ZIPCODE',
        title: 'Фамилия И.О.',
        type: 'string',
        length: 12,
    }, {
        key: 'CITIZEN_ADDR',
        title: 'Адрес',
        type: 'string',
        length: 255,
    }, {
        key: 'ISN_ADDR_CATEGORY',
        title: 'ISN_ADDR_CATEGORY',
        type: 'number',
    }, {
        key: 'PHONE',
        title: 'Телефон',
        type: 'string',
        length: 64,
    }, {
        key: 'SEX',
        title: 'Пол',
        type: 'number',
    }, {
        key: 'N_PASPORT',
        title: 'Номер паспорта',
        type: 'string',
        length: 64,
    }, {
        key: 'SERIES',
        title: 'Серия паспорта',
        type: 'string',
        length: 64,
    }, {
        key: 'GIVEN',
        title: 'Паспорт выдан',
        type: 'string',
        length: 255,
    }, {
        key: 'INN',
        title: 'ИНН',
        type: 'string',
        length: 64,
    }, {
        key: 'NEW',
        title: 'NEW',
        type: 'number',
    }, {
        key: 'E_MAIL',
        title: 'e-mail',
        type: 'string',
        length: 255,
    }, {
        key: 'EDS_FLAG',
        title: 'EDS_FLAG',
        type: 'number',
    }, {
        key: 'ENCRYPT_FLAG',
        title: 'ENCRYPT_FLAG',
        type: 'number',
    }, {
        key: 'ID_CERTIFICATE',
        title: 'ID_CERTIFICATE',
        type: 'string',
        length: 4000,
    }, {
        key: 'MAIL_FORMAT',
        title: 'MAIL_FORMAT',
        type: 'number',
    }, {
        key: 'SNILS',
        title: 'СНИЛС',
        type: 'string',
        length: 14,
    },
    ]),
    treeFields: [],
    searchFields: ['CITIZEN_SURNAME'],
    listFields: ['CITIZEN_SURNAME', 'CITIZEN_CITY', ],
    fullSearchFields: [],
    quickViewFields: ['CITIZEN_SURNAME', ],
    shortQuickViewFields: [],
    editFields: ['CITIZEN_SURNAME', 'CITIZEN_CITY', 'ISN_REGION', 'ZIPCODE', 'CITIZEN_ADDR',
        'ISN_ADDR_CATEGORY', 'PHONE', 'SEX', 'N_PASPORT', 'SERIES', 'GIVEN', 'INN', 'NEW', 'E_MAIL', 'EDS_FLAG',
        'ENCRYPT_FLAG', 'ID_CERTIFICATE', 'MAIL_FORMAT', 'SNILS', ],
    /** customize view fields */
    allVisibleFields: ['ISN_REGION', 'ZIPCODE', 'CITIZEN_ADDR',
        'ISN_ADDR_CATEGORY', 'PHONE', 'SEX', 'N_PASPORT', 'SERIES', 'GIVEN', 'INN', 'NEW', 'E_MAIL', 'EDS_FLAG',
        'ENCRYPT_FLAG', 'ID_CERTIFICATE', 'MAIL_FORMAT', 'SNILS', ],
};
/* tslint:enable:max-line-length */
