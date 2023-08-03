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
            key: 'INDEX_URL',
            type: 'string',
            readonly: false,
            title: 'ПОЛНЫЙ ПУТЬ К ПРОКСИ-СЕРВЕРУ ВНЕШНЕЙ СЛУЖБЫ ПОИСКА',
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
            title: 'ПАПКА ДЛЯ ELN-ЯРЛЫКОВ',
        },
        {
            key: 'FULLTEXT_EXTENSIONS',
            type: 'string',
            // readonly: true,
            title: 'ФОРМАТЫ ФАЙЛОВ, ИНДЕКСИРУЕМЫХ ВНЕШНЕЙ СЛУЖБОЙ',
            length: 2000
        },
        /* {
            key: 'KafkaCfgServerURL',
            type: 'string',
            readonly: false,
            title: 'АДРЕС KAFKA',
        }, */
        {
            key: 'ElasticCfgServerURL',
            type: 'string',
            readonly: false,
            title: 'АДРЕС СЕРВЕРА ELASTICSEARCH',
        },
        {
            key: 'ElasticCfgLogin',
            type: 'string',
            readonly: false,
            title: 'ЛОГИН',
        },
        {
            key: 'ElasticCfgPassword',
            type: 'string',
            readonly: false,
            title: 'Пароль',
        },
    ]
};
