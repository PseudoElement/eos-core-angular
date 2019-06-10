import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS } from './_common';
/*
*/
export const REGION_DICT: ITreeDictionaryDescriptor = {
    id: 'region',
    apiInstance: 'REGION_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Регионы',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-icon-pin-geo-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization',
        'edit', 'view', 'remove', 'userOrder', 'showAllSubnodes', 'restore', 'export', 'import'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
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
    }, {
        key: 'CLASSIF_NAME',
        title: 'Наименование',
        type: 'string',
        length: 64,
        isUnique: true,
        uniqueInDict: true,
        required: true,
        pattern: NOT_EMPTY_STRING,
    }, {
        key: 'CODE',
        title: 'Код региона',
        pattern: /^\s*\d{0,4}\s*$/,
        type: 'number',
        length: 4,
    }, {
        key: 'COD_OKATO',
        title: 'Код ОКАТО',
        type: 'string',
        length: 11,
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }, {
        key: 'MAXDUE',
        title: 'MAX значение кода Дьюи',
        type: 'string',
        length: 248,
        pattern: NOT_EMPTY_STRING,
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE'],
    searchFields: [/*'CODE', 'COD_OKATO',*/ 'CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CODE', 'NOTE', 'COD_OKATO'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CODE', 'NOTE', 'COD_OKATO'],
};
