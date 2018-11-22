import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';

export const RESPRJ_STATUS_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'reprj-status',
    apiInstance: 'RESPRJ_STATUS_CL',
    title: 'Статусы проекта поручения',
    visible: true,
    iconName: 'eos-icon-project-status-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        uniqueInDict: true,
    })]
});
