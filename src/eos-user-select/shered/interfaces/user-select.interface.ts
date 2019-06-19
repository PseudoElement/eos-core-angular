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
}

export interface IUserCheckSort {
    upDoun: boolean;
    checked: boolean;
}
export enum SortsList {department, fullDueName, tip, login}
