import { E_DICT_TYPE, IDictionaryDescriptor, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { COMMON_FIELDS } from './_common';
import { SEARCH_TYPES } from '../search-types';
import { REGION_DICT } from './region.consts';
import { ADDR_CATEGORY_DICT } from './addr-category.consts';
import { MAIL_FORMATS } from './contact.consts';
import {GENDERS_CITIZEN } from './department.consts';



// "CITIZEN_ADDR": "ул.Академика Королева д.14 к.1 кв.3",
// "CITIZEN_CITY": "Москва",
// "CITIZEN_SURNAME": "Матюхин А.А.",
// "DELETED": 0,
// "DUE_REGION": "0.2EYKO.2EYOY.",
// "EDS_FLAG": 0,



// "CLASSIF_NAME": "Матюхин А.А.",
// "ENCRYPT_FLAG": 0,
// "E_MAIL": null,
// "GIVEN": null,

// "ID_CERTIFICATE": null,
// "INN": null,
// "ISN_ADDR_CATEGORY": null,
// "ISN_CITIZEN": 3935,
// "ISN_LCLASSIF": 3935,
// "MAIL_FORMAT": 2,
// "NEW": 0,
// "NOTE": null,
// "N_PASPORT": null,
// "PHONE": null,
// "PROTECTED": 0,
// "SERIES": null,
// "SEX": 1,
// "SNILS": null,
// "WEIGHT": null,
// "ZIPCODE": "123456",
// "_more_json": null


/* tslint:disable:max-line-length */
export const CITIZENS_DICT: IDictionaryDescriptor = {
    id: 'citizens',
    apiInstance: 'CITIZEN',
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'CITIZEN_SURNAME',
    title: 'Граждане',
    visible: true,
    iconName: 'eos-adm-icon-citizen-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'showDeleted', 'edit',
        'view', 'restore', 'remove', 'removeHard', 'tableCustomization', 'cut', 'combine', 'uncheck', 'uncheckNewEntry', 'dopRequisites',
        'export', 'import', 'protViewSecurity'],
    keyField: 'ISN_CITIZEN',
    searchConfig: [SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
        key: 'ISN_CITIZEN',
        title: 'ISN',
        type: 'number'
    }, {
        key: 'CITIZEN_ADDR',
        title: 'Адрес',
        type: 'string',
        length: 255,
    }, {
        key: 'CITIZEN_CITY',
        title: 'Город',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
        required: true,
        preferences: <IFieldPreferences>{
            minColumnWidth: 200,
        }
    }, {
        key: 'CITIZEN_SURNAME',
        title: 'Фамилия И.О.',
        type: 'string',
        length: 64,
        pattern: NOT_EMPTY_STRING,
        required: true,
    }, {
        key: 'DUE_REGION',
        title: 'Регион',
        type: 'select',
        dictionaryId: REGION_DICT.apiInstance,
        dictionaryLink: {
            pk: 'DUE',
            fk: 'DUE_REGION',
            label: 'CLASSIF_NAME',
        },
        options: [],
        preferences: <IFieldPreferences>{
            minColumnWidth: 200,
        }
    }, {
        key: 'EDS_FLAG',
        title: 'ЭП',
        type: 'boolean',
    }, {
        key: 'ENCRYPT_FLAG',
        type: 'boolean',
        title: 'Шифрование',
    }, {
        key: 'E_MAIL',
        title: 'E-mail',
        type: 'string',
        length: 255,
    }, {
        key: 'GIVEN',
        title: 'Выдан',
        type: 'string',
        length: 255,
    }, {
        key: 'ID_CERTIFICATE',
        title: 'ID_CERTIFICATE',
        type: 'string',
        length: 4000,
    }, {
        key: 'INN',
        title: 'ИНН',
        type: 'string',
        length: 64,
    }, {
        key: 'ISN_ADDR_CATEGORY',
        title: 'Категория',
        type: 'select',
        dictionaryId: ADDR_CATEGORY_DICT.apiInstance,
        dictionaryLink: {
            pk: 'ISN_LCLASSIF',
            fk: 'ISN_ADDR_CATEGORY',
            label: 'CLASSIF_NAME',
        },
        options: [],
    },
    {
        key: 'MAIL_FORMAT',
        type: 'select',
        title: 'Почтовый формат',
        options: MAIL_FORMATS,
    }, {
        key: 'NEW',
        title: 'Нов.',
        type: 'new',
    }, {
        key: 'N_PASPORT',
        title: 'Паспорт №',
        type: 'string',
        length: 64,
    }, {
        key: 'PHONE',
        title: 'Телефон',
        type: 'string',
        length: 64,
    }, {
        key: 'SERIES',
        title: 'Паспорт серия',
        type: 'string',
        length: 64,
    }, {
        key: 'SEX',
        title: 'Пол',
        type: 'select',
        options: GENDERS_CITIZEN,
    }, {
        key: 'SNILS',
        title: 'СНИЛС',
        type: 'string',
        length: 14,
    }, {
        key: 'ZIPCODE',
        title: 'Индекс',
        type: 'string',
        length: 12,
    },
    {
        key: 'ISN_REGION',
        title: 'ISN_Регион',
        type: 'dictionary',
        dictionaryId: 'REGION_CL',
        dictionaryLink: {
            pk: 'ISN_NODE',
            fk: 'ISN_REGION',
            label: 'CLASSIF_NAME',
        },
    },
    {
        key: 'DOP_REC',
        title: 'Доп. реквизит',
        type: 'string',
    },


    ]),
    treeFields: ['CITIZEN_SURNAME'],
    searchFields: ['CITIZEN_SURNAME', 'CITIZEN_CITY', 'ZIPCODE'],
    listFields: ['CITIZEN_SURNAME'],
    fullSearchFields: ['CITIZEN_SURNAME', 'CITIZEN_CITY', 'ZIPCODE', 'CITIZEN_ADDR', 'ISN_REGION', 'NEW', 'DOP_REC', 'E_MAIL'],
    quickViewFields: ['CITIZEN_SURNAME', 'DUE_REGION'],
    shortQuickViewFields: [],
    editFields: ['CITIZEN_SURNAME', 'CITIZEN_CITY', 'ISN_REGION', 'ZIPCODE', 'CITIZEN_ADDR',
        'ISN_ADDR_CATEGORY', 'PHONE', 'SEX', 'N_PASPORT', 'SERIES', 'GIVEN', 'INN', 'NEW', 'E_MAIL', 'EDS_FLAG',
        'ENCRYPT_FLAG', 'ID_CERTIFICATE', 'MAIL_FORMAT', 'SNILS'],
    /** customize view fields */
    allVisibleFields: ['CITIZEN_CITY', 'DUE_REGION', 'CITIZEN_ADDR', 'ZIPCODE', 'INN', 'SNILS', 'PHONE', 'SEX',
        'SERIES', 'N_PASPORT', 'GIVEN', 'E_MAIL', 'NOTE', 'NEW'],
};
/* tslint:enable:max-line-length */
