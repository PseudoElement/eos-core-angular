import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const DIRECTORIES_USER: IBaseUsers = {
    id: 'directories',
    title: 'Справочники',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'WINPOS',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'вертикальные'},
                {value: '0', title: 'горизонтальные'}
            ]
        },
        {
            key: 'SORT',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'по алфавиту'},
                {value: '1', title: 'в порядке ввода значений'},
            ]
        },
        {
            key: 'CLASSIF_WEB_SUGGESTION',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Click мышью'},
                {value: '1', title: 'Ctrl+ Click мышью'},
            ]
        },
        {
            key: 'SRCH_CONTACT_FIELDS',
            type: 'boolean',
            title: ''
        },
        {
            key: 'SRCH_CONTACT_FIELDS_SURNAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'SRCH_CONTACT_FIELDS_DUTY',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'SRCH_CONTACT_FIELDS_DEPARTMENT',
            type: 'boolean',
            title: 'Подразделение'
        },
        {
            key: 'CL_SHOW_DEP_REPLACE_BEFORE',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: '0'},
                {value: '1', title: '1'},
                {value: '2', title: '2'},
                {value: '3', title: '3'},
                {value: '4', title: '4'},
                {value: '5', title: '5'},
                {value: '6', title: '6'},
                {value: '7', title: '7'},
                {value: '8', title: '8'},
                {value: '9', title: '9'},
                {value: '10', title: '10'},
            ]
        }
    ],
    fieldsDefaultValue: [
        {
            key: 'WINPOS',
            type: 'radio',
            title: '',
        },
        {
            key: 'SORT',
            type: 'radio',
            title: '',
        },
        {
            key: 'SRCH_CONTACT_FIELDS',
            type: 'boolean',
            title: ''
        },
        {
            key: 'CL_SHOW_DEP_REPLACE_BEFORE',
            type: 'select',
            title: '',
            options: [
                {value: '0', title: '0'},
                {value: '1', title: '1'},
                {value: '2', title: '2'},
                {value: '3', title: '3'},
                {value: '4', title: '4'},
                {value: '5', title: '5'},
                {value: '6', title: '6'},
                {value: '7', title: '7'},
                {value: '8', title: '8'},
                {value: '9', title: '9'},
                {value: '10', title: '10'},
            ]
        }
    ]
};
