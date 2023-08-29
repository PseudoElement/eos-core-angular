import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';
const REG_MIN_VAL: RegExp = /^([1-9]{1}[0-9]{0,1})$/;
const REG_MIN_VAL_MORE: RegExp = /^([0-9]{1}[0-9]{0,1}[0-9]{0,1})$/;
const REG_MIN_VAL2: RegExp = /^([0-9]{1}[0-9]{0,1})$/;
export const OTHER_USER_TRANSFER: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SEND_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'DELFROMCAB',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Да'},
                {value: '1', title: 'Нет'}
            ]
        },
        {
            key: 'MARKDOC',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Не добавлять'},
                {value: '0', title: 'Для всех документов'},
                {value: '2', title: 'Только для документов с оригиналом на бумажном носителе'}
            ]
        },
        {
            key: 'MARKDOCKND',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
    ],
};
export const OTHER_USER_ADDRESSES: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'RS_OUTER_DEFAULT_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: '', title: ''}
            ]
        },
        {
            key: 'RS_OUTER_DEFAULT_SENDING_TYPE',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Централизовано'},
                {value: '1', title: 'В департаменте'}
            ]
        },
        {
            key: 'RS_INNER_DEFAULT_ORIG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '4', title: 'Эл. экземпляр(ы)'},
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Не отмечать'}
            ]
        },
        {
            key: 'MARKDOCKND1',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'GPD_FLAG',
            type: 'boolean',
            title: 'Использовать правило секции «Внутренние адресаты» об указании бумажного экземпляра в записях журнала передачи'
        },
        {
            key: 'VOL_FLAG',
            type: 'boolean',
            title: 'Показывать информацию о томах в записях о списании в дело'
        },
        {
            key: 'ADDR_EXPEDITION',
            title: '',
            type: 'text',
            length: 255,
        },
        {
            key: 'RS_OUTER_DEFAULT_SENDING_TYPE',
            title: '',
            type: 'radio',
            options: [
                {value: '1', title: 'Централизовано'},
                {value: '2', title: 'В департаменте'},
            ],
            readonly: false,
        },
        {
            key: 'RS_INNER_FILL_SEND_DATE',
            type: 'boolean',
            title: 'Добавлять с отметкой об отправке в АРМ «ДелоWeb»'
        },
    ]
};
export const OTHER_USER_DISPATCH: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'RVO_NUMBER_FORMATION',
            type: 'select',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Пусто'},
                {value: '1', title: 'От счетчика'},
                {value: '2', title: 'Редактируемый'}
            ]
        },
        {
            key: 'RVO_URGENCY',
            type: 'string',
            title: ''
        },
        {
            key: 'RVO_IMPORTANCE',
            type: 'string',
            title: ''
        },
        {
            key: 'RVO_NOTE',
            type: 'string',
            title: ''
        },
        {
            key: 'RVO_MODE',
            type: 'radio',
            title: '',
            readonly: false,
            dafault: 'COLLECTIVE',
            options: [
                {value: 'COLLECTIVE', title: 'Коллективные'},
                {value: 'PERSONAL', title: 'Персональные'}
            ]
        },
    ],
};
export const OTHER_USER_REESTR: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
   fields: [
    {
        key: 'CUR_CABINET',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '0', title: 'По всему журналу передачи документа'},
            {value: '1', title: 'По записям текущего кабинета'}
        ]
    },
    {
        key: 'PARAM_WINDOW',
        type: 'boolean',
        title: 'Показывать окно изменения параметров реестра'
    },
    {
        key: 'SELECT_ITEMS',
        type: 'boolean',
        title: 'Давать возможность выбора записей для реестра'
    },
    {
        key: 'REESTR_ONE_TO_ONE',
        type: 'boolean',
        title: 'Каждый адресат в свой реестр'
    },
    {
        key: 'ORIG_FLAG',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '0', title: 'Оригиналам'},
            {value: '1', title: 'Копиям'},
            {value: '2', title: 'Всем'}
        ]
    },
    {
        key: 'REESTR_NOT_INCLUDED',
        type: 'boolean',
        title: 'Не включенным в реестр'
    },
    {
        key: 'REESTR_DATE_INTERVAL',
        type: 'numberIncrement',
        title: 'Дата передачи документов не позднее ( дней ):',
        pattern: REG_MIN_VAL2
    },
    {
        key: 'REESTR_COPY_COUNT',
        type: 'numberIncrement',
        title: 'Количество копий:',
        pattern: REG_MIN_VAL
    },
    {
        key: 'REESTR_RESTRACTION_DOCGROUP',
        title: 'Ограничить группами документов',
        type: 'text',
        length: 255,
    },
   ]
};
export const OTHER_USER_REESTR_CB: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
   fields: [
    {
        key: 'CUR_CABINET',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '0', title: 'По всему журналу передачи документа'},
            {value: '1', title: 'По записям текущего кабинета'}
        ]
    },
    {
        key: 'PARAM_WINDOW',
        type: 'boolean',
        title: 'Показывать окно изменения параметров реестра'
    },
    {
        key: 'SELECT_ITEMS',
        type: 'boolean',
        title: 'Давать возможность выбора записей для реестра'
    },
    {
        key: 'REESTR_ONE_TO_ONE',
        type: 'boolean',
        title: 'Каждый адресат в свой реестр'
    },
    {
        key: 'ORIG_FLAG',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '0', title: 'Оригиналам'},
            {value: '1', title: 'Копиям'},
            {value: '2', title: 'Всем'}
        ]
    },
    {
        key: 'REESTR_CB_CONTENT',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '0', title: 'Содержание'},
            {value: '1', title: 'Корреспондент/Адресаты'},
        ]
    },
    {
        key: 'REESTR_FORMAT',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '1', title: 'Единый реестр'},
            {value: '2', title: 'Единый реестр с сортировкой по подразделением/ДЛ'},
            {value: '3', title: 'Каждое подразделение / ДЛ в свой реестр'},
        ]
    },
    {
        key: 'REESTR_CB_KIND',
        type: 'radio',
        title: '',
        readonly: false,
        options: [
            {value: '1', title: 'В экспедицию'},
            {value: '2', title: 'Нарочным'},
            {value: '3', title: 'В подразделение'},
        ]
    },
    {
        key: 'REESTR_TO_PRINTER',
        type: 'boolean',
        title: 'Печать на принтер'
    },
    {
        key: 'REESTR_CB_WITHCOM',
        type: 'boolean',
        title: 'С примечанием'
    },
    {
        key: 'REESTR_NOT_INCLUDED',
        type: 'boolean',
        title: 'Не включенным в реестр'
    },
    {
        key: 'REESTR_NOT_INCLUDED',
        type: 'boolean',
        title: 'Не включенным в реестр'
    },
    {
        key: 'REESTR_DATE_INTERVAL',
        type: 'numberIncrement',
        title: 'Дата передачи документов не позднее ( дней ):',
        pattern: REG_MIN_VAL_MORE
    },
    {
        key: 'REESTR_COPY_COUNT',
        type: 'numberIncrement',
        title: 'Количество копий:',
        pattern: REG_MIN_VAL
    },
    {
        key: 'REESTR_RESTRACTION_DOCGROUP',
        title: 'Ограничить группами документов',
        type: 'text',
        length: 255,
    },
    {
        key: 'REESTR_RESTRACTION_DEPARTMENT',
        title: 'Подразделения-адресаты',
        type: 'text',
        length: 255,
    },
    {
        key: 'REESTR_CB_SECUR',
        title: 'Ограничить грифами доступа',
        type: 'text',
        length: 255,
    },
   ]
};
export const OTHER_USER_SHABLONY: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'Визуализация документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Выгрузка РК',
            type: 'string',
            title: ''
        },
        /* {
            key: 'Вставка файла',
            type: 'string',
            title: ''
        }, */
        {
            key: 'Выгрузка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады СЭВ',
            type: 'string',
            title: ''
        },
        /* {
            key: 'Журнал ознакомления',
            type: 'string',
            title: ''
        }, */
        {
            key: 'Запуск печатных форм',
            type: 'string',
            title: ''
        },
        {
            key: 'Импорт файла',
            type: 'string',
            title: ''
        },
        {
            key: 'КОНТЕКСТНЫЙ ПОИСК',
            type: 'string',
            title: ''
        },
        {
            key: 'ЛИСТ СОГЛАСОВАНИЯ',
            type: 'string',
            title: ''
        },
        /* {
            key: 'Недоступные РК',
            type: 'string',
            title: ''
        }, */

        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать резолюций',
            type: 'string',
            title: ''
        },
        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА ПОРУЧЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать списка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'ПРОЕКТ ДОКУМЕНТА',
            type: 'string',
            title: ''
        },
        {
            key: 'Просмотр коллажа',
            type: 'string',
            title: ''
        },
        {
            key: 'ПУНКТ РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Регистрационная карточка',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр всех документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр отмеченных документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Резолюция РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Реквизиты сообщения МЭДО',
            type: 'string',
            title: ''
        },
        /* {
            key: 'Сводный журнал',
            type: 'string',
            title: ''
        },
        {
            key: 'СЕРВЕР ПРИЛОЖЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Синхронизация СЭВ',
            type: 'string',
            title: ''
        }, */
        {
            key: 'Сканирование',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп входящего документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп исходящего документа',
            type: 'string',
            title: ''
        },

    ]
};
export const OTHER_USER: IBaseUsers = {
    id: 'other',
    title: 'Передача',
    apiInstance: 'USER_PARMS',
    fields: [
        {
            key: 'SEND_DIALOG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: 'NO', title: 'Без диалога'},
                {value: 'YES', title: 'С диалогом'}
            ]
        },
        {
            key: 'DELFROMCAB',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Нет'},
                {value: '0', title: 'Да'}
            ]
        },
        {
            key: 'MARKDOC',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '1', title: 'Не добавлять'},
                {value: '0', title: 'Для всех документов'},
                {value: '2', title: 'Только для документов с "бумажным" оригиналом'}
            ]
        },
        {
            key: 'MARKDOCKND',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'RS_OUTER_DEFAULT_DELIVERY',
            type: 'select',
            title: '',
            options: [
                {value: '', title: ''}
            ]
        },
        {
            key: 'MARKDOCKND1',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Вручную'}
            ]
        },
        {
            key: 'RS_INNER_DEFAULT_ORIG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '4', title: 'Эл. экземпляр(ы)'},
                {value: '0', title: 'Оригинал(ы)'},
                {value: '1', title: 'Копию(и)'},
                {value: '2', title: 'Первому оригинал(ы), остальным копии'},
                {value: '3', title: 'Не отмечать'}
            ]
        },
        {
            key: 'GPD_FLAG',
            type: 'boolean',
            title: 'Использовать это правило в Журнале передачи документов'
        },
        {
            key: 'VOL_FLAG',
            type: 'boolean',
            title: 'Показывать информацию о томах в записях о списании в дело'
        },
        {
            key: 'RS_INNER_FILL_SEND_DATE',
            type: 'boolean',
            title: 'Добавлять с отметкой об отправке в АРМ «ДелоWeb»'
        },
        {
            key: 'CUR_CABINET',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'По всему журналу передачи документа'},
                {value: '1', title: 'По записям текущего кабинета'}
            ]
        },
        {
            key: 'PARAM_WINDOW',
            type: 'boolean',
            title: 'Показывать окно изменения параметров реестра'
        },
        {
            key: 'SELECT_ITEMS',
            type: 'boolean',
            title: 'Давать возможность выбора записей для реестра'
        },
        {
            key: 'REESTR_ONE_TO_ONE',
            type: 'boolean',
            title: 'Каждый адресат в свой реестр'
        },
        {
            key: 'ORIG_FLAG',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'Оригиналам'},
                {value: '1', title: 'Копиям'},
                {value: '2', title: 'Всем'}
            ]
        },
        {
            key: 'REESTR_NOT_INCLUDED',
            type: 'boolean',
            title: 'Не включенным в реестр'
        },
        {
            key: 'REESTR_DATE_INTERVAL',
            type: 'numberIncrement',
            title: 'Дата передачи документов не позднее ( дней ):',
            pattern: REG_MIN_VAL2
        },
        {
            key: 'REESTR_COPY_COUNT',
            type: 'numberIncrement',
            title: 'Количество копий:',
            pattern: REG_MIN_VAL

        },
        {
            key: 'REESTR_RESTRACTION_DOCGROUP',
            title: 'Ограничить группами документов',
            type: 'text',
            length: 255,
        },
        {
            key: 'ADDR_EXPEDITION',
            title: '',
            type: 'text',
            length: 255,
        },
        {
            key: 'Визуализация документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Выгрузка РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Вставка файла',
            type: 'string',
            title: ''
        },
        {
            key: 'Выгрузка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Журнал ознакомления',
            type: 'string',
            title: ''
        },
        {
            key: 'Запуск печатных форм',
            type: 'string',
            title: ''
        },
        {
            key: 'Импорт файла',
            type: 'string',
            title: ''
        },
        {
            key: 'КОНТЕКСТНЫЙ ПОИСК',
            type: 'string',
            title: ''
        },
        {
            key: 'ЛИСТ СОГЛАСОВАНИЯ',
            type: 'string',
            title: ''
        },
        {
            key: 'Недоступные РК',
            type: 'string',
            title: ''
        },

        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать резолюций',
            type: 'string',
            title: ''
        },
        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА ПОРУЧЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать списка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'ПРОЕКТ ДОКУМЕНТА',
            type: 'string',
            title: ''
        },
        {
            key: 'Просмотр коллажа',
            type: 'string',
            title: ''
        },
        {
            key: 'ПУНКТ РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Регистрационная карточка',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр всех документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр отмеченных документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Резолюция РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Реквизиты сообщения МЭДО',
            type: 'string',
            title: ''
        },
        {
            key: 'Сводный журнал',
            type: 'string',
            title: ''
        },
        {
            key: 'СЕРВЕР ПРИЛОЖЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Синхронизация СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Сканирование',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп входящего документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп исходящего документа',
            type: 'string',
            title: ''
        },
    ],
    fieldsTemplates: [
        {
            key: 'Визуализация документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Выгрузка РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Вставка файла',
            type: 'string',
            title: ''
        },
        {
            key: 'Выгрузка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Доклады СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Журнал ознакомления',
            type: 'string',
            title: ''
        },
        {
            key: 'Запуск печатных форм',
            type: 'string',
            title: ''
        },
        {
            key: 'Импорт файла',
            type: 'string',
            title: ''
        },
        {
            key: 'КОНТЕКСТНЫЙ ПОИСК',
            type: 'string',
            title: ''
        },
        {
            key: 'ЛИСТ СОГЛАСОВАНИЯ',
            type: 'string',
            title: ''
        },
        {
            key: 'Недоступные РК',
            type: 'string',
            title: ''
        },

        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка РКПД СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Отправка СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать резолюций',
            type: 'string',
            title: ''
        },
        {
            key: 'Опись дел',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА',
            type: 'string',
            title: ''
        },
        {
            key: 'ПЕЧАТЬ СПИСКА ПОРУЧЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Печать списка РКПД',
            type: 'string',
            title: ''
        },
        {
            key: 'ПРОЕКТ ДОКУМЕНТА',
            type: 'string',
            title: ''
        },
        {
            key: 'Просмотр коллажа',
            type: 'string',
            title: ''
        },
        {
            key: 'ПУНКТ РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Регистрационная карточка',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр всех документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Реестр отмеченных документов',
            type: 'string',
            title: ''
        },
        {
            key: 'Резолюция РК',
            type: 'string',
            title: ''
        },
        {
            key: 'Реквизиты сообщения МЭДО',
            type: 'string',
            title: ''
        },
        {
            key: 'Сводный журнал',
            type: 'string',
            title: ''
        },
        {
            key: 'СЕРВЕР ПРИЛОЖЕНИЙ',
            type: 'string',
            title: ''
        },
        {
            key: 'Синхронизация СЭВ',
            type: 'string',
            title: ''
        },
        {
            key: 'Сканирование',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп входящего документа',
            type: 'string',
            title: ''
        },
        {
            key: 'Штамп исходящего документа',
            type: 'string',
            title: ''
        },
    ]
};
