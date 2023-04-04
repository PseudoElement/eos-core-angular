import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const INLINE_SCANNING_PARAM: IBaseParameters = {
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
            key: 'ACCESS_VISUALITY',
            type: 'boolean',
            title: 'Запрет на изменение визуального контроля '
        },
        {
            key: 'LOCAL_SSCAN',
            type: 'boolean',
            title: 'Локальное сканирование'
        },
        {
            key: 'NETWORK_SSCAN',
            type: 'boolean',
            title: 'Сетевое сканирование'
        },
        {
            key: 'SITE_MRSCAN',
            type: 'string',
            title: 'Адрес сайта MRScan'
        },
        {
            key: 'LOCAL_MRSCAN',
            type: 'string',
            title: 'Адрес локального MRScan.Server'
        },
        {
            key: 'NETWORK_MRSCAN',
            type: 'string',
            title: 'Адрес сетевого MRScan.Server'
        },
        {
            key: 'SITE_MRSCAN_CHECK',
            type: 'boolean',
            title: 'Модуль'
        },
        {
            key: 'LOCAL_MRSCAN_CHECK',
            type: 'boolean',
            title: 'Локальный'
        },
        {
            key: 'NETWORK_MRSCAN_CHECK',
            type: 'boolean',
            title: 'Локальный'
        },
    ]
};


