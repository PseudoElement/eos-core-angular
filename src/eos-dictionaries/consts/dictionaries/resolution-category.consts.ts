import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';

export const RESOL_CATEGORY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'resolution-category',
    apiInstance: 'RESOLUTION_CATEGORY_CL',
    title: 'Категории поручений',
    visible: true,
    iconName: 'eos-icon-category-blue',
    fields: [...LINEAR_TEMPLATE.fields,
        COMMON_FIELD_ICONS_SEV,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 64,
            isUnique: true,
            uniqueInDict: true,
        }),
        {
            key: 'sev',
            title: 'Индекс СЭВ',
            type: 'dictionary',
            isUnique: true,
        }
    ],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'],
    editFields: [ ... LINEAR_TEMPLATE.editFields,
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    quickViewFields: ['CLASSIF_NAME',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],

});
