import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';

export const STATUS_REPLY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'status-reply',
    apiInstance: 'STATUS_REPLY_CL',
    title: 'Состояния исполнения (исполнитель)',
    visible: true,
    iconName: 'eos-icon-administrant-status-blue',
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
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER] : [],
        'CLASSIF_NAME'],
    editFields: [ ... LINEAR_TEMPLATE.editFields,
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    quickViewFields: ['NOTE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
});



