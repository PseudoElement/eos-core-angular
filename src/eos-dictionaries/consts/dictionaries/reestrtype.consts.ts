import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { ADDR_CATEGORY_DICT } from './addr-category.consts';
import { DELIVERY_DICT } from './delivery.consts';

export const REESTRTYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'reestrtype',
    apiInstance: 'REESTRTYPE_CL',
    title: 'Типы реестров',
    visible: true,
    iconName: 'eos-adm-icon-new-doc-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        length: 64,
        isUnique: true,
        uniqueInDict: true,
    }), {
            key: 'ISN_ADDR_CATEGORY',
            type: 'select',
            title: 'Категория',
            length: 150,
            required: true,
            dictionaryId: ADDR_CATEGORY_DICT.apiInstance,
            options: [],
            default: 0,
    }, {
            key: 'ISN_DELIVERY',
            type: 'select',
            title: 'Вид отправки',
            length: 100,
            dictionaryId: DELIVERY_DICT.apiInstance,
            dictionaryOrder: 'WEIGHT',
            options: [],
    }, {
            key: 'GROUP_MAIL',
            type: 'boolean',
            length: 10,
            title: 'Партионная почта',
    }, {
            key: 'FLAG_TYPE',
            type: 'buttons',
            title: 'Номерообразование',
            length: 100,
            options: [{value: 1, title: 'от счетчика'}, {value: 0, title: 'редактируемый'}],
            default: 0,
    }, {
            key: 'EMERGENCY',
            type: 'string',
            title: 'Срочность',
            length: 64,
    }, {
            key: 'IMPOTANCE',
            type: 'string',
            title: 'Важность',
            length: 64,
    }, {
            key: 'IS_UNIQUE',
            type: 'select',
            title: 'Уникальность',
            length: 100,
            options: [{value: 0, title: 'Нет'}, {value: 1, title: ''}],
    }],
    quickViewFields: ['ISN_ADDR_CATEGORY', 'ISN_DELIVERY', 'GROUP_MAIL', 'FLAG_TYPE', 'EMERGENCY', 'IMPOTANCE', 'NOTE'],
    editFields: [...LINEAR_TEMPLATE.editFields, 'ISN_ADDR_CATEGORY', 'ISN_DELIVERY', 'GROUP_MAIL', 'FLAG_TYPE', 'EMERGENCY', 'IMPOTANCE'],
    allVisibleFields: ['ISN_ADDR_CATEGORY', 'ISN_DELIVERY', 'IS_UNIQUE'],
    listFields: [...LINEAR_TEMPLATE.listFields]
});

