
export interface IPasswordSetting {
    Key?: string;
    Value?: string;
}
export interface ISettingEmailCommon {
    EmailAccount: string;
    Password: IPasswordSetting;
    ProfileName: string;
}
export interface ISettingEmailReceive {
    DeleteEmailsOnServer: boolean;
    InAuthMethod: string;
    InEncryption: string;
    InServerHost: string;
    InServerPort: number;
    InServerType: string;
    InUserName: string;
    ImapFolder: string;
}
export interface ISettingEmailSend {
    OutAuthMethod: number;
    OutEncryption: number;
    OutServerHost: string;
    OutServerPort: number;
    OutUserName: string;
}

interface ILibrary {
    Directory: string;
    Name: string;
  }
export interface IArchivist {
    ArhStoreUrl: string;
    Library: ILibrary;
}
export interface IUploadParam {
    namespace: string;
    typename: string;
    instance?: string; // если ну указать instance то будет использоваться get-list или говоря по другому будет получены все записи а не конкретная запись
}

export interface IConverterParam {
    Name: string;
    Library: ILibrary;
    MaxCacheSize: number;
    IsShared: boolean;
    /** Данные параметры выпилены */
    /* ConverterFormat: string;
    ServerURL: string; */
    CountProcesses: number;
    InstanceName: number;
}
export interface IKafkaParams {
    ServerURL: string;
    PartitionsCount: number;
    ConsumersCount: number;
}
export interface IElasticParams {
    ServerURL: string;
    Login: string;
    Password: string;
}
export interface ICrawlerParams {
    MaxItemsGetCount: number;
    ReindexThreadsCount: number;
    IndexThreadsCount: number;
}

export interface ICryptographyParams {
    CertStores: string;
    InitString: string;
    ProfileName: string;
}

export interface IFilesParams {
    EdmsParm: string;
    Library: ILibrary;
    MaxFileSize: number;
}
export interface IFdulzParams {
    Expiration: number;
    Library: ILibrary;
}

export interface IExtendedParams {
    Library: ILibrary;
}

export interface IConverterUse {
    InstanceName: string;
    Type: number;
}
export interface IPreviewParams {
    ConverterMaxFileSize: number;
    IsActive: boolean;
    TimeOutWaitConverting: number;
    ConverterFormat: string;
    ConverterUse: IConverterUse;
}

export interface ISession {
    TimeoutInMinutes: number;
}

