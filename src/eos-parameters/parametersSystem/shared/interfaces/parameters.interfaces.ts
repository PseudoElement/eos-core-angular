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

export interface IBaseParameters {
    id: string;
    apiInstance: string;
    title: string;
    disabledFields?: string[];
    visible?: boolean;
    actions?: string[];
    fieldsChild?: any; // IFieldDescriptor[];
    fields?: any; // IFieldDescriptor[];
}


export interface ISelectOption {
    value: string | number;
    title: string;
}
