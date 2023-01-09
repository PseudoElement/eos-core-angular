import { IDictionaryDescriptor, IFieldPreferences} from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { COMMON_FIELD_NAME, COMMON_FIELD_ICONS_SEV, ICONS_CONTAINER_SEV } from './_common';
import { Features } from 'eos-dictionaries/features/features-current.const';

export const LINK_TYPES = [{
    value: 2,
    title: 'Исполнение'
}, {
    value: 1,
    title: 'Повторность'
}, {
    value: 3,
    title: 'Проекты'
}, {
    value: 0,
    title: '',
}];

export const LINK_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'link',
    apiInstance: 'LINK_CL',
    title: 'Типы связок',
    visible: true,
    iconName: 'eos-adm-icon-chain-blue',
    fields: [...LINEAR_TEMPLATE.fields,
        COMMON_FIELD_ICONS_SEV,
        Object.assign({}, COMMON_FIELD_NAME, {
            isUnique: true,
            uniqueInDict: true,
            required: false,
            length: 64,
        }), {
        key: 'LINK',
        title: 'Связка',
        type: 'string',
        preferences: <IFieldPreferences>{
            minColumnWidth: 200,
        }
    }, {
        key: 'PAIR_LINK',
        title: 'Обратная связка',
        type: 'string',
        preferences: <IFieldPreferences>{
            minColumnWidth: 200,
        }
    }, {
        key: 'PARE_LINK_Ref',
        type: 'dictionary',
    }, {
        key: 'ISN_PARE_LINK',
        type: 'number',
    }, {
        key: 'LINK_INDEX',
        title: 'Индекс',
        type: 'string',
        length: 24,
    }, {
        key: 'TRANSPARENT',
        title: 'Прозрачная связка',
        type: 'boolean',
    }, {
        key: 'LINK_TYPE',
        title: '',
        type: 'select',
        options: LINK_TYPES,
    }, {
        key: 'TYPE',
        title: 'Категория',
        type: 'select',
        options: LINK_TYPES,
    }, {
        key: 'LINK_DIR',
        type: 'number',
    }, {
        key: 'sev',
        title: 'Индекс СЭВ',
        type: 'dictionary',
    },
    {
        key: 'MEDO_ID',
        title: 'ID MEDO связки',
        type: 'string',
        length: 64,
        default: 'LT00000000'
    }
],

    defaultOrder: 'LINK',
    keyField: 'ISN_LCLASSIF',
    editFields: ['LINK_INDEX', 'CLASSIF_NAME', 'TRANSPARENT', 'LINK_TYPE', 'LINK_DIR', 'ISN_LCLASSIF', 'NOTE',
        'PARE_LINK_Ref', 'ISN_PARE_LINK', 'MEDO_ID',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
        ],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'LINK', 'PAIR_LINK', 'TYPE', 'MEDO_ID'],
    quickViewFields: ['LINK_INDEX', 'LINK', 'TRANSPARENT', 'NOTE', 'TYPE',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    allVisibleFields: ['LINK_INDEX', 'NOTE', 'sev', ],
});
