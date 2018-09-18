import { IBaseParameters } from '../interfaces/parameters.interfaces';
import { REG_RANGE_0_10, REG_RANGE_0_30 } from './eos-parameters.const';

export const AUTH_PARAM: IBaseParameters = {
    id: 'authentication',
    apiInstance: 'USER_PARMS',
    title: 'Аутентификация',
    disabledFields: [
        'PASS_MINLEN',
        'PASS_CASE',
        'PASS_ALF',
        'PASS_NUM',
        'PASS_SPEC',
        'PASS_LIST',
        'PASS_LIST_SUBSTR',
        'PASS_OLD',
        'PASS_DATE'
    ],
    fields: [
        {
            key: 'CHANGE_PASS',
            type: 'boolean',
            title: 'Запретить пользавателям смену пароля'
        },
        {
            key: 'PASS_MINLEN',
            type: 'numberIncrement',
            title: 'Длинна пароля не менее:',
            pattern: REG_RANGE_0_30
        },
        {
            key: 'PASS_CASE',
            type: 'boolean',
            title: 'в разных регистрах'
        },
        {
            key: 'PASS_ALF',
            type: 'numberIncrement',
            title: 'букв',
            pattern: REG_RANGE_0_10
        },
        {
            key: 'PASS_NUM',
            type: 'numberIncrement',
            title: 'цифр',
            pattern: REG_RANGE_0_10
        },
        {
            key: 'PASS_SPEC',
            type: 'numberIncrement',
            title: 'других символов',
            pattern: REG_RANGE_0_10
        },
        {
            key: 'PASS_LIST',
            type: 'boolean',
            title: 'значений слов из Словаря'
        },
        {
            key: 'PASS_LIST_SUBSTR',
            type: 'radio',
            title: '',
            options: [
                {value: 'YES', title: 'как подстраку'},
                {value: 'NO', title: 'точное значение'},
            ]
        },
        {
            key: 'PASS_OLD',
            type: 'numberIncrement',
            title: 'Последовательность из',
            pattern: REG_RANGE_0_30
        },
        {
            key: 'PASS_DATE',
            type: 'numberIncrement',
            title: 'Срок действия пароля:',
            pattern: /^\d{1,3}$/
        },
        {
            key: 'MAX_LOGIN_ATTEMPTS',
            type: 'numberIncrement',
            title: 'Блокировка пользователя после',
            pattern: /^\d{1,4}$/
        },
    ]
};
