

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
    /** открытие через шестерёнку */
    arm?: boolean;
    /** Открытие из толстяка из пользователей */
    tk?: boolean;
    /** Отркытие из толстяка из документов */
    tkDoc?: boolean;
    /** специальный канал для ЦБ называется ARMCBR */
    cbr?: boolean;
    /** Параметр который говорит что параметр mode был передан */
    hasMode?: boolean;
    /** Канал на который нужно перейти во Внешнием обмене  */
    extExchParams?: number;
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