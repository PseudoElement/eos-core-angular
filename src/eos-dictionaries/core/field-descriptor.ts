import { IFieldDescriptor, IFieldDescriptorBase, E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { ISelectOption } from 'eos-common/interfaces';

export class FieldDescriptor implements IFieldDescriptorBase {
    readonly key: string;
    readonly title: string;
    readonly type: E_FIELD_TYPE;
    readonly length?: number;
    readonly format?: string;
    readonly foreignKey?: string;
    readonly pattern?: RegExp;
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

    constructor(data: IFieldDescriptor) {
        if (data.key) {
            this.key = data.key;
            this.title = data.title;
            this.type = E_FIELD_TYPE[data.type];
            this.foreignKey = data.foreignKey;
        }

        if (data.length) {
            this.length = data.length;
        }

        if (data.format) {
            this.format = data.format;
        }

        if (data.pattern) {
            this.pattern = data.pattern;
        }

        this.required = !!data.required;

        this.isUnique = !!data.isUnique;

        this.uniqueInDict = !!data.uniqueInDict;

        if (data.options) {
            this.options = data.options;
        }

        if (data.height) {
            this.height = data.height;
        }

        this.forNode = data.forNode;
        this.default = data.default;
        this.dictionaryId = data.dictionaryId;

        this.password = !!data.password;
        if (data.groupLabel) {
            this.groupLabel = data.groupLabel;
        }
    }
}
