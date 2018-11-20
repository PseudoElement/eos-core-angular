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
                {value: '1', title: 'Вертикальное'},
                {value: '0', title: 'Горизонтальное'}
            ]
        },
        {
            key: 'SORT',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Алфавитная'},
                {value: '1', title: 'В порядке ввода значений'},
            ]
        },
        {
            key: 'SRCH_CONTACT_FIELDS',
            type: 'boolean',
            title: ''
        }
    ],
    fieldsChild: [
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
        }
    ]
};
