import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';

export const RESOL_CATEGORY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'resolution-category',
    apiInstance: 'RESOLUTION_CATEGORY_CL',
    title: 'Категории поручений',
    visible: true,
    iconName: 'eos-adm-icon-category-blue',
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
        },
        {
            key: 'PLAN_COUNT_FLAG',
            type: 'boolean',
            length: 10,
            title: 'Использовать для расчёта плановой даты поручения',
        },
        {
            key: 'PLAN_DAY_COUNT',
            page: 'D',
            type: 'numberIncrement',
            // kind_doc '1,2,3',
            title: 'Срок',
            pattern: /(^\d{1,4}$)/,
            minValue: 0,
            maxValue: 9999,
            order: 30,
            default: 0,
        },
        {
            key: 'PLAN_DAY_TYPE',
            type: 'select',
            title: '',
            default: 1,
            options: [
                { value: 1, title: 'календарн.' },
                { value: 2, title: 'рабоч.' },
            ],
        },
        {
            key: 'PLAN_PROTECTED',
            type: 'boolean',
            length: 10,
            title: 'Запретить редактирование плановой даты',
        },
    ],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'],
    editFields: [ ... LINEAR_TEMPLATE.editFields,
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
        'PLAN_COUNT_FLAG', 'PLAN_DAY_COUNT', 'PLAN_DAY_TYPE', 'PLAN_PROTECTED',
    ],
    quickViewFields: ['CLASSIF_NAME',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [], 'PLAN_COUNT_FLAG', 'PLAN_PROTECTED',
    ],

});
