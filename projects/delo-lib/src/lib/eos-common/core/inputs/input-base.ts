import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { DynamicInputBaseDirective } from '../../../eos-common/dynamic-form-input/dynamic-input-base';

export class InputBase<T> {
    value: T;
    key: string;
    dict: string;
    label: string;
    required: boolean;
    order: number;
    controlType: E_FIELD_TYPE;
    pattern: RegExp;
    readonly: boolean;
    isUnique: boolean;
    unique: boolean;
    uniqueInDict: boolean;
    hideLabel: boolean;
    forNode: boolean;
    options?: any[];
    disabled?: boolean;
    length?: number;
    password?: boolean;
    groupLabel?: string;
    isGroup?: boolean;
    formatDbBinary?: boolean;
    minValue?: number;
    maxValue?: number;
    dib?: DynamicInputBaseDirective;
    descriptor?: any;
    customTooltip?: string;
    hideTooltip?: boolean;
    constructor(options: {
        value?: T,
        key?: string,
        dict?: string,
        label?: string,
        required?: boolean,
        order?: number,
        controlType?: string,
        pattern?: RegExp,
        readonly?: boolean,
        isUnique?: boolean,
        uniqueInDict?: boolean,
        unique?: boolean,
        hideLabel?: boolean,
        forNode?: boolean,
        options?: any[],
        disabled?: boolean,
        length?: number,
        password?: boolean,
        groupLabel?: string,
        isGroup?: boolean,
        formatDbBinary?: boolean,
        minValue?: number;
        maxValue?: number;
        customTooltip?: string;
        hideTooltip?: boolean;
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.dict = options.dict || 'rec';
        this.label = options.label || '';
        this.required = !!options.required;
        this.order = options.order === undefined ? 1 : options.order;
        if (E_FIELD_TYPE[options.controlType]) {
            this.controlType = E_FIELD_TYPE[options.controlType] || E_FIELD_TYPE.string;
        }
        this.pattern = options.pattern || null;
        this.readonly = !!options.readonly;
        this.formatDbBinary = options.formatDbBinary;
        this.isUnique = !!options.isUnique;
        this.uniqueInDict = !!options.uniqueInDict;
        this.hideLabel = !!options.hideLabel;
        this.forNode = options.forNode;
        this.disabled = !!options.disabled;
        this.length = options.length;
        this.password = options.password;
        this.groupLabel = options.groupLabel;
        this.isGroup = options.isGroup;
        this.minValue = options.minValue;
        this.maxValue = options.maxValue;
        this.unique = options?.unique;
        this.customTooltip = options?.customTooltip;
        this.hideTooltip = options?.hideTooltip;
    }
}
