import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { IInputParamControl, IPassRegExp } from '../intrfaces/user-parm.intterfaces';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        readonly: true
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'SURNAME_PATRON',
        label: 'ФАМИЛИЯ И.О.',
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.text,
        key: 'NOTE2',
        label: 'ПРИМЕЧАНИЕ',
        pattern: /.+/,
        length: 2000
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'NOTE',
        label: 'ПОДРАЗДЕЛЕНИЕ',
        // length: 255
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'TECH_DUE_DEP',
        label: 'Ограничение',
    },
    {
        controlType: E_FIELD_TYPE.autosearch,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        disabled: false,
        readonly: false,
        options: [
            {
                title: '',
                value: '',
            }
        ],
        value: ''
    }
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
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_ROLE',
        label: 'РОЛЬ',
        disabled: false,
        readonly: false,
        options: [
            {
                title: '',
                value: '',
            }
        ],
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.text,
        key: 'SELECT_ROLE_VIBR',
        label: 'РОЛЬ ВИБР',
    },
    {
        controlType: E_FIELD_TYPE.autosearch,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        disabled: false,
        readonly: false,
        options: [
            {
                title: '',
                value: '',
            }
        ],
        value: ''
    }
];

export const BASE_PARAM_INPUTS_CB: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'SURNAME_PATRON',
        label: 'ФАМИЛИЯ И.О.',
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.text,
        key: 'NOTE2',
        pattern: /.+/,
        label: 'ПРИМЕЧАНИЕ',
        length: 2000
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'NOTE',
        label: 'ПОДРАЗДЕЛЕНИЕ',
        length: 255
    },

    {
        controlType: E_FIELD_TYPE.autosearch,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        disabled: false,
        readonly: false,
        options: [
            {
                title: '',
                value: '',
            }
        ],
        value: ''
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'TECH_DUE_DEP',
        label: 'Ограничение',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'IS_SECUR_ADM',
        label: 'Администратор системы',
    },
];

export const BASE_PARAM_ACCESS_INPUT: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'delo_web',
        label: 'ДЕЛО-WEB',
    },
    // {
    //     controlType: E_FIELD_TYPE.boolean,
    //     key: '0',
    //     label: 'ДЕЛО',
    // },
    // {
    //     controlType: E_FIELD_TYPE.boolean,
    //     key: '0-1',
    //     label: 'ДЕЛО + ДЕЛО-WEB',
    // },
    {
        controlType: E_FIELD_TYPE.radio,
        key: '1-27',
        label: '',
        options: [
            {
                title: 'Конкурентная',
                value: '27'
            },
            {
                title: 'Личная',
                value: '1'
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
        label: 'Мобильное приложение',
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
    // {
    //     controlType: E_FIELD_TYPE.boolean,
    //     key: '21',
    //     label: 'EOS Desktop Service',
    // },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '41',
        label: 'Редактор файлов МО',
    },
];

export const BASE_PARAM_REG_EXP: IPassRegExp[] = [
    {passNums: /\D+/g},
    {passAlph:  /[\A-Z\a-z\А-Я\a-я]/g},
    {otherSymb: /[^\d\sA-Z\d\sa-я]/gi}
];
