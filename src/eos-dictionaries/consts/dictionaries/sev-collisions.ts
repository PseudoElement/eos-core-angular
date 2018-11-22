import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';

export const RESOLVE_DESCRIPTIONS = [
    {type: 1, text: 'Отказать в регистрации'},
    {type: 2, text: 'Регистрировать сообщение из ПП в СЭВ'},
    {type: 3, text: 'Продолжить регистрацию'},
    {type: 4, text: 'Создать связку с документом, не зарегистрированным'},
    {type: 5, text: 'Разрешить редактировать'},
];

export const COLLISIONS_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-collisions',
    apiInstance: 'SEV_COLLISION',
    actions: [],
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
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'RESOLVE_TYPE',
        type: 'number',
        length: 100,
        title: 'Код способа разрешения',
        required: true,
    }, {
        key: 'resolve_text',
        type: 'string',
        length: 200,
        title: 'Способ разрешения',
        required: true,
    }, {
        key: 'DEFAULT_RESOLVE_TYPE',
        type: 'number'
    }, {
        key: 'ALLOWED_RESOLVE_TYPES',
        type: 'string'
    }],
    treeFields: ['COLLISION_NAME'],
    editFields: [],
    listFields: ['REASON_NUM', 'COLLISION_NAME', 'resolve_text'],
    allVisibleFields: ['COLLISION_NAME'],
});
