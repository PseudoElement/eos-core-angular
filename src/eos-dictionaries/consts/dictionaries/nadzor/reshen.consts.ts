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
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization',
        'edit', 'view', 'remove', 'userOrder', 'showAllSubnodes', 'restore'],
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
    }, {
        key: 'ID_GAS_PS',
        type: 'string',
        title: 'ID ГАС ПС',
        length: 10,
        forNode: true,
    },
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Наименование',
            isUnique: true,
            uniqueInDict: true,
            length: 248,
        }), {
            key: 'IS_NODE',
            title: 'IS_NODE',
            type: 'number'
        }]),
    treeFields: ['CLASSIF_NAME', ],
    editFields: ['CLASSIF_NAME', 'ID_GAS_PS', 'NOTE'],
    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE', ],
    quickViewFields: ['CLASSIF_NAME', 'NOTE',  ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['ID_GAS_PS', 'NOTE'],
};
