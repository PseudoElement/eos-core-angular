export interface IParamBese {
    id: string;
    apiInstance: string;
    title: string;
    fields: IParamInput[];
}

export interface IParamInput {
    key?: string;
    type: string;
    title: string;
    length?: number;
}
