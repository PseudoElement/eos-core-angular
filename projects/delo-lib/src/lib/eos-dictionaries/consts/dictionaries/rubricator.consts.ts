import { E_DICT_TYPE, ITreeDictionaryDescriptor, IFieldPreferences } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_CODE, COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME, COMMON_FIELD_ICONS, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV, } from './_common';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { VALID_REQ_STRING } from '../../../eos-common/consts/common.consts';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const RUBRICATOR_DICT: ITreeDictionaryDescriptor = {
    id: E_DICTIONARY_ID.RUBRICATOR,
    apiInstance: 'RUBRIC_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Рубрикатор',
    visible: true,
    iconName: 'eos-adm-icon-template-blue',
    defaultOrder: 'CLASSIF_NAME',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'cut', 'paste', 'combine',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes',
        'export', 'import', 'protViewSecurity'
    ],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([
    {
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    },
    COMMON_FIELD_ICONS_SEV,
    COMMON_FIELD_ICONS,
    Object.assign({}, COMMON_FIELD_CODE, {
        key: 'RUBRIC_CODE',
        required: true,
        length: 248,
        isUnique: true,
        uniqueInDict: true,
        pattern: VALID_REQ_STRING,
    }),
    Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Краткое наименование',
        length: 2000,
        preferences: <IFieldPreferences> { hasIcon: true, },
        // isUnique: true,
        // uniqueInDict: true,
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
        isUnique: true,
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    searchFields: ['RUBRIC_CODE', 'CLASSIF_NAME'/*, 'NOTE'*/],
    fullSearchFields: ['RUBRIC_CODE', 'CLASSIF_NAME', 'NOTE', 'FULLNAME'],
    quickViewFields: ['RUBRIC_CODE', 'FULLNAME', 'NOTE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],  // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'FULLNAME', 'sev', 'RUBRIC_CODE', ],
};
