import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const DELIVERY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.DELIVERY,
    apiInstance: 'DELIVERY_CL',
    title: 'Виды доставки',
    visible: true,
    iconName: 'eos-adm-icon-save-send-blue',
    fields: [...LINEAR_TEMPLATE.fields,
        {
            key: 'E_SENDING_FLAG',
            title: 'Электронная отправка',
            type: 'boolean',
        },
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        uniqueInDict: true,
        length: 64,
    })],
    editFields: ['CLASSIF_NAME', 'E_SENDING_FLAG', 'NOTE'],
    quickViewFields: ['NOTE', 'E_SENDING_FLAG'],
    allVisibleFields: ['E_SENDING_FLAG'],
    fieldDefault: ['E_SENDING_FLAG']
});
