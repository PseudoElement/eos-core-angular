import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const STATUS_EXEC_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.STATUS_EXEC,
    apiInstance: 'STATUS_EXEC_CL',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'cut', 'combine',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'export', 'import', 'protViewSecurity'],
    title: 'Состояния исполнения (поручение)',
    visible: true,
    iconName: 'eos-adm-icon-viewed-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        length: 64,
        uniqueInDict: true,
    })],
});
