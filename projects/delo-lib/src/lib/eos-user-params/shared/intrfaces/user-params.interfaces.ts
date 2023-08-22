

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
    hidden?: boolean;
}

export interface IUserSettingsModes {
    arm?: boolean;
    tk?: boolean;
    tkDoc?: boolean;
    cbr?: boolean;
    hasMode?: boolean;
}

export interface ISelectedUserSumProtocol{
    checked: boolean
    date: string
    eventUser: string
    id: number
    isnEvent: number
    isnUser: string
    isnWho: string
}

export interface ISelectedUserProtocol extends ISelectedUserSumProtocol{
    itemsQty: number
    count: number
}