
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';
import { E_DICT_TYPE, IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { LINEAR_TEMPLATE } from './_linear-template';

export const TYPE_DOCUM_DICT: IDictionaryDescriptor =  {
    id: E_DICTIONARY_ID.TYPE_DOCUM,
    apiInstance: 'DOCVID_CL',
    title: 'Виды документов',
    dictType: E_DICT_TYPE.linear,
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    keyField: 'ISN_LCLASSIF',
    treeFields: ['CLASSIF_NAME'],
    defaultOrder: 'CLASSIF_NAME',
    iconName: 'eos-adm-icon-types-documents-blue',
    fields: [
        {
            key: 'ISN_LCLASSIF',
            title: '',
            type: 'number',
        },
        {
            key: 'CLASSIF_NAME',
            title: 'Краткое наименование',
            type: 'string',
            length: 64,
            required: true,
        },
        {
            key: 'DOCVID_INDEX',
            title: 'Индекс вида',
            type: 'string',
            length: 64,
        },
        {
            key: 'AP_FLAG',
            title: 'АП',
            type: 'boolean',

        },
        {
            key: 'FULLNAME',
            title: 'Полное наименование',
            type: 'text',
            length: 2000
        },
        {
            key: 'NOTE',
            title: 'Примечание',
            type: 'text',
            length: 255
        },
        {
            key: 'WEIGHT',
            title: 'Вес',
            type: 'number'
        }
    ],

    quickViewFields: ['DOCVID_INDEX', 'AP_FLAG', 'FULLNAME', 'NOTE'],
    allVisibleFields: [ 'FULLNAME', 'NOTE',
    ],
    fullSearchFields: [],
    shortQuickViewFields: [ 'CLASSIF_NAME'],
    searchFields: ['CLASSIF_NAME'],
    searchConfig: [SEARCH_TYPES.quick],
    listFields: ['DOCVID_INDEX', 'AP_FLAG', 'CLASSIF_NAME'],
    editFields: ['DOCVID_INDEX', 'AP_FLAG', 'CLASSIF_NAME', 'FULLNAME', 'NOTE'
    ]
};
