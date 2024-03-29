import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const ADDR_CATEGORY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.ADDR_CATEGORY,
    apiInstance: 'ADDR_CATEGORY_CL',
    title: 'Категории адресатов',
    visible: true,
    iconName: 'eos-adm-icon-address-category-blue',
    fields: [...LINEAR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            length: 64,
            uniqueInDict: true,
        })],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],
    searchFields: ['CLASSIF_NAME', 'NOTE'],
});
