import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const OTHER_PARAM: IBaseParameters = {
    id: 'other',
    apiInstance: 'USER_PARMS',
    title: 'Прочие',
    fields: [
        {
            key: 'SEV_SERVER',
            type: 'string',
            readonly: true,
            title: 'Имя сервера СЭВ',
        },
        {
            key: 'SEV_ROOT_DIR',
            type: 'string',
            readonly: true,
            title: 'Хранилище подсистемы СЭВ',
        },
        {
            key: 'NOTIFY_MANAGMENT',
            type: 'string',
            readonly: true,
            title: 'Подсистемы Оповещения и уведомления и управление процессами',
        },
        {
            key: 'EMAIL_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: '3777', title: 'Телефонограмма'},
                {value: '3779', title: 'Спецсвязь'},
                {value: '3778', title: 'Факс'},
                {value: '2', title: 'СЭВ'},
                {value: '3', title: 'МЭДО'},
                {value: '4', title: 'VipNet'},
            ]
        },
        {
            key: 'SEV_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: '3777', title: 'Телефонограмма'},
                {value: '3779', title: 'Спецсвязь'},
                {value: '3778', title: 'Факс'},
                {value: '2', title: 'СЭВ'},
                {value: '3', title: 'МЭДО'},
                {value: '4', title: 'VipNet'},
            ]
        },
    ]
};
