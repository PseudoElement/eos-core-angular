import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IOpenClassifParams } from 'eos-common/interfaces';

export const CREATE_USER_INPUTS = [
    {
        controlType: E_FIELD_TYPE.string,
        key: 'classifName',
        label: 'ЛОГИН',
        required: true,
        // pattern: /\S+/,
        // forNode: false,
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.boolean,
        key: 'teсhUser',
        label: 'Технический пользователь',
        value: false,
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_ROLE',
        label: 'РОЛЬ',
        options: [],
    },
];

export const OPEN_CLASSIF_DEPARTMENT: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    id: '0.',
    skipDeleted: true,
    selectMulty: false,
    selectLeafs: true,
    selectNodes: false,
};
