import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';

export interface Istore {
    Location: string;
    Address?: string;
    Name?: string;
}

export class CarmaConnectionInterface {


    TestConnection() {
        throw this.NotImplementedError('TestConnection');
    }

    Sign(content, certId) {
        throw this.NotImplementedError('Sign');
    }

    Sign2(content, certId, comment, isAttached, certInclude, addSigner, uri) {
        throw this.NotImplementedError('Sign2');
    }

    SignHash(content, certId, comment, isAttached, certInclude, addSigner, uri) {
        throw this.NotImplementedError('SignHash');
    }

    SignRaw(content, certId) {
        throw this.NotImplementedError('SignRaw');
    }
    SignHashRaw(content, certId) {
        throw this.NotImplementedError('SignHashRaw');
    }

    Hash(content, certId, alg) {
        throw this.NotImplementedError('Hash');
    }

    GetSignInfo(content, signature) {
        throw this.NotImplementedError('GetSignInfo');
    }

    GetCertInfo(certId) {
        throw this.NotImplementedError('GetCertInfo');
    }

    ShowSign(content, signature) {
        throw this.NotImplementedError('ShowSign');
    }

    ShowCert(certId) {
        throw this.NotImplementedError('ShowCert');
    }

    ValidateCert(certId) {
        throw this.NotImplementedError('ValidateCert');
    }

    EnumCertificates(location, address, name) {
        throw this.NotImplementedError('EnumCertificates');
    }

    EnumStores(location, address) {
        throw this.NotImplementedError('EnumStores');
    }

    EnumAllCertificates(stores) {
        throw this.NotImplementedError('EnumAllCertificates');
    }

    FindStoreByCertID(certId, stores) {
        throw this.NotImplementedError('FindStoreByCertID');
    }


    PreloadKey(initStr) {
        throw this.NotImplementedError('PreloadKey');
    }

    SetCurrentStore(location, address, name) {
        throw this.NotImplementedError('SetCurrentStore');
    }
    SignStream(signature, fileStream, comment, isAttached, certInclude, addSigner, uri) {
        throw this.NotImplementedError('SignStream');
    }

    // для совместимости с датой, возвращаемой activeX
    convertDateStr(str) {
        let match = str.match(/^(\d+).(\d+).(\d+) (\d+)\:(\d+)\:(\d+)$/);
        // если время обрезано
        if (!match) {
            match = str.match(/^(\d+).(\d+).(\d+)$/);
            match.push('00', '00', '00');
        }
        const date = new Date(match[3], match[2] - 1, match[1], match[4], match[5], match[6]);
        return date;
    }

    _convertCertDate = function (cert) {
        if (cert.ValidFrom) {
            cert.ValidFrom = this.convertDateStr(cert.ValidFrom);
        }
        if (cert.ValidTo) {
            cert.ValidTo = this.convertDateStr(cert.ValidTo);
        }
        if (cert.ValidFromUTC) {
            cert.ValidFromUTC = this.convertDateStr(cert.ValidFromUTC);
        }
        if (cert.ValidToUTC) {
            cert.ValidToUTC = this.convertDateStr(cert.ValidToUTC);
        }
        if (cert.IssuerCert != null) {
            this._convertCertDate(cert.IssuerCert);
        }
    };

    _convertSignDate = function (sign) {
        sign.SignTime = this.convertDateStr(sign.SignTime);
        if (sign.SignTimeUTC) {
            sign.SignTimeUTC = this.convertDateStr(sign.SignTimeUTC);
        }
        this._convertCertDate(sign.SignCert);
    };
    private NotImplementedError(methodName) {
        return new TypeError('Метод ' + methodName + ' не реализован.');
    }
}
@Injectable()
export class CarmaHttpService extends CarmaConnectionInterface {
    // console.log('CarmaHttp:ctor("' + initStr + '" , ' + JSON.stringify(stores) + ')');
    // constructor (initStr, stores) {}
    // CarmaConnectionInterface.call(this);

    mode_encrypt = 12;
    mode_sign = 14;
    mode_verify = 15;
    mode_setcert = 21;
    mode_getcertinfo = 22;
    mode_translatecrl = 23;
    mode_testconn = 24;
    mode_iskeyvalid = 25;
    mode_encryptmulty = 26;
    mode_sign2 = 27;
    mode_cosign = 28;
    mode_getsigninfo = 29;
    mode_showsign = 30;
    mode_streamencode = 31;
    mode_streammultyenc = 32;
    mode_streamdecode = 33;
    mode_getcertinfo2 = 34;
    mode_getcert = 35;
    mode_enumstore = 37;
    mode_enumcert = 38;
    mode_showcert = 39;
    mode_translatecrl2 = 40;
    mode_getreceplist = 41;
    mode_initcrysvc = 42;
    mode_stopcrysvc = 43;
    mode_getsigntype = 44;
    mode_setcert2 = 45;
    mode_setcertpk = 46;
    mode_CreateHash = 50;
    mode_SignRaw = 51;
    mode_VerifyRaw = 52;
    mode_streamsign = 53;
    mode_streamverify = 54;
    mode_streamsigninfo = 55;
    mode_signhash = 56;
    mode_getsigninfo2 = 57;
    mode_SignHashRaw = 58;
    mode_streamshowsign = 59;

    ServiceInfo = { carmaVersion: '0', carmaProtocolVersion: '0', defaultModule: '' };
    url = '';
    serverAddress = '';
    initStr = '';
    useHttp = false;
    storesConfig: Istore[];
    ctorStores;
    carmaOptions: RequestOptionsArgs;
    stores: Istore[] = [];

    constructor(
        private http: Http
    ) {
        super();
    }
    init(initStr, stores) {
        initStr = initStr || 'SERVER="http://localhost:8080"';
        this.stores = stores;
        this.initStr = initStr;
        this.ctorStores = stores;
        this.carmaOptions = {
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'ru-RU, ru;q=0.8,en-US;q=0.6, en;q=0.4'
            })
        };
        const index = initStr.toUpperCase().indexOf('SERVER=');
        if (index !== -1) {
            const s = initStr.substring(index + 7);
            let end = s.indexOf(';');
            let val = '';
            if (end === -1) {
                end = s.length;
            }

            val = s.substring(1, end - 1); // параметр SERVER имеет формат значения с кавычками

            this.url = val;
            if (val.toLowerCase().indexOf('http:') === 0 || val.toLowerCase().indexOf('https:') === 0) {
                this.useHttp = true;
                this.serverAddress = val;
                if (this.serverAddress.lastIndexOf('/') > 7) {
                    this.serverAddress = this.serverAddress.substring(0, this.serverAddress.lastIndexOf('/'));
                }
            } else {
                this.useHttp = false;
            }
        }
        this.storesConfig = this.__make_stores(this.stores);
        this.__make_stores(stores);
        return this.TestConnection()
        .map((data) => {
            if (data.errorCode === 0 && data.errorMessage === 'DONE') {
                this.getServiceInfo();
                return true;
            } else {
                return false;
            }
        });
    }



    __make_stores(stores) {
        const res = [];
        for (let i = 0; i < stores.length; i++) {
            let location = stores[i].Location;
            const address = stores[i].Address;
            let name = stores[i].Name;

            if (location === '') {
                location = 'sscu';
            }
            if (name === '') {
                name = 'MY';
            }

            res.push({ location: location, address: address, name: name });
        }
        return res;
    }
    getServiceInfo() {
        this.http.get(this.serverAddress, this.carmaOptions)
        .map(res => res.json())
        .subscribe(
            (res) => {
                this.ServiceInfo = res;
            },
            (err) => {
                throw new Error(`Не удалось получить сведения о сервисе КАРМА (${err}).`);
            }
        );
    }

    request(rec: any): Observable<any> {
        rec.extInitParams = this.initStr;
        if (!rec.currentStores) {
            if (!this.storesConfig || this.ctorStores !== this.stores) {
                this.storesConfig = this.__make_stores(this.stores);
                this.ctorStores = this.stores;
            }
            rec.currentStores = this.storesConfig;
        }
        return this.http.post(this.serverAddress, rec, this.carmaOptions).map(res => res.json());
    }

    TestConnection() {
        return this.request({
            mode: this.mode_testconn
        });
    }

    EnumCertificates(location, address, name): Observable<string[]> {
        // console.log('CarmaHttp.EnumCertificates');
        if (location === '') {
            location = 'sscu';
        }
        if (name === '') {
            name = 'MY';
        }

        return this.request({
            mode: this.mode_enumcert,
            storeAddress:
            {
                location: location,
                address: address,
                name: name
            }
        }).map(data => {
            if (data.errorMessage === 'DONE') {
                return data.certificates;
            } else {
                throw new Error(`Ошибка ${data.errorMessage}`);
            }
        });
    }

    EnumStores(location, address): Observable<string[]> {
        return this.request({
            mode: this.mode_enumstore,
            storeAddress:
            {
                location: location,
                address: address
            }
        }).map(data => {
            if (data.errorMessage === 'DONE') {
                return data.stores;
            } else {
                throw new Error(`Ошибка ${data.errorMessage}`);
            }
        });
    }
}
