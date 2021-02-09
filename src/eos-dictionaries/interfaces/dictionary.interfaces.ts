import { SEARCH_TYPES } from '../consts/search-types';
import { ISelectOption } from 'eos-common/interfaces';

export enum E_DEPT_MODE {
    person,
    department,
    cabinet
}

export enum E_DICT_TYPE {
    organiz,
    linear,
    tree,
    department,
    custom,
    form,
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
export enum E_VISIBLE_TIPE {
    all,
    onlyNode,
    onlyChild,
    fromParentIfNode,
}
export enum E_FIELD_TYPE {
    string,
    number,
    photo,
    text,
    date,
    icon,
    icon_sev,
    boolean,
    buttons,
    dictionary,
    select, // Generic select
    array,
    xml,
    toggle,
    numberIncrement,
    radio,
    dictLink,
    select2, // Select by angular component
    new,
}

export interface IDictionaryLink {
    pk: string;
    fk: string;
    label: string;
}

export interface IFieldPreferences {
    minColumnWidth?: number; /* node-list style: min-width.px */
    hasIcon?: boolean; /* flag for enable icon (department, docgroups) */
    noLeftPadding?: boolean; /* flag for icons without padding (ex: sev) */
    inline?: boolean; /* if true - hedden in customisable columns */
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
    vistype?: E_VISIBLE_TIPE;
    default?: any;
    dictionaryId?: string;
    dictionaryLink?: IDictionaryLink;
    dictionaryOrder?: string;
    password?: boolean;
    groupLabel?: string;
    minValue?: number;
    maxValue?: number;
    parent?: any;
    keyPosition?: number| string;
    preferences?: IFieldPreferences;
    readonly?: boolean;
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
    readonly vistype?: E_VISIBLE_TIPE;
    readonly default?: any;
    readonly dictionaryId?: string;
    readonly password?: boolean;
    readonly groupLabel?: string;
    readonly dictionaryLink?: IDictionaryLink;
    readonly dictionaryOrder?: string;
    readonly preferences: IFieldPreferences;
}

export interface IFieldView extends IFieldDescriptorBase {
    value: any;
}

export interface IDictionaryDescriptor {
    id: string;
    isFolder?: boolean;
    folder?: string; // dict folder (ex, nadzor, sev). root, if null or undefined
    dictType: E_DICT_TYPE;
    apiInstance: string;
    title: string;
    modeList?: IRecordModeDescription[];
    visible?: boolean; // in all-list
    actions: string[];
    fields: IFieldDescriptor[];
    keyField: string;
    defaultOrder: string;
    parentField?: string;
    iconName: string;

    // listFields: string[];
    searchFields: string[];
    searchConfig: SEARCH_TYPES[];
    /** customize view fields */
    allVisibleFields: string[];
    treeFields: string[];

    /** abstract field sets, depend on dictionary type */
    fullSearchFields: any;
    quickViewFields: any;
    shortQuickViewFields: any;
    /** fields for based edit */
    editFields: any;
    /** pinned fields */
    listFields: any;

    hideTopMenu?: boolean;
    editOnlyNodes?: boolean;
    showDeleted?: boolean;
}

export interface ITreeDictionaryDescriptor extends IDictionaryDescriptor {
    parentField: string;
    quickViewFields: string[];
    shortQuickViewFields: string[];
    editFields: string[];
    listFields: string[];

}

export interface IFormDictionaryDescriptor extends IDictionaryDescriptor {
    dictType: E_DICT_TYPE.form;

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
