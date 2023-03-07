import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const ORGAN_PARAM: IBaseParameters = {
    id: 'now-organiz',
    apiInstance: 'DELO_OWNER(1)',
    title: 'Текущая организация',
    fields: [
        {
            key: 'NAME',
            type: 'string',
            readonly: true,
            title: 'Наименование',
            length: 255,
            required: true,
        },
        {
            key: 'FULLNAME',
            type: 'text',
            readonly: true,
            title: ''
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
            title: 'Идент. №',
            length: 64,
        },
        {
            key: 'ISN_ORGANIZ',
            type: 'string',
            readonly: true,
            title: 'ISN_ORGANIZ',
        },
    ]
};
