import { IBaseUsers } from "../../../shared/intrfaces/user-params.interfaces";

export interface TreeItem {
    title: string;
    key: string;
    isOpen: boolean;
    children: Array<any>;
    parent?: TreeItem;
    readonly?: boolean;
}

export interface Accordion {
    title: string;
    tree: TreeItem[];
}

export interface ConfigChannelCB {
    nameEN: string;
    nameRU: string;
    fieldsConst: IBaseUsers;
    fieldsConstMailResive?: IBaseUsers;
}
