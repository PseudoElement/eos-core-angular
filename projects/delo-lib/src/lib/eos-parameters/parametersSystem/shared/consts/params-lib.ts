import { IBaseParameters } from './../interfaces/parameters.interfaces';
import { FILES_UNS } from './eos-parameters.const';
export const PARAMS_LIB: IBaseParameters = {
    id: 'lib_params',
    apiInstance: 'USER_PARMS',
    title: 'Хранение файлов',
    fields: [
        {
            key: 'EDMSNAME',
            type: 'select',
            title: 'Система хранения',
            readonly: true,
            options: [
                {value: 'NADZOR', title: 'Надзор'},
                {value: 'DELO', title: 'Дело'}
            ]
        },
        {
            key: 'EDMSPARM',
            type: 'radio',
            title: '',
            options: [
                {value: 'DB', title: 'База данных несколькими отрезками'},
                {value: 'DB2', title: 'База данных одним отрезком'},
                {value: 'STORAGE', title: 'Файловое хранилище'},
            ]
        },
        {
            key: 'GATEPATH',
            type: 'string',
            title: 'Каталог шлюза'
        },
        {
            key: 'DIRECTSTORAGE',
            type: 'select',
            title: '',
            default: 'RW',
            options: []
        },
        {
            key: 'DIRECTSTORAGE_TYPES',
            type: 'string',
            title: '',
            /* pattern: REG_RANGE_0_1440_2, */
        },
        {
            key: 'STORAGEPATH',
            type: 'string',
            title: 'Папка хранения файлов'
        },
        {
            key: 'MAX_FILESIZE',
            type: 'numberIncrement',
            title: 'Максимальный размер файлов (МБ)'
        },
        {
            key: 'gate',
            type: 'string',
            title: 'Папка временных файлов',
            pattern: FILES_UNS
        },
        {
            key: 'EXPIRATION',
            type: 'numberIncrement',
            title: 'Время хранения временных файлов (мин.)',
            /* pattern: REG_RANGE_0_1440_2, */
        }
    ]
};
