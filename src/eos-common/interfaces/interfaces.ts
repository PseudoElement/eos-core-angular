export interface IAppCfg {
    webBaseUrl: string;
    apiBaseUrl: string;
    authApi: string;
    dataApi: string;
    /*
    metaMergeFuncList?: ((meta: any) => void)[];
    authApiUrl?: string;
    dataApiUrl?: string;
    */
}

export interface ISelectOption {
    value: string | number;
    title: string;
}

export interface IOpenClassifParams {
    classif: string;
    id?: string;
    skipDeleted?: boolean;
    selectMulty?: boolean;
    selectLeafs?: boolean;
    selectNodes?: boolean;
    nomenkl_jou?: boolean;
    return_due?: boolean;
    selected? ;
}
