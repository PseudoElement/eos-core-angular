import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IInputParamControl } from '../intrfaces/user-parm.intterfaces';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.date,
        key: 'PASSWORD_DATE',
        label: 'ДАТА СМЕНЫ ПАРОЛЯ',
        readonly: true,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'USERTYPE',
        label: 'Аутентификация с помощью ОС',
    },
    {
        controlType: E_FIELD_TYPE.text,
        key: 'NOTE2',
        label: 'ПРИМЕЧАНИЯ',
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        required: true,
        data: '',
    },
];

export const BASE_PARAM_CONTROL_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'teсhUser',
        label: 'Технический пользователь',
        disabled: true,
        readonly: true,
    },
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
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_ROLE',
        label: 'РОЛЬ',
        disabled: false,
        readonly: false,
        options: [
            {
                title: '',
                value: ''
            }
        ],
    },
];

export const BASE_PARAM_ACCESS_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'delo_web',
        label: 'ДЕЛО-WEB',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '0',
        label: 'ДЕЛО',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '0-1',
        label: 'ДЕЛО + ДЕЛО-WEB',
    },
    {
        controlType: E_FIELD_TYPE.radio,
        key: '1-27',
        label: '',
        options: [
            {
                title: 'ЛГО',
                value: '1'
            },
            {
                title: 'КЛ',
                value: '27'
            }
        ]
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '26',
        label: 'Информер',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '23',
        label: 'Мобильный кабинет',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '25',
        label: 'АРМ руководителя',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '17',
        label: 'Поиск по штрих-коду',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '2',
        label: 'Сканирование',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '3',
        label: 'Поточное сканирование',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '15',
        label: 'Печать штрих-кода',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '16',
        label: 'Оповещения и уведомления',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '5',
        label: 'ЭП и шифрование',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '21',
        label: 'EOS Desktop Service',
    },
];
