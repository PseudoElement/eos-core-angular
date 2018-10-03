import { IBaseUsers } from '../intrfaces/user-params.interfaces';

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
            key: 'SURNAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'DUTY',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'DEPARTMENT',
            type: 'boolean',
            title: 'Подразделение'
        }
    ],
    fieldsChild: [
        {
            key: 'SURNAME',
            type: 'boolean',
            title: 'ФИО'
        },
        {
            key: 'DUTY',
            type: 'boolean',
            title: 'Должность'
        },
        {
            key: 'DEPARTMENT',
            type: 'boolean',
            title: 'Подразделение'
        }
    ]
};
