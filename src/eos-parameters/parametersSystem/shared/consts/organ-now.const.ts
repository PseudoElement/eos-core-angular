import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const ORGAN_PARAM: IBaseParameters = {
    id: 'now-organiz',
    apiInstance: 'DELO_OWNER(-99)',
    title: 'Текущая организация',
    fields: [
        {
            key: 'NAME',
            type: 'string',
            readonly: true,
            title: 'Наименование'
        },
        {
            key: 'ORG',
            type: 'string',
            readonly: true,
            title: 'Организации'
        },
        {
            key: 'INDEX',
            type: 'string',
            readonly: true,
            title: 'Индекс'
        },
        {
            key: 'ADDRES',
            type: 'string',
            readonly: true,
            title: 'Адрес'
        },
        {
            key: 'INN',
            type: 'string',
            readonly: true,
            title: 'ИНН'
        },
        {
            key: 'OKPO',
            type: 'string',
            readonly: true,
            title: 'ОКПО'
        },
        {
            key: 'OKVED',
            type: 'string',
            readonly: true,
            title: 'ОКВЭД'
        },
        {
            key: 'ORG_ID',
            type: 'string',
            readonly: true,
            title: 'Идент. №'
        },
        {
            key: 'ISN_ORGANIZ',
            type: 'string',
            readonly: true,
            title: 'ISN_ORGANIZ'
        },
    ]
};
