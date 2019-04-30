import { Injectable } from '@angular/core';
import { ICertificateInit } from 'eos-common/interfaces';
declare function openPopup(url: string, callback?: Function): boolean;

@Injectable()
export class CertificateService {
    constructor() {

    }
    // http://localhost/X1807/Pages/Project/ChooseCertificate.aspx?Stores=sscu:Root,sslm:My&AddToSignProfileVisible=1&FilterBlockVisible=1
    openCerts(params?: ICertificateInit) {
        return new Promise((resolve, reject) => {
            const url = this.getUrl(params);
            const w = openPopup(url, function (event, str) {
                if (str !== '') {
                    return resolve(str);
                }
                return reject();
            });

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
        let url = '../Pages/Project/ChooseCertificate.aspx';
        let connector = '?';
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
