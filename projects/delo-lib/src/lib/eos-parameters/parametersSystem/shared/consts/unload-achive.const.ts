import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const UNLOAD_PARAMS: IBaseParameters = {
    id: 'unload',
    apiInstance: 'USER_PARMS',
    title: 'Архивное хранилище',
    fields: [
        {
            key: 'ArhStoreUrl',
            type: 'string',
            readonly: true,
            title: 'Адрес архивного хранилища',
        },
        {
            key: 'ArhExportPath',
            type: 'string',
            readonly: true,
            title: 'Папка выгрузки',
        },

    ]
};
