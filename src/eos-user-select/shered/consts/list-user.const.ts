import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

export const LIST_USER_CABINET = [
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'CHECK_ALL_CARTOTEC',
        label: 'Учитывать право \'Поиск по всем картотекам\'',
        value: true,
    },

    {
        controlType: E_FIELD_TYPE.select,
        key: 'USER_CABINET',
        options: [],
        default: 'Все кабинеты'
    },
];
