import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const CONTEXT_RC_PARAM: IBaseParameters = {
    id: 'context-rc',
    apiInstance: 'USER_PARMS',
    title: 'Контекст РК(РКПД)',
    fields: [
        {
            key: 'DOC_RC',
            type: 'boolean',
            title: 'Основные реквизиты РК'
        },
        {
            key: 'DOC_REF_FILE',
            type: 'boolean',
            title: 'Файлы'
        },
        {
            key: 'REF_SEND',
            type: 'boolean',
            title: 'Адресаты'
        },
        {
            key: 'JOURNAL',
            type: 'boolean',
            title: 'ЖПД'
        },
        {
            key: 'DOC_REF_RUBRIC',
            type: 'boolean',
            title: 'Рубрики'
        },
        {
            key: 'DOC_REF_LINK',
            type: 'boolean',
            title: 'Связки'
        },
        {
            key: 'ACQUAINTANCE',
            type: 'boolean',
            title: 'Журнал ознакомления с документом'
        },
        {
            key: 'FORWARD',
            type: 'boolean',
            title: 'Журнал пересылок'
        },
        {
            key: 'AR_RC_VALUE',
            type: 'boolean',
            title: 'Дополнительные реквизиты РК'
        },
        {
            key: 'ITEMS',
            type: 'boolean',
            title: 'Пункты'
        },
        {
            key: 'RESOLUTION',
            type: 'radio',
            title: 'Резолюции',
            options: [
                {value: 'RESOLUTION_ALL', title: 'Все'},
                {value: 'RESOLUTION_FIRST', title: 'Первого уровня'}
            ]
        },
        {
            key: 'REF_CORRESP1',
            type: 'boolean',
            title: 'Корреспонденты'
        },
        {
            key: 'REF_CORRESP2',
            type: 'boolean',
            title: 'Сопроводительные документы'
        },
        {
            key: 'REF_VISA',
            type: 'boolean',
            title: 'Визы'
        },
        {
            key: 'DOC_SIGN',
            type: 'boolean',
            title: 'Подписал'
        },
        {
            key: 'DOC_WHO',
            type: 'boolean',
            title: 'Кому(адресован)'
        },
        {
            key: 'REF_SOISP',
            type: 'boolean',
            title: 'Соисполнители'
        },
        {
            key: 'DOC_EXE',
            type: 'boolean',
            title: 'Исполнитель'
        },
        {
            key: 'PRJ_RC', // PRJ_RC
            type: 'boolean',
            title: 'Основные реквизиты РКПД'
        },
        {
            key: 'PRJ_REF_FILE',
            type: 'boolean',
            title: 'Файлы РКПД'
        },
        {
            key: 'PRJ_REF_SEND',
            type: 'boolean',
            title: 'Адресаты'
        },
        {
            key: 'PRJ_REF_RUBRIC',
            type: 'boolean',
            title: 'Рубрики'
        },
        {
            key: 'PRJ_REF_LINK',
            type: 'boolean',
            title: 'Связки'
        },
        {
            key: 'PRJ_FORUM',
            type: 'boolean',
            title: 'Обсуждение'
        },
        {
            key: 'PRJ_EXEC',
            type: 'boolean',
            title: 'Исполнители'
        },
        {
            key: 'PRJ_VISA',
            type: 'boolean',
            title: 'Визы'
        },
        {
            key: 'PRJ_SIGN',
            type: 'boolean',
            title: 'Подписи'
        },
        {
            key: 'AR_PRJ_VALUE',
            type: 'boolean',
            title: 'Дополнительные реквизиты РКПД'
        },
    ]
};
