import { IBaseUsers } from '../intrfaces/user-params.interfaces';

export const SEARCH_USER: IBaseUsers = {
    id: 'search',
    title: 'Поиск',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SRCH_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное кол-во записей:'
        },
        {
            key: 'SEARCH_CONTEXT_CARD_EMPTY',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Текущая картотека'},
                {value: '1', title: 'Не задана'}
            ]
        }
    ]
};
