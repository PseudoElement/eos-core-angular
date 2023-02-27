export interface ISettingEmailCommon {
    EmailAccount: string;
    Password: string;
    ProfileName: string;
}
export interface ISettingEmailReceive {
    EmailAccount: string;
    Password: string;
    ProfileName: string;
}
export interface ISettingEmailSend {
    EmailAccount: string;
    Password: string;
    ProfileName: string;
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
