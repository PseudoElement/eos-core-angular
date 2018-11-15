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
    iconName: 'eos-icon-new-doc-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        length: 100,
        uniqueInDict: true,
    }), {
            key: 'ISN_ADDR_CATEGORY',
            type: 'select',
            title: 'Категория',
            length: 150,
            required: true,
            dictionaryId: ADDR_CATEGORY_DICT.id,
            options: [],
            default: 0,
    }, {
            key: 'ISN_DELIVERY',
            type: 'select',
            title: 'Вид отправки',
            length: 100,
            dictionaryId: DELIVERY_DICT.id,
            options: [],
            default: 1,
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
            options: [{value: 0, title: 'от счетчика'}, {value: 1, title: 'редактируемый'}],
            default: 0,
    }, {
            key: 'EMERGENCY',
            type: 'string',
            title: 'Срочность',
            length: 100,
    }, {
            key: 'IMPOTANCE',
            type: 'string',
            title: 'Важность',
            length: 100,
    }, {
            key: 'IS_UNIQUE',
            type: 'select',
            title: 'Уникальность',
            length: 100,
            options: [{value: 0, title: 'Нет'}, {value: 1, title: ''}],
    }],
    editFields: [...LINEAR_TEMPLATE.editFields, 'ISN_ADDR_CATEGORY', 'ISN_DELIVERY', 'GROUP_MAIL', 'FLAG_TYPE', 'EMERGENCY', 'IMPOTANCE'],
    listFields: [...LINEAR_TEMPLATE.listFields, 'ISN_ADDR_CATEGORY', 'ISN_DELIVERY', 'IS_UNIQUE']
});

