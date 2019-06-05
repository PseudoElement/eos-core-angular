import {E_DICT_TYPE, IDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {LINEAR_TEMPLATE} from './_linear-template';
import {COMMON_FIELD_NAME} from './_common';
import {YEAR_PATTERN} from 'eos-common/consts/common.consts';


export const DID_NOMENKL_CL = 'nomenkl';
export const NOMENKL_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: DID_NOMENKL_CL,
    apiInstance: 'NOMENKL_CL',
    title: 'Номенклатура дел',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization', 'removeHard',
        'edit', 'view', 'remove', 'removeHard', 'userOrder',
        'OpenSelected',
        'CloseSelected',
    ],
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
        // default: 'общий',
        default: '',
        options: [],
    }, {
        key: 'SHELF_LIFE',
        title: 'Срок хранения',
        type: 'string',
        length: 255,
    }, {
        key: 'YEAR_NUMBER',
        title: 'Ввод в действие',
        type: 'numberIncrement',
        pattern: YEAR_PATTERN,
        required: true,
        minValue: 1901,
        maxValue: 2100,

    }, {
        key: 'NOM_NUMBER',
        title: 'Индекс',
        type: 'string',
        length: 24,
        required: true,
    }, {
        key: 'END_YEAR',
        title: 'Завершение',
        type: 'numberIncrement',
        pattern: YEAR_PATTERN,
        minValue: 1901,
        maxValue: 2100,
    }, {
        key: 'ARTICLE',
        title: 'Статья',
        type: 'string',
        length: 255,
    }, {
        key: 'CLOSE_WHO',
        title: 'Кем закрыто',
        type: 'select',
        options: [],
        dictionaryId: 'USER_CL',
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
        title: 'Для электронных документов',
        type: 'boolean',
        required: true,
        default: 0,
    }, {
        key: 'buttPer',
        type: 'buttons',
        title: '',
        length: 100,
        options: [{value: 0, title: 'Текущее'}, {value: 1, title: 'Переходящее'}],
        // default: 1,
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Заголовок',
            length: 2000,
        }),
    ]),

    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'CLOSED', 'SECURITY', 'YEAR_NUMBER', 'SHELF_LIFE', 'NOM_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', 'buttPer'],
    searchFields: ['CLASSIF_NAME', 'NOM_NUMBER', ],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE', 'NOM_NUMBER'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['NOM_NUMBER', 'CLASSIF_NAME', ],
    allVisibleFields: ['NOTE', 'CLOSED', 'SECURITY', 'SHELF_LIFE', 'YEAR_NUMBER',
        'END_YEAR', 'ARTICLE', 'CLOSE_WHO', 'CLOSE_DATE', 'DOC_UID', 'ARCH_DATE', 'ARCH_FLAG', 'E_DOCUMENT', ],

});
