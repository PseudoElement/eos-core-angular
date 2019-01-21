import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';

export const DELIVERY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'delivery',
    apiInstance: 'DELIVERY_CL',
    title: 'Виды доставки',
    visible: true,
    iconName: 'eos-icon-save-send-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        uniqueInDict: true,
        length: 64,
    })],
});
