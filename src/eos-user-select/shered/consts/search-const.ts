
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
            length: 2
        },
        {
            key: 'DEPARTMENT',
            type: 'string',
            title: 'Подразделение',
            pattern: /\w{5,50}/,
        },
        {
            key: 'DUE_DEP',
            type: 'string',
            title: 'Должностное лицо',
            pattern: /\w{5,50}/,
        },
        {
            key: 'CARD',
            type: 'string',
            title: 'Картотека',
            pattern: /\w{5,50}/,
        },
    ]
};
