import { IOpenClassifParams } from '../../eos-common/interfaces';

export const OPEN_CLASSIF_ORGANIZ_FULL: IOpenClassifParams = {
    classif: 'CONTACT',
    return_due: true,
    skipDeleted: false,
    selectNodes: true,
    selectLeafs: true,
    selected: '',
};
export const OPEN_CLASSIF_DEPARTMENT_FULL: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    skipDeleted: false,
};
export const OPEN_CLASSIF_DEPARTMENT_SEND_CB: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    skipDeleted: false,
    selectLeafs: false,
};
export const OPEN_CLASSIF_DOCGROUP_CL: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    return_due: true,
    selectLeafs: true,
    selectNodes: true,
    selectMulty: true,
};
export const OPEN_CLASSIF_DEPARTMENT_ONLI_NODE: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
    selectLeafs: false,
    selectNodes: true,
    selectMulty: true,
    skipDeleted: false,
};
export const OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    return_due: true,
    selectLeafs: false,
    selectNodes: true,
    selectMulty: true,
    skipDeleted: false,
};
export const OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE: IOpenClassifParams = {
    classif: 'RUBRIC_CL',
    return_due: true,
    selectLeafs: false,
    selectNodes: true,
    selectMulty: true,
    skipDeleted: false,
};
export const OPEN_CLASSIF_CARDINDEX: IOpenClassifParams = {
    classif: 'CARDINDEX',
    return_due: true,
    selectMulty: true,
    skipDeleted: false,
};

export const OPEN_CLASSIF_DOCGROUP_FOR_FILE_CAT: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    selectMulty: true,
    selectLeafs: true,
    skipDeleted: false,
    return_due: true
};


