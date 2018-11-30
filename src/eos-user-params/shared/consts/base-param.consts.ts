import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IInputParamControl } from '../intrfaces/user-parm.intterfaces';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        required: true,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.date,
        key: 'PASSWORD_DATE',
        label: 'ДАТА СМЕНЫ ПАРОЛЯ',
        readonly: true,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'USERTYPE',
        label: 'Аутентификация с помощью ОС',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.text,
        key: 'NOTE2',
        label: 'ПРИМЕЧАНИЯ',
        value: '',
    },
];

export const BASE_PARAM_CONTROL_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'teсhUser',
        label: 'Технический пользователь',
        disabled: true,
        readonly: true,
        value: false,
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
    {
        controlType: E_FIELD_TYPE.string,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        disabled: true,
        readonly: true,
        value: '',
        data: '',
    },
];

export const BASE_PARAM_ACCESS_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'delo_web',
        label: 'ДЕЛО-WEB',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '0',
        label: 'ДЕЛО',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '0-1',
        label: 'ДЕЛО + ДЕЛО-WEB',
        value: false
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
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '23',
        label: 'Мобильный кабинет',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '25',
        label: 'АРМ руководитель',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '17',
        label: 'Поиск по штрих-коду',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '2',
        label: 'Сканирование',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '3',
        label: 'Поточное сканирование',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '15',
        label: 'Печать штрих-кода',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '16',
        label: 'Оповещения и уведомления',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '5',
        label: 'ЭП и шифрование',
        value: false
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '21',
        label: 'EOS Desktop Service',
        value: false
    },
];
