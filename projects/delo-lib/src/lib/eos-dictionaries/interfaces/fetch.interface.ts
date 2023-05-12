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

export interface ResponseProto {
        suboperId: string;
        operDescribe: string;
        operComment: string;
        isnProtInfo: number;
        userIsn: number;
        timeStamp: string
        tableId: string;
        refIsn: number
        operId: string
}

export interface SearchQueryOrganization {
    ISN_HIGH_NODE?: string;
    DUE?: string;
    LAYER?: string;
    branch: object;
    contact: object;
    medo: object;
    organiz: object;
    protocol: Protocol
}

export interface Protocol {
    FROM: string;
    OPER_DESCRIBE: string;
    TO: string;
    USER_ISN: number;
}

export interface ResponseProt {
    data: {
        protsPg: {
            items: ResponseProtItem[];
        }
    };
    errors?: any[];
}

export interface ResponseProtItem {
    suboperId: string;
    operDescribe: string;
    operComment: string;
    isnProtInfo: number |  null;
    userIsn: number;
    timeStamp: string
    tableId: string;
    refIsn: number;
    operId: string;
}

export interface ResponseOrganizationItems {
    due: string;
    isnNode: number;
    isnHighNode: number;
    layer: number;
    isNode: number;
    weight: number;
    classifName: string;
    classifNameSearch: string;
    protected: number;
    fullname: object,
    zipcode: string;
    city: string;
    address: string;
    note: object,
    okpo: object,
    inn: object,
    isnRegion: object,
    okonh: object,
    lawAdress: object,
    isnOrganizType: object,
    sertificat: object,
    isnAddrCategory: object,
    code: object,
    ogrn: object,
    termExec: object,
    termExecType: object,
    insDate: object,
    insWho: object,
    updDate: object,
    updWho: object,
    deleted: number;
    mailForAll: number;
    newRecord: number;
    parentNode: {
      due: string;
    }
}

export interface ResponseOrganization {
    data: {
        organizClsPg: {
          items: ResponseOrganizationItems[];
        }
      }
}