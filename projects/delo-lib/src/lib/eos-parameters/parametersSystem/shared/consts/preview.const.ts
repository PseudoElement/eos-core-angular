import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const PREVIEW_PARAM: IBaseParameters = {
    id: 'preview',
    apiInstance: 'APP_SETTINGS',
    title: 'Предварительный просмотр',
    fields: [
        {
            key: 'IsActive',
            type: 'boolean',
            title: 'Использовать службу конвертации',
            formatDbBinary: true
        },
        {
            key: 'ConverterUseType',
            type: 'select',
            readonly: false,
            title: 'РЕЖИМ ИСПОЛЬЗОВАНИЯ КОНВЕРТЕРА',
            options: [
                { value: '0', title: 'Наименее загруженный' },
                { value: '1', title: 'Локальный' },
                { value: '2', title: 'Указанный' },
                //
            ],
        },
        {
            key: 'ConverterUseInstanceName',
            type: 'select',
            readonly: false,
            title: 'ПРОФИЛЬ ИЛИ ЭКЗЕМПЛЯР КОНВЕРТЕРА',
        },
        {
            key: 'TimeOutWaitConverting',
            type: 'numberIncrement',
            readonly: false,
            title: 'Время ожидания завершения конвертации, мин.',
        },
        {
            key: 'ConverterMaxFileSize',
            type: 'numberIncrement',
            readonly: false,
            title: 'Максимальный размер файла для конвертации, Мб',
        }
    ]
};
