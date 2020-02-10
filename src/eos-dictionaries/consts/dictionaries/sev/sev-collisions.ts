import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../../input-validation';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';

export const RESOLVE_DESCRIPTIONS = [
    { value: 1, title: 'Отказать в регистрации'},
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ'},
    { value: 3, title: 'Продолжить регистрацию'},
    { value: 4, title: 'Создать связку с документом, не зарегистрированным'},
    { value: 5, title: 'Разрешить редактировать'},
];

export const COLLISIONS_SEV_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: 'sev-collisions',
    apiInstance: 'SEV_COLLISION',
    visible: true,
    iconName: 'eos-icon-alert-blue',
    defaultOrder: 'COLLISION_NAME',
    keyField: 'COLLISION_CODE',
    title: 'Коллизии СЭВ',
    searchConfig: [],
    hideTopMenu: true,
    fields: [{
        key: 'COLLISION_CODE',
        type: 'number',
        length: 5,
    }, {
        key: 'REASON_NUM',
        type: 'number',
        required: true,
        length: 12,
        title: '№',
    }, {
        key: 'COLLISION_NAME',
        type: 'string',
        title: 'Название коллизии СЭВ',
        length: 200,
        required: true,
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'RESOLVE_TYPE',
        type: 'select',
        // length: 100,
        title: 'Способ разрешения',
        required: true,
        options: RESOLVE_DESCRIPTIONS,
    },
    // {
    //     key: 'resolve_text',
    //     type: 'string',
    //     length: 200,
    //     title: 'Способ разрешения',
    //     required: true,
    // },
    {
        key: 'DEFAULT_RESOLVE_TYPE',
        type: 'number'
    }, {
        key: 'ALLOWED_RESOLVE_TYPES',
        type: 'string'
    }],
    treeFields: ['COLLISION_NAME'],
    editFields: ['COLLISION_NAME', 'RESOLVE_TYPE'],
    listFields: ['REASON_NUM', 'COLLISION_NAME', 'RESOLVE_TYPE'/*'resolve_text'*/],
    allVisibleFields: [],
    quickViewFields: ['RESOLVE_TYPE'], // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['COLLISION_NAME'],
});
