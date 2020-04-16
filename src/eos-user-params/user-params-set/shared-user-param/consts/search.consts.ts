import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
const REG_MIN_VAL: RegExp = /^[1-9][0-9]*$/;
export const SEARCH_USER: IBaseUsers = {
    id: 'search',
    title: 'Поиск',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SRCH_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное кол-во записей:',
            maxValue: 99999,
            minValue: 1,
            pattern: REG_MIN_VAL
        },
        {
            key: 'SEARCH_CONTEXT_CARD_EMPTY',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'текущая'},
                {value: '1', title: 'не задана'}
            ]
        }
    ],
    fieldsDefaultValue: [
        {
            key: 'SRCH_LIMIT_RESULT',
            type: 'numberIncrement',
            title: 'Максимальное кол-во записей:',
        },
        {
            key: 'SEARCH_CONTEXT_CARD_EMPTY',
            type: 'radio',
            title: '',
        }
    ]
};
