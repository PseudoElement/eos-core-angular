import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import {SEARCH_TYPES} from '../../search-types';
import {COMMON_FIELD_NAME, COMMON_FIELDS} from '../_common';

export const NP_RESHEN_CL: ITreeDictionaryDescriptor = {
    id: 'reshen',
    apiInstance: 'NP_RESHEN_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Принятые решения',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: '',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes'],
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
            title: 'Наименование',
            isUnique: true,
            uniqueInDict: true,
            length: 150,
        }), {
            key: 'IS_NODE',
            title: 'IS_NODE',
            type: 'number'
        }]),
    treeFields: ['CLASSIF_NAME', 'NOTE'],
    editFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME', 'NOTE'],
    allVisibleFields: [],
};
