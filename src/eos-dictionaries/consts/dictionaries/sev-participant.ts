import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';
import { BROADCAST_CHANNEL_DICT } from './broadcast-channel';
import { COMMON_FIELD_NAME } from './_common';

export const PARTICIPANT_SEV_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'sev-participant',
    apiInstance: 'SEV_PARTICIPANT',
    title: 'Участники СЭВ',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']), // ??
    visible: true,
    iconName: 'eos-icon-shared-folder-blue',
    keyField: 'ISN_LCLASSIF',
    defaultOrder: 'ADDRESS',
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
        key: 'rules',
        type: 'string',
        title: 'Используемые правила',
        // foreignKey: 'SEV_PARTICIPANT_RULE_List'
    }]),
    editFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'ADDRESS', 'rules', 'CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['ISN_CHANNEL', 'NOTE', 'ADDRESS', 'rules'],
    quickViewFields: ['NOTE', 'ISN_CHANNEL', 'ADDRESS', 'rules'],
    searchFields: [],
});
