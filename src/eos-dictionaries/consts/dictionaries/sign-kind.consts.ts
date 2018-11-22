import {IDictionaryDescriptor, E_DICT_TYPE} from 'eos-dictionaries/interfaces';
import {NOT_EMPTY_STRING} from '../input-validation';
import {SEARCH_TYPES} from '../search-types';
import {LINEAR_TEMPLATE} from './_linear-template';
import {COMMON_FIELD_NAME} from './_common';
/*
*/
export const SIGN_KIND_DICT: IDictionaryDescriptor = {
    id: 'sign-kind',
    apiInstance: 'SIGN_KIND_CL',
    dictType: E_DICT_TYPE.linear,
    title: 'Виды подписей',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-icon-signature-blue',
    actions: [
        'quickSearch', 'fullSearch', 'order', 'userOrder',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'tableCustomization', 'edit', 'view',
    ],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick],
    fields: LINEAR_TEMPLATE.fields.concat([
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Вид подписи',
        }),
        {
            key: 'SIGN_TEXT',
            title: 'Текст подписи',
            type: 'text',
            length: 255,
            pattern: NOT_EMPTY_STRING,
        }
    ]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['SIGN_TEXT'],
    searchFields: ['CLASSIF_NAME', 'SIGN_TEXT'],
    fullSearchFields: ['CLASSIF_NAME', 'SIGN_TEXT'],
    quickViewFields: ['CLASSIF_NAME', 'SIGN_TEXT'],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: ['CLASSIF_NAME'],
    allVisibleFields: ['SIGN_TEXT'],
};
