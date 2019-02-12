import { IOpenClassifParams } from 'eos-common/interfaces';

export const OPEN_CLASSIF_DEPARTMENT_FULL: IOpenClassifParams = {
    classif: 'DEPARTMENT',
    return_due: true,
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
};
export const OPEN_CLASSIF_DOCGROUP_CL_ONLI_NODE: IOpenClassifParams = {
    classif: 'DOCGROUP_CL',
    return_due: true,
    selectLeafs: false,
    selectNodes: true,
    selectMulty: true,
};
export const OPEN_CLASSIF_RUBRIC_CL_ONLI_NODE: IOpenClassifParams = {
    classif: 'RUBRIC_CL',
    return_due: true,
    selectLeafs: false,
    selectNodes: true,
    selectMulty: true,
};
export const OPEN_CLASSIF_CARDINDEX: IOpenClassifParams = {
    classif: 'CARDINDEX',
    return_due: true,
    selectMulty: true,
};
