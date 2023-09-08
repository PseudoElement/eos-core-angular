import { InputBase } from "eos-common/core/inputs/input-base";
import { IBaseParameters } from "../interfaces/parameters.interfaces";

export const PARAMS: IBaseParameters = {
    id: 'protocol-of-requests',
    apiInstance: 'APP_SETTINGS',
    title: 'Протоколирование запросов',
    fields: []
};

export const PROTOCOL_OF_REQUESTS_PARAMS: InputBase<string>[] = [{
    controlType: 3,
    readonly: false,
    key: 'PROTOCOL_PARAMS',
    value: '',
    required: true,
    isUnique: false,
    disabled: false,
    dict: 'rec',
    forNode: undefined,
    hideLabel: false,
    label: 'ПАРАМЕТРЫ ПРОТОКОЛИРОВАНИЯ',
    order: undefined,
    pattern: null,
    unique: undefined,
    uniqueInDict: false
}]
