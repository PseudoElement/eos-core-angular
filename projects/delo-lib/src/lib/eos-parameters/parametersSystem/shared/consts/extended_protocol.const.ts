import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const EXTENDED_PARAMS: IBaseParameters = {
    id: 'extended',
    apiInstance: 'APP_SETTINGS',
    title: 'Расширенный протокол',
    fields: [
        {
            key: 'LibraryDirectory',
            type: 'string',
            title: 'Папка выгрузки протокола'
        },
        {
            key: 'LibraryName',
            type: 'select',
            readonly: false,
            title: 'Хранилище',
        },
    ]
};
