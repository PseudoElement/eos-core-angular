import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const MAX_SIZE = 'Мах размер';
export const ONE_FILE = 'Один файл';
export const REG_EXTENSIONS: RegExp = /\..*\S$/;
export const REG_MAX_SIZE: RegExp = /^([1-9]\d{0,7}?|\s)$/; // '', 1 - 99999999
export const FILES_PARAM: IBaseParameters = {
    id: 'files',
    title: 'Файлы',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'EDMSNAME',
            type: 'select',
            title: 'Система хранения',
            readonly: true,
            options: [
                {value: 'DELO', title: 'Дело'}
            ]
        },
        {
            key: 'EDMSPARM',
            type: 'radio',
            title: '',
            readonly: true,
            options: [
                {value: 'DB', title: 'База данных несколькими отрезками'},
                {value: 'DB2', title: 'База данных одним отрезком'},
                {value: 'STORAGE', title: 'Файловое хранилище'},
            ]
        },
        {
            key: 'GATEPATH',
            type: 'string',
            readonly: true,
            title: 'Каталог шлюза'
        },
        {
            key: 'STORAGEPATH',
            type: 'string',
            readonly: true,
            title: 'Папка хранения файлов'
        },
        {
            key: 'EDS_DELETE_DENIED', // в базе значение 1/0
            type: 'boolean',
            formatDbBinary: true,
            title: 'Запретить удаление ЭП файлов РК/РКПД'
        },
        {
            key: 'FILE_WITH_EDS_PROTECTED',
            type: 'boolean',
            title: 'Запретить редактирование файлов РК с ЭП'
        }
    ],
    fieldsChild: [
        {
            key: 'DOC_RC_MAX_SIZE',
            type: 'numberIncrement',
            title: MAX_SIZE,
            pattern: REG_MAX_SIZE
        },
        {
            key: 'DOC_RC_ONE_FILE',
            type: 'boolean',
            title: ONE_FILE
        },
        {
            key: 'DOC_RC_EXTENSIONS',
            type: 'string',
            title: '',
            /* pattern: REG_EXTENSIONS, */
        },
        {
            key: 'PRJ_RC_MAX_SIZE',
            type: 'numberIncrement',
            title: MAX_SIZE,
            pattern: REG_MAX_SIZE
        },
        {
            key: 'PRJ_RC_ONE_FILE',
            type: 'boolean',
            title: ONE_FILE
        },
        {
            key: 'PRJ_RC_EXTENSIONS',
            type: 'string',
            title: '',
            /* pattern: REG_EXTENSIONS */
        },
        {
            key: 'PRJ_VISA_SIGN_MAX_SIZE',
            type: 'numberIncrement',
            title: MAX_SIZE,
            pattern: REG_MAX_SIZE
        },
        {
            key: 'PRJ_VISA_SIGN_ONE_FILE',
            type: 'boolean',
            title: ONE_FILE
        },
        {
            key: 'PRJ_VISA_SIGN_EXTENSIONS',
            type: 'string',
            title: '',
           /*  pattern: REG_EXTENSIONS */
        },
        {
            key: 'REPLY_MAX_SIZE',
            type: 'numberIncrement',
            title: MAX_SIZE,
            pattern: REG_MAX_SIZE
        },
        {
            key: 'REPLY_ONE_FILE',
            type: 'boolean',
            title: ONE_FILE
        },
        {
            key: 'REPLY_EXTENSIONS',
            type: 'string',
            title: '',
           /*  pattern: REG_EXTENSIONS */
        },
        {
            key: 'RESOLUTION_MAX_SIZE',
            type: 'numberIncrement',
            title: MAX_SIZE,
            pattern: REG_MAX_SIZE
        },
        {
            key: 'RESOLUTION_ONE_FILE',
            type: 'boolean',
            title: ONE_FILE
        },
        {
            key: 'RESOLUTION_EXTENSIONS',
            type: 'string',
            title: '',
            /* pattern: REG_EXTENSIONS */
        },
    ]
};


