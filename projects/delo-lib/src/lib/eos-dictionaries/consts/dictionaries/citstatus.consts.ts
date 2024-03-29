import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';
import { E_DICT_TYPE, ITreeDictionaryDescriptor, IFieldPreferences } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELD_NAME, COMMON_FIELDS } from './_common';

export const CITSTATUS_DICT: ITreeDictionaryDescriptor = {
    id: E_DICTIONARY_ID.CITSTATUS,
    apiInstance: 'CITSTATUS_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Статус заявителя',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-adm-icon-applicant-status-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes',
        'export', 'import', 'protViewSecurity'],
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
    // Object.assign({}, COMMON_FIELD_CODE, {length: 20}),
    Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Наименование статуса',
        isUnique: true,
        uniqueInDict: true,
        length: 64,
        preferences: <IFieldPreferences> { hasIcon: true, },
    }), {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'number'
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['NOTE'],
};
