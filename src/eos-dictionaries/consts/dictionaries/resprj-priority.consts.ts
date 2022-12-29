import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME } from './_common';

export const RESPRJ_PRIORITY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'reprj-priority',
    apiInstance: 'RESPRJ_PRIORITY_CL',
    title: 'Приоритеты проектов резолюций',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'cut', 'combine',
        'edit', 'view', 'remove', 'removeHard', 'export', 'import', 'protViewSecurity'],
    visible: true,
    iconName: 'eos-adm-icon-rating-blue',
    fields: [...LINEAR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
            length: 64
        }), {
            key: 'WEIGHT',
            title: 'Вес',
            type: 'number',
        }],
    defaultOrder: 'WEIGHT',
});
