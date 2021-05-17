import { IDictionaryDescriptor, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';

export const COLLISIONS_SEV_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: 'sev-collisions',
    apiInstance: 'SEV_COLLISION',
    visible: true,
    actions: ['edit', 'defaultCollision', 'protViewSecurity'],
    dictType: E_DICT_TYPE.custom,
    iconName: 'eos-icon-alert-blue',
    defaultOrder: 'COLLISION_CODE',
    keyField: 'COLLISION_CODE',
    title: 'Коллизии СЭВ',
    searchConfig: [],
    hideTopMenu: true,
    fields: [{
        key: 'COLLISION_CODE',
        type: 'number',
        title: 'Номер колизиии',
        readonly: true,
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
        readonly: true,
        preferences: {minColumnWidth: 350}
    }, {
        key: 'RESOLVE_TYPE',
        type: 'select',
        // length: 100,
        title: 'Способ разрешения',
        required: true,
        options: [],
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
    editFields: ['COLLISION_NAME', 'RESOLVE_TYPE', 'COLLISION_CODE'],
    listFields: ['COLLISION_CODE', 'COLLISION_NAME', 'RESOLVE_TYPE'/*'resolve_text'*/],
    allVisibleFields: [],
    quickViewFields: ['RESOLVE_TYPE'], // CLASSIF_NAME is in shortQuickViewFields
    shortQuickViewFields: ['COLLISION_NAME'],
});
