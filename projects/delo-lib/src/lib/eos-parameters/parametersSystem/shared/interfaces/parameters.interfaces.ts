import { E_PARMS_PAGES } from "../consts/eos-parameters.const";
import { ITableData } from "./tables.interfaces";

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

export interface AdditionalInputs {
    input: string;
    readonly: boolean;
}
export enum APP_SETTINGS_SMS {
    namespace = "Eos.Platform.Settings.Sms",
    typename = "SmsCfg"
}

export interface AppSettingsSmsGateWay {
    ProfileName: string;
    Endpoint: string;
    Login: string;
    Password: AppSettingsPassword;
    UrlTemplate: string;
}

export interface AppSettingsPassword {
    Key: string | null;
    Value?: string | null
}

export type AppSettingsFields = string;

export interface ResultAppSettings {
    [key: string]: AnyType
    default?: AnyType
}

export interface AnyType {
    [key: string]: string | any;
}

export interface BaseTableData extends ITableData {
    data: BaseDataRow[]
}

export interface BaseDataRow {
    [key: string]: any,
    [num: number]: any,
    key: string | number
}
export enum DEFAULT_APP_SETTINGS_BTN {
    add = "add",
    edit = "edit",
    deleted = "deleted"
}

export interface IEosParametersTab {
    title: string
    url: E_PARMS_PAGES
    visible?: boolean
}