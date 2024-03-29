import { IBaseParameters } from '../interfaces/parameters.interfaces';
import { REG_RANGE_0_10, REG_RANGE_0_30 } from './eos-parameters.const';

export const ESIA_AUTH_PARM_VALUE = '1';
export const ESIA_AUTH_FIELD_KEY = 'ALLOWED_EXTERNAL_AUTH_ESIA';
export const EXTERNAL_AUTH_COMMON_KEY = 'ALLOWED_EXTERNAL_AUTH';

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
            title: 'Запретить пользователям смену пароля'
        },
        {
            key: 'PASS_MINLEN',
            type: 'numberIncrement',
            title: 'Длина пароля не менее:',
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
                {value: 'YES', title: 'как подстроку'},
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
            title: 'Блокировать пользователя после',
            pattern: /^\d{1,4}$/
        },
        {
            key: 'EXTERNAL_AUTH_ADD',
            type: 'boolean',
            title: 'Разрешить пользователям добавление идентификатора внешних систем аутентификации',
            formatDbBinary: true,
        },
        {
            key: EXTERNAL_AUTH_COMMON_KEY,
            type: 'string',
        },
        {
            key: ESIA_AUTH_FIELD_KEY,
            type: 'boolean',
            title: 'Единая система идентификации и аутентификации (ЕСИА)',
            value: false,
        },
    ]
};
