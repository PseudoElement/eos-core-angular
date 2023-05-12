import { ITreeDictionaryDescriptor, E_DICT_TYPE, IFieldPreferences } from '../../../eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from '../input-validation';
import { SEARCH_TYPES } from '../search-types';
import { COMMON_FIELDS, COMMON_FIELD_NAME, ICONS_CONTAINER_SEV } from './_common';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from '../../../eos-dictionaries/features/features.interface';
import { DIGIT3_PATTERN } from '../../../eos-common/consts/common.consts';
import { ADDR_CATEGORY_DICT } from './addr-category.consts';


export const ORGANIZ_DICT: ITreeDictionaryDescriptor = {
    id: 'organization',
    apiInstance: 'ORGANIZ_CL',
    title: 'Организации',
    visible: true,
    iconName: 'eos-adm-icon-building-blue',
    defaultOrder: 'CLASSIF_NAME',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'cut', 'combine', 'paste', 'dopRequisites',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization', 'export', 'import',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes', 'uncheckNewEntry', 'protViewSecurity'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick , SEARCH_TYPES.full],
    modeList: [
        {
            key: 'common',
            title: 'Основные',
        },
        {
            key: 'medo',
            title: 'Реквизиты МЭДО',
        },
        {
            key: 'protocol',
            title: 'Протокол ',
        }
    ],
    fields: COMMON_FIELDS.concat([
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
            key: 'DUE',
            type: 'string',
            title: 'Код Дьюи организации',
            length: 248,
        }, 
        {
            key: 'PARENT_DUE',
            type: 'string',
            title: 'Код родительской организации',
            length: 248,
        }, 
        {
            key: 'ISN_NODE',
            type: 'number',
            title: 'ISN организации',
        }, 
        {
            key: 'ISN_HIGH_NODE',
            title: 'Номер вышестоящ вершины',
            type: 'number',
        }, 
        {
            key: 'LAYER',
            title: 'Номер уровня',
            type: 'number',
        },
        {
            key: 'IS_NODE',
            title: 'Признак вершины',
            type: 'number',
        }, 
        {
            key: 'MAXDUE',
            title: 'MAX значение кода Дьюи',
            type: 'string',
            pattern: NOT_EMPTY_STRING,
            length: 248,
        },
        ... Features.cfg.variant === EOSDICTS_VARIANT.CB ? [
            {
                key: 'TERM_EXEC',
                title: 'Срок исполнения',
                length: 3,
                minValue: 1,
                maxValue: 999,
                pattern: DIGIT3_PATTERN,
                default: '',
                type: 'numberIncrement',
            },
            {
                key: 'TERM_EXEC_TYPE',
                type: 'select',
                title: '',
                default: 3,
                options: [
                    { value: 3, title: 'календарн.+' },
                    { value: 4, title: 'календарн.-' },
                    { value: 1, title: 'календарн.' },
                    { value: 2, title: 'рабоч.' },
                ],
            },
            {
                key: 'ISN_ADDR_CATEGORY',
                type: 'select',
                title: 'Категория',
                length: 150,
                dictionaryId: ADDR_CATEGORY_DICT.apiInstance,
                    dictionaryLink: {
                        pk: 'ISN_LCLASSIF',
                        fk: 'ISN_ADDR_CATEGORY',
                        label: 'CLASSIF_NAME',
                    },
                options: [],
            },
            ] : [],
        {
            key: 'NEW_RECORD',
            title: 'Нов.',
            type: 'new',
            length: 1,
        },
        {
            key: 'CONTACT.MEDO_ID',
            title: 'Идентификатор организации',
            type: 'string',
            length: 255
        },
        {
            key: 'CONTACT.MEDO_GLOBAL_ID',
            title: 'Идентификатор организации в ГАС',
            type: 'string',
            length: 255
        },
        {
            key: 'GATE',
            title: 'АДРЕС МЭДО',
            type: 'string',
            length: 255
        },
        {
            key: 'GATE_ID',
            title: 'Идентификатор шлюза',
            type: 'string',
            length: 255
        },
        Object.assign({}, COMMON_FIELD_NAME, {
            title: 'Наименование организации',
            groupLabel: 'Наименование группы',
            length: 255,
            preferences: <IFieldPreferences>{ hasIcon: true, },
        }),
        {
            key: 'INN',
            title: 'ИНН',
            type: 'string',
            length: 64,
            pattern: NOT_EMPTY_STRING,
        },
        {
            key: 'EMAIL',
            title: 'Почта',
            type: 'string',
            length: 64,
            pattern: NOT_EMPTY_STRING,
        },
        {
            key: 'DOP_REC',
            title: 'Доп. реквизит',
            type: 'string',
        },
        {
            key: 'FROM',
            title: '',
            type: 'string',
        },
        {
            key: 'TO',
            title: '',
            type: 'string',
        },
        {
            key: 'OPER_DESCRIBE',
            title: '',
            type: 'string',
        },
        {
            key: 'USER_ISN',
            title: '',
            type: 'number',
        }
    ]),

    treeFields: ['CLASSIF_NAME'],
    editFields: ['CLASSIF_NAME', 'NOTE',
        ... Features.cfg.variant === EOSDICTS_VARIANT.CB ? [ 'TERM_EXEC', 'TERM_EXEC_TYPE', 'ISN_ADDR_CATEGORY'] : [],
    ],
    searchFields: ['CLASSIF_NAME'],
    fullSearchFields: [
        'CLASSIF_NAME', 
        'EMAIL', 
        'INN', 
        'DOP_REC', 
        'CONTACT.MEDO_ID', 
        'GATE', 
        'GATE_ID', 
        'CONTACT.MEDO_GLOBAL_ID',
        'FROM',
        'OPER_DESCRIBE',
        'TO',
        'USER_ISN',
    ],
    quickViewFields: ['FULLNAME',
        ... Features.cfg.SEV.isIndexesEnable ? ['sev'] : [],
    ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: [
        ... Features.cfg.SEV.isIndexesEnable ? [ICONS_CONTAINER_SEV] : [],
        'CLASSIF_NAME'
    ],
    allVisibleFields: ['NOTE', 'NEW_RECORD'],
    dictType: E_DICT_TYPE.organiz,
};
