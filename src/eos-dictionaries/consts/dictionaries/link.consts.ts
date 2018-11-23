import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';

export const LINK_CL: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'links-type',
    apiInstance: 'LINK_CL',
    title: 'Типы связок',
    visible: true,
    iconName: '',
    fields: [...LINEAR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
        })],
});
