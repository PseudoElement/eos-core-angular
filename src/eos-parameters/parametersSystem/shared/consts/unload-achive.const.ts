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
            title: 'Адрес архивного хранилища',
        },
        {
            key: 'Directory',
            type: 'string',
            readonly: false,
            required: true,
            title: 'Папка выгрузки',
        },
        {
            key: 'Name',
            type: 'select',
            readonly: false,
            title: 'Хранилище',
        },
    ]
};
