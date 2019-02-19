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
export enum E_RIGHT_SIDE_DOC_GROUP_IN_FILE_CARD_ACCESS_CONTENT {
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
export interface IChengeItemInFileCard {
    method: 'POST'|'DELETE'|'MERGE';
    data: any;
    due_card?: string;
    due?: string;
    user_cl?: boolean;
    funcNum?: number;
}
