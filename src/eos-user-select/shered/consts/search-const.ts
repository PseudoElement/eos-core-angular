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
            length: 255
        },
        {
            key: 'DEPARTMENT',
            type: 'string',
            title: 'Подразделение',
            pattern: pattrenSearch,
            length: 255
        },
        {
            key: 'fullDueName',
            type: 'string',
            title: 'Должностное лицо',
            pattern: pattrenSearch,
            length: 255
        },
        {
            key: 'CARD',
            type: 'string',
            title: 'Картотека',
            pattern: pattrenSearch,
            length: 255
        },
        {
            key: 'DEL_USER',
            type: 'boolean',
            title: 'Поиск удаленных пользователей',
        },
        {
            key: 'BLOCK_USER',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'С блокированными'},
                {value: '1', title: 'Без блокированных'},
                {value: '2', title: 'Блокированные'}
            ]
        },
        {
            key: 'SURNAME',
            type: 'string',
            title: 'Фамилия',
            pattern: pattrenSearch,
            length: 255
        },
        {
            key: 'AV_SYSTEMS',
            type: 'boolean',
            title: 'Поиск по системам',
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
        {
            type: 'boolean',
            key: '26',
            title: 'Информер',
            value: '0'
        },
        {
            type: 'boolean',
            key: '23',
            title: 'Мобильный кабинет',
            value: '0'
        },
        {
            type: 'boolean',
            key: '25',
            title: 'АРМ руководителя',
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
        {
            type: 'boolean',
            key: '21',
            title: 'EOS Desktop Service',
            value: '0'
        },
    ]
};

export interface USERSRCH {
    CARD?: string;
    DEPARTMENT?: string;
    LOGIN?: string;
    fullDueName?: string;
    SURNAME?: string;
    DEL_USER?: boolean;
    AV_SYSTEMS?: string;
    BLOCK_USER?: string;
}
