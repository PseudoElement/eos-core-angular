import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const SEARCH_PARAM: IBaseParameters = {
    id: 'search',
    apiInstance: 'USER_PARMS',
    title: 'Поиск',
    fields: [
        {
            key: 'INDEXKIND',
            type: 'radio',
            readonly: false,
            title: '',
            options: [
                {value: 'DBMS', title: 'СУБД'},
                {value: 'MSINDEXSERVER', title: 'Внешняя служба'},
                {value: 'ES', title: 'Служба Elasticsearch'}
            ]
        },
        {
            key: 'ES_SETTINGS',
            type: 'string',
            readonly: false,
            title: 'Адрес Elasticsearch',
        },
        {
            key: 'INDEX_URL',
            type: 'string',
            readonly: false,
            title: 'Полный путь к прокси-серверу службы поиска',
        },
        {
            key: 'INDEXTIMEOUT',
            type: 'numberIncrement',
            readonly: true,
            title: 'Максимальное время ожидания выполнения запроса(сек)',
        },
        {
            key: 'ELNPATH',
            type: 'string',
            readonly: true,
            title: 'Папка для eln-ярлыков',
        },
        {
            key: 'FULLTEXT_EXTENSIONS',
            type: 'string',
            // readonly: true,
            title: 'Форматы файлов, индексируемых внешней службой',
            length: 2000
        },
    ]
};
