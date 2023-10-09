import { IDictionaryDescriptor } from '../../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';
import { COMMON_FIELD_NOTE } from '../_common';
// import {DOCGROUP_DICT} from '../docgroup.consts';
import {
    ADDRESS_REPLACE,
    ADDRESSEE_KIND,
    LINK_KIND, CONSIDERATION_KIND, DATE_EXECUTION_PROJECT_KIND,
    DOCUMENT_TYPES, EXECUTOR_CONSIDERATION_KIND, EXECUTOR_PROJECT_KIND, FORWARDING_DOCS_KIND, FORWARDING_DOCS_PROJECT_KIND,
    ITEMS_KIND,
    KOR_RULE_SEND, ORDERS_KIND,
    RESOLUTION_KIND, SIGNATURES_KIND,
    TYPE_OF_RULE, Visa_KIND, Visa_KIND_TAKE, RESEVER_SELECT, NAME_OF_RULE
} from './types.consts';
import { SECURITY_DICT } from '../security.consts';
import { ORG_TYPE_DICT } from '../org-type.consts';
import { CONTACT_DICT } from '../contact.consts';
import { ORGANIZ_DICT } from '../organiz.consts';
import { SEV_LINEAR_TEMPLATE } from './templates-sev.consts';
import { SEARCH_TYPES } from '../../../../eos-dictionaries/consts/search-types';
import { E_DICTIONARY_ID } from '../enum/dictionaryId.enum';

export const RULES_SEV_DICT: IDictionaryDescriptor = Object.assign({}, SEV_LINEAR_TEMPLATE, {
    id: E_DICTIONARY_ID.RULES_SEV,
    apiInstance: 'SEV_RULE',
    visible: true,
    iconName: 'eos-adm-icon-rules-blue',
    title: 'Правила СЭВ',
    actions: ['add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'userOrderCut', 'userOrderPaste',
        'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'tableCustomization',
        'removeHard', 'edit', 'view', 'protViewSecurity'],
    keyField: 'ISN_LCLASSIF',
    searchConfig: [SEARCH_TYPES.quick, SEARCH_TYPES.full],
    fields: [...LINEAR_TEMPLATE.fields,
        {
            key: 'CLASSIF_NAME',
            title: 'Наименование',
            type: 'string',
            length: 64,
            required: true,
            isUnique: true,
            pattern:  /^(?! *$)[\wА-Яа-я.+ '-][^!@$&^=~]*$/,
            preferences: {minColumnWidth: 400}
        },
        Object.assign({}, COMMON_FIELD_NOTE, {
            title: 'Примечание'
        }), {
            key: 'SCRIPT_CONFIG',
            type: 'xml',
        }, {
            key: 'FILTER_CONFIG',
            type: 'xml',
        }, {
            key: 'type',
            type: 'select',
            title: 'Тип документа',
            options: DOCUMENT_TYPES,
            default: 1,
        }, {
            key: 'kind',
            type: 'select',
            title: 'Вид правила',
            options: TYPE_OF_RULE,
            default: 1,
        }, {
            key: 'RULE_KIND',
            type: 'number',
            default: 1,
        }, {
            key: 'NAME_RULE_KIND',
            type: 'select',
            title: 'Вид правила',
            options: NAME_OF_RULE,
            default: 1,
            preferences: {minColumnWidth: 240}
        }, {
            key: 'RC_TYPE',
            type: 'number',
            default: 0,
        }, {
            key: 'DUE_DOCGROUP',
            type: 'string',
            title: 'Группа документов',
            // required: true, обработка есть у меня в компоненте по этому убираю отсюда
        // dictionaryId: DOCGROUP_DICT.apiInstance,
        //     dictionaryLink: {
        //         pk: 'DUE',
        //         label: 'CLASSIF_NAME',
        // },
        //     options: [],
        },
        {
            key: 'DUE_DOCGROUP_NAME',
            type: 'string',
            title: 'Группа документов',
        },
        {
            key: 'DUE_DOCGROUP_DELET',
            type: 'string',
            title: '',
        },
        {
            key: 'DUE_DEP',
            type: 'select',
            options: [{value: null, title: 'Все организации'}],
            title: 'Отправитель',
        }, {
            key: 'departmentSend', // TODO справочник организаций
            type: 'select',
            dictionaryId: ORGANIZ_DICT.apiInstance,
            options: [{
                value: '',
                title: 'Для всех организаций'
            }],
            title: 'Отправитель',
        }, {
            key: 'departmentReceive', // TODO справочник организаций и подразделений
            type: 'select',
            options: RESEVER_SELECT,
            title: 'Тип получателя',
            default: 1,
        }, {
            key: 'kindDepartment',
            type: 'select',
            options: [], // TODO Отправитель получатель
        }, {
            key: 'link',
            type: 'boolean',
            title: 'Связки РК',
            default: false, // для по умолчанию
        }, {
            key: 'linkKind',
            type: 'buttons',
            options: LINK_KIND,
            default: 0,
        }, {
            key: 'linkTypeList',  // TODO Типы связок
            type: 'select',
            options: [],
            default: '',
        }, {
            key: 'access',
            type: 'boolean',
            title: 'Гриф доступа',
            default: true, // по умолчанию
        }, {
            key: 'rubric',
            type: 'boolean',
            title: 'Рубрики',
            default: true, // по умолчанию
        }, {
            key: 'address',
            type: 'boolean',
            title: 'Адрес субъекта документа',
            default: true, // по умолчанию
        }, {
            key: 'region',
            type: 'boolean',
            title: 'Регион субъекта документа',
            default: true, // по умолчанию
        }, {
            key: 'visa',
            type: 'boolean',
            title: 'Визы',
            default: true, // по умолчанию
        }, {
            key: 'addressee',
            type: 'boolean',
            title: 'Адресаты',
            default: true, // по умолчанию
        }, {
            key: 'addresseeKind',
            type: 'buttons',
            default: 0, // по умолчанию
            options: ADDRESSEE_KIND,
        }, {
            key: 'additionalField',
            title: 'Доп. реквизиты',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'userGrantedOnly',
            title: 'Только доступные пользователю файлы и поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'file',
            title: 'Файлы',
            type: 'boolean',
            default: true,
        }, {
            key: 'fileExtensions',
            title: 'С расширением',
            type: 'string',
            default: '.pdf, .doc, docx, .txt, .xls, .xlsx, .tif, .tiff, .jpg, .bmp, .gif',
        }, {
            key: 'fileAccessList', // TODO должен быть массив
            title: 'Грифы доступа:',
            type: 'select',
            dictionaryId: SECURITY_DICT.apiInstance,
            options: [],
            default: '1'
        },
        {
            key: 'fileAccessListRk',
            title: 'Грифы доступа:',
            type: 'string',
        },
        {
            key: 'fileMaxLength',
            title: 'Max размер',
            type: 'number',
            pattern: /^[1-9]{1}[0-9]{0,8}$/,
            default: ''
        }, {
            key: 'item',
            title: 'Пункты',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'itemKind',
            type: 'buttons',
            default: 2, // по умолчанию
            options: ITEMS_KIND,
        }, {
            key: 'resolution',
            title: 'Резолюции',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'resolutionKind',
            type: 'buttons',
            default: 3, // по умолчанию
            options: RESOLUTION_KIND,
        }, {
            key: 'taskCategory',
            title: 'Категория поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'taskController',
            title: 'Контролер поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'taskNote',
            title: 'Примечание',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'taskFile',
            title: 'Файлы',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'taskFileExtensions',
            title: 'С расширением',
            type: 'string',
            default: '.pdf, .doc, docx, .txt, .xls, .xlsx, .tif, .tiff, .jpg, .bmp, .gif',
        }, {
            key: 'taskFileMaxLength',
            title: 'Max размер',
            type: 'number',
            pattern: /^[1-9]{1}[0-9]{0,8}$/,
            default: '',
        }, {
            key: 'reception',
            title: 'Уведомление о приеме',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'registration',
            title: 'Доклад о регистрации (отказ в регистрации)/доклад о редактировании данных',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'forwarding',
            title: 'Доклад о направлении документа',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'consideration',
            title: 'Доклад о работе с документом (ввод резолюций)',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'report',
            title: 'Доклад об исполнении поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'redirection',
            title: 'Доклад об отправке документов',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'answer',
            title: 'Доклад об отправке документа-ответа',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'stopDayCount',
            title: 'Доклады направлять в течении (сутки)',
            type: 'numberIncrement',
            default: 30, // по умолчанию
            required: true,
            pattern: /^[1-9]$|^[0-9]{2,3}$/
        }, {
            key: 'handRegistration',
            title: 'Направлять на ручную регистрацию',
            type: 'boolean',
            default: false // по умолчанию
        }, {
            key: 'filterConfig',
            title: 'Для групп документов',
            type: 'select',
            options: [],
        }, {
            key: 'cardFile',
            title: 'Картотека автомата',
            type: 'select',
            options: [],
            default: '0.',
        }, {
            key: 'cabinetFile',
            title: 'Кабинет автомата',
            type: 'select',
            options: [],
        }, {
            key: 'korRuleSend',
            title: 'Корр. РК сформировать',
            type: 'select',
            options: KOR_RULE_SEND,
            default: 1,
        }, {
            key: 'OrganizationFolder',
            title: 'Организации создавать',
            type: 'select',
            dictionaryId: ORG_TYPE_DICT.apiInstance,
            options: [],
        }, {
            key: 'adrReplace',
            type: 'buttons',
            options: ADDRESS_REPLACE,
            default: 2,
        }, {
            key: 'takeFileRK',
            title: 'Принимать файлы РК',
            type: 'boolean',
            default: true,
        }, {
            key: 'orders',
            title: 'Поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'ordersKind',
            type: 'buttons',
            options: ORDERS_KIND,
            default: 0, // по умолчанию
        }, {
            key: 'noteOrders',
            title: 'Примечание',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'takeFileOrders',
            title: 'Принимать файлы Поручений',
            type: 'boolean',
            default: true,
        }, {
            key: 'FileRK',
            title: 'Файлы РК',
            type: 'boolean',
            default: false // по умолчанию
        }, {
            key: 'takeOrdersRK',
            title: 'Поручения РК',
            type: 'boolean',
            default: false // по умолчанию
        }, {
            key: 'forwardingDocs',
            title: 'Доклад о направлениях документа',
            type: 'boolean',
            default: true,
        }, {
            key: 'kindForwardingDocs',
            type: 'buttons',
            options: FORWARDING_DOCS_KIND,
            default: 1,
        }, {
            key: 'kindConsideration',
            type: 'buttons',
            options: CONSIDERATION_KIND,
            default: 0,
        }, {
            key: 'textConsideration',
            title: 'Текст резолюции',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'categoryConsideration',
            title: 'Категория резолюции',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'noteConsideration',
            title: 'Примечание',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'controlConsideration',
            title: 'Контрольность резолюции',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'planConsideration',
            title: 'План. дата',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'Summary',
            title: 'Ход исполнения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'controllerMission',
            title: 'Контролёр поручения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'FactDate',
            title: 'Дата снятия с контроля',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'Status',
            title: 'Состояние исполненения',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'Resume',
            title: 'Основание для снятия с контроля',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'executors',
            title: 'Исполнители резолюции',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'kindExecutorConsideration',
            type: 'buttons',
            options: EXECUTOR_CONSIDERATION_KIND,
            default: 0,
        }, {
            key: 'executorFile',
            title: 'Файлы исполнителя',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'editSet',
            title: 'Редактировать набор отправляемых уведомлений и докладов после повторного документа СЭВ',
            type: 'boolean',
            default: true,
        }, {
            key: 'calcDate',
            title: 'Пересчитывать срок отправки докладов',
            type: 'boolean',
            default: false, // по умолчанию
        }, {
            key: 'regNumber',
            title: 'Рег.№ в \'Адресат\'',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'reportExecution',
            title: 'Отчет об исполнении в \'Поручение\'',
            type: 'boolean',
            default: true, // по умолчанию
        }, {
            key: 'LinkPD',
            type: 'boolean',
            title: 'Связки РКПД:',
            default: false,
        }, {
            key: 'executorsProject',
            type: 'boolean',
            title: 'Исполнители',
            default: true,
        }, {
            key: 'kindExecutorProject',
            type: 'buttons',
            options: EXECUTOR_PROJECT_KIND,
            default: 1,
        }, {
            key: 'dateExecutionProject',
            type: 'boolean',
            title: 'Срок исполнения',
            default: true,
        }, {
            key: 'kindDateExecutionProject',
            type: 'buttons',
            options: DATE_EXECUTION_PROJECT_KIND,
            default: 1,
        }, {
            key: 'FileRKPD',
            type: 'boolean',
            title: 'Файлы РКПД',
            default: true,
        }, {
            key: 'VisaKind',
            type: 'buttons',
            options: Visa_KIND,
            default: 1,
        }, {
            key: 'VisaInfo',
            type: 'boolean',
            title: 'Информация о визе',
            default: true,
        }, {
            key: 'VisaFile',
            type: 'boolean',
            title: 'Файл визы',
            default: true,
        }, {
            key: 'signatures',
            type: 'boolean',
            title: 'Подписи',
            default: true,
        }, {
            key: 'signaturesKind',
            type: 'buttons',
            options: SIGNATURES_KIND,
            default: 0,
        }, {
            key: 'signaturesInfo',
            type: 'boolean',
            title: 'Информация о подписи',
            default: true,
        }, {
            key: 'signaturesFile',
            type: 'boolean',
            title: 'Файл подписи',
            default: true,
        }, {
            key: 'registrationProject',
            title: 'Доклад о регистрации (отказ в регистрации)',
            type: 'boolean',
            default: true,
        }, {
            key: 'forwardingVisa',
            title: 'Доклад о направлении документа на визирование',
            type: 'boolean',
            default: true,
        }, {
            key: 'forwardingSign',
            title: 'Доклад о направлении документа на подписание',
            type: 'boolean',
            default: true,
        }, {
            key: 'reportVisa',
            title: 'Доклад о визировании',
            type: 'boolean',
            default: true,
        }, {
            key: 'reportSign',
            title: 'Доклад о подписании',
            type: 'boolean',
            default: true,
        },
        {
            key: 'progectRegistration',
            title: 'Доклад о регистрации документа',
            type: 'boolean',
            default: false,
        },
        {
            key: 'executor',
            title: 'Исполнитель',
            type: 'select',
            dictionaryId: CONTACT_DICT.apiInstance,
            options: [],
        }, {
            key: 'executive',
            title: 'ДЛ за "Текущую организацию"',
            type: 'select',
            dictionaryId: CONTACT_DICT.apiInstance,
            options: [],
        }, {
            key: 'VisaKindTake',
            type: 'buttons',
            options: Visa_KIND_TAKE,
            default: 0,
        }, {
            key: 'signatureKindTake',
            type: 'buttons',
            options: Visa_KIND_TAKE,
            default: 0,
        }, {
            key: 'visaDate',
            title: 'Срок визы, если требуемый срок истек',
            type: 'number',
            pattern: /^[0-9]?[0-9]$/,
            default: ''
        }, {
            key: 'visaDays',
            title: 'дней',
            type: 'boolean',
            default: false,
        }, {
            key: 'signatureDate',
            title: 'Срок подписи, если требуемый срок истек',
            type: 'number',
            pattern: /^[0-9]?[0-9]$/,
            default: ''
        }, {
            key: 'signatureDays',
            title: 'дней',
            type: 'boolean',
            default: false,
        }, {
            key: 'visaForward',
            title: 'Направить на визирование',
            type: 'boolean',
        }, {
            key: 'signatureForward',
            title: 'Направить на подпись',
            type: 'boolean',
        }, {
            key: 'forwardingVisaKind',
            type: 'buttons',
            options: FORWARDING_DOCS_PROJECT_KIND,
            default: 1,
        }, {
            key: 'forwardingSignKind',
            type: 'buttons',
            options: FORWARDING_DOCS_PROJECT_KIND,
            default: 1,
        }, {
            key: 'reportVisaKind',
            type: 'buttons',
            options: FORWARDING_DOCS_PROJECT_KIND,
            default: 1,
        }, {
            key: 'reportSignKind',
            type: 'buttons',
            options: FORWARDING_DOCS_PROJECT_KIND,
            default: 1,
        }, {
            key: 'infoVisaign',
            title: 'Информация о визировании/подписании в РКПД',
            type: 'boolean',
            default: true,
        }, {
            key: 'fileVisaign',
            title: 'Файл визы/подписи',
            type: 'boolean',
            default: true,
        }, {
            key: 'correctingVisaign',
            title: 'Корректировать визирующих/подписывающих в РКПД',
            type: 'boolean',
            default: true,
        }, {
            key: 'NotificationConfigReport',
            title: 'Доклад об исполнении поручений',
            type: 'boolean',
            default: true,
        }, {
            key: 'OrganizationFolderInput',
            title: 'Организации создавать:',
            type: 'string',
            default: '', // по умолчанию
        }, {
            key: 'linkTypeListInput',
            title: 'Организации создавать:',
            type: 'string',
            default: '', // по умолчанию
        }, {
            key: 'executiveInput',
            title: 'ДЛ за "Текущую организацию":',
            type: 'string',
            default: '', // по умолчанию
        }, {
            key: 'groupDocument',
            title: 'Для групп документов:',
            type: 'string',
        }, {
            key: 'fileDocument',
            title: 'Файл документа',
            type: 'boolean',
            default: false, // по умолчанию
        }, {
            key: 'departmentReceiveInput',
            title: 'Подразделение:',
            type: 'string',
        }, {
            key: 'organizationNow',
            title: 'Текущая организация',
            type: 'string',
            default: ''
        }
    ],
    editFields: ['CLASSIF_NAME', 'NAME_RULE_KIND', 'RULE_KIND', 'RC_TYPE', 'NOTE', 'type', 'DUE_DOCGROUP', 'DUE_DOCGROUP_NAME', 'DUE_DEP', 'departmentSend', 'kind', 'linkInclude', 'link',
        'linkKind', 'linkTypeList', 'access', 'rubric', 'address', 'region', 'visa', 'addressee', 'addresseeKind', 'additionalField',
        'userGrantedOnly', 'file', 'fileExtensions', 'fileAccessList', 'fileMaxLength', 'item', 'itemKind', 'resolution',
        'resolutionKind', 'taskCategory', 'taskController', 'taskNote', 'taskFile', 'taskFileExtensions', 'taskFileMaxLength', 'reception',
        'registration', 'forwarding', 'consideration', 'report', 'redirection', 'answer', 'stopDayCount',
        'handRegistration',
        'groupDocs', 'cardFile', 'cabinetFile', 'korRuleSend', 'OrganizationFolder', 'adrReplace', 'takeFileRK',
        'orders', 'ordersKind', 'noteOrders', 'takeFileOrders', 'takeFileRK', 'takeOrdersRK', 'forwardingDocs',
        'kindForwardingDocs', 'kindConsideration', 'textConsideration', 'categoryConsideration', 'noteConsideration',
        'controlConsideration', 'planConsideration', 'Summary', 'FactDate', 'Status', 'Resume',
        'executorConsideration', 'kindExecutorConsideration', 'executors', 'executorFile', 'editSet', 'calcDate', 'regNumber',
        'LinkPD', 'executorsProject', 'kindExecutorProject', 'dateExecutionProject', 'kindDateExecutionProject', 'FileRKPD',
         'VisaKind', 'VisaInfo', 'VisaFile', 'signatures', 'signaturesKind', 'signaturesInfo', 'signaturesFile', 'registrationProject',
        'forwardingVisa', 'forwardingSign', 'reportVisa', 'reportSign', 'executor', 'executive', 'visaDate', 'visaDays',
        'signatureDate', 'signatureDays', 'visaForward', 'signatureForward', 'VisaKindTake', 'signatureKindTake', 'forwardingVisaKind',
        'forwardingSignKind', 'reportVisaKind', 'reportSignKind', 'infoVisaign', 'fileVisaign', 'correctingVisaign', 'progectRegistration', 'fileAccessListRk',
        'NotificationConfigReport', 'controllerMission', 'OrganizationFolderInput', 'reportExecution', 'filterConfig', 'linkTypeListInput', 'executiveInput',
        'groupDocument', 'fileDocument', 'FileRK', 'departmentReceive', 'departmentReceiveInput', 'organizationNow', 'DUE_DOCGROUP_DELET'
    ],
    listFields: ['CLASSIF_NAME', 'NAME_RULE_KIND', 'NOTE'],
    allVisibleFields: [],
    fullSearchFields: ['CLASSIF_NAME', 'NOTE', 'type', 'kind', 'RULE_KIND', 'DUE_DOCGROUP'],
    quickViewFields: ['CLASSIF_NAME', 'NOTE', 'type', 'kind', 'DUE_DOCGROUP_NAME'],
    searchFields: ['CLASSIF_NAME'],
});
