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
            key: 'REF_CORRESP1',
            type: 'boolean',
            title: 'REF_CORRESP1'
        },
        {
            key: 'REF_CORRESP2',
            type: 'boolean',
            title: 'REF_CORRESP2'
        },
        {
            key: 'REF_VISA',
            type: 'boolean',
            title: 'REF_VISA'
        },
        {
            key: 'DOC_SIGN',
            type: 'boolean',
            title: 'DOC_SIGN'
        },
        {
            key: 'DOC_WHO',
            type: 'boolean',
            title: 'DOC_WHO'
        },
        {
            key: 'REF_SOISP',
            type: 'boolean',
            title: 'REF_SOISP'
        },
        {
            key: 'DOC_EXE',
            type: 'boolean',
            title: 'DOC_EXE'
        },
        {
            key: 'PRJ_RC', // PRJ_RC
            type: 'boolean',
            title: 'PRJ_RC'
        },
        {
            key: 'PRJ_REF_FILE',
            type: 'boolean',
            title: 'PRJ_REF_FILE'
        },
        {
            key: 'PRJ_REF_SEND',
            type: 'boolean',
            title: 'PRJ_REF_SEND'
        },
        {
            key: 'PRJ_REF_RUBRIC',
            type: 'boolean',
            title: 'PRJ_REF_RUBRIC'
        },
        {
            key: 'PRJ_REF_LINK',
            type: 'boolean',
            title: 'PRJ_REF_LINK'
        },
        {
            key: 'PRJ_FORUM',
            type: 'boolean',
            title: 'PRJ_FORUM'
        },
        {
            key: 'PRJ_EXEC',
            type: 'boolean',
            title: 'PRJ_EXEC'
        },
        {
            key: 'PRJ_VISA',
            type: 'boolean',
            title: 'PRJ_VISA'
        },
        {
            key: 'PRJ_SIGN',
            type: 'boolean',
            title: 'PRJ_SIGN'
        },
        {
            key: 'AR_PRJ_VALUE',
            type: 'boolean',
            title: 'AR_PRJ_VALUE'
        },
    ]
};
