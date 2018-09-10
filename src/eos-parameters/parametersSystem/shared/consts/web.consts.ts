import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const WEB_PARAM: IBaseParameters = {
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
            key: 'CERT_APPSRV_STORES',
            type: 'string',
            title: 'Хранилища сертификатов',
        }
    ]
};

export interface IListStores {
    name: string;
    selected: boolean;
    location: string;
    address: string;
    title: string;
}
