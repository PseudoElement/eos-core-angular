import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
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
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_AUTENT',
        label: 'Система аутентификации',
        disabled: false,
        readonly: false,
        options: [
            {
                title: 'СУБД-аутентификация',
                value: '0'
            },
            {
                title: 'ОС-аутентификация',
                value: '1'
            },
            /* {
                title: 'Системная аутентификация',
                value: '2'
            },
            {
                title: 'Веб-аутентификация',
                value: '3'
            } */
        ],
    },
];

