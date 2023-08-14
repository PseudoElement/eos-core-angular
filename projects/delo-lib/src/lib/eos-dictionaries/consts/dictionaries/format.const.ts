import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';
import { E_DICT_TYPE, IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';

const FORMAT_TNAME_OPTIONS = [
    { value: 'txt', title: 'TXT' },
    { value: 'rtf', title: 'RTF' },
    { value: 'doc', title: 'DOC(X)' },
    { value: 'htm', title: 'HTML' },
    { value: 'xls', title: 'XLS(X)' },
    { value: 'pdf', title: 'PDF' },
    { value: 'no', title: 'нет' },
];
const FORMAT_GNAME_OPTIONS = [
    { value: 'bmp', title: 'BMP' },
    { value: 'jpg', title: 'JPG' },
    { value: 'tif', title: 'TIF' },
    { value: 'png', title: 'PNG' },
    { value: 'pdf', title: 'PDF' },
    { value: 'no', title: 'нет' },
];
const COLOR_OPTIONS = [
    {value: 1, title: 'Черно-белый'},
    {value: 2, title: 'Оттенки серого'},
    {value: 3, title: 'Цветной'},
];
const COMPR_OPTIONS = [
    {value: 1, title: 'без сжатия'},
    {value: 2, title: 'CCITT3'},
    {value: 3, title: 'CCITT4'},
    {value: 4, title: 'PACKBITS'},
    {value: 5, title: 'JPEG'},
];
export const FORMAT_DICT: IDictionaryDescriptor = {
    id: E_DICTIONARY_ID.FORMAT,
    apiInstance: 'FORMAT_CL',
    dictType: E_DICT_TYPE.linear,
    title: 'Форматы сохранения',
    visible: true,
    iconName: 'eos-icon-directory-book-blue',
    defaultOrder: 'NOTE',
    actions: ['add', 'quickSearch', 'userOrder', 'restore', 'remove', 'showDeleted', 'markRecords', 'edit', 'view', 'removeHard',
    'moveUp', 'moveDown', 'userOrderCut', 'userOrderPaste'],
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
            key: 'FORMAT_TNAME',
            title: 'Текстовый формат',
            type: 'select',
            options: FORMAT_TNAME_OPTIONS,
            default: 'no'
        },
        {
            key: 'KIND_ADJ', // настройка исключена из web-страницы
            title: '',
            type: 'string',
        },
        {
            key: 'FILE_ADJ', // настройка исключена из web-страницы
            title: '',
            type: 'string',
        },
        {
            key: 'FORMAT_GNAME',
            title: 'Графический формат',
            type: 'select',
            options: FORMAT_GNAME_OPTIONS,
            default: 'no'
        },
        {
            key: 'COLOR',
            type: 'radio',
            title: 'Цветовая гамма',
            options: COLOR_OPTIONS
        },
        {
            key: 'COMPR',
            title: 'Метод сжатия',
            type: 'radio',
            options: COMPR_OPTIONS
        },
        {
            key: 'WEIGHT', // описания не нашёл
            title: '',
            type: 'string',
            length: 255,
        },
/*         {
            key: 'PROTECTED', // описания не нашёл
            title: '',
            type: 'string',
            length: 255,
        }, */
        {
            key: 'DEL_COL', // описания не нашёл
            title: '',
            type: 'number',
            length: 248,
        },
        {
            key: 'NOTE',
            title: 'Наименование',
            type: 'string',
            length: 64,
            isUnique: true,
            uniqueInDict: true,
            required: true,
        },
        {
            key: 'PRIORITET',
            title: 'По умолчанию',
            type: 'boolean',
        },
    ],
    treeFields: ['NOTE'],
    editFields: ['FORMAT_TNAME', 'FORMAT_GNAME', 'PRIORITET', 'NOTE', 'COMPR', 'COLOR'],
    searchFields: ['NOTE'/*, 'NOTE'*/],
    fullSearchFields: ['NOTE', ],
    quickViewFields: ['NOTE', 'PRIORITET', 'FORMAT_GNAME', 'COLOR', 'COMPR', 'FORMAT_TNAME'],
    shortQuickViewFields: ['NOTE'],
    listFields: ['NOTE', 'FORMAT_TNAME', 'FORMAT_GNAME', 'PRIORITET'],
    allVisibleFields: ['NOTE'],
};
