import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const ORG_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.ORG_TYPE,
    apiInstance: 'ORG_TYPE_CL',
    title: 'Типы организаций',
    visible: true,
    iconName: 'eos-adm-icon-organisation-type-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        length: 64,
        uniqueInDict: true,
    })],
});
