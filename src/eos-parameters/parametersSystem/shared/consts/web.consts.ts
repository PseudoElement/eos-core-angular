import { IParametersDescriptor } from '../interfaces/parameters.interfaces';

export const WEB_PARAM: IParametersDescriptor = {
    id: 'web',
    apiInstance: 'USER_PARMS',
    title: 'WEB',
    fields: [
        {
            key: 'APPSRV_CRYPTO_ACTIVEX',
            type: 'string',
            title: 'Название объекта',
        },
        {
            key: 'APPSRV_CRYPTO_INITSTR',
            type: 'string',
            title: 'Строка инициализации',
        },
        {
            key: 'APPSRV_PKI_ACTIVEX',
            type: 'string',
            title: 'Название объекта',
        },
        {
            key: 'APPSRV_PKI_INITSTR',
            type: 'string',
            title: 'Строка инициализации',
        },
        {
            key: 'STORAGE',
            type: 'buttons',
            title: 'Хранилища сертификатов',
            options: [{ value: 1, title: 'Хранилища сертификатов'}]
        }
    ]
};
