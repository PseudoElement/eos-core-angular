import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { IInputParamControl } from '../intrfaces/user-parm.intterfaces';

export const AUNTEFICATION_CONTROL_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'pass',
        label: 'ПАРОЛЬ',
        pattern: /^\S+$/,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'passRepeated',
        label: 'ПОВТОРИТЕ ПАРОЛЬ',
        pattern: /^\S+$/,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        required: true,
        pattern: /^(\s*\S+\s*)+$/,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'USERTYPE',
        label: 'Аутентификация с помощью ОС',
        disabled: true,
        readonly: true,
    },
    {
        controlType: E_FIELD_TYPE.date,
        key: 'PASSWORD_DATE',
        label: 'ДАТА СМЕНЫ ПАРОЛЯ',
        readonly: true,
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'ID_USER',
        label: 'ИДЕНТИФИКАТОР ПОЛЬЗОВАТЕЛЯ',
        pattern: /^\S+$/,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'EXTERNAL_ID',
        label: 'ИДЕНТИФИКАТОР ЕСИА',
        pattern: /^\S+$/,
        value: '',
    },
    {
        key: 'EXTERNAL_TYPE',
        controlType: E_FIELD_TYPE.select,
        label: 'ТИП ИДЕНТИФИКАТОРА',
        disabled: false,
        readonly: false,
        options: [
            {value: '0', title: '...'},
            {value: 'ESIA_EMAIL', title: 'Эл. почта'},
            {value: 'ESIA_PHONE', title: 'Телефон'},
            {value: 'ESIA_SNILS', title: 'СНИЛС'},
            {value: 'ESIA_ID', title: 'Код ЕСИА', disabled: true},
        ]
    },
    {
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_AUTENT',
        label: 'Система аутентификации',
        disabled: false,
        readonly: false,
        options: [
            {
                title: 'Без права входа в систему',
                value: '-1'
            },
            {
                title: 'Имя/пароль в БД',
                value: '0'
            },
            {
                title: 'ОС-аутентификация',
                value: '1'
            },
            {
                title: 'Пользователь в БД',
                value: '2'
            },
            {
                title: 'Имя/пароль',
                value: '3'
            },
            {
                title: 'ОС-аутентификация на сервере',
                value: '4'
            },
        ],
    },
];

