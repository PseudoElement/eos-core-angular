import { IBaseParameters } from './../interfaces/parameters.interfaces';
const REG_MIN_VAL_MORE: RegExp = /^([1-9]{1}[0-9]{0,})$/;
export const OTHER_PARAM: IBaseParameters = {
    id: 'other',
    apiInstance: 'USER_PARMS',
    title: 'Прочие',
    fields: [
        {
            type: 'string',
            key: 'СЕРВЕР_ПРИЛОЖЕНИЙ',
            readonly: false,
            title: 'Сервер приложений и сервер «ДелоWEB»',
        },
        /* {
            key: 'SEV_SERVER',
            type: 'string',
            readonly: false,
            title: 'Имя сервера СЭВ',
        },
        {
            key: 'SEV_ROOT_DIR',
            type: 'string',
            readonly: false,
            title: 'Хранилище подсистемы СЭВ',
        }, */
        {
            key: 'NOTIFY_MANAGMENT',
            type: 'string',
            readonly: false,
            title: 'Подсистемы "Оповещения и уведомления" и "управление процессами"',
        },
        {
            key: 'TimeoutInMinutes',
            type: 'numberIncrement',
            readonly: false,
            pattern: REG_MIN_VAL_MORE,
            title: 'Таймаут сессии (минут)',
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
        {
            key: 'MEDO_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'DIADOC_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
    ]
};
export const OTHER_PARAM_CB: IBaseParameters = {
    id: 'other',
    apiInstance: 'USER_PARMS',
    title: 'Прочие',
    fields: [
        {
            type: 'string',
            key: 'СЕРВЕР_ПРИЛОЖЕНИЙ',
            readonly: false,
            title: 'Сервер приложений и сервер «ДелоWEB»',
        },
        /* {
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
        }, */
        {
            key: 'NOTIFY_MANAGMENT',
            type: 'string',
            readonly: true,
            title: 'Подсистемы "Оповещения и уведомления" и "управление процессами"',
        },
        {
            key: 'TimeoutInMinutes',
            type: 'numberIncrement',
            readonly: false,
            pattern: REG_MIN_VAL_MORE,
            title: 'Таймаут сессии (минут)',
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
        {
            key: 'MEDO_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'ASPSD_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'SDS_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'LK_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'EPVV_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
        {
            key: 'DIADOC_ISN_DELIVERY',
            type: 'select',
            title: '',
            options: []
        },
    ]
};
