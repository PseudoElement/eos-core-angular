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
    criteriesSearch?: boolean;
    criteriesName?: string;
}

export interface ICertificateInit {
    // использование набора хранилищ пользователя ( по умолчанию 0)
    UseUserStores?: string;
    // используемый набор адресов хранилищ через запятую, например Stores=sscu:Root,sslm:My
    // Если вообще не указан источник хранилища – используется sscu:My
    Stores?: string;
    // – только с секретным ключом ( по умолчанию 0)
    OnlyWithPrivateKey?: any;
    // – кастомная строка инициализации клиентсткой кармы ( по умолчанию используется строка из настроек пользователя)
    init_str?: string;
    // – кастомный ActiveX объект ( по умолчанию используется из настрноек пользователя) – не очень актуальный параметр
    pki_activex?: any;
    // - показ чека с сохранением сертификата в профиль пользователя ( по умолчанию 0)
    AddToSignProfileVisible?: any;
    // показ блока с настройками фильтра ( по умолчанию 0 )
    FilterBlockVisible?: any;
    // выделенный идентификатор
    cert_id?: string;
}
