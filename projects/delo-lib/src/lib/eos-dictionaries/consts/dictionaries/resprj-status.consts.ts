import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const RESPRJ_STATUS_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.RESPRJ_STATUS,
    apiInstance: 'RESPRJ_STATUS_CL',
    title: 'Статусы проекта поручения',
    visible: true,
    iconName: 'eos-adm-icon-project-status-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        length: 64,
        uniqueInDict: true,
    })]
});
