const pattrenSearch = /^.{0,}$/;

export const USER_SEARCH = {
    id: '',
    title: '',
    apiInstance: '',
    disabledFields: [
    ],
    fields: [
        {
            key: 'LOGIN',
            type: 'string',
            title: 'Логин',
            pattern: pattrenSearch,
            length: 64
        },
        {
            key: 'DEPARTMENT',
            type: 'string',
            title: 'Подразделение',
            pattern: pattrenSearch,
            length: 150
        },
        {
            key: 'fullDueName',
            type: 'string',
            title: 'Должностное лицо',
            pattern: pattrenSearch,
            length: 150
        },
        {
            key: 'CARD',
            type: 'string',
            title: 'Картотека',
            pattern: pattrenSearch,
            length: 255
        },
        {
            key: 'BLOCK_USER',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'С заблокированными'},
                {value: '1', title: 'Без заблокированных'},
                {value: '2', title: 'Заблокированные'}
            ]
        },
        {
            key: 'SURNAME',
            type: 'string',
            title: 'Фамилия',
            pattern: pattrenSearch,
            length: 64
        },
        {
            type: 'boolean',
            key: '1',
            title: 'ДЕЛО-WEB',
            value: '0'
        },
        {
            type: 'boolean',
            key: '0',
            title: 'ДЕЛО',
            value: '0'
        },
        // {
        //     type: 'boolean',
        //     key: '26',
        //     title: 'Информер',
        //     value: '0'
        // },
        // {
        //     type: 'boolean',
        //     key: '23',
        //     title: 'Мобильный кабинет',
        //     value: '0'
        // },
        {
            type: 'boolean',
            key: '25',
            title: 'Мобильное приложение',
            value: '0'
        },
        {
            type: 'boolean',
            key: '17',
            title: 'Поиск по штрих-коду',
            value: '0'
        },
        {
            type: 'boolean',
            key: '2',
            title: 'Сканирование',
            value: '0'
        },
        {
            type: 'boolean',
            key: '3',
            title: 'Поточное сканирование',
            value: '0'
        },
        {
            type: 'boolean',
            key: '15',
            title: 'Печать штрих-кода',
            value: '0'
        },
        {
            type: 'boolean',
            key: '16',
            title: 'Оповещения и уведомления',
            value: '0'
        },
        {
            type: 'boolean',
            key: '5',
            title: 'ЭП и шифрование',
            value: '0'
        },
        // {
        //     type: 'boolean',
        //     key: '21',
        //     title: 'EOS Desktop Service',
        //     value: '0'
        // },
        {
            type: 'select',
            key: 'DELO_RIGHTS',
            title: 'Абсолютное право',
            options: [
                { value: '', title: '...' },
                { value: '5', title: 'Ввод резолюций' },
                { value: '23', title: 'Ввод проектов резолюций' },
                { value: '6', title: 'Исполнение поручений' },
                { value: '7', title: 'Контроль исполнения поручений'},
                { value: '11', title: 'Визирование проектов'},
                { value: '12', title: 'Подписание проектов'},
                { value: '32', title: 'Исполнение проектов'},
                { value: '33', title: 'Чтение проектов'},
                { value: '25', title: 'Чтение РК персонифицированного доступа'},
                { value: '26', title: 'Чтение файлов персонифицированного доступа'},
                { value: '34', title: 'Чтение файлов строгого доступа'},
                { value: '35', title: 'Чтение событий'},
                { value: '36', title: 'Работа с событиями'},
            ],
            default: 0, // на самом деле наследование в docgroup-dictionary-descriptor
        },
        {
            type: 'string',
            key: 'USER_ORGANIZ_List',
            title: 'Организация',
            value: '0'
        },
        {
            type: 'string',
            key: 'USERDEP_List',
            title: 'Подразделение / Должностное лицо',
            value: '0'
        },
        {
            type: 'boolean',
            key: '41',
            title: 'Редактор файлов МО',
            value: '0'
        }
    ]
};

export interface USERSRCH {
    CARD?: string;
    DEPARTMENT?: string;
    LOGIN?: string;
    fullDueName?: string;
    SURNAME?: string;
    AV_SYSTEMS?: string;
    BLOCK_USER?: string;
    USERDEP_List?: string;
    USER_ORGANIZ_List?: string;
    DELO_RIGHTS?: string;
    SURNAME_PATRON?: string;
}

export interface USERSRCHFORM {
    fullForm?: any;
    quickForm?: string;
    currTab?: number;
}
