export interface IModesUserSelect {
    key: E_MODES_USER_SELECT;
    title: string;
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
    Department?: IUserCheckSort;
    Official?: IUserCheckSort;
    Tip?: IUserCheckSort;
    Login?: IUserCheckSort;
}

export interface IUserCheckSort {
    upDoun: boolean;
    checked: boolean;
}
export enum SortsList {department, official, tip, login}
