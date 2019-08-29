export interface IPaginationConfig {
    start: number;
    length: number;
    current: number;
    itemsQty: number;
    showMore?: boolean;
}

export interface IPageLength {
    title: string;
    value: number;
}
