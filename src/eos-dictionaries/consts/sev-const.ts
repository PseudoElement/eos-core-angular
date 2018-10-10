export interface OptionDiscription {
    value: any;
    title: string;
    selected?: boolean;
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
    title: 'E-mail'
}, {
    value: 'FileSystem',
    title: 'Файловая система'
}];

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

export const BUNCHS_RK_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'С типом: '}
];

export const ADDRESSEES_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Адресаты сообщений'}
];

export const ITEMS_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Весь документ'},
    { value: 1, title: 'Выписку'}
];

export const RESOLUTION_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: '"Свои" + родительские'},
    { value: 2, title: 'Только "свои"'}
];

export const ORDERS_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Только "свои"'}
];

export const FORWARDING_DOCS_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Всех'},
    { value: 1, title: 'Первого'}
];

export const CONSIDERATION_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Первые'},
    { value: 2, title: 'Последение'}
];

export const EXECUTOR_CONSIDERATION_KIND: Array<OptionDiscription> = [
    { value: 0, title: 'Все'},
    { value: 1, title: 'Ответственные'}
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
