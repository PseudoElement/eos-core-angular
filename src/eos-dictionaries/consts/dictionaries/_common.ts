import { IFieldDescriptor, IFieldPreferences } from 'eos-dictionaries/interfaces';
import { NOT_EMPTY_STRING } from 'eos-common/consts/common.consts';

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
    pattern: NOT_EMPTY_STRING,
    // isUnique: true,
    // uniqueInDict: true,
};

export const COMMON_FIELD_FULLNAME: IFieldDescriptor = {
    key: 'FULLNAME',
    title: 'Полное наименование',
    type: 'text',
    length: 250,
    pattern: NOT_EMPTY_STRING,
};

export const COMMON_FIELD_NOTE = {
    key: 'NOTE',
    title: 'Примечание',
    type: 'text',
    length: 250,
};

export const ICONS_CONTAINER = 'ICONS_TYPE';
export const COMMON_FIELD_ICONS = {
    key: ICONS_CONTAINER,
    title: 'Тип',
    type: 'icon',
    length: 5,
};

export const COMMON_FIELD_ICONS_SEV = Object.assign({}, COMMON_FIELD_ICONS, {
        title: '',
        preferences: <IFieldPreferences>{
            noLeftPadding: true,
        }
});

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
