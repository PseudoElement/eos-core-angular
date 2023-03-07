
import { E_DICT_TYPE, ITreeDictionaryDescriptor, IFieldPreferences } from '../../../eos-dictionaries/interfaces';
import { SEARCH_TYPES } from '../search-types';
import {COMMON_FIELDS, COMMON_FIELD_CODE, COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME, COMMON_FIELD_NOTE, COMMON_FIELD_ICONS, ICONS_CONTAINER} from './_common';
import { ISelectOption } from '../../../eos-common/interfaces';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from '../../../eos-dictionaries/features/features.interface';

export const RK_TYPE_OPTIONS_NODE: ISelectOption[] = [
    { value: 0, title: 'Не определена' },
    { value: 1, title: 'Входящие' },
    { value: 3, title: 'Исходящие' },
    { value: 2, title: 'Письма граждан'},
];

export const RK_TYPE_OPTIONS: ISelectOption[] = [
    { value: 1, title: 'Входящие' },
    { value: 3, title: 'Исходящие' },
    { value: 2, title: 'Письма граждан' },
];
export const PROTECT_DEL_PRJ_STATUS_OPTS: ISelectOption[] = [
    { value: 2, title: 'На визировании' },
    { value: 3, title: 'Завизирован' },
    { value: 4, title: 'На подписи' },
    { value: 5, title: 'Подписан' },
];


export const DOCGROUP_DICT: ITreeDictionaryDescriptor = {
    id: 'docgroup',
    apiInstance: 'DOCGROUP_CL',
    dictType: E_DICT_TYPE.tree,
    title: 'Группы документов',
    defaultOrder: 'CLASSIF_NAME',
    visible: true,
    iconName: 'eos-adm-icon-folder-group-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste', 'counterDocgroup',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization', 'counterDocgroupRKPD',
        'edit', 'view', 'remove', 'removeHard', 'userOrder', 'restore', 'showAllSubnodes' , 'additionalFields',
        'AdvancedCardRK', 'prjDefaultValues', 'copyPropertiesFromParent', 'copyProperties', 'export', 'import', 'protViewSecurity'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    },
    COMMON_FIELD_ICONS,
    Object.assign({}, COMMON_FIELD_CODE, {length: 10}),
    Object.assign({}, COMMON_FIELD_NOTE, {length: 100}),
    Object.assign({}, COMMON_FIELD_NAME, {
        length: 64,
        uniqueInDict: true,
        isUnique: true,
        preferences: <IFieldPreferences> { hasIcon: true, },
    }),
    Object.assign({}, COMMON_FIELD_FULLNAME, {length: 100}),
    {
        key: 'IS_COPYCOUNT',
        title: 'Нумерация копий',
        type: 'boolean',
    }, {
        key: 'RC_TYPE',
        title: 'Вид РК',
        type: 'select',
        options: RK_TYPE_OPTIONS_NODE,
        default: 0, // на самом деле наследование в docgroup-dictionary-descriptor
    }, {
        key: 'DOCGROUP_INDEX',
        title: 'Индекс',
        type: 'string',
        length: 24,
    }, {
        key: 'DOCNUMBER_FLAG',
        title: 'Номерообразование',
        type: 'boolean',
    }, {
        key: 'SHABLON',
        title: 'Шаблон',
        type: 'string',
        required: true,
    }, {
        key: 'EDS_FLAG',
        title: 'ЭП',
        type: 'boolean',
    }, {
        key: 'ENCRYPT_FLAG',
        title: 'Шифрование',
        type: 'boolean',
    }, {
        key: 'TEST_UNIQ_FLAG',
        title: 'Проверка уникальности номера',
        type: 'boolean'
    }, {
        key: 'PRJ_NUM_FLAG',
        title: 'Проекты документов',
        type: 'boolean',
    }, {
        key: 'PRJ_SHABLON',
        title: 'Шаблон проекта',
        type: 'string',
        required: true,
    }, {
        key: 'PRJ_WEIGHT',
        title: 'Вес в списке для проектов',
        type: 'number',
    }, {
        key: 'PRJ_AUTO_REG',
        title: 'Автоматическая регистрация',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY_EDS',
        title: 'подписей',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY2_EDS',
        title: 'виз',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_APPLY_EXEC_EDS',
        title: 'исполнителей',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_DEL_AFTER_REG',
        title: 'Удалять РКПД после регистрации',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'PRJ_TEST_UNIQ_FLAG',
        title: 'Проверка уникальности номера проекта',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'E_DOCUMENT',
        title: 'Оригинал в эл.виде',
        type: 'boolean',
    }, {
        key: 'ACCESS_MODE',
        title: 'РК перс. доступа',
        type: 'boolean',
    }, {
        key: 'ACCESS_MODE_FIXED',
        title: 'Без редактирования',
        type: 'boolean',
    }, {
        key: 'REG_DATE_PROTECTED',
        title: 'Запрещено редактировать рег. дату',
        type: 'boolean',
        default: false,
    }, {
        key: 'INITIATIVE_RESOLUTION',
        title: 'Инициативные поручения',
        type: 'boolean',
        forNode: true,
    }, {
        key: 'COPY_NUMBER_FLAG',
        title: 'COPY_NUMBER_FLAG',
        type: 'boolean',
    }, {
        key: 'COPY_NUMBER_FLAG_PRJ',
        title: 'COPY_NUMBER_FLAG_PRJ',
        type: 'boolean',
    }, {
        key: 'PROTECT_DEL_PRJ_STATUS',
        title: 'Запретить удаление РКПД при статусе', // и выше
        type: 'select',
        options: PROTECT_DEL_PRJ_STATUS_OPTS,
        default: null,
    },
    {
        key: 'ISN_DOCVID',
        title: 'Вид документов',
        type: 'string',
    },
    {
        key: 'DOCVID_NAME',
        title: 'Вид документов',
        type: 'string',
    },
    ]),
    treeFields: ['CLASSIF_NAME'],
    editFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME', 'NOTE', 'IS_COPYCOUNT', 'ACCESS_MODE_FIXED', 'E_DOCUMENT', 'PRJ_TEST_UNIQ_FLAG',
        'PRJ_DEL_AFTER_REG', 'PRJ_APPLY_EXEC_EDS', 'PRJ_APPLY2_EDS', 'PRJ_APPLY_EDS', 'PRJ_AUTO_REG', 'PRJ_SHABLON', 'PRJ_NUM_FLAG',
        'TEST_UNIQ_FLAG', 'ENCRYPT_FLAG', 'EDS_FLAG', 'SHABLON', 'DOCNUMBER_FLAG', 'DOCGROUP_INDEX', 'RC_TYPE', 'INITIATIVE_RESOLUTION',
        'ACCESS_MODE', 'ISN_DOCVID', 'DOCVID_NAME',
        ... Features.cfg.variant === EOSDICTS_VARIANT.CB ? ['REG_DATE_PROTECTED', 'PROTECT_DEL_PRJ_STATUS', 'COPY_NUMBER_FLAG', 'COPY_NUMBER_FLAG_PRJ', ] : [],
        ],
    searchFields: ['CODE', 'CLASSIF_NAME', 'FULLNAME'],
    fullSearchFields: ['CLASSIF_NAME', 'FULLNAME', 'DOCGROUP_INDEX', 'NOTE'],
    quickViewFields: ['CLASSIF_NAME', 'FULLNAME', 'NOTE', 'DOCGROUP_INDEX', 'RC_TYPE' ],
    shortQuickViewFields: ['CLASSIF_NAME'],
    listFields: [ICONS_CONTAINER, 'CLASSIF_NAME'],
    allVisibleFields: ['RC_TYPE', 'DOCGROUP_INDEX', 'NOTE', 'FULLNAME'],
};
