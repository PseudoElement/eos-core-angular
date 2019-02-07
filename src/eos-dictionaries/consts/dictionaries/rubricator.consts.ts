import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_CODE, COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME } from './_common';
/*
*/
export const RUBRICATOR_DICT: ITreeDictionaryDescriptor = {
    id: 'rubricator',
    apiInstance: 'RUBRIC_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Рубрикатор',
    visible: true,
    iconName: 'eos-icon-template-blue',
    defaultOrder: 'CLASSIF_NAME',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'
    ],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    },
    Object.assign({}, COMMON_FIELD_CODE, {
        key: 'RUBRIC_CODE',
        required: true,
        length: 248,
        isUnique: true,
        uniqueInDict: true,
    }),
    Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Краткое наименование',
        length: 250,
        isUnique: true,
        uniqueInDict: true,
    }),
        COMMON_FIELD_FULLNAME,
    {
        key: 'ISN_HIGH_NODE',
        title: 'ISN_HIGH_NODE',
        type: 'number'
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }, {
        key: 'PARENT_DUE',
        title: 'PARENT_DUE',
        type: 'string'
    }, {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'dictionary',
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE', 'sev'],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME'/*, 'NOTE'*/],
    fullSearchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'FULLNAME'],
    quickViewFields: ['FULLNAME', 'NOTE', 'sev'],  // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['RUBRIC_CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'FULLNAME', 'sev'],
};
