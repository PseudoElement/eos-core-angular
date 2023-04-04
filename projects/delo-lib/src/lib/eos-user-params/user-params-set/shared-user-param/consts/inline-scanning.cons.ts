import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const INLINE_SCANNING_USER: IBaseUsers = {
    id: 'inline-scanning',
    title: 'Поточное сканирование',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'DEFAULT_VISUALITY',
            type: 'boolean',
            title: 'Визуальный контроль'
        },
        {
            key: 'LOCAL_SSCAN',
            type: 'boolean',
            title: 'Локальное сканирование'
        },
        {
            key: 'ACCESS_VISUALITY',
            type: 'boolean',
            title: 'Запрет на изменение визуального контроля'
        },
        {
            key: 'NETWORK_SSCAN',
            type: 'boolean',
            title: 'Сетевое сканирование'
        },
        {
            key: 'LOCAL_MRSCAN_VIEW',
            type: 'string',
            title: 'АДРЕС ЛОКАЛЬНОГО MRSCAN SERVER'
        },
        {
            key: 'LOCAL_MRSCAN',
            type: 'string',
            title: 'АДРЕС ЛОКАЛЬНОГО MRSCAN SERVER'
        },
        {
            key: 'LOCAL_MRSCAN_CHECKBOX',
            type: 'boolean',
            title: 'Локальный'
        },
    ],
    fieldsDefaultValue: [
        {
            key: 'DEFAULT_VISUALITY',
            type: 'boolean',
            title: '',
        },
        {
            key: 'LOCAL_SSCAN',
            type: 'boolean',
            title: '',
        },
        {
            key: 'ACCESS_VISUALITY',
            type: 'boolean',
            title: ''
        },
        {
            key: 'NETWORK_SSCAN',
            type: 'boolean',
            title: '',
        },
        {
            key: 'LOCAL_MRSCAN',
            type: 'string',
            title: '',
        },
    ]
};
