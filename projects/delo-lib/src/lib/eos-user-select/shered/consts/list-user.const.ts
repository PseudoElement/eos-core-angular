import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';

export enum UsersTypeTabs{
    AllUsers = 'AllUsers',
    MyUsers = 'MyUsers'
}
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

export const USERS_TYPE_TO_TECH_ADMIN_TABS = [
    {
        text: 'Все',
        value: UsersTypeTabs.AllUsers
    },
    {
        text: 'Мои пользователи',
        value: UsersTypeTabs.MyUsers
    }
]