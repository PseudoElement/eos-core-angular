import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const UNLOAD_PARAMS: IBaseParameters = {
    id: 'unload',
    apiInstance: 'USER_PARMS',
    title: 'Выгрузка в Архивное хранилище',
    fields: [
        {
            key: 'ArhStoreUrl',
            type: 'string',
            readonly: true,
            title: 'Адрес Архивного хранилища',
        },
        {
            key: 'ArhExportPath',
            type: 'string',
            readonly: true,
            title: 'Путь к папке для выгрузки',
        },

    ]
};
