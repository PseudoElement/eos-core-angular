
import { Injectable } from '@angular/core';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
declare function CarmaHttp(initStr: string, stores: any): void;
@Injectable()
export class CarmaHttp2Service {
    clientCarma: any;
    constructor(
        private errHalper: ErrorHelperServices,
    ) {
        this.clientCarma = null;
    }
    public connect(connectStirng: string, stores: any) {
        try {
            this.clientCarma = new CarmaHttp(connectStirng, stores);
        } catch (e) {
            this.errHalper.errorHandler(e);
        }
    }
    public getStores(store: any): Promise<any> {
        return new Promise((res, rej) => {
            if (this.clientCarma) {
                this.clientCarma.request(store, (data) => {
                    res(data);
                }, null);
            } else {
                this.errHalper.errorHandler({ code: 2000, message: 'Проверьте соединение с кармой' });
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
        const store = {
            mode: 38,
            storeAddress:
            {
                location: location,
                address: address,
                name: name
            }
        };
        return this.getStores(store);
    }
    public EnumStores(lacation, address): Promise<any> {
        const store = {
            mode: 37,
            storeAddress:
            {
                location: lacation,
                address: address,
            }
        };
        return this.getStores(store).then(data => {
            if (data && data.stores) {
                return data.stores;
            }
        }).catch(e => {
            console.log(e);
            this.errHalper.errorHandler(e);
        });
    }
    public showCertInfo(certId: string): void {
        if (this.clientCarma) {
            this.clientCarma.ShowCert(certId);
        } else {
            this.errHalper.errorHandler({ code: 2000, message: 'Проверьте соединение с кармой' });
        }
    }
}
