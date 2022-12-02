import { E_DICT_TYPE, IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import { VALID_REQ_STRING } from 'eos-common/consts/common.consts';

export const Templates: IDictionaryDescriptor = {
    id: 'templates',
    apiInstance: 'DOC_TEMPLATES',
    dictType: E_DICT_TYPE.custom,
    defaultOrder: 'NAME_TEMPLATE',
    title: 'Настройка шаблонов',
    visible: true,
    iconName: 'eos-icon-templates-settings',
    actions: ['add', 'markRecords', 'edit', 'removeHard', 'downloadFile', 'protViewSecurity'],
    fields: [{
        key: 'NAME_TEMPLATE',
        title: 'Имя файла',
        type: 'string',
        pattern: VALID_REQ_STRING,
        length: 64,
        required: true,
        isUnique: true,
        uniqueInDict: true,
    },
    {
        key: 'photo',
        type: 'dictionary',
        title: 'Название файла'
    },
    {
        key: 'DESCRIPTION',
        title: 'Описание',
        type: 'string',
        length: 64,
        isUnique: false,
    },
    {
        key: 'CATEGORY',
        title: 'Категория',
        type: 'select',
        options: [
        ],
        // required: true,
        // length: 64,
        // isUnique: true,
    },
    {
        key: 'ISN_TEMPLATE',
        title: 'ISN шаблона',
        type: 'number',
        isUnique: true,
    },
    {
        key: 'FILECONTENTS',
        title: 'Файл',
        type: 'text',
    }],
    keyField: 'ISN_TEMPLATE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    searchFields: ['NAME_TEMPLATE', /* 'DESCRIPTION', 'CATEGORY' *//*, 'NOTE'*/],
    fullSearchFields: ['NAME_TEMPLATE', 'DESCRIPTION', 'CATEGORY'/*, 'NOTE'*/],
    treeFields: ['NAME_TEMPLATE'],
    editFields: [/* 'FILECONTENTS', */ 'DESCRIPTION', 'CATEGORY', 'NAME_TEMPLATE'],
    shortQuickViewFields: ['NAME_TEMPLATE'],
    listFields: ['NAME_TEMPLATE', 'DESCRIPTION', 'CATEGORY'],
    allVisibleFields: ['NAME_TEMPLATE'],
    quickViewFields: ['NAME_TEMPLATE', 'DESCRIPTION', 'CATEGORY'],
};
