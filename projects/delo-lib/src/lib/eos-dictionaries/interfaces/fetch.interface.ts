
export interface DeleteGroupDoc {
    isnFileCategory: number;
    isnNodeDg: number;
}

export interface METADATA {
    __type: string;
}

export interface RELFIELD {
    DUE_NODE_DG?: null | string;
}

export interface DgFileCategoryElement {
    CompositePrimaryKey: string;
    DUE_NODE_DG: string;
    ISN_FILE_CATEGORY: number;
    ISN_NODE_DG: number;
    __metadata: METADATA;
}

export interface ORIG {
    CLASSIF_NAME: string;
    DELETED: number;
    DG_FILE_CATEGORY_List: DgFileCategoryElement[];
    ISN_LCLASSIF: number;
    NAME: string;
    NOTE: string;
    PROTECTED: number;
    WEIGHT: string;
    __metadata: METADATA;
}

export interface REC extends ORIG {
    DOC_GROUP_NAMES: string;
    _orig: ORIG;
}

export interface ORIGINDATA {
    DG_FILE_CATEGORY_List: DgFileCategoryElement[];
    allOwner: undefined;
    rec: REC;
    updateTrules: any[];
    __relfield: RELFIELD;
}

export interface ResponseGraphQL {
    data: ResponseData;
}

export interface ResponseData {
    deleteDgFileCategory: ResponseFecth;
}

export interface ResponseFecth {
    clientMutationId?: string | null;
    message?: string | null;
    messageCode?: string | null;
    messageData?: string | null;
    systemMessage?: string | null;
    success: boolean;
}

export interface ErrFech {
    message: string;
    stack: string;
}
