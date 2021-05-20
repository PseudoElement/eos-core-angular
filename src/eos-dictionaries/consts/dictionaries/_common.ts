import { IFieldDescriptor, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING, /* VALID_REQ_STRING, */ NOT_EMPTY_STRING2 } from 'eos-common/consts/common.consts';

export const COMMON_FIELD_CODE: IFieldDescriptor = {
    key: 'CODE',
    title: 'Код',
    type: 'string',
    length: 64,
    pattern: NOT_EMPTY_STRING,
    isUnique: true,
    uniqueInDict: true,
};

export const COMMON_FIELD_NAME: IFieldDescriptor = {
    key: 'CLASSIF_NAME',
    title: 'Наименование',
    type: 'string',
    length: 250,
    required: true,
    pattern: NOT_EMPTY_STRING2,
    // isUnique: true,
    // uniqueInDict: true,
};

export const COMMON_FIELD_FULLNAME: IFieldDescriptor = {
    key: 'FULLNAME',
    title: 'Полное наименование',
    type: 'text',
    length: 2000,
    pattern: NOT_EMPTY_STRING,
};

export const COMMON_FIELD_NOTE = {
    key: 'NOTE',
    title: 'Примечание',
    type: 'text',
    length: 255,
};

export const ICONS_CONTAINER = 'ICONS_TYPE';
export const COMMON_FIELD_ICONS = {
    key: ICONS_CONTAINER,
    title: 'Тип',
    type: 'icon',
    length: 5,
    preferences: <IFieldPreferences>{
        noLeftPadding: true,
    }
};

export const ICONS_CONTAINER_SEV = 'ICONS_TYPE_SEV';
export const COMMON_FIELD_ICONS_SEV = {
    key: ICONS_CONTAINER_SEV,
    title: '',
    type: 'icon_sev',
    length: 5,
    preferences: <IFieldPreferences>{
        noLeftPadding: true,
        inline: true,
    }
};

export const COMMON_FIELDS: IFieldDescriptor[] = [{
    key: 'DELETED',
    title: 'Признак удаления',
    type: 'boolean'
}, {
    key: 'PROTECTED',
    title: 'Защищен',
    type: 'number'
}, {
    key: 'WEIGHT',
    title: 'Вес',
    type: 'number'
},
    COMMON_FIELD_NOTE
];

export const DOP_REC = {
    rec: {
        text:  {
            foreignKey: 'text',
            title: '',
            type: 0,
            length: 255,
        },
        decimal: {
            foreignKey: 'decimal',
            type: 1,
            title: '',
            length: 255,
        },
        date: {
            foreignKey: 'date',
            title: '',
            type: 4,
        },
        flag:  {
            foreignKey: 'flag',
            title: '',
            type:  17,
            default: 1,
            options: [
                {
                    title: 'Да',
                    value: 1,
                },
                {
                    title: 'Нет',
                    value: 0
                }
            ],
        }
    }
};
