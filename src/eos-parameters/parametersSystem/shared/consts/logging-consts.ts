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
            title: `Просмотр РК`
        },
        {
            key: 'VIEWPROT1',
            type: 'boolean',
            title: `Просмотр РКПД`
        },
        {
            key: 'VIEWPROT2',
            type: 'boolean',
            title: `Просмотр поручения`
        },
        {
            key: 'VIEWPROT3',
            type: 'boolean',
            title: `Просмотр файла`
        },
        {
            key: 'VIEWPROT4',
            type: 'boolean',
            title: `Добавление ЭП`
        },
        {
            key: 'VIEWPROT5',
            type: 'boolean',
            title: `Просмотр ЭП`
        },
        {
            key: 'VIEWPROT6',
            type: 'boolean',
            title: `Удаление ЭП`
        },
        {
            key: 'VIEWPROT7',
            type: 'boolean',
            title: `Печать ЭП`
        },
        {
            key: 'VIEWPROT8',
            type: 'boolean',
            title: `Печать РКПД`
        },
        {
            key: 'VIEWPROT9',
            type: 'boolean',
            title: `Печать Поручения`
        },
        {
            key: 'VIEWPROT10',
            type: 'boolean',
            title: `Экспорт данных`
        },
        {
            key: 'VIEWPROT11',
            type: 'boolean',
            title: `Сохранение файла на диске`
        },
        {
            key: 'VIEWPROT12',
            type: 'boolean',
            title: `Выгрузка РК/РКПД и файлов`
        },
    ]
};
