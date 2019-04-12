import {E_DICT_TYPE, ITreeDictionaryDescriptor} from 'eos-dictionaries/interfaces/index';
import {COMMON_FIELD_NAME, COMMON_FIELDS} from '../_common';
import {SEARCH_TYPES} from '../../search-types';

export const NP_SUD_RESHEN_TYPE_CL: ITreeDictionaryDescriptor = /*Object.assign({}, NADZOR_TEMPLATE, */{
    id: 'reshen-suda',
    apiInstance: 'NP_SUD_RESHEN_TYPE_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Решения суда',
    defaultOrder: 'CLASSIF_NAME',
    iconName: '',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'
    ],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick],
    fields: COMMON_FIELDS.concat([{
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
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'ISN_HIGH_NODE',
        type: 'number'
    }, {
        key: 'LAYER',
        title: 'LAYER',
        type: 'number'
    },
    Object.assign({}, COMMON_FIELD_NAME, {
        length: 248,
    }),

    {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE'],

    visible: true,

    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['NOTE'],



};

