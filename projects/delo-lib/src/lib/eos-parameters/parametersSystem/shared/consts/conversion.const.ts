import { IBaseParameters } from '../interfaces/parameters.interfaces';
import { ITableHeader, ITableSettings } from '../interfaces/tables.interfaces';
export const CONVERSION_PARAM: IBaseParameters = {
    id: 'conversion',
    apiInstance: 'APP_SETTINGS',
    title: 'Служба конвертации',
    fields: [
        {
            key: 'IsShared',
            type: 'boolean',
            title: 'Общедоступный конвертер',
            formatDbBinary: true
        },
        {
            key: 'Name',
            type: 'string',
            readonly: true,
            title: 'Имя конвертера'
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
            title: 'Рабочая папка конвертера'
        },
        {
            key: 'LibraryName',
            type: 'select',
            readonly: false,
            title: 'Файловое хранилище',
        },
        {
            key: 'CountProcesses',
            type: 'numberIncrement',
            readonly: true,
            title: 'КОЛИЧЕСТВО ПРОЦЕССОВ',
        },
        {
            key: 'InstanceName',
            type: 'string',
            readonly: true,
            title: '',
        },
        // {
        //     key: 'ConverterFormat',
        //     type: 'string',
        //     title: ''
        // },
        // {
        //     key: 'ServerURL',
        //     type: 'string',
        //     title: 'АДРЕС'
        // }
    ]
};
export const CONVERSION_PARAM_BTN_TABEL = [
    {
        tooltip: 'Редактировать',
        disable: true,
        iconActiv: 'eos-adm-icon-edit-blue',
        iconDisable: 'eos-adm-icon-edit-grey',
        id: 'edit'
    }
];
export const HEADER_TABLE_CONVERSION: ITableHeader[]  = [
    {
        title: 'Сервер фоновых задач',
        id: 'DISPALY_NAME',
        style: {width: '250px'}
    },
    {
        title: 'Экземпляр конвертера',
        id: 'InstanceName',
        style: {width: '200px'}
    },
    {
        title: 'Имя конвертера',
        id: 'Name',
        style: {width: '200px'}
    },
    {
        title: 'Общий доступ',
        id: 'IsSharedList',
        style: {width: '150px'}
    },
];
export const SETTIING_TABLE_CONVERSION: ITableSettings = {
    hiddenCheckBox: true,
    maxHeightTable: '600px',
    selectedRow: true,
    count: true
}
