import { Injectable } from '@angular/core';
import { ErrorHelperServices } from '../../eos-user-params/shared/services/helper-error.services';

declare function CarmaHttp(initStr: string, stores: any, async: boolean): void;
@Injectable()
export class CarmaHttp2Service {
    clientCarma: any;
    carmaInitialized = false;
    constructor(
        private errHalper: ErrorHelperServices,
    ) {
        this.clientCarma = null;
    }
    public connect(connectStirng: string, stores: any): Promise<any> {
        return new Promise((res, rej) => {
            try {
                this.clientCarma = new CarmaHttp(connectStirng, stores, true);
                this.clientCarma.Initialize();
                this.carmaInitialized = true;
                res(true);
            } catch (e) {
                this.clientCarma = null;
                this.errHalper.errorHandler(e);
                rej(e);
            }
        });
    }
    public connectWrapper(connectStirng: string, stores: any) {
        return new Promise((resolve, reject) => {
            try {
                this.connect(connectStirng, stores);
                resolve(true);
            } catch (e) {
                reject(false);
            }
        });
    }

    public getStores(store: any): Promise<any> {
        return new Promise((res, rej) => {
            if (this.clientCarma && this.carmaInitialized) {
                this.clientCarma.GetCertInfoAsync(store, res, rej);
            } else {
                this.errHalper.errorHandler({ code: 2000, message: 'Сервис КАРМА недоступен' });
                rej({ code: 2000, message: 'Проверьте соединение с кармой' });
            }
        });
    }
    public EnumStoresAsync(location: string, address: string): Promise<any> {
        return new Promise((res, rej) => {
            if (this.clientCarma && this.carmaInitialized) {
                this.clientCarma.EnumStoresAsync(location, address, res, rej);
            } else {
                this.errHalper.errorHandler({ code: 2000, message: 'Сервис КАРМА недоступен' });
                rej({ code: 2000, message: 'Проверьте соединение с кармой' });
            }
        });
    }
    public EnumCertificates(location, address, name): Promise<string[]> {
        if (location === '') {
            location = 'sscu';
        }
        if (name === '') {
            name = 'MY';
        }
        return new Promise((res, rej) => {
            if (this.clientCarma && this.carmaInitialized) {
                this.clientCarma.EnumCertificatesAsync(location, address, name, undefined, res, rej);
            } else {
                this.errHalper.errorHandler({ code: 2000, message: 'Сервис КАРМА недоступен' });
                rej({ code: 2000, message: 'Проверьте соединение с кармой' });
            }
        });
    }

    public getServiceInfo() {
        if (this.clientCarma) {
            return this.clientCarma.ServiceInfo;
        }
    }

    public ShowCert(certId: string) {
        if (this.clientCarma) {
            return new Promise((resolve, reject) => {
                const res = this.clientCarma.ShowCert(certId);
                resolve(res);
            });
        }
    }

    public GetCertInfo(certId) {
        return new Promise((resolve, reject) => {
           const res = this.clientCarma.GetCertInfo(certId);
            resolve(res);
        });
    }

    public GetCertInfoP(certId) {
        return new Promise((resolve, reject) => {
            const res = this.clientCarma.GetCertInfoP(certId);
             resolve(res);
         });
    }

    public GetCertInfoMulty(certIds) {
        return new Promise((resolve, reject) => {
            const res = this.clientCarma.GetCertInfoMulty(certIds);
            resolve(res);
        });
    }

    public SetCert(certData) {
        return new Promise((resolve, reject) => {
            const res = this.clientCarma.SetCert(certData);
            resolve(res);
        });
    }

    public EnumStores(location, address): Promise<any> {
        const objstore = {
            location: location
        };
        if (address) {
            objstore['address'] = address;
        }
        /* const store = {
            mode: 37,
            storeAddress: objstore
        }; */
        return this.EnumStoresAsync(location, address).then(data => {
            if (data) {
                return data;
            }
        });
    }
    public showCertInfo(certId: string): void {
        if (this.clientCarma && this.carmaInitialized) {
            this.clientCarma.ShowCert(certId);
        } else {
            this.errHalper.errorHandler({ code: 2000, message: 'Проверьте соединение с кармой' });
        }
    }
    
}
