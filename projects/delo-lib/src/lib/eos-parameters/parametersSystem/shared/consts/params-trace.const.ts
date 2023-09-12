import { InputBase } from "eos-common/core/inputs/input-base";
import { IBaseParameters } from "../interfaces/parameters.interfaces";
import { IUploadParam } from "../../../interfaces/app-setting.interfaces";
import { AppsettingsParams, AppsettingsTypename } from "../../../../eos-common/consts/params.const";

export const PARAMS: IBaseParameters = {
    id: 'protocol-of-requests',
    apiInstance: 'APP_SETTINGS',
    title: 'Трассировка запросов',
    fields: []
};

export const TRACE_PARAMS: InputBase<string>[] = [{
    controlType: 3,
    readonly: false,
    key: 'TRACE_PARAMS',
    value: '',
    required: false,
    isUnique: false,
    disabled: false,
    dict: 'rec',
    forNode: undefined,
    hideLabel: false,
    label: 'ПАРАМЕТРЫ',
    order: undefined,
    pattern: null,
    unique: undefined,
    uniqueInDict: false
}]

export const UPLOAD_PARAMS: IUploadParam = {
    namespace: AppsettingsParams.LogginManager,
    typename: AppsettingsTypename.TFilterSettings,
    instance: 'Default'
  }