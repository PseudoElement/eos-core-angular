import { IAppCfg } from 'eos-common/interfaces';

/**
 * used if module was imported without parameters
 * check src/app/app.config.ts
*/
export class ApiCfg implements IAppCfg {
    webBaseUrl = '../';
    apiBaseUrl = '../';
    authApi = '/Services/ApiSession.asmx/';
    dataApi = '/OData.ashx/';

    metaMergeFuncList?: any[] = [];
    authApiUrl?: string = this.apiBaseUrl + this.authApi;
    dataApiUrl?: string = this.dataApiUrl + this.dataApi;
}
