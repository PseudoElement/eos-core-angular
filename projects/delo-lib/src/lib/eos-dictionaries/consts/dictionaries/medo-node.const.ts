import { E_DICT_TYPE, IDictionaryDescriptor, /* IFieldPreferences  */} from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
 // import { COMMON_FIELD_ICONS, COMMON_FIELD_NAME } from './_common';
// import { YEAR_PATTERN, VALID_REQ_MULTIPLE_STRING } from 'eos-common/consts/common.consts';
// import { SECURITY_DICT } from './security.consts';
import { SEARCH_TYPES } from '../search-types';

export const MEDO_NODE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'medo-node-cl',
    apiInstance: 'MEDO_NODE_CL',
    title: 'Узлы МЭДО',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    visible: true,
    actions: [
        'add', 'edit', 'userOrder', 'moveUp', 'moveDown', 'remove', 'showDeleted', 'restore', 'protViewSecurity', 'tableCustomization',
        'removeHard', 'markRecords',
    ],
    defaultOrder: 'WEIGHT',
    dictType: E_DICT_TYPE.linear,
    iconName: 'eos-iconp-organization-list-blue',
    keyField: 'ISN_LCLASSIF',
    fields: LINEAR_TEMPLATE.fields.concat([
    {
        key: 'NAME',
        title: 'Название узла',
        type: 'string',
        length: 255,
        required: true,
    }, {
        key: 'DIRECTORY',
        title: 'Каталог обмена',
        type: 'string',
        length: 255,
        required: true,
    }, {
        key: 'PASSWORD',
        title: 'Хэш пароля',
        type: 'string',
        length: 64,
    }, {
        key: 'NOTE',
        title: 'Примечание',
        type: 'text',
        length: 2000,
    }, {
        key: 'WEIGHT',
        title: 'Вес элемента',
        type: 'number',
    }, {
        key: 'DELETED',
        title: 'Флаг логического удаления',
        type: 'boolean',
    }, {
        key: 'PROTECTED',
        title: 'Флаг логического удаления',
        type: 'boolean',
    }, {
        key: 'INS_DATE',
        type: 'date',
        title: '',
    }, {
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
    }, {
        key: 'UPD_DATE',
        type: 'date',
        title: 'Дата изменения',
    }, {
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
    // COMMON_FIELD_ICONS,
    /* Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Заголовок',
        length: 2000,
        type: 'text',
        // pattern: VALID_REQ_MULTIPLE_STRING,
        preferences: <IFieldPreferences>{
            minColumnWidth: 250,
        }
    }), */
    ]),
    editFields: ['NAME', 'DIRECTORY', 'PASSWORD', 'NOTE'],
    searchFields: ['NAME', 'DIRECTORY', 'NOTE'],
    fullSearchFields: ['NAME', 'DIRECTORY', 'NOTE'],
    quickViewFields: ['NAME', 'DIRECTORY', 'NOTE'],
    shortQuickViewFields: ['NAME'],
    listFields: ['NAME'], // 'NAME' Замок в настройках столбцов
    allVisibleFields: ['DIRECTORY', 'NOTE'],
    fieldDefault: ['DIRECTORY', 'NOTE']
});
