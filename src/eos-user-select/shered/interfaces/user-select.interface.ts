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
    department?: IUserCheckSort;
    official?: IUserCheckSort;
    tip?: IUserCheckSort;
    login?: IUserCheckSort;
}

export interface IUserCheckSort {
    upDoun: boolean;
    checked: boolean;
}
export enum SortsList {Department, Official, Tip, Login}
