import {IDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {LINEAR_TEMPLATE} from './_linear-template';
import {COMMON_FIELD_NAME} from './_common';


export const NOMENKL_CL: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'nomenkl',
    apiInstance: 'NOMENKL_CL',
    title: 'Номенклатура дел',
    visible: true,
    iconName: '',
    keyField: 'ISN_LCLASSIF',
    fields: LINEAR_TEMPLATE.fields.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'CLOSED',
        title: 'Закрыто',
        type: 'number',
        default: 0,
        required: true,
    }, {
        key: 'SECURITY',
        title: 'SECURITY',
        type: 'string',
        length: 64,
    }, {
        key: 'YEAR_NUMBER',
        title: 'Год',
        type: 'number',
        required: true,
    }, {
        key: 'STORE_TIME',
        title: 'Время',
        type: 'number',
    }, {
        key: 'SHELF_TIME',
        title: 'Время хранения',
        type: 'string',
        length: 255,
    }, {
        key: 'NOM_NUMBER',
        title: 'Номер',
        type: 'string',
        length: 24,
        required: true,
    }, {
        key: 'END_YEAR',
        title: 'Год окончания',
        type: 'number',
    }, {
        key: 'ARTICLE',
        title: 'Артикль',
        type: 'string',
        length: 255,
    }, {
        key: 'CLOSE_WHO',
        title: 'Кем закрыто',
        type: 'number',
    }, {
        key: 'CLOSE_DATE',
        title: 'Кем закрыто',
        type: 'date',
    }, {
        key: 'DOC_UID',
        title: 'UID',
        type: 'string',
        length: 512,
    }, {
        key: 'ARCH_DATE',
        title: 'Дата архивации',
        type: 'date',
    }, {
        key: 'ARCH_FLAG',
        title: 'Флаг архивации',
        type: 'number',
    }, {
        key: 'E_DOCUMENT',
        title: 'E_DOCUMENT',
        type: 'number',
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 2000,
        }),
    ]),

    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'CLOSED', 'SECURITY', 'YEAR_NUMBER', 'STORE_TIME', 'SHELF_TIME', 'NOM_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME', ],
    listFields: ['YEAR_NUMBER', 'NOM_NUMBER', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'CLOSED', 'SECURITY', 'STORE_TIME', 'SHELF_TIME',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],

});
