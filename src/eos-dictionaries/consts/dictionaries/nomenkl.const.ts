import {E_DICT_TYPE, ITreeDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {LINEAR_TEMPLATE} from './_linear-template';
import {COMMON_FIELD_NAME} from './_common';


export const NOMENKL_CL: ITreeDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'nomenkl',
    apiInstance: 'NOMENKL_CL',
    title: 'Номенклатура дел',
    visible: true,
    dictType: E_DICT_TYPE.custom,
    parentField: 'DUE',
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
        title: 'PARENT ID',
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
        type: 'string',
        length: 64,
        // dictionaryId: SECURITY_DICT.apiInstance,
        // options: [],
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
        title: 'E_DOCUMENT',
        type: 'number',
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Заголовок',
            length: 2000,
        }),
    ]),

    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'CLOSED', 'SECURITY', 'YEAR_NUMBER', 'STORE_TIME', 'SHELF_LIFE', 'NOM_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME', ],
    listFields: ['NOM_NUMBER', 'SECURITY', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'CLOSED', 'SECURITY', 'STORE_TIME', 'SHELF_LIFE',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],

});
