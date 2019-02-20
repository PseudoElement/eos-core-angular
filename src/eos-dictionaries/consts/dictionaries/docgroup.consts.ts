
import { E_DICT_TYPE, ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import {COMMON_FIELDS, COMMON_FIELD_CODE, COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME, COMMON_FIELD_NOTE} from './_common';
import { ISelectOption } from 'eos-common/interfaces';

export const RK_TYPE_OPTIONS_NODE: ISelectOption[] = [
    { value: 1, title: 'Входящие' },
    { value: 3, title: 'Исходящие' },
    { value: 2, title: 'Письма граждан' }
];

export const RK_TYPE_OPTIONS: ISelectOption[] = [
    { value: 0, title: 'Не определена' },
    { value: 1, title: 'Входящие' },
    { value: 3, title: 'Исходящие' },
    { value: 2, title: 'Письма граждан' }
];

export const DOCGROUP_DICT: ITreeDictionaryDescriptor = {
    id: 'docgroup',
    apiInstance: 'DOCGROUP_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Группы документов',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-icon-folder-group-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'counterDocgroup',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes' , 'additionalFields'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    },
    Object.assign({}, COMMON_FIELD_CODE, {lenght: 10}),
    Object.assign({}, COMMON_FIELD_NOTE, {lenght: 100}),
    Object.assign({}, COMMON_FIELD_NAME, {lenght: 100, uniqueInDict: true, isUnique: true}),
    Object.assign({}, COMMON_FIELD_FULLNAME, {lenght: 100}),
    {
        key: 'IS_COPYCOUNT',
        title: 'Нумерация копий',
        type: 'boolean',
    }, {
        key: 'RC_TYPE',
        title: 'Вид РК',
        type: 'select',
        options: RK_TYPE_OPTIONS,
        default: 3,
    }, {
        key: 'RC_TYPE_NODE',
        title: 'Вид РК',
        type: 'select',
        options: RK_TYPE_OPTIONS_NODE,
        default: 3,
    }, {
        key: 'DOCGROUP_INDEX',
        title: 'Индекс',
        type: 'string',
    }, {
        key: 'DOCNUMBER_FLAG',
        title: 'Номерообразование',
        type: 'boolean',
    }, {
        key: 'SHABLON',
        title: 'Шаблон',
        type: 'string',
        required: true,
    }, {
        key: 'EDS_FLAG',
        title: 'ЭП',
        type: 'boolean',
    }, {
        key: 'ENCRYPT_FLAG',
        title: 'Шифрование',
        type: 'boolean',
    }, {
        key: 'TEST_UNIQ_FLAG',
        title: 'Проверка уникальности номера',
        type: 'boolean'
    }, {
        key: 'PRJ_NUM_FLAG',
        title: 'Проекты документов',
        type: 'boolean',
    }, {
        key: 'PRJ_SHABLON',
        title: 'Шаблон проекта',
        type: 'string',
        required: true,
    }, {
        key: 'PRJ_WEIGHT',
        title: 'Вес в списке для проектов',
        type: 'number',
    }, {
        key: 'PRJ_AUTO_REG',
        title: 'Автоматическая регистрация',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY_EDS',
        title: 'подписей',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY2_EDS',
        title: 'виз',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY_EXEC_EDS',
        title: 'исполнителей',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_DEL_AFTER_REG',
        title: 'Удалять РКПД после регистрации',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_TEST_UNIQ_FLAG',
        title: 'Проверка уникальности номера проекта',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'E_DOCUMENT',
        title: 'Оригинал в эл.виде',
        type: 'boolean',
    }, {
        key: 'ACCESS_MODE',
        title: 'РК перс. доступа',
        type: 'boolean',
    }, {
        key: 'ACCESS_MODE_FIXED',
        title: 'Без редактирования',
        type: 'boolean',
    }, {
        key: 'INITIATIVE_RESOLUTION',
        title: 'Инициативные поручения',
        type: 'boolean',
        forNode: true,
    }]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE', 'IS_COPYCOUNT', 'ACCESS_MODE_FIXED', 'E_DOCUMENT', 'PRJ_TEST_UNIQ_FLAG',
        'PRJ_DEL_AFTER_REG', 'PRJ_APPLY_EXEC_EDS', 'PRJ_APPLY2_EDS', 'PRJ_APPLY_EDS', 'PRJ_AUTO_REG', 'PRJ_SHABLON', 'PRJ_NUM_FLAG',
        'TEST_UNIQ_FLAG', 'ENCRYPT_FLAG', 'EDS_FLAG', 'SHABLON', 'DOCNUMBER_FLAG', 'DOCGROUP_INDEX', 'RC_TYPE', 'INITIATIVE_RESOLUTION',
        'ACCESS_MODE', 'RC_TYPE_NODE'],
    searchFields: ['CODE', 'CLASSIF_NAME'],
    fullSearchFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'DOCGROUP_INDEX', 'NOTE'],
    quickViewFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE', 'DOCGROUP_INDEX', 'RC_TYPE' ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CODE', 'CLASSIF_NAME'],
    allVisibleFields: ['NOTE', 'FULLNAME'],
};
