import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const LOGGINGS_PARAM: IBaseParameters = {
    id: 'logging',
    title: 'Протоколирование',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'USER_EDIT_AUDIT',
            type: 'boolean',
            title: `Протоколирование работы со справочником 'Пользователи'`
        },
        {
            key: 'VIEWPROT0',
            type: 'boolean',
            title: `Просмотр РК`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT1',
            type: 'boolean',
            title: `Просмотр РКПД`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT2',
            type: 'boolean',
            title: `Просмотр поручения`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT3',
            type: 'boolean',
            title: `Просмотр файла`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT4',
            type: 'boolean',
            title: `Добавление ЭП`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT5',
            type: 'boolean',
            title: `Просмотр ЭП`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT6',
            type: 'boolean',
            title: `Удаление ЭП`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT7',
            type: 'boolean',
            title: `Печать РК`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT8',
            type: 'boolean',
            title: `Печать РКПД`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT9',
            type: 'boolean',
            title: `Печать Поручения`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT10',
            type: 'boolean',
            title: `Экспорт данных`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT11',
            type: 'boolean',
            title: `Сохранение файла на диске`,
            formatDbBinary: true
        },
        {
            key: 'VIEWPROT12',
            type: 'boolean',
            title: `Выгрузка РК/РКПД и файлов`,
            formatDbBinary: true
        },
    ]
};
