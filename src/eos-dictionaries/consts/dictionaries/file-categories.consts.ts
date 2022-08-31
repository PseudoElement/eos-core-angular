import { NOT_EMPTY_STRING } from '../input-validation';
import { E_DICT_TYPE, IFieldPreferences, IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import {ISelectOption} from 'eos-common/interfaces';

export const DELETED_VALUES: ISelectOption[] = [
    {value: null, title: 'Не указан'},
    {value: 1, title: 'Да'},
    {value: 0, title: 'Нет'}
];

export const FILE_CATEGORIES_DICT: IDictionaryDescriptor = {
    id: 'file-category',
    apiInstance: 'FILE_CATEGORY_CL',
    dictType: E_DICT_TYPE.linear,
    title: 'Категории файлов',
    visible: true,
    iconName: 'eos-icon-folder-blue',
    defaultOrder: 'WEIGHT',
    actions: ['add', 'edit', 'remove', 'showDeleted', 'restore', 'userOrder',  'view', 'tableCustomization',
              'export', 'import', 'protViewSecurity', 'removeHard', 'markRecords', 'quickSearch', 'fullSearch'],
    keyField: 'ISN_LCLASSIF',
    fields: [
        {
            key: 'ISN_LCLASSIF',
            type: 'number',
            title: 'Идентификатор'
        },
        {
            key: 'CLASSIF_NAME',
            type: 'string',
            title: 'Название',
            length: 200,
            isUnique: true,
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
            title: 'Название',
            length: 200,
        },
        {
            key: 'DG_FILE_CATEGORY.ISN_NODE_DG',
            type: 'dictionary[]',
            dictionaryId: 'DG_FILE_CATEGORY',
            title: '',
            required: true,
            dictionaryLink: {
                pk: 'ISN_NODE_DG',
                fk: 'ISN_FILE_CATEGORY',
                label: '',
            },
            options: []
        },
        {
            key: 'DG_NAMES',
            type: 'string',
            title: 'Группы документов',
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
            type: 'select',
            options: DELETED_VALUES

        },
   ],
   searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    editFields: ['CLASSIF_NAME', 'NOTE', 'DG_NAMES'],
    searchFields: ['CLASSIF_NAME'],
    quickViewFields: ['CLASSIF_NAME', 'DG_NAMES', 'NOTE'],
    shortQuickViewFields: ['ISN_LCLASSIF'],
    listFields: ['CLASSIF_NAME',  'DG_NAMES', 'NOTE'],
    allVisibleFields: ['CLASSIF_NAME', 'NOTE', 'WEIGHT', 'DG_NAMES', 'INS_PERSON', 'PROTECTED', 'INS_DATE', 'INS_WHO', 'UPD_DATE', 'UPD_WHO', 'DELETED'],
    treeFields: ['ISN_LCLASSIF'],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE', 'DG_NAMES']
};
