import { E_FIELD_TYPE } from 'eos-parameters/parametersSystem/shared/interfaces/parameters.interfaces';

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
}

export interface ISelectOptionControl {
    value: string | number;
    title: string;
}
