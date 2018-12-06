import {E_DICT_TYPE, IDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {LINEAR_TEMPLATE} from './_linear-template';
import {COMMON_FIELD_NAME} from './_common';


export const NOMENKL_CL: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'nomenkl',
    apiInstance: 'NOMENKL_CL',
    title: 'Номенклатура дел',
    defaultOrder: 'NOM_NUMBER',
    visible: true,
    dictType: E_DICT_TYPE.custom,
    iconName: 'eos-icon-deal-blue',
    keyField: 'ISN_LCLASSIF',
    fields: LINEAR_TEMPLATE.fields.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Parent ID',
        length: 248,
    }, {
        key: 'CLOSED',
        title: 'Закрыто',
        type: 'boolean',
        default: 0,
        required: true,
    }, {
        key: 'SECURITY',
        title: 'Гриф',
        type: 'select',
        length: 64,
        default: '',
        options: [],
    }, {
        key: 'SHELF_LIFE',
        title: 'Время хранения',
        type: 'string',
        length: 255,
    }, {
        key: 'YEAR_NUMBER',
        title: 'Ввод в действие',
        type: 'number',
        required: true,
    }, {
        key: 'STORE_TIME',
        title: 'Время',
        type: 'number',
    }, {
        key: 'NOM_NUMBER',
        title: 'Индекс',
        type: 'string',
        length: 24,
        required: true,
    }, {
        key: 'END_YEAR',
        title: 'Завершение',
        type: 'number',
    }, {
        key: 'ARTICLE',
        title: 'Статья',
        type: 'string',
        length: 255,
    }, {
        key: 'CLOSE_WHO',
        title: 'Кем закрыто',
        type: 'number',
    }, {
        key: 'CLOSE_DATE',
        title: 'Дата закрытия',
        type: 'date',
    }, {
        key: 'DOC_UID',
        title: 'UID',
        type: 'string',
        length: 512,
    }, {
        key: 'ARCH_DATE',
        title: 'Передано в архив',
        type: 'date',
    }, {
        key: 'ARCH_FLAG',
        title: 'Подлежит сдаче в архив',
        type: 'boolean',
    }, {
        key: 'E_DOCUMENT',
        title: 'Для эл. документов',
        type: 'boolean',
        required: true,
        default: 0,
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Заголовок',
            length: 2000,
        }),
    ]),

    treeFields: ['title'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'CLOSED', 'SECURITY', 'YEAR_NUMBER', 'STORE_TIME', 'SHELF_LIFE', 'NOM_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],
    searchFields: ['CLASSIF_NAME', 'NOM_NUMBER', ],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE', 'NOM_NUMBER'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['NOM_NUMBER', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'CLOSED', 'SECURITY', 'STORE_TIME', 'SHELF_LIFE', 'YEAR_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],

});
