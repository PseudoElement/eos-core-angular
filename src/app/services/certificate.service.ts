import { Injectable } from '@angular/core';
import { ICertificateInit } from 'eos-common/interfaces';
import { AppContext } from 'eos-rest/services/appContext.service';
declare function openPopup(url: string, callback?: Function): boolean;

@Injectable()
export class CertificateService {
    w: any;
    constructor(
        private _appContext: AppContext,
    ) {

    }
    // http://localhost/X1807/Pages/Project/ChooseCertificate.aspx?Stores=sscu:Root,sslm:My&AddToSignProfileVisible=1&FilterBlockVisible=1
    openCerts(params?: ICertificateInit) {
        return new Promise((resolve, reject) => {
            const url = this.getUrl(params);
            let w;
            setTimeout(() => {
                w = openPopup(url, function (event, str) {
                    if (str !== '') {
                        return resolve(str);
                    }
                    return reject();
                });
            }, 10);
            if (w) {
                this.w = w;
            }
            const checkDialClosed = setInterval(function () {
                try {
                    if (!w || w['closed']) {
                        clearInterval(checkDialClosed);
                        reject();
                    }
                } catch (e) {
                    reject();
                }
            }, 500);
        });
    }
    getUrl(params?: ICertificateInit): string {
        let url = '../WebRc/Pages/Certificate.html' + (this._appContext.cbBase ? '?showLdapFilter=true' : '');
        let connector = url.indexOf('?') === -1 ? '?' : '&';
        if (params.UseUserStores) {
            url += `${connector}UseUserStores=${params.UseUserStores}`;
            connector = '&';
        }
        if (params.Stores) {
            url += `${connector}Stores=${params.Stores}`;
            connector = '&';
        }
        if (params.init_str) {
            url += `${connector}init_str=${params.init_str}`;
            connector = '&';
        }
        if (params.OnlyWithPrivateKey) {
            url += `${connector}OnlyWithPrivateKey=${params.OnlyWithPrivateKey}`;
            connector = '&';
        }
        if (params.AddToSignProfileVisible) {
            url += `${connector}FilterBlockVisible=${params.AddToSignProfileVisible}`;
            connector = '&';
        }
        if (params.FilterBlockVisible) {
            url += `${connector}FilterBlockVisible=${params.FilterBlockVisible}`;
            connector = '&';
        }
        if (params.pki_activex) {
            url += `${connector}pki_activex=${params.pki_activex}`;
            connector = '&';
        }
        if (params.cert_id) {
            url += `${connector}cert_id=${params.cert_id}`;
            connector = '&';
        }
        return url;
    }

}
