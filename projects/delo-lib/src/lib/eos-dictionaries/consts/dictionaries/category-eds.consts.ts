import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_NOTE } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const EDS_CATEGORY_CL_CONTS: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.EDS_CATEGORY_CL,
    apiInstance: 'EDS_CATEGORY_CL',
    actions: [... LINEAR_TEMPLATE.actions, 'certifUC', 'importEDS'],
    title: 'Категории ЭП',
    visible: true,
    iconName: 'eos-adm-icon-electronic-signature-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        uniqueInDict: true,
        length: 64,
    }),
    Object.assign({}, COMMON_FIELD_NOTE, {
        length: 255,
    })],
    quickViewFields: ['CLASSIF_NAME', 'NOTE'],  // CLASSIF_NAME is in shortQuickViewFields
    listFields: ['CLASSIF_NAME', ],
    allVisibleFields: ['NOTE'],
    editFields: ['CLASSIF_NAME', 'NOTE' ]

});
