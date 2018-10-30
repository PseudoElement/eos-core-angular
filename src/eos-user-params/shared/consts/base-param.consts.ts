import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IInputParamControl } from '../intrfaces/user-parm.intterfaces';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'CLASSIF_NAME',
        label: 'ЛОГИН',
        required: true,
        // pattern: /\S+/,
        // forNode: false,
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
    // {
    //     controlType: 'select',
    //     key: 'data.select',
    //     label: 'select value',
    //     disabled: false,
    //     required: false,
    //     options: [
    //         {
    //             value: 1,
    //             title: 'one',
    //         },
    //         {
    //             value: 2,
    //             title: 'two',
    //         },
    //         {
    //             value: 3,
    //             title: 'three',
    //         },
    //     ],
    // },
    // {
    //     controlType: 'date',
    //     key: 'data.date',
    //     value: new Date(),
    //     label: 'date',
    // },
    // {
    //     controlType: 'buttons',
    //     key: 'data.switch',
    //     label: 'buttons',
    //     options: [
    //         {
    //             value: 1,
    //             title: 'one',
    //         },
    //         {
    //             value: 2,
    //             title: 'two',
    //         },
    //         {
    //             value: 3,
    //             title: 'three',
    //         },
    //     ],
    //     value: 1,
    // },
];

export const BASE_PARAM_CONTROL_INPUT: IInputParamControl[] = [];
