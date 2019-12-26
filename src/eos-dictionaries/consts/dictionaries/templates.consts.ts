import { E_DICT_TYPE, IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
export const Templates: IDictionaryDescriptor = {
    id: 'templates',
    apiInstance: 'DOC_TEMPLATES',
    dictType: E_DICT_TYPE.custom,
    defaultOrder: 'NAME_TEMPLATE',
    title: 'Настройка шаблонов',
    visible: true,
    iconName: 'eos-icon-templates-settings',
    actions: ['add', 'markRecords', 'edit', 'removeHard', 'downloadFile'],
    fields: [{
        key: 'NAME_TEMPLATE',
        title: 'Имя файла',
        type: 'string',
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
            { value: '', title: '' },
            { value: 'Информация о системе', title: 'Информация о системе' },
            { value: 'Файлы документов', title: 'Файлы документов' },
            { value: 'Печать списка РК', title: 'Печать списка РК' },
            { value: 'Печать штрих-кода (альбомная)', title: 'Печать штрих-кода (альбомная)' },
            { value: 'Печать штрих-кода (книжная)', title: 'Печать штрих-кода (книжная)' },
            { value: 'Печать списка РКПД', title: 'Печать списка РКПД' },
            { value: 'Печать списка поручений', title: 'Печать списка поручений' },
            { value: 'Печать перечня поручений', title: 'Печать перечня поручений' },
            { value: 'Реестры внеш. отправки', title: 'Реестры внеш. отправки' },
            { value: 'Печать РК', title: 'Печать РК' },
            { value: 'opis_arh.exe', title: 'opis_arh.exe' }
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
