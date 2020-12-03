import { Component, OnInit, OnDestroy, Input } from '@angular/core';

/* import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; */

import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { UserParamsService } from '../../shared/services/user-params.service';
import { CarmaHttpService } from 'app/services/carmaHttp.service';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE, PARM_ERROR_DB, PARM_ERROR_CARMA } from '../shared-user-param/consts/eos-user-params.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { USER_CERT_PROFILE } from 'eos-rest/interfaces/structures';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { SertsBase } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CertificateService } from 'app/services/certificate.service';
import { ICertificateInit } from 'eos-common/interfaces';
export interface Istore {
    Location: string;
    Address?: string;
    Name?: string;
}
interface SertInfo {
    whom: string;
    sn: string;
    who: string;
    data: any;
    selected: boolean;
    id: string;
    key?: number;
    create: boolean;
    delete: boolean;
    valid: boolean;
}
// import { CertStoresService, IListCertStotes } from '../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
@Component({
    selector: 'eos-prof-sert',
    styleUrls: ['user-params-prof-sert.component.scss'],
    templateUrl: 'user-params-prof-sert.component.html',
    providers: [CarmaHttpService]
})


export class UserParamsProfSertComponent implements OnInit, OnDestroy {
    @Input() mainUser?;
    @Input() isCurrentSettings?: boolean;

    public stateSerts: SertsBase = {
        sing_mail: null,
        enc_mail: null,
        id_sing: null,
        id_enc: null,
        id_enc_origin: null,
        id_sing_origin: null,
        sing_mail_origin: null,
        enc_mail_origin: null,
    };
    public selectedSertificatePopup: SertInfo;
    public listsSertInfo: Array<SertInfo> = [];
    public alllistSertInfo: Array<SertInfo> = [];
    public selectList: SertInfo;
    public selectedFromAllList: SertInfo;
    public editFlag = false;
    public btnDisabled: boolean = false;
    /* public modalRef: BsModalRef; */
    public currentUser;
    get titleHeader() {
        if (this.currentUser) {
            if (this.currentUser.isTechUser) {
                return this.currentUser.CLASSIF_NAME + '- Профиль сертификатов';
            }
            return `${this.currentUser['DUE_DEP_SURNAME']} - Профиль сертификатов`;
        }
        return '';
    }
    public flagHideBtn: boolean = false;
    public isCarma: boolean = true;
    private DBserts: USER_CERT_PROFILE[] = [];
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        public certStoresService: CarmaHttpService,
        private _userSrv: UserParamsService,
        /* private _modalService: BsModalService, */
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _certService: CertificateService,
        private carmaSrv: CarmaHttpService,
    ) { }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    ngOnInit() {
        const config = {expand: 'USER_PARMS_List'};
        if (this.mainUser) {
            config['isn_cl'] = this.mainUser;
        }
        this._userSrv.getUserIsn(config)
            .then(() => {
                this.currentUser = this._userSrv.curentUser;
                this.selectedSertificatePopup = null;
                const store: Istore[] = [{ Location: 'sscu', Address: '', Name: 'My' }];
                this.certStoresService.init(null, store)
                    .pipe(
                        takeUntil(this.ngUnsubscribe)
                    )
                    .subscribe(
                        (data) => {
                            this.isCarma = true;
                                this.getSerts();
                        },
                        (error) => {
                            this.isCarma = false;
                            this.getSertNotCarma();
                            // this._msgSrv.addNewMessage(PARM_ERROR_CARMA);
                        }
                    );
            })
            .catch(err => {

            });
    }
    checkVersion(): boolean {
        const arrVersion = this.certStoresService.ServiceInfo.carmaVersion.split('.');
        if (arrVersion[2] === '135') {
            return false;
        }
        if (arrVersion[2] === '145') {
            return true;
        }
        return false;
    }
    /* oldWaitSerts(data: Array<any>) {
        const arrPromise = [];
        data.forEach(sert => {
            arrPromise.push(this.certStoresService.GetCertInfo2(sert));
        });
        Promise.all(arrPromise).then(arrayInfo => {
            arrayInfo.forEach((infoSert, index) => {
                if (infoSert.errorMessage === 'DONE') {
                    const ob = this.objectForSertInfo(infoSert, data[index], false, false, false);
                    this.alllistSertInfo.push(ob);
                }
            });
        });
    } */

    objectForSertInfo(infoSert, id, selected, create, del): SertInfo {
        if (infoSert.hasOwnProperty('certInfo')) {
            return {
                who: infoSert['certInfo']['Issuer'],
                sn: infoSert['certInfo']['Serial'],
                whom: this.parseSertWhom(infoSert['certInfo']['X500Description']),
                data: infoSert,
                selected: selected,
                id: id,
                create: create,
                delete: del,
                valid: this.parceValid(infoSert['certInfo']['Validity']),
            };
        } else {
            return {
                who: infoSert['Issuer'],
                sn: infoSert['Serial'],
                whom: this.parseSertWhom(infoSert['X500Description']),
                data: infoSert,
                selected: selected,
                id: id,
                create: create,
                delete: del,
                valid: this.parceValid(infoSert['Validity']),
            };
        }
    }

    /* waitSerts(data) {
        const strQuery = data.join(';');
        this.certStoresService.GetCertInfo2(strQuery).then(arrayInfo => {
            if (Array.isArray(arrayInfo['certInfos'])) {
                arrayInfo['certInfos'].forEach((infoSert, index) => {
                    const ob = this.objectForSertInfo(infoSert, data[index], false, false, false);
                    this.alllistSertInfo.push(ob);
                });
            } else {
                const ob = this.objectForSertInfo(arrayInfo, data[0], false, false, false);
                this.alllistSertInfo.push(ob);
            }
        });
    } */
    parceValid(value: string): boolean {
        if (value === 'VALID') {
            return true;
        } else {
            return false;
        }
    }
    getSerts(): Promise<any> {
        const query = {
            USER_CERT_PROFILE: {
                criteries: {
                    ISN_USER: String(this._userSrv.userContextId)
                }
            }
        };
        return this.apiSrv.read(query)
        .then((result: USER_CERT_PROFILE[]) => {
            this.DBserts = result;
            this.getInfoForDBSerts().then(() => {
                if (this.listsSertInfo.length > 0) {
                    this.selectCurent(this.listsSertInfo[0]);
                }
            });
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_DB);
        });
    }

    getSertNotCarma() {
        const query = {
            USER_CERT_PROFILE: {
                criteries: {
                    ISN_USER: String(this._userSrv.userContextId)
                }
            }
        };
        return this.apiSrv.read(query).then((result: USER_CERT_PROFILE[]) => {
            this.DBserts = result;
            this.DBserts.forEach(sert => {
                this.listsSertInfo.push({
                    who: 'нет данных',
                    sn: sert['ID_CERTIFICATE'],
                    whom: 'нет данных',
                    data: sert,
                    selected: false,
                    id: sert['ID_CERTIFICATE'],
                    key: sert['ISN_CERT_PROFILE'],
                    create: false,
                    delete: false,
                    valid: false,
                });
            });
            if (this.listsSertInfo.length > 0) {
                this.selectCurent(this.listsSertInfo[0]);
            }
        });
    }

    getInfoForDBSerts(): Promise<any> {
        if (this.checkVersion()) {
            return this.bettaGetInfo();
        } else {
            return this.stableGetInfo();
        }
    }
    stableGetInfo() {
        const arrRequestSerts = [];
        this.DBserts.forEach(sert => {
            arrRequestSerts.push(this.certStoresService.GetCertInfo2(sert['ID_CERTIFICATE']));
        });
        return Promise.all(arrRequestSerts).then(data => {
            data.forEach((infoSert, index) => {
                this.listsSertInfo.push({
                    who: infoSert['certInfo']['Issuer'],
                    sn: infoSert['certInfo']['Serial'],
                    whom: this.parseSertWhom(infoSert['certInfo']['X500Description']),
                    data: infoSert,
                    selected: false,
                    id: this.DBserts[index]['ID_CERTIFICATE'],
                    key: this.DBserts[index]['ISN_CERT_PROFILE'],
                    create: false,
                    delete: false,
                    valid: this.parceValid(infoSert['certInfo']['Validity']),
                });
            });
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_CARMA);
        });
    }
    bettaGetInfo() {
        const arrRequestSerts = [];
        this.DBserts.forEach((sert: USER_CERT_PROFILE) => {
            arrRequestSerts.push(sert['ID_CERTIFICATE']);
        });
        return this.certStoresService.GetCertInfo2(arrRequestSerts.join(';')).then(serts => {
            if (Array.isArray(serts['certInfos'])) {
                serts['certInfos'].forEach((infoSert, index) => {
                    this.listsSertInfo.push({
                        whom: infoSert['Issuer'],
                        sn: infoSert['Serial'],
                        who: this.parseSertWhom(infoSert['X500Description']),
                        data: infoSert,
                        selected: false,
                        id: this.DBserts[index]['ID_CERTIFICATE'],
                        key: this.DBserts[index]['ISN_CERT_PROFILE'],
                        create: false,
                        delete: false,
                        valid: this.parceValid(infoSert['Validity']),
                    });
                });
            } else {
                this.listsSertInfo.push({
                    whom: serts['certInfo']['Issuer'],
                    sn: serts['certInfo']['Serial'],
                    who: this.parseSertWhom(serts['certInfo']['X500Description']),
                    data: serts['certInfo'],
                    selected: false,
                    id: this.DBserts[0]['ID_CERTIFICATE'],
                    key: this.DBserts[0]['ISN_CERT_PROFILE'],
                    create: false,
                    delete: false,
                    valid: this.parceValid(serts['certInfo']['Validity']),
                });
            }
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_CARMA);
        });
    }
    selectCurent(list: SertInfo): void {
        if (this.selectList) {
            this.selectList.selected = false;
        }
        this.selectList = list;
        this.selectList.selected = true;
    }

    parseSertWhom(code: string): string {
        if (code) {
            return code.replace(/\w+=/g, ' ');
        } return ' ';
    }

    showSert(): void {
        if (this.selectedFromAllList) {
            this.openCarmWindow(this.selectedFromAllList.id);
        } else {
            if (this.selectList) {
                this.openCarmWindow(this.selectList.id);
            }
        }
    }

    openCarmWindow(idSert) {
        this.certStoresService.ShowCert(String(idSert))
            .pipe(
                catchError(e => {
                    this._msgSrv.addNewMessage(PARM_ERROR_CARMA);
                    return of(null);
                })
            )
            .subscribe(() => { });
    }


    openSertService(): void {
        const openSerts: ICertificateInit = {
        };
        this._certService.openCerts(openSerts).then((data: string) => {
            if (data) {
                this.carmaSrv.GetCertInfo2(data).then(result => {
                    this.selectedSertificatePopup = this.objectForSertInfo(result, data, false, false, false);
                    this.addSert();
                    this.addSertificate();
                });
            }
        }).catch(error => {
            console.log('error', error);
        });
    }
    chooseSertificate(): void {
        this.openSertService();
        // this.modalRef = this._modalService.show(template);
    }
    selectCurentListAll(item: SertInfo): void {
        if (this.selectedSertificatePopup) {
            this.selectedSertificatePopup.selected = false;
        }

        this.selectedSertificatePopup = item;
        this.selectedSertificatePopup.selected = true;
    }
    addSert() {
        if (this.selectedSertificatePopup) {
            this.selectedFromAllList = this.selectedSertificatePopup;
        }
    }

    checkSert(): boolean {
        return this.listsSertInfo.some((list: SertInfo) => {
            return list.id === this.selectedSertificatePopup.id;
        });
    }
    findNeedSert() {
        return this.listsSertInfo.filter((sert: SertInfo) => {
            return sert.id === this.selectedSertificatePopup.id && sert.delete;
        });
    }

    addSertificate(): void {
        let newSert: SertInfo = null;
        const findsert = this.findNeedSert();
        if (this.checkSert()) {
            if (findsert.length) {
                findsert[0].delete = false;
                this.selectCurent(findsert[0]);
            } else {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Настройка профиля пользователя',
                    msg: 'Данный сертификат уже добавлен в профиль',
                    dismissOnTimeout: 10000
                });
            }
        } else {
            newSert = Object.assign({}, this.selectedFromAllList);
            newSert.create = true;
            newSert.selected = false;
            this.listsSertInfo.push(newSert);
            this.selectCurent(this.listsSertInfo[this.listsSertInfo.length - 1]);
        }

        this.flagHideBtn = false;
        this.checkchanges();
    }

    deleteSertificate() {
        if (this.selectList) {
            this.listsSertInfo.map((sert: SertInfo) => {
                if (sert.id === this.selectList.id) {
                    sert.delete = true;
                    sert.selected = false;
                }
                return sert;
            });
        }
        if (this.listsSertInfo.length) {
            const filterNotDelete = this.listsSertInfo.filter((sert: SertInfo) => {
                return !sert.delete;
            });
            if (filterNotDelete.length) {
                const newSelected = filterNotDelete[filterNotDelete.length - 1];
                this.selectList = newSelected;
                this.selectList.selected = true;
                this.flagHideBtn = false;
            } else {
                this.flagHideBtn = true;
            }
        }
        this.checkchanges();
    }

    submit(event): Promise<any> {
        let requestCreate, requestDelete;
        this.listsSertInfo.forEach((sert: SertInfo) => {
            if (sert.create && !sert.delete) {
                requestCreate = this._userSrv.BatchData('POST', 'USER_CERT_PROFILE', {
                    ISN_USER: this._userSrv.curentUser['ISN_LCLASSIF'],
                    ID_CERTIFICATE: String(sert.id),
                });
            }
        });
        this.listsSertInfo.forEach((sert: SertInfo) => {
            if (!sert.create && sert.delete) {
                requestDelete = this._userSrv.BatchData('DELETE', `USER_CERT_PROFILE(${sert.key})`);
            }
        });
        return Promise.all([requestCreate, requestDelete]).then(data => {
            this.editFlag = false;
            this.listsSertInfo.splice(0, this.listsSertInfo.length);
            if (this.isCarma) {
                this.getSerts();
            } else {
                this.getSertNotCarma();
            }
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
            this.checkchanges();
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancellation(false);
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
        });
    }
    cancellation(event) {
        this.editFlag = event;
        this.listsSertInfo = this.listsSertInfo.filter((sert: SertInfo, index) => {
            if (!sert.create && sert.delete) {
                sert.delete = false;
            }
            return !sert.create;
        });
        if (this.listsSertInfo.length) {
            this.selectCurent(this.listsSertInfo[0]);
            this.flagHideBtn = false;
        }
        this.checkchanges();
    }
    edit(event) {
        this.editFlag = event;
    }
    checkchanges() {
        const check = this.listsSertInfo.some((sert: SertInfo) => {
            return ((sert.create && !sert.delete) || (!sert.create && sert.delete));
        });
        if (check) {
            this.btnDisabled = true;
        } else {
            this.btnDisabled = false;
        }
        this._pushState();
    }
    default(event) {
        return;
    }
    private _pushState() {
        this._userSrv.setChangeState({ isChange: this.btnDisabled });
    }

}
