import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';
import { USER_CL } from 'eos-rest';

export interface IInputParamControl {
    controlType: E_FIELD_TYPE;
    key?: string;
    value?: any;
    dict?: string;
    label?: string;
    required?: boolean;
    order?: number;
    length?: number;
    pattern?: RegExp;
    readonly?: boolean;
    isUnique?: boolean;
    uniqueInDict?: boolean;
    hideLabel?: boolean;
    forNode?: boolean;
    options?: ISelectOptionControl[];
    disabled?: boolean;
    data?: any;
}

export interface ISelectOptionControl {
    value: string | number;
    title: string;
}

export interface IParamUserCl extends USER_CL {
    DUE_DEP_NAME?: string;
    isTechUser?: boolean;
    isAccessDelo?: boolean;
    ACCESS_SYSTEMS?: string[];
}
export interface IListDocsTree {
    DUE: string;
    label: string;
    allowed: boolean;
}
