import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { NOT_EMPTY_STRING } from '../../input-validation';
import { COMMON_FIELD_NAME } from '../_common';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';
import { BROADCAST_CHANNEL_DICT } from './sev-broadcast-channel';
import { SEARCH_TYPES } from 'eos-dictionaries/consts/search-types';

export const PARTICIPANT_SEV_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: 'sev-participant',
    apiInstance: 'SEV_PARTICIPANT',
    title: 'Участники СЭВ',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'tableCustomization',
        'removeHard', 'edit', 'view', 'protViewSecurity'],
    visible: true,
    iconName: 'eos-adm-icon-shared-folder-blue',
    keyField: 'ISN_LCLASSIF',
    defaultOrder: 'WEIGHT',
    showDeleted: true,
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: LINEAR_TEMPLATE.fields.concat([{
        key: 'DUE_ORGANIZ',
        title: 'Участник СЭВ',
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
        title: 'Шифрование',

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
    {
        key: 'SEV_PARTICIPANT_RULE.ISN_RULE',
        title: 'Правила',
        type: 'dictionary',
        dictionaryId: 'SEV_PARTICIPANT_RULE',
        dictionaryLink: {
            pk: 'ISN_PARTICIPANT',
            fk: 'ISN_RULE',
            label: 'CLASSIF_NAME',
        },
    },
    {
        key: 'SEV_PARTICIPANT_RULE.ISN_RULE',
        title: 'Правила',
        type: 'dictionary',
        dictionaryId: 'SEV_PARTICIPANT_RULE',
        dictionaryLink: {
            pk: 'ISN_PARTICIPANT',
            fk: 'ISN_RULE',
            label: 'CLASSIF_NAME',
        },
    },
    {
        key: 'FILE_SYNC_DATE',
        title: 'Дата формирования файла синхронизации',
        type: 'number'
    }, {
        key: 'WEIGHT',
        title: 'Вес элемента',
        type: 'number',
    }
   ]),
    editFields: ['DUE_ORGANIZ', 'NOTE', 'ISN_CHANNEL', 'CRYPT', 'ADDRESS', 'rules', 'CLASSIF_NAME', 'sev_partisipant', 'sev_rule'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['ISN_CHANNEL', 'CRYPT', 'NOTE', 'ADDRESS', 'FILE_SYNC_DATE'],
    fullSearchFields: ['CLASSIF_NAME', 'ADDRESS', 'rules', 'ISN_CHANNEL', 'SEV_PARTICIPANT', 'SEV_PARTICIPANT_RULE.ISN_RULE'],
    quickViewFields: ['NOTE', 'ISN_CHANNEL', 'CRYPT', 'ADDRESS', 'rules', 'sev_partisipant', 'sev_rule', 'FILE_SYNC_DATE' ],
    searchFields: ['CLASSIF_NAME'],
    fieldDefault: ['ISN_CHANNEL', 'CRYPT', 'FILE_SYNC_DATE']
});
