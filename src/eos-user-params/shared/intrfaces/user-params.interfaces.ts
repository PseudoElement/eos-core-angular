

export interface IBaseUsers {
    id: string;
    apiInstance: string;
    title: string;
    disabledFields?: string[];
    visible?: boolean;
    actions?: string[];
    fieldsChild?: any; // IFieldDescriptor[];
    fields?: any; // IFieldDescriptor[];
    fieldsTemplates?: any; // IFieldDescriptor[];
    fieldsDefaultValue?: any; // IFieldDescriptor[];
    fieldsCurrentValue?: any; // IFieldDescriptor[];
}

export interface ISelectOption {
    value: string | number;
    title: string;
}

export interface IParamAccordionList {
    title: string;
    url?: string;
    subList?: IParamAccordionList[];
    isOpen?: boolean;
    disabled?: boolean;
}
