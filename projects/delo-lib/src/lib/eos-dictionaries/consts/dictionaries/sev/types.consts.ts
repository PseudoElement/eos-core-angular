import { InputBase } from "../../../../eos-common/core/inputs/input-base";

export interface OptionDiscription {
    value: any;
    title: string;
    selected?: boolean;
    iconClass?: any;
}
interface IAccordion{
    inputSelect: InputBase<string>;
    title: string;
    isOpen: boolean;
}
export interface IOutInMessagesAccordion extends IAccordion{
    inputText: InputBase<string>;
}
export interface IEmailChannelAccordion extends IAccordion{
    additionalInfo: string;
}
export interface IFileSystemAccordions{
    OUTGOING: IOutInMessagesAccordion
    INCOMING: IOutInMessagesAccordion
}
export const ENCRYPTION_TYPE: Array<OptionDiscription> = [{
    value: 0,
    title: 'Нет',
}, {
    value: 1,
    title: 'SSL'
}, {
    value: 2,
    title: 'StartTLS'
}];

export const CHANNEL_TYPE: Array<OptionDiscription> = [{
    value: 'email',
    title: 'E-mail',
    iconClass: {
      standard: 'eos-adm-icon-A-Black',
      tooltip: 'электронная почта',
      deleted:  'eos-adm-icon-A-Grey'
    }
}, {
    value: 'FileSystem',
    title: 'FileSystem',
    iconClass: {
        standard: 'eos-adm-icon-folder-black',
        tooltip: 'файловая система',
        deleted:  'eos-adm-icon-folder-grey'
    }
  }
 ];

export const AUTH_METHOD: Array<OptionDiscription> = [
    { value: 0, title: 'Авторизация не требуется', },
    { value: 1, title: 'Авторизация Windows' },
    { value: 2, title: 'Авторизация логин/пароль' }

];

export const TYPE_OF_RULE: Array<OptionDiscription> = [{
    value: 1,
    title: 'Отправка документа'
}, {
    value: 2,
    title: 'Прием документа'
}, {
    value: 3,
    title: 'Отправка доклада'
}, {
    value: 4,
    title: 'Прием доклада'
}];
export const NAME_OF_RULE: Array<OptionDiscription> = [{
    value: 1,
    title: 'Отправка документа (РК)'
}, {
    value: 2,
    title: 'Прием документа (РК)'
}, {
    value: 3,
    title: 'Отправка доклада (РК)'
}, {
    value: 4,
    title: 'Прием доклада (РК)'
}, {
    value: 5,
    title: 'Отправка документа (РКПД)'
}, {
    value: 6,
    title: 'Прием документа (РКПД)'
}, {
    value: 7,
    title: 'Отправка доклада (РКПД)'
}, {
    value: 8,
    title: 'Прием доклада (РКПД)'
}];
export const RESEVER_SELECT:  Array<OptionDiscription> = [{
    value: 1,
    title: 'Организация'
}, {
    value: 2,
    title: 'Подразделение'
}];

export const LINK_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'С типом: '}
];

export const ADDRESSEE_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Адресаты сообщений'}
];

export const ITEMS_KIND: Array<OptionDiscription> = [
    { value: 1, title: 'Весь документ'},
    { value: 2, title: 'Выписку'}
];

export const RESOLUTION_KIND: Array<OptionDiscription> = [
    { value: 1, title: 'Все'},
    { value: 2, title: '"Свои" + родительские'},
    { value: 3, title: 'Только "свои"'}
];

export const ORDERS_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Только "свои"'}
];

export const FORWARDING_DOCS_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Всех'},
    { value: 1, title: 'Первого'}
];

export const FORWARDING_DOCS_PROJECT_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Всем'},
    { value: 1, title: 'Только присланным'}
];

export const CONSIDERATION_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Первые'},
    { value: 2, title: 'Последние'}
];

export const Visa_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Первичные'},
    { value: 2, title: 'Только адресат сообщения'}
];

export const Visa_KIND_TAKE: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Только свои'}
];

export const SIGNATURES_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Только адресат сообщения'}
];

export const EXECUTOR_CONSIDERATION_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Ответственные'}
];

export const EXECUTOR_PROJECT_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Только первый'}
];

export const DATE_EXECUTION_PROJECT_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Срок РКПД'},
    { value: 1, title: 'Срок направления'}
];

export const DOCUMENTS_GROUP: Array<OptionDiscription> = [];

/**
 * Document type of SEV rules
 */
export const DOCUMENT_TYPES: Array<OptionDiscription> = [{
    value: 1,
    title: 'Документ'
}, {
    value: 2,
    title: 'Проект'
}];

export const KOR_RULE_SEND: Array<OptionDiscription> = [{
    value: 1,
    title: 'от Автора документа'
}, {
    value: 2,
    title: 'от Корреспондента сообщения'
}];

export const ADDRESS_REPLACE: Array<OptionDiscription> = [{
    value: 1,
    title: 'Всегда'
}, {
    value: 2,
    title: 'Если пуст'
}];

export const SENDER: Array<OptionDiscription> = [{
    value: 0,
    title: 'Для всех организаций'
}];
