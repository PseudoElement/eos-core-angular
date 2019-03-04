export interface IEnt {
    _State?: string;
    __metadata?: any;
    _orig?: any;
    _more_json?: any;
}

export interface ILinearCL extends IEnt {
    ISN_LCLASSIF: number;
    CLASSIF_NAME: string;
    PROTECTED: number;
    DELETED: number;
    NOTE: string;
    STATUS?: string;
    IS_FINAL?: number;
}
/**
 * свойства записи про ее создание и изменение
 * есть у многих
 */
export interface IStamp {
    /**
     * Дата и время создания
     */
    INS_DATE: number;
    /**
     * Дата и время обновления
     */
    UPD_DATE: number;
    /**
     * Кто создал
     */
    INS_WHO: number;
    /**
     * Кто обновил
     */
    UPD_WHO: number;
}



export interface IHierCL extends IEnt {
    DUE: string;
    ISN_NODE: number;
    ISN_HIGH_NODE: number;
    PARENT_DUE: string;
    IS_NODE: number;
    CLASSIF_NAME: string;
    PROTECTED: number;
    DELETED: number;
    NOTE: string;
}

export interface ITypeDef {
    pk: string;
    properties: any;
    relations: IRelationDef[];
}

export interface IRelationDef {
    name: string;
    __type: string;
    sf: string;
    tf: string;
    noDirectRead?: boolean;
}

export interface IViewModelResponse {
    value: any;
    formatters: any[];
    contentTypes: any[];
    declaredType: any;
    statusCode: number;
}

export interface IKeyValuePair {
    [key: string]: any;
}

export interface IRequest extends IKeyValuePair {
    url?: string;
    expand?: string;
    _moreJSON?: any;

    foredit?: boolean;
    reload?: boolean;
    top?: number;
    skip?: number;
    orderby?: string;

    urlParams?: string;

    //    errHandler?: (e) => any;
}

export interface IAsk {
    ids?: any[];
    criteries?: any;
    args?: any;
    then?: any;
}

export interface IR extends IRequest {
    _et: string;
}

export enum CacheLevel {
    Entities = 1, List = 2, EntitiesAndList = 4
}

export interface ICachePolicy {
    level?: CacheLevel;
    refresh?: CacheLevel;

//    expire?: Date;

//    zone?: string;
//    izolateZone?: boolean;
}
