import { ISelectOption } from '../../interfaces';

export interface IBaseInput {
    controlType?: string;
    key?: string;
    value?: any;
    dict?: string;
    label?: string;
    required?: boolean;
    order?: number;
    pattern?: RegExp;
    readonly?: boolean;
    isUnique?: boolean;     // Значение должно быть уникальным в пределах вершины.
    uniqueInDict?: boolean; // Значение должно быть уникальным в пределах справочника.
    unique?: boolean;
    hideLabel?: boolean;
    forNode?: boolean;
    options?: any[];
    disabled?: boolean;
    password?: boolean;
    groupLabel?: string;
    minValue?: number;
    maxValue?: number;
    length?: number;
}

export interface ISelectInput extends IBaseInput {
    options: ISelectOption[];
}

export interface ICheckboxInput extends IBaseInput {
    disabled: boolean;
    value: boolean;
}
