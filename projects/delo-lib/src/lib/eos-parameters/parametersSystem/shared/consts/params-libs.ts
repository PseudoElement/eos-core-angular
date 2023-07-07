import { ITableHeader } from '../interfaces/tables.interfaces';
import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const PARAMS_LIBS: IBaseParameters = {
    id: 'libs_params',
    apiInstance: 'USER_PARMS',
    title: 'Хранение файлов',
    fields: [
        {
            key: 'Expiration',
            type: 'numberIncrement',
            title: 'СРОК ХРАНЕНИЯ ВРЕМЕННЫХ ФАЙЛОВ (МИН.)',
        },
        {
            key: 'FdulzDirectory',
            type: 'string',
            title: 'ПАПКА ХРАНЕНИЯ ВРЕМЕННЫХ ФАЙЛОВ',
        },
        {
            key: 'FdulzName',
            type: 'select',
            title: 'ХРАНИЛИЩЕ',
        },
        {
            key: 'MaxFileSize',
            type: 'numberIncrement',
            title: 'МАКС. РАЗМЕР ФАЙЛОВ (МБ)',
        },
        {
            key: 'EdmsParm',
            type: 'string',
            title: '',
        },
        {
            key: 'CommonDirectory',
            type: 'string',
            title: 'ПАПКА',
        },
        {
            key: 'CommonName',
            type: 'select',
            title: 'ХРАНИЛИЩЕ',
        },
        {
            key: 'EdmsParm',
            type: 'radio',
            title: 'МЕСТО ХРАНЕНИЯ',
            options: [
                {value: 'GRStorage14', title: 'База данных единым блоком'},
                {value: 'GRStorage11', title: 'База данных несколькими блоками'},
                {value: 'GRStorage12', title: 'Файловое хранилище'},
                {value: 'DB2', title: 'База данных единым блоком (DB2)'},
                {value: 'DB', title: 'База данных несколькими блоками (DB)'},
                {value: 'STORAGE', title: 'Файловое хранилище (STORAGE)'},
            ]
        },
    ]
};

export const TABLE_HEADER_FILES: ITableHeader[] = [
    {
      title: 'Хранилище',
      id: 'ProfileName',
      style: {width: '230px'}
    },
    {
      title: 'Тип',
      id: 'TYPE',
      style: {width: '70px'}
    },
    {
      title: 'Путь',
      id: 'STORAGE_PATH',
      style: {width: '270px'}
    },
    {
      title: 'Точка монтирования',
      id: 'MOUNT_NAME',
      style: {width: 'calc(100% - (230px + 70px + 270px)'}
    },
  ];