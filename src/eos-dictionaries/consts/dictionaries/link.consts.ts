import { IDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';

export const LINK_TYPES = [{
    value: 2,
    title: 'Исполнение'
}, {
    value: 1,
    title: 'Повторность'
}, {
    value: 3,
    title: 'Проекты'
}, {
    value: 0,
    title: '',
}];

export const LINK_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'link',
    apiInstance: 'LINK_CL',
    title: 'Типы связок',
    visible: true,
    iconName: 'eos-icon-chain-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        uniqueInDict: true,
    }),
    Object.assign({}, COMMON_FIELD_NAME, {
        key: 'PAIR_NAME',
        isUnique: true,
        uniqueInDict: true,
    }), {
        key: 'LINK',
        title: 'Связка',
        type: 'string',
    }, {
        key: 'PAIR_LINK',
        title: 'Обратная связка',
        type: 'string',
    }, {
        key: 'ISN_PARE_LINK',
        type: 'number',
    }, {
        key: 'LINK_INDEX',
        title: 'Индекс',
        type: 'string',
    }, {
        key: 'TRANSPARENT',
        title: 'Прозрачная связка',
        type: 'boolean',
    }, {
        key: 'PAIR_INDEX',
        title: 'Индекс',
        type: 'string',
    }, {
        key: 'PAIR_TRANSPARENT',
        title: 'Прозрачная связка',
        type: 'boolean',
    }, {
        key: 'PAIR_NOTE',
        title: 'Примечание',
        type: 'text',
        length: 250,
    }, {
        key: 'LINK_TYPE',
        title: '',
        type: 'select',
        options: LINK_TYPES,
    }, {
        key: 'TYPE',
        title: 'Категория',
        type: 'select',
        options: LINK_TYPES,
    }, {
        key: 'LINK_DIR',
        type: 'number',
    }],

    defaultOrder: 'WEIGHT',
    keyField: 'ISN_LCLASSIF',
    editFields: ['LINK_INDEX', 'CLASSIF_NAME', 'TRANSPARENT', 'PAIR_INDEX', 'PAIR_NAME', 'PAIR_TRANSPARENT',
        'LINK_TYPE', 'LINK_DIR', 'ISN_LCLASSIF', 'ISN_PARE_LINK', 'NOTE', 'PAIR_NOTE'],
    listFields: ['LINK', 'PAIR_LINK', 'TYPE'],
});
