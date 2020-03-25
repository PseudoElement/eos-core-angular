import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const SETTINGS_MANAGEMENT_INPUTS = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '1',
        label: 'Абсолютные права',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '2',
        label: 'включая личные права',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '3',
        label: 'Картотечные права',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '4',
        label: 'включая все картотеки',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '5',
        label: 'Параметры',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '6',
        label: 'Списки справочников',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '7',
        label: 'Права поточного сканирования',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '8',
        label: 'Списки стандарных текстов',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '9',
        label: 'Личные папки',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'USER_COPY',
        label: 'Скопировать выбранным пользователям настройки от:',
        value: '',
    },
];

export const CUT_RIGHTS_INPUTS = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '1',
        label: 'Права "Дело" (абсолютные и картотечные)',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: '2',
        label: 'Права системного технолога',
        value: false,
    },
];
