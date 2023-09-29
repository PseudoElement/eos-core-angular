import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME } from './_common';
import { SEARCH_TYPES } from '../search-types';
import {environment} from '../../../environments/environment';
import { VALID_REQ_STRING } from '../../../eos-common/consts/common.consts';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const CABINET_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.CABINET,
    folder: 'departments',
    apiInstance: 'CABINET',
    title: 'Кабинеты',
    keyField: 'ISN_CABINET',
    visible: !environment.production,
    iconName: 'eos-adm-icon-department-blue',
    defaultOrder: 'CABINET_NAME',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order',
        // 'userOrder', 'moveUp', 'moveDown',
        'edit', 'navigateUp', 'navigateDown', /* 'showDeleted', 'remove', */ 'removeHard',
      /*   'restore', */ 'tableCustomization', 'showDeleted'],
    fields: [{
        key: 'ISN_CABINET',
        type: 'number',
        title: 'ISN кабинета',
        pattern: /^\d*$/,
        length: 10,
    },
    Object.assign({}, COMMON_FIELD_NAME, {
        key: 'CABINET_NAME',
        title: 'Краткое наименование кабинета',
        pattern: VALID_REQ_STRING,
        length: 64,
    //    isUnique: true,
    }),
    Object.assign({}, COMMON_FIELD_FULLNAME, {
        title: 'Полное наименование кабинета',
        height: 150,
        length: 2000,
        isUnique: true,
    }), {
        key: 'DUE',
        type: 'string',
        title: 'Код подразделения',
        length: 248,
    }, {
        key: 'DEPARTMENT_NAME',
        title: 'Подразделение',
        type: 'text',
        length: 100,
    }, {
        key: 'department',
        type: 'dictionary',
        title: 'Подразделение'
    }, {
        key: 'users',
        type: 'array',
        title: 'Пользователи кабинета'
    }, {
        key: 'folders',
        type: 'array',
        title: 'Папки кабинета',
        foreignKey: 'FOLDER_List'
    }, {
        key: 'owners',
        type: 'array',
        title: 'Владельцы кабинета'
    }, {
        key: 'cabinetAccess',
        type: 'dictionary',
        title: 'Доступ пользователей'
    },
    {
        key: 'ORDER_NUM',
        type: 'number',
        title: 'Порядок сортировки',
        pattern: /^\d*$/,
        length: 1000,
    }],
    treeFields: ['CABINET_NAME'],
    listFields: ['CABINET_NAME', 'DEPARTMENT_NAME'],
    searchFields: ['CABINET_NAME'],
    fullSearchFields: ['CABINET_NAME' /*, 'FULLNAME'*/],
    allVisibleFields: [],
    shortQuickViewFields: ['CABINET_NAME', 'FULLNAME'],
    quickViewFields: ['ISN_CABINET', 'CABINET_NAME', 'DEPARTMENT_NAME', 'FULLNAME', 'department', 'owners', 'users'],
    editFields: ['CABINET_NAME', 'FULLNAME', 'department', 'users', 'owners', 'folders', 'cabinetAccess'],
});

export const CABINET_FOLDERS = [{ /*  */
    key: 1,
    charKey: '1',
    title: 'Поступившие'
}, {
    key: 2,
    charKey: '2',
    title: 'На исполнении'
}, {
    key: 3,
    charKey: '3',
    title: 'На контроле'
}, {
    key: 4,
    charKey: '4',
    title: 'У руководства'
}, {
    key: 5,
    charKey: '5',
    title: 'На рассмотрении'
}, {
    key: 6,
    charKey: '6',
    title: 'В Дело'
}, {
    key: 7,
    charKey: '7',
    title: 'Управление проектами'
}, {
    key: 8,
    charKey: '8',
    title: 'На визировании'
}, {
    key: 9,
    charKey: '9',
    title: 'На подписи'
}];

