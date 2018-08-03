import { IBaseParameters } from './../interfaces/parameters.interfaces';
export const CONTEXT_RC_PARAM: IBaseParameters = {
    id: 'context-rc',
    apiInstance: 'USER_PARMS',
    title: 'Контекст РК(РКПД)',
    // disabledFields: [
    //     '',
    //     '',
    //     '',
    //     '',
    //     '',
    //     '',
    //     '',
    //     '',
    //     ''
    // ],
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
    ]
};
