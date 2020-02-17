import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { NOT_EMPTY_STRING } from '../../input-validation';
import { COMMON_FIELD_NAME } from '../_common';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';
import { BROADCAST_CHANNEL_DICT } from './sev-broadcast-channel';

export const PARTICIPANT_SEV_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: 'sev-participant',
    apiInstance: 'SEV_PARTICIPANT',
    title: 'Участники СЭВ',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'tableCustomization',
        'removeHard', 'edit', 'view'],
    visible: true,
    iconName: 'eos-icon-shared-folder-blue',
    keyField: 'ISN_LCLASSIF',
    defaultOrder: 'ADDRESS',
    showDeleted: true,
    fields: LINEAR_TEMPLATE.fields.concat([{
        key: 'DUE_ORGANIZ',
        title: 'Организация',
        type: 'string',
        required: true,
        pattern: NOT_EMPTY_STRING,
    }, Object.assign({}, COMMON_FIELD_NAME, {
        title: 'Организация'
    }), {
        key: 'ISN_CHANNEL',
        type: 'select',
        dictionaryId: BROADCAST_CHANNEL_DICT.apiInstance,
        title: 'Канал передачи сообщений',
        required: true,
        options: [],
    }, {
        key: 'ADDRESS',
        type: 'string',
        title: 'Адрес',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'CRYPT',
        type: 'boolean',
        title: 'Шифровать',

    }, {
        key: 'rules',
        type: 'string',
        title: 'Используемые правила',
        // required: true,
        // foreignKey: 'SEV_PARTICIPANT_RULE_List'
    },
    {
        key: 'sev_partisipant',
        type: 'dictionary',
        title: 'ПРАВИЛА ID',
    },
    {
        key: 'sev_rule',
        type: 'dictionary',
        title: 'Наименования правил',

    },


    ]),
    editFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'CRYPT', 'ADDRESS', 'rules', 'CLASSIF_NAME', 'sev_partisipant', 'sev_rule'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['ISN_CHANNEL', 'NOTE', 'ADDRESS'],
    quickViewFields: ['NOTE', 'ISN_CHANNEL', 'CRYPT', 'ADDRESS', 'rules', 'sev_partisipant', 'sev_rule'],
    searchFields: ['CLASSIF_NAME'],
});
