import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV } from './_common';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { E_DICTIONARY_ID } from './enum/dictionaryId.enum';

export const STATUS_REPLY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.STATUS_REPLY,
    apiInstance: 'STATUS_REPLY_CL',
    actions: [
        'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'restore',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
        'cut', 'combine',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'export', 'import', 'protViewSecurity'],
    title: 'Состояния исполнения (исполнитель)',
    visible: true,
    iconName: 'eos-adm-icon-administrant-status-blue',
    fields: [...LINEAR_TEMPLATE.fields,
    COMMON_FIELD_ICONS_SEV,
    Object.assign({}, COMMON_FIELD_NAME, {
        isUnique: true,
        length: 64,
        uniqueInDict: true,
    }), {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'dictionary',
        isUnique: true,
    }],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'],
    editFields: [ ... LINEAR_TEMPLATE.editFields,
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    quickViewFields: ['NOTE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
});



