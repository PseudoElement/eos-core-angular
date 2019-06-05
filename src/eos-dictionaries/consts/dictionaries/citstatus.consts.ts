import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELD_NAME, COMMON_FIELDS, COMMON_FIELD_CODE } from './_common';

export const CITSTATUS_DICT: ITreeDictionaryDescriptor = {
    id: 'cistatus',
    apiInstance: 'CITSTATUS_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Статус заявителя',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-icon-applicant-status-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick /*, SEARCH_TYPES.full*/],
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
    Object.assign({}, COMMON_FIELD_CODE, {length: 20}),
    Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Наименование статуса',
        isUnique: true,
        uniqueInDict: true,
        length: 64,
    }), {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    searchFields: ['CODE', 'CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CODE', 'CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['CODE', 'NOTE'],
};
