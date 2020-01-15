import { ITreeDictionaryDescriptor, E_DICT_TYPE, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_NAME, } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from 'eos-dictionaries/features/features.interface';
import { DIGIT3_PATTERN } from 'eos-common/consts/common.consts';
import { ADDR_CATEGORY_DICT } from './addr-category.consts';


export const ORGANIZ_DICT: ITreeDictionaryDescriptor = {
    id: 'organization',
    apiInstance: 'ORGANIZ_CL',
    // dictType: E_DICT_TYPE.tree,
    title: 'Организации',
    visible: true,
    iconName: 'eos-icon-building-blue',
    defaultOrder: 'CLASSIF_NAME',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'cut', 'combine', 'dopRequisites',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes', 'uncheckNewEntry'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick /*, SEARCH_TYPES.full*/],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'Код Дьюи организации',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Код родительской организации',
        length: 248,
    }, {
        key: 'ISN_NODE',
        type: 'number',
        title: 'ISN организации',
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящ вершины',
        type: 'number',
    }, {
        key: 'LAYER',
        title: 'Номер уровня',
        type: 'number',
    }, {
        key: 'IS_NODE',
        title: 'Признак вершины',
        type: 'number',
    }, {
        key: 'MAXDUE',
        title: 'MAX значение кода Дьюи',
        type: 'string',
        pattern: NOT_EMPTY_STRING,
        length: 248,
    },
    ... Features.cfg.variant === EOSDICTS_VARIANT.CB ? [
    {
        key: 'TERM_EXEC',
        title: 'Срок исполнения',
        length: 3,
        minValue: 1,
        maxValue: 999,
        pattern: DIGIT3_PATTERN,
        default: 1,
        type: 'numberIncrement',
    },
    {
        key: 'TERM_EXEC_TYPE',
        type: 'select',
        title: '',
        default: 3,
        options: [
            // {value: '', title: ''},
            { value: 3, title: 'календарн.+' },
            { value: 4, title: 'календарн.-' },
            { value: 1, title: 'календарн.' },
            { value: 2, title: 'рабоч.' },
        ],
    },
    {
        key: 'ISN_ADDR_CATEGORY',
        type: 'select',
        title: 'Категория',
        length: 150,
        //  required: true,
        dictionaryId: ADDR_CATEGORY_DICT.apiInstance,
            dictionaryLink: {
                pk: 'ISN_LCLASSIF',
                fk: 'ISN_ADDR_CATEGORY',
                label: 'CLASSIF_NAME',
            },
        options: [],
        default: 0,
    },
    ] : [],
    {
        key: 'NEW_RECORD',
        title: 'Нов.',
        type: 'new',
        length: 1,
    },
    Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Наименование организации',
        groupLabel: 'Наименование группы',
        length: 255,
        preferences: <IFieldPreferences>{ hasIcon: true, },
    }), /* {
        key: 'CLASSIF_NAME_SEARCH',
        title: 'Поиск наименование организации',
        type: 'string',
        length: 255,
        pattern: NOT_EMPTY_STRING,
    }*/
        // ,
        // Object.assign({}, COMMON_FIELD_FULLNAME, {
        //     title: 'Полное наименование',
        //     type: 'string',
        //     length: 255,
        //     pattern: NOT_EMPTY_STRING,
        // }), {
        //     key: 'ZIPCODE',
        //     title: 'Почтовый индекс',
        //     type: 'string',
        //     length: 12,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'CITY',
        //     title: 'Город',
        //     type: 'string',
        //     length: 255,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'ADDRESS',
        //     title: 'Почтовый адрес',
        //     type: 'string',
        //     length: 255,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'MAIL_FOR_ALL',
        //     title: 'Признак использования e-mail для всех представителей',
        //     type: 'boolean',
        //     length: 1,
        // }, {
        //     key: 'NEW_RECORD',
        //     title: 'Признак новой записи',
        //     type: 'number',
        //     length: 1,
        // }, {
        //     key: 'OKPO',
        //     title: 'ОКПО',
        //     type: 'string',
        //     length: 16,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'INN',
        //     title: 'ИНН',
        //     type: 'string',
        //     length: 64,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'ISN_REGION',
        //     title: 'Регион',
        //     type: 'dictionary',
        //     dictionaryId: REGION_DICT.id,
        // }, {
        //     key: 'OKONH',
        //     title: 'ОКОНХ',
        //     type: 'string',
        //     length: 16,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'LAW_ADRESS',
        //     title: 'Юридический адрес',
        //     type: 'string',
        //     length: 255,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'ISN_ORGANIZ_TYPE',
        //     title: 'Форма Собственности',
        //     type: 'number',
        //     pattern: NOT_EMPTY_STRING,
        //     length: 10,
        // }, {
        //     key: 'SERTIFICAT',
        //     title: 'Регистрационное свидетельство',
        //     type: 'string',
        //     length: 255,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'ISN_ADDR_CATEGORY',
        //     title: 'Категория адресата',
        //     type: 'select',
        //     dictionaryId: ADDR_CATEGORY_DICT.id,
        //     length: 200,
        //
        // }, {
        //     key: 'CODE',
        //     title: 'поле для формирования выписок для ЦБ',
        //     type: 'number',
        //     length: 4,
        //     pattern: NOT_EMPTY_STRING,
        //
        // }, {
        //     key: 'OGRN',
        //     title: 'ОГРН',
        //     type: 'string',
        //     length: 64,
        //     pattern: NOT_EMPTY_STRING,
        // }, {
        //     key: 'contact',
        //     type: 'array',
        //     title: '',
        //
        // }, {
        //     key: 'bank-recvisit',
        //     type: 'dictionary',
        //     title: '',
        //
        // }, {
        //     key: 'ar-organiz-value',
        //     type: 'dictionary',
        //     title: '',
        // }, {
        //     key: 'sev',
        //     type: 'dictionary',
        //     title: '',

        // }
    ]),
    treeFields: ['CLASSIF_NAME'],
    // editFields: ['PARENT_DUE', 'CLASSIF_NAME', 'CLASSIF_NAME_SEARCH', 'FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS',
    //     'MAIL_FOR_ALL', 'NOTE', 'OKPO', 'INN', 'ISN_REGION', 'OKONH', 'LAW_ADRESS', 'ISN_ORGANIZ_TYPE', 'SERTIFICAT',
    //     'ISN_ADDR_CATEGORY', 'CODE', 'OGRN', 'contact', 'bank-recvisit', 'ar-organiz-value', 'sev'],
    editFields: ['CLASSIF_NAME', 'NOTE',
        ... Features.cfg.variant === EOSDICTS_VARIANT.CB ? [ 'TERM_EXEC', 'TERM_EXEC_TYPE', 'ISN_ADDR_CATEGORY'] : [],
    ],
    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: [],
    // quickViewFields: ['FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS', 'OKPO', 'INN', 'OKONH', 'LAW_ADRESS',
    //     'ISN_ORGANIZ_TYPE', 'SERTIFICAT',  'ISN_ADDR_CATEGORY', 'CODE', 'OGRN', 'sev'],
    quickViewFields: ['FULLNAME', ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'NEW_RECORD'],
    // allVisibleFields: ['CLASSIF_NAME_SEARCH', 'FULLNAME', 'ZIPCODE', 'CITY', 'ADDRESS', 'MAIL_FOR_ALL', 'NOTE', 'OKPO',
    //     'INN', 'ISN_REGION', 'OKONH', 'LAW_ADRESS', 'ISN_ORGANIZ_TYPE', 'SERTIFICAT', 'ISN_ADDR_CATEGORY', 'CODE',
    //     'OGRN'],
    // editOnlyNodes: false,
    dictType: E_DICT_TYPE.organiz,
};
