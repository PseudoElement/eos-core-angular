import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_NOTE } from './_common';

export const EDS_CATEGORY_CL: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'eds-category',
    apiInstance: 'EDS_CATEGORY_CL',
    actions: [... LINEAR_TEMPLATE.actions, 'certifUC', 'importEDS'],
    title: 'Категории ЭП',
    visible: true,
    iconName: 'eos-icon-electronic-signature-blue',
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
    listFields: ['CLASSIF_NAME', 'NOTE'],
    allVisibleFields: [],
    editFields: ['CLASSIF_NAME', 'NOTE' ]

});
