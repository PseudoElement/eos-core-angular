import {E_DICT_TYPE, E_VISIBLE_TIPE, IDepartmentDictionaryDescriptor} from 'eos-dictionaries/interfaces';
import {NOT_EMPTY_STRING} from '../input-validation';
import {SEARCH_TYPES} from '../search-types';
import {ISelectOption} from 'eos-common/interfaces';
import { COMMON_FIELD_NAME, COMMON_FIELD_FULLNAME, COMMON_FIELD_CODE, COMMON_FIELDS, COMMON_FIELD_NOTE } from './_common';

export const ROLES_IN_WORKFLOW: ISelectOption[] = [
    {value: 0, title: 'Не указана'},
    {value: 1, title: 'Начальник'},
    {value: 2, title: 'Секретарь'}
];

export const GENDERS: ISelectOption[] = [
    {value: null, title: 'Не указан'},
    {value: 0, title: 'Мужской'},
    {value: 1, title: 'Женский'}
];
/* tslint:disable:max-line-length */
export const DEPARTMENTS_DICT: IDepartmentDictionaryDescriptor = {
    id: 'departments',
    apiInstance: 'DEPARTMENT',
    dictType: E_DICT_TYPE.department,
    title: 'Подразделения',
    defaultOrder: 'title',
    visible: true,
    iconName: 'eos-icon-department-blue',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'import', 'export', 'importPhotos',
        'createRepresentative', 'tableCustomization', 'showAllSubnodes', 'edit', 'view', 'slantForForms', 'restore', 'remove', 'removeHard',
        'showDeleted', 'tuneFields', 'CounterNPMain', 'CounterNP'],
    keyField: 'DUE',
    parentField: 'PARENT_DUE',
    modeField: 'IS_NODE',
    searchConfig: [SEARCH_TYPES.full, SEARCH_TYPES.quick, SEARCH_TYPES.dateFilter],
    modeList: [{
        key: 'department',
        title: 'Подразделение',
    }, {
        key: 'cabinet',
        title: 'Кабинет',
    }, {
        key: 'person',
        title: 'Должностное лицо',
    }],
    fields: COMMON_FIELDS.concat([{
        key: 'DUE',
        type: 'string',
        title: 'ID',
        length: 248,
    }, {
        key: 'ISN_NODE',
        title: 'ISN_NODE',
        type: 'number'
    }, {
        key: 'ISN_ORGANIZ',
        title: 'Не используется Организация',
        type: 'number',
    }, {
        key: 'ISN_HIGH_NODE',
        title: 'Номер вышестоящей вершины',
        type: 'number',
    }, {
        key: 'IS_NODE',
        title: 'IS_NODE',
        type: 'boolean'
    }, {
        key: 'PARENT_DUE',
        type: 'string',
        title: 'Parent ID',
        length: 248,
    },
        Object.assign({}, COMMON_FIELD_NOTE, {length: 255}),
        Object.assign({}, COMMON_FIELD_CODE, {length: 20}),
        Object.assign({}, COMMON_FIELD_NAME, {
            key: 'title',
            title: 'Краткое наименование подразделения',
            foreignKey: 'CLASSIF_NAME',
            length: 255,
            required: true,
            forNode: false,
        }),
        {
            key: 'SURNAME',
            title: 'Фамилия И.О.',
            type: 'string',
            length: 64,
            pattern: NOT_EMPTY_STRING,
            required: true,
            forNode: true,
        }, {
            key: 'DUTY',
            title: 'Краткое наименование должности',
            type: 'string',
            length: 255,
            pattern: NOT_EMPTY_STRING,
            required: true,
            forNode: true,
        },
        Object.assign({}, COMMON_FIELD_FULLNAME, {
            key: 'fullTitle',
            title: 'Полное наименование подразделения',
            type: 'text',
            foreignKey: 'FULLNAME',
            forNode: false,
            length: 2000,
            vistype: E_VISIBLE_TIPE.onlyChild,
        }),
        Object.assign({}, COMMON_FIELD_FULLNAME, {
            key: 'fullPosition',
            title: 'Полное наименование должности',
            type: 'text',
            foreignKey: 'FULLNAME',
            length: 2000,
            forNode: true,
            vistype: E_VISIBLE_TIPE.onlyNode,
        }), {
            key: 'SKYPE',
            title: 'Skype',
            type: 'string',
            length: 64,
            forNode: true,
        }, {
            key: 'DEPARTMENT_DUE',
            title: 'Картотека ДЛ',
            type: 'string',
            forNode: true,
        }, {
            key: 'ISN_CABINET',
            title: 'ISN кабинета',
            type: 'number',
        }, {
            key: 'ORDER_NUM',
            title: 'Порядковый номер в кабинете',
            type: 'number',
        }, {
            key: 'indexPerson',
            foreignKey: 'DEPARTMENT_INDEX',
            title: 'Индекс ДЛ',
            type: 'string',
            length: 24,
            forNode: true,
        }, {
            key: 'indexDep',
            foreignKey: 'DEPARTMENT_INDEX',
            title: 'Индекс',
            type: 'string',
            length: 24,
            pattern: NOT_EMPTY_STRING,
            forNode: false,
        }, {
            key: 'POST_H',
            title: 'Роль',
            type: 'select',
            default: 0,
            options: ROLES_IN_WORKFLOW,
            forNode: true,
        }, {
            key: 'CARD_FLAG',
            title: 'Картотека',
            type: 'boolean',
            forNode: false,
        }, {
            key: 'CARD_NAME',
            title: 'Наименование картотеки',
            type: 'string',
            required: true,
            length: 64,
            pattern: NOT_EMPTY_STRING,
            forNode: false,
        }, {
            key: 'START_DATE',
            title: 'Начало действия',
            type: 'date',
        }, {
            key: 'END_DATE',
            title: 'Окончание действия',
            type: 'date',
        }, {
            key: 'ISN_CONTACT',
            title: 'ISN контакта',
            type: 'number',
            pattern: /^\d*$/,
        }, {
            key: 'PHONE_LOCAL',
            title: '№ местного телефона',
            type: 'string',
            length: 24,
            pattern: NOT_EMPTY_STRING,
            forNode: true,
        }, {
            key: 'PHONE',
            title: '№ телефона',
            type: 'string',
            length: 24,
            pattern: NOT_EMPTY_STRING,
            forNode: true,
        }, {
            key: 'FAX',
            title: 'Факс',
            type: 'string',
            length: 24,
            pattern: NOT_EMPTY_STRING,
            forNode: true,
        }, {
            key: 'E_MAIL',
            title: 'E-mail',
            type: 'string',
            length: 64,
            pattern: NOT_EMPTY_STRING,
            forNode: true,
        }, {
            key: 'NUM_CAB',
            title: '№ кабинета',
            type: 'string',
            length: 24,
            pattern: NOT_EMPTY_STRING,
            forNode: true,
        }, {
            key: 'DUE_LINK_ORGANIZ',
            title: 'Организация',
            type: 'string',
        }, {
            key: 'ISN_PHOTO',
            title: 'ISN фотографии',
            type: 'number',
        }, {
            key: 'printInfo',
            type: 'dictionary',
            title: '',
        }, {
            key: 'sev',
            type: 'dictionary',
            title: '',
        }, {
            key: 'organization',
            title: 'Организация',
            type: 'dictionary',
            dictionaryId: 'ORGANIZ_CL',
            dictionaryLink: {
                pk: 'DUE',
                fk: 'DUE_LINK_ORGANIZ',
                label: 'CLASSIF_NAME',
            },
            options: [],
        }, {
            key: 'cabinet',
            type: 'dictionary',
            title: '',
        }, {
            key: 'user',
            type: 'dictionary',
            title: '',
        },
        /*NO DISCRIPTION FIELDS*/
        {
            key: 'ISN_LCLASSIF',
            title: 'ISN_CLASSIF',
            type: 'number'
        }, {
            key: 'alternate',
            title: 'Заместитель',
            type: 'string',
            length: 248,
            pattern: NOT_EMPTY_STRING,
        }, {
            key: 'type',
            title: 'Тип',
            type: 'icon'
        }, {
            key: 'titleRoom',
            title: 'Краткое наименование кабинета',
            type: 'string',
            pattern: NOT_EMPTY_STRING,
            foreignKey: 'CLASSIF_NAME',
        }, {
            key: 'fullCabinet',
            title: 'Полное наименование кабинета',
            type: 'string',
            pattern: NOT_EMPTY_STRING,
            foreignKey: 'FULLNAME',
        }, {
            key: 'ID_GAS_PS',
            title: 'Код ГАС ПС',
            type: 'string',
            length: 10,
        }, {
            key: 'NUMCREATION_FLAG',
            title: 'Номерообразование НП',
            type: 'boolean',
        }, {
            key: 'EXPEDITION_FLAG',
            title: 'Отправка документов по реестрам',
            type: 'boolean',
        }, {
            key: 'photo',
            type: 'dictionary',
            title: 'Фото'
        }]),
    treeFields: ['title'],
    searchFields: [/* 'RUBRIC_CODE', */'title'/*, 'NOTE'*/],
    listFields: ['CODE', 'title'],
    fullSearchFields: {
        person: ['CODE', 'PHONE', 'PHONE_LOCAL', 'E_MAIL', 'DUTY', 'fullPosition', 'SURNAME', 'NOTE', 'printInfo'],
        department: ['CODE', 'title', 'indexDep', 'NOTE', 'fullTitle'],
        cabinet: ['titleRoom', 'fullCabinet']
    },
    quickViewFields: ['photo', 'fullTitle', 'fullPosition', 'DUTY', 'PHONE', 'PHONE_LOCAL', 'E_MAIL', 'IS_NODE', 'POST_H', 'SURNAME',
        'CARD_NAME', 'CARD_FLAG', 'CODE', 'NOTE', 'IS_NODE', 'printInfo', 'user', 'cabinet',
        'sev', 'title', 'organization'], // title is in shortQuickViewFields
    shortQuickViewFields: ['firstName', 'fathersName', 'lastName', 'title'],
    editFields: ['CARD_FLAG', 'CARD_NAME', 'CODE', 'DUTY', 'IS_NODE', 'NOTE', 'SURNAME', 'indexPerson', 'POST_H', 'PHONE_LOCAL', 'PHONE',
        'FAX', 'E_MAIL', 'NUM_CAB', 'START_DATE', 'END_DATE', 'fullPosition', 'SKYPE', 'printInfo', 'sev', 'organization', 'cabinet',
        'user', 'photo', 'ID_GAS_PS', 'NUMCREATION_FLAG',
        'title', 'DUE_LINK_ORGANIZ', 'indexDep', 'fullTitle', 'ISN_PHOTO', 'EXPEDITION_FLAG'],
    // ['fio', 'position', 'description', 'title', 'phone', 'email', 'rooms', 'associatedUsers']
    allVisibleFields: ['SURNAME', 'DUTY', 'fullTitle', 'fullPosition', 'SKYPE', /* 'DEPARTMENT_DUE', */ 'ORDER_NUM', 'indexDep', 'POST_H',
        'CARD_FLAG',
        'CARD_NAME', 'NOTE', 'START_DATE', 'END_DATE', 'PHONE_LOCAL', 'PHONE', 'FAX', 'E_MAIL', 'NUM_CAB', 'ID_GAS_PS',
        'NUMCREATION_FLAG' , 'organization', /*, 'printInfo', 'sev',
, 'cabinet', 'user'*/],
};
/* tslint:enable:max-line-length */
