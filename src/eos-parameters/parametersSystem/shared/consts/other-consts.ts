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
            options: []
        },
        {
            key: 'SEV_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
    ]
};
