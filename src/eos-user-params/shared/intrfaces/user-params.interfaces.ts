

export interface IUserBese {
    id: string;
    apiInstance: string;
    title: string;
    fields: IUserInput[];
    fieldsTemplates: IUserInput[];
    fieldsDefaultValue: IUserInput[];
    fieldsCurrentValue: IUserInput[];
}

export interface IUserInput {
    key?: string;
    type: string;
    title: string;
    length?: number;
}

export interface IBaseUsers {
    id: string;
    apiInstance: string;
    title: string;
    disabledFields?: string[];
    visible?: boolean;
    actions?: string[];
    fieldsChild?: IFieldDescriptor[];
    fields?: IFieldDescriptor[];
    fieldsTemplates?: IFieldDescriptor[];
    fieldsDefaultValue?: IFieldDescriptor[];
    fieldsCurrentValue?: IFieldDescriptor[];
}

export interface IFieldDescriptor {
    key?: string;
    title: string;
    type: string;
    formatDbBinary?: boolean;
    readonly?: boolean;
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
    maxValue?: number;
    minValue?: number;
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
    xml,
    toggle,
    numberIncrement,
    radio,
}

export interface IParamAccordionList {
    title: string;
    url?: string;
    subList?: IParamAccordionList[];
    isOpen?: boolean;
}
