import { E_DICT_TYPE, ITreeDictionaryDescriptor, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { VALID_REQ_STRING } from 'eos-common/consts/common.consts';
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
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'cut', 'combine', 'paste',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'removeHard', 'tableCustomization',
        'edit', 'view', 'remove', 'userOrder', 'showAllSubnodes', 'restore', 'export', 'import'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([
        COMMON_FIELD_ICONS_SEV,
    {
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
        pattern: VALID_REQ_STRING,
        preferences: <IFieldPreferences> { hasIcon: true, },
    }, {
        key: 'CODE',
        title: 'Код региона',
        pattern: /^\s*\d{1,4}\s*$/,
        type: 'number',
        length: 4,
    }, {
        key: 'COD_OKATO',
        title: 'Код ОКАТО',
        pattern: /^\s*\d{1,11}\s*$/,
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
    }, {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'dictionary',
        isUnique: true,
    }
    ]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    searchFields: [/*'CODE', 'COD_OKATO',*/ 'CLASSIF_NAME', /*'NOTE'*/],
    fullSearchFields: ['CODE', 'COD_OKATO', 'CLASSIF_NAME', 'NOTE'],
    quickViewFields: ['CODE', 'NOTE', 'COD_OKATO',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'],
    allVisibleFields: ['CODE', 'NOTE', 'COD_OKATO'],
};
