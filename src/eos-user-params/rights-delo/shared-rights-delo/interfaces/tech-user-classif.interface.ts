import { IOpenClassifParams } from 'eos-common/interfaces';

export enum E_TECH_USER_CLASSIF_CONTENT {
    none,
    limitation,
    rubric,
    docGroup,
    department
}
export interface ITechUserClassifConst {
    key: number;
    label: string;
    expandable: E_TECH_USER_CLASSIF_CONTENT;
}
export interface IConfigUserTechClassif {
    apiInstance: 'DEPARTMENT' | 'DOCGROUP_CL' | 'RUBRIC_CL';
    waitClassif: IOpenClassifParams;
    label: 'CLASSIF_NAME' | 'CARD_NAME';
}
