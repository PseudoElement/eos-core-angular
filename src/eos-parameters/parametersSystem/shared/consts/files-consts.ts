import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const FILES_PARAM: IBaseParameters = {
    id: 'files',
    title: 'Файлы',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'EDMSNAME',
            type: 'select',
            title: 'Система хранения:',
            readonly: true,
            options: [
                {value: 'DELO', title: 'Дело'}
            ]
        },
        {
            key: 'EDMSPARM',
            type: 'radio',
            title: '',
            // readonly: true,
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
            title: 'Каталог шлюза:'
        },
        {
            key: 'STORAGEPATH',
            type: 'string',
            readonly: true,
            title: 'Папка хранения файлов:'
        }
    ]
};
