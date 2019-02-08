import { IBaseUsers } from '../../../shared/intrfaces/user-params.interfaces';

export const OTHER_USER: IBaseUsers = {
    id: 'other',
    title: 'Прочее',
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
            key: 'GPD_FLAG',
            type: 'boolean',
            title: 'Использовать это правило в Журнале передачи документов'
        },
        {
            key: 'VOL_FLAG',
            type: 'boolean',
            title: 'Заполнять информацию о томах'
        },
        {
            key: 'CUR_CABINET',
            type: 'radio',
            title: '',
            readonly: false,
            options: [
                {value: '0', title: 'по записям текущей картотеки'},
                {value: '1', title: 'по записям текущего кабинета'}
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
            title: 'Каждый адресат в свой реестр'
        },
        {
            key: 'REESTR_DATE_INTERVAL',
            type: 'numberIncrement',
            title: 'Дата передачи документов не позднее ( дней ):'
        },
        {
            key: 'REESTR_COPY_COUNT',
            type: 'numberIncrement',
            title: 'Количество копий:'
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
