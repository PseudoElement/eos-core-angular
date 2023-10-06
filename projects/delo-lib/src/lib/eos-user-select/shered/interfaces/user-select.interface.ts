import { UsersTypeTabs } from "../consts/list-user.const";

export interface IModesUserSelect {
    key: E_MODES_USER_SELECT;
    title: string;
    tooltip?: string;
}
export enum E_MODES_USER_SELECT {
    department,
    card,
    organiz
}
export interface IConfig {
    shooseTab: number;
    titleDue: string;
}
export interface IUserSort {
    department?: IUserCheckSort;
    fullDueName?: IUserCheckSort;
    tip?: IUserCheckSort;
    login?: IUserCheckSort;
    surnamePatron?:IUserCheckSort;
}

export interface IUserCheckSort {
    upDoun: boolean;
    checked: boolean;
}
export type IUsersTypeTabsVisibility = {
    [UsersTypeTabs.AllUsers]: boolean,
    [UsersTypeTabs.MyUsers]: boolean
} | null
export enum SortsList {department, fullDueName, tip, login, surnamePatron}
