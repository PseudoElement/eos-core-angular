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
