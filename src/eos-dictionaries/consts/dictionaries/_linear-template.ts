import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_NAME } from './_common';

export const LINEAR_TEMPLATE: IDictionaryDescriptor = {
    id: '',
    apiInstance: '',
    dictType: E_DICT_TYPE.linear,
    defaultOrder: 'CLASSIF_NAME',
    title: 'Линейный справочник',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization', 'removeHard',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', ],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick],
    fields: COMMON_FIELDS.concat([{
        key: 'ISN_LCLASSIF',
        type: 'number',
        title: 'ID',
    },
    Object.assign({}, COMMON_FIELD_NAME, {
        length: 100,
    })]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['NOTE'], // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: [],
    iconName: 'eos-icon-dept-blue'
};
