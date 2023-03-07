import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const CONVERSION_PARAM: IBaseParameters = {
    id: 'conversion',
    apiInstance: 'APP_SETTINGS',
    title: 'Служба конвертации',
    fields: [
        {
            key: 'IsActive',
            type: 'boolean',
            title: 'Использовать службу конвертации',
            formatDbBinary: true
        },
        {
            key: 'Name',
            type: 'string',
            readonly: true,
            title: ''
        },
        {
            key: 'MaxCacheSize',
            type: 'numberIncrement',
            readonly: true,
            title: 'МАКС. РАЗМЕР ПАПКИ РЕЗУЛЬТАТОВ (ГБ)'
        },
        {
            key: 'LibraryDirectory',
            type: 'string',
            title: 'ПАПКА'
        },
        {
            key: 'LibraryName',
            type: 'select',
            readonly: false,
            title: 'ХРАНИЛИЩЕ',
        },
        {
            key: 'ConverterFormat',
            type: 'string',
            title: ''
        },
        {
            key: 'ServerURL',
            type: 'string',
            title: 'АДРЕС'
        }
    ]
};
