import { E_DICT_TYPE, IDictionaryDescriptor, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
/*
*/
export const FILE_TYPE_DICT: IDictionaryDescriptor = {
    id: 'filetype',
    apiInstance: 'FILE_TYPE_CL',
    dictType: E_DICT_TYPE.linear,
    title: 'Типы файлов',
    visible: true,
    iconName: 'eos-adm-icon-folder-blue',
    defaultOrder: 'CLASSIF_NAME',
    actions: ['add', 'quickSearch', 'fullSearch', 'userOrder', 'userOrderCut', 'userOrderPaste', 'markRecords', 'moveUp', 'moveDown', 'showDeleted',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore',
        'export', 'import', 'protViewSecurity'
    ],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick],
    fields: [
        {
            key: 'ISN_LCLASSIF',
            type: 'number',
            title: 'ID',
            length: 248,
        },
        {
            key: 'CLASSIF_NAME',
            title: 'Наименование',
            type: 'string',
            isUnique: true,
            length: 64,
            required: true,
        },
        {
            key: 'DELETED',
            title: 'Удален',
            type: 'boolean',
        },
        {
            key: 'PROTECTED',
            title: 'Защищенное',
            type: 'boolean',
        },
        {
            key: 'WEIGHT',
            title: 'Вес',
            type: 'number',
        },
        {
            key: 'TAG',
            title: 'Тег',
            type: 'string',
            length: 64,
            preferences: <IFieldPreferences>{
                minColumnWidth: 200,
            }
        },
        {
            key: 'UNIQUE_FLAG',
            title: 'Уникальность',
            type: 'boolean',
            length: 64,
            default: false
        },
        {
            key: 'NOTE',
            title: 'Примечание',
            type: 'string',
            length: 255,
        },
    ],
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'TAG', 'UNIQUE_FLAG', 'NOTE'],
    searchFields: ['CLASSIF_NAME'/*, 'NOTE'*/],
    fullSearchFields: ['CLASSIF_NAME', 'TAG', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'TAG', 'UNIQUE_FLAG', 'NOTE'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME', 'UNIQUE_FLAG', 'TAG', 'NOTE'],
    allVisibleFields: ['NOTE'],
};
