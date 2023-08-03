import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const UNLOAD_PARAMS: IBaseParameters = {
    id: 'unload',
    apiInstance: 'APP_SETTINGS',
    title: 'Архивное хранилище',
    fields: [
        {
            key: 'ArhStoreUrl',
            type: 'string',
            readonly: false,
            title: 'АДРЕС АРХИВНОГО ХРАНИЛИЩА',
        },
        {
            key: 'Directory',
            type: 'string',
            readonly: false,
            required: true,
            title: 'ПАПКА ВЫГРУЗКИ',
        },
        {
            key: 'Name',
            type: 'select',
            readonly: false,
            title: 'ХРАНИЛИЩЕ',
        },
    ]
};
