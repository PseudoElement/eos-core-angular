export interface IPaginationUserConfig {
    start: number;
    length: number;
    current: number;
    itemsQty: number;
    showMore?: boolean;
}

export interface IPageUserLength {
    title: string;
    value: number;
}
