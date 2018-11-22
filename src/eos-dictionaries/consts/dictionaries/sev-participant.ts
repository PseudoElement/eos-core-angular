import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../input-validation';
import { BROADCAST_CHANNEL_DICT } from './broadcast-channel';

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
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'ISN_CHANNEL',
        type: 'select',
        dictionaryId: BROADCAST_CHANNEL_DICT.id,
        title: 'Канал передачи сообщений',
        required: true,
        options: [],
    }, {
        key: 'ADDRESS',
        type: 'string',
        title: 'Адрес',
        pattern: NOT_EMPTY_STRING
    }, {
        key: 'SEV_PARTICIPANT_RULE_List',
        type: '',
        title: 'Используемые правила',
    }]),
    editFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'ADDRESS', 'SEV_PARTICIPANT_RULE_List'],
    listFields: ['DUE_ORGANIZ'],
    allVisibleFields: ['ISN_CHANNEL', 'NOTE', 'ADDRESS', 'SEV_PARTICIPANT_RULE_List'],
    quickViewFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'ADDRESS', 'SEV_PARTICIPANT_RULE_List'],
    searchFields: [],
});
