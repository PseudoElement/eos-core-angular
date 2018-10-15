import { SEARCH_TYPES } from '../consts/search-types';
import { ISelectOption } from 'eos-common/interfaces';

export enum E_DEPT_MODE {
    person,
    department,
    cabinet
}

export enum E_DICT_TYPE {
    linear,
    tree,
    department
}

export enum E_FIELD_SET {
    tree,
    list,
    info,
    shortQuickView,
    search,
    fullSearch,
    edit,
    allVisible
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
    xml
}

export interface IFieldDescriptor {
    key: string;
    title: string;
    type: string;
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
    dictionaryId?: string;
    password?: boolean;
    groupLabel?: string;
}

export interface IFieldDescriptorBase {
    readonly key: string;
    readonly title: string;
    customTitle?: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
    readonly foreignKey?: string;
    pattern?: RegExp;
    readonly required?: boolean;
    readonly isUnique?: boolean;
    readonly uniqueInDict?: boolean;
    readonly options?: ISelectOption[];
    readonly height?: number;
    readonly forNode?: boolean;
    readonly default?: any;
    readonly dictionaryId?: string;
    readonly password?: boolean;
    readonly groupLabel?: string;
}

export interface IFieldView extends IFieldDescriptorBase {
    value: any;
}

export interface IDictionaryDescriptor {
    id: string;
    dictType: E_DICT_TYPE;
    apiInstance: string;
    title: string;
    visible?: boolean;
    actions: string[];
    fields: IFieldDescriptor[];
    keyField: string;
    defaultOrder: string;
    parentField?: string;
    iconName: string;

    // listFields: string[];
    searchFields: string[];
    searchConfig: SEARCH_TYPES[];
    allVisibleFields: string[];
    treeFields: string[];

    /* abstract field sets, depend on dictionary type */
    fullSearchFields: any;
    quickViewFields: any;
    shortQuickViewFields: any;
    editFields: any;
    listFields: any;

    hideTopMenu?: boolean;
}

export interface ITreeDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
}

/* mode for department-like ditionary */
export interface IRecordMode {
    [mode: string]: string[];
}

export interface IRecordModeDescription {
    key: string;
    title: string;
}

export interface IDepartmentDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    modeField: string;
    modeList: IRecordModeDescription[];
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];
    fullSearchFields: IRecordMode;
}
