const pattrenSearch = /^("[^]*"|'[^']*'|[ёЁа-яА-Яa-zA-Z0-9\s\.-]{0,50})$/;
const pattrenSearchLogin = /^("[^]*"|'[^']*'|[ёЁ_а-яА-Яa-zA-Z0-9\s\.-]{0,50})$/;
const pattrenSearchDepartment = /^("[^]*"|'[^']*'|[ёЁ_а-яА-Яa-zA-Z0-9\s\.)(/\\,-]{0,50})$/;
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
            pattern: pattrenSearchLogin,
        },
        {
            key: 'DEPARTMENT',
            type: 'string',
            title: 'Подразделение',
            pattern: pattrenSearchDepartment,
        },
        {
            key: 'fullDueName',
            type: 'string',
            title: 'Должностное лицо',
            pattern: pattrenSearch,
        },
        {
            key: 'CARD',
            type: 'string',
            title: 'Картотека',
            pattern: pattrenSearch,
        },
        {
            key: 'DEL_USER',
            type: 'boolean',
            title: 'Поиск удаленных пользователей',
        },
        {
            key: 'SURNAME',
            type: 'string',
            title: 'Фамилия',
            pattern: pattrenSearch,
        },
    ]
};

export interface USERSRCH {
    CARD?: string;
    DEPARTMENT?: string;
    LOGIN?: string;
    fullDueName?: string;
    SURNAME?: string;
}
