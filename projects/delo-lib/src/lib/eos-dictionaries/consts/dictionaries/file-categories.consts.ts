import { NOT_EMPTY_STRING } from '../input-validation';
import { E_DICT_TYPE, IFieldPreferences, IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const FILE_CATEGORIES_DICT: IDictionaryDescriptor = {
    id: E_DICTIONARY_ID.FILE_CATEGORIES,
    apiInstance: 'FILE_CATEGORY_CL',
    dictType: E_DICT_TYPE.linear,
    title: 'Категории файлов',
    visible: true,
    iconName: 'eos-adm-icon-category-doc-blue',
    defaultOrder: 'WEIGHT',
    actions: ['add', 'edit', 'remove', 'showDeleted', 'restore', 'userOrder', 'userOrderCut', 'userOrderPaste', 'view', 'tableCustomization',
        'export', 'import', 'protViewSecurity', 'removeHard', 'markRecords', 'quickSearch', 'fullSearch', 'moveUp', 'moveDown'],
    keyField: 'ISN_LCLASSIF',
    fields: [
        {
            key: 'ISN_LCLASSIF',
            type: 'number',
            title: 'Идентификатор'
        },
        {
            key: 'NAME',
            type: 'string',
            title: 'Наименование',
            length: 200,
            isUnique: true,
            uniqueInDict: true,
            required: true,
            pattern: NOT_EMPTY_STRING,
            preferences: <IFieldPreferences>{
                minColumnWidth: 200,
            }
        },
        {
            key: 'NOTE',
            type: 'string',
            title: 'Примечание',
            length: 200,
            default: null,
        },
        {
            key: 'WEIGHT',
            type: 'number',
            title: 'Вес',
            length: 200,
        },
        {
            key: 'DOC_GROUP_NAMES',
            type: 'string',
            title: 'Группa документов',
            preferences: <IFieldPreferences>{
                minColumnWidth: 300,
            }
        },
        {
            key: 'PROTECTED',
            type: 'boolean',
            title: 'Защищенный',
        },
        {
            key: 'INS_DATE',
            type: 'date',
            title: 'Дата создания',
        },
        {
            key: 'INS_WHO',
            title: 'Кто создал',
            type: 'string',
            options: [],
            dictionaryId: 'USER_CL',
            dictionaryLink: {
                pk: 'ISN_LCLASSIF',
                fk: 'INS_WHO',
                label: 'SURNAME_PATRON',
            },
        },
        {
            key: 'UPD_DATE',
            type: 'date',
            title: 'Дата изменения',
        },
        {
            key: 'UPD_WHO',
            title: 'Кто изменил',
            type: 'string',
            options: [],
            dictionaryId: 'USER_CL',
            dictionaryLink: {
                pk: 'ISN_LCLASSIF',
                fk: 'UPD_WHO',
                label: 'SURNAME_PATRON',
            },
        },
        {
            key: 'DELETED',
            title: 'Удален',
            type: 'boolean',
        },
    ],
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    editFields: ['NAME', 'NOTE', 'DOC_GROUP_NAMES'],
    searchFields: ['NAME'],
    treeFields: ['NAME'],
    quickViewFields: ['NAME', 'DOC_GROUP_NAMES', 'NOTE'],
    shortQuickViewFields: ['NAME'],
    listFields: ['NAME'],
    allVisibleFields: ['NOTE', 'DOC_GROUP_NAMES'],
    fullSearchFields: ['NAME', 'NOTE', 'DOC_GROUP_NAMES'],
    fieldDefault: ['NAME', 'NOTE', 'DOC_GROUP_NAMES'],
};
