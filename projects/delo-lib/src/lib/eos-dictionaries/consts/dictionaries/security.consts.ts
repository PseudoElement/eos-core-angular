import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { NOT_EMPTY_STRING } from '../../../eos-dictionaries/consts/input-validation';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { ICONS_CONTAINER_SEV, /* COMMON_FIELD_ICONS_SEV */ } from './_common';
import { VALID_REQ_STRING } from '../../../eos-common/consts/common.consts';

export const SECURITY_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'security',
    apiInstance: 'SECURITY_CL',
    keyField: 'SECURLEVEL',
    defaultOrder: 'GRIF_NAME',
    title: 'Грифы доступа',
    visible: true,
    iconName: 'eos-adm-icon-lock-blue',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization', 'protViewSecurity']),
    fields: LINEAR_TEMPLATE.fields.concat([
        /* COMMON_FIELD_ICONS_SEV */,
        {
            key: ICONS_CONTAINER_SEV,
            title: '',
            type: 'icon_sev',
            length: 5,
            preferences: {
                minColumnWidth: 45,
                noLeftPadding: true,
                inline: true,
            }
        },
    {
            key: 'SECURLEVEL',
            type: 'number',
            title: 'Гриф доступа',
            length: 10,
            pattern: NOT_EMPTY_STRING,
        }, {
            key: 'GRIF_NAME',
            type: 'string',
            title: 'Наименование грифа',
            length: 64,
            pattern: VALID_REQ_STRING,
            required: true,
            isUnique: true,
            uniqueInDict: true,
        }, {
            key: 'EDS_FLAG',
            type: 'boolean',
            title: 'ЭП',
            length: 20,
        }, {
            key: 'ENCRYPT_FLAG',
            type: 'boolean',
            title: 'Шифрование',
            length: 20,
        }, {
            key: 'SEC_INDEX',
            type: 'string',
            title: 'Индекс грифа',
            length: 24,
            pattern: NOT_EMPTY_STRING,
        }, {
            key: 'CONFIDENTIONAL',
            type: 'boolean',
            title: 'ДСП файл',
            length: 20,
            pattern: NOT_EMPTY_STRING,
        }, {
            key: 'sev',
            title: 'Индекс СЭВ',
            type: 'dictionary',
            isUnique: true,
        }

    ]),
    treeFields: ['GRIF_NAME'],
    allVisibleFields: ['EDS_FLAG', 'ENCRYPT_FLAG', 'SEC_INDEX', 'NOTE'],
    listFields: [
        ...Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'GRIF_NAME'],
    editFields: ['SEC_INDEX', 'GRIF_NAME', 'EDS_FLAG', 'ENCRYPT_FLAG', 'NOTE', 'CONFIDENTIONAL',
        ...Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    shortQuickViewFields: ['GRIF_NAME'],
    quickViewFields: ['SEC_INDEX', 'EDS_FLAG', 'ENCRYPT_FLAG', 'NOTE', 'CONFIDENTIONAL',
        ...Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
});

