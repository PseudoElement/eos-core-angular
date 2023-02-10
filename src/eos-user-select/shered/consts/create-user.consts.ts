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
        controlType: E_FIELD_TYPE.autosearch,
        key: 'DUE_DEP_NAME',
        label: 'ДОЛЖНОСТНОЕ ЛИЦО',
        value: '',
        options: []
    },
    {
        controlType: E_FIELD_TYPE.select,
        key: 'USER_TYPE',
        label: 'Тип пользователя:',
        options: [],
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.select,
        key: 'SELECT_ROLE',
        label: 'РОЛЬ',
        options: [],
        required: true,
    },
    {
        controlType: E_FIELD_TYPE.string,
        key: 'USER_COPY',
        label: 'Скопировать настройки от:',
        value: '',
    },
    {
        controlType: E_FIELD_TYPE.select,
        key: 'USER_TEMPLATES',
        label: 'Шаблон:',
        options: [],
        default: '...'
    },
];

export const OPEN_CLASSIF_DEPARTMENT: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    id: '0.',
    skipDeleted: false,
    selectMulty: true,
    selectLeafs: true,
    selectNodes: false,
};
export const OPEN_CLASSIF_USER_CL: IOpenClassifParams = {
    classif: 'USER_CL',
    selectMulty: false,
    can_tech: true,
};

export const OPEN_CLASSIF_DOCGR: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    selectMulty: true,
    return_due: true,
    skipDeleted: false,
};

export const OPEN_CLASSIF_LINK_CL: IOpenClassifParams = {
    classif: 'LINK_CL',
    selectMulty: true,
    selected: '',
};

export const OPEN_CLASSIF_SECURITY_CL: IOpenClassifParams = {
    classif: 'SECURITY_CL',
    selectMulty: true,
    selected: '',
};
// Выбор из организаций
export const OPEN_CLASSIF_ORGANIZ_CL: IOpenClassifParams = {
    classif: 'CONTACT',
    selectMulty: false,
    selectLeafs: false,
    selectNodes: true,
    return_due: true,
};
export const OPEN_CLASSIF_ORGANIZ_CL_PARTIC: IOpenClassifParams = {
    classif: 'CONTACT',
    selectMulty: false,
    selectLeafs: true,
    selectNodes: false,
    skipDeleted: true,
    return_due: true,
};
export const OPEN_CLASSIF_DEPARTMENT_SEV: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    id: '0.',
    skipDeleted: true,
    selectMulty: false,
    selectLeafs: true,
    selectNodes: false,
};
export const OPEN_CLASSIF_DEPARTMENT_SEV_FULL: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    id: '0.',
    skipDeleted: true,
    selectMulty: false,
};

export const OPEN_CLASSIF_DOCGR_SEV: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    selectMulty: false,
    return_due: true,
    skipDeleted: true,
};

export const OPEN_CLASSIF_DOCGR_LEAFS: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    return_due: true,
    skipDeleted: true,
    selectLeafs: true,
    selectNodes: false,
    selectMulty: false,
};
