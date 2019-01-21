export enum E_RIGHT_DELO_ACCESS_CONTENT {
    docGroup,
    docGroupCard,
    none,
    department,
    departmentCardAuthor,
    editOrganiz,
    classif,
    all,
    departmentCardAuthorSentProject,
}
export interface IChengeItemAbsolute {
    method: 'POST'|'DELETE'|'MERGE';
    data: any;
    due?: string;
    user_cl?: boolean;
    funcNum?: number;
}
