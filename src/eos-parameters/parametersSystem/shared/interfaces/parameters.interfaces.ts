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
    visible?: boolean;
    actions?: string[];
    fields: IFieldDescriptor[];
}

export interface IFieldDescriptor {
    key?: string;
    title: string;
    type: string;
    length?: number;
    format?: string;
    foreignKey?: string;
    pattern?: RegExp;
    required?: boolean;
    isUnique?: boolean;
    uniqueInDict?: boolean;
    options?: ISelectOption[];
    height?: number;
    forNode?: boolean;
    default?: any;
}

export interface ISelectOption {
    value: string | number;
    title: string;
}

export enum E_FIELD_TYPE {
    string,
    number,
    photo,
    text,
    date,
    icon,
    boolean,
    buttons,
    dictionary,
    select,
    array,
    toggle,
    numberIncrement
}
