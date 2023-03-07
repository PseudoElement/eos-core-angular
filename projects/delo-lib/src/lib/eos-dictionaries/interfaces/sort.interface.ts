export interface IOrderBy {
    fieldKey: string;
    ascend: boolean;
}

export interface IDictionaryOrder {
    [dictionaryId: string]: IOrderBy;
}
