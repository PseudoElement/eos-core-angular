import { CarmaHttp2Service } from '../../../app/services/camaHttp2.service';
import { AppContext } from './../../../eos-rest/services/appContext.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

/* import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'; */

import { Subject } from 'rxjs';
// import { catchError } from 'rxjs/operators';

import { UserParamsService } from '../../shared/services/user-params.service';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import {
    PARM_CANCEL_CHANGE,
    PARM_SUCCESS_SAVE,
    PARM_ERROR_DB,
    PARM_ERROR_CARMA
} from '../shared-user-param/consts/eos-user-params.const';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { USER_CERT_PROFILE } from '../../../eos-rest/interfaces/structures';
import { ErrorHelperServices } from '../../shared/services/helper-error.services';
import { SertsBase } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CertificateService } from '../../../app/services/certificate.service';
import { ICertificateInit } from '../../../eos-common/interfaces';
import { takeUntil } from 'rxjs/operators';
import { RouterStateSnapshot } from '@angular/router';
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
    notFound?: boolean;
}
// import { CertStoresService, IListCertStotes } from '../../../eos-parameters/parametersSystem/param-web/cert-stores.service';
@Component({
    selector: 'eos-prof-sert',
    styleUrls: ['user-params-prof-sert.component.scss'],
    templateUrl: 'user-params-prof-sert.component.html',
    providers: [CarmaHttp2Service]
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
    public isLoading: boolean = true;
    public listsSertInfo: Array<SertInfo> = [];
    public alllistSertInfo: Array<SertInfo> = [];
    public selectList: SertInfo;
    public selectedFromAllList: SertInfo;
    public editFlag = false;
    public isEnableBtn = false;
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
    get isUnselected() {
        return (
            !this.editFlag ||
            this.flagHideBtn ||
            !this.listsSertInfo.length ||
            (!this.selectedFromAllList && !this.selectList)
        );
    }
    get isNotFoundSert() {
        return this.selectedFromAllList && this.selectedFromAllList.notFound || this.selectList && this.selectList.notFound;
    }
    get isCursetUnlimTech() {
        const techRights = this._appContext.CurrentUser.TECH_RIGHTS;
        return (techRights && techRights[0] === '1');
    }
    
    get isDisabledSertInfo() {
        return !this.editFlag || 
        (!this.selectedFromAllList && !this.selectList ) || 
        this.selectList.notFound || 
        this.checkingListEmpty();
    }

    public flagHideBtn: boolean = false;
    public isCarma: boolean = true;
    public loadSert: boolean = false;
    private DBserts: USER_CERT_PROFILE[] = [];
    private ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        public certStoresService: CarmaHttp2Service,
        private _userSrv: UserParamsService,
        /* private _modalService: BsModalService, */
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
        private _errorSrv: ErrorHelperServices,
        private _certService: CertificateService,
        private carma2Srv: CarmaHttp2Service,
        private _appContext: AppContext,
    ) {
        this._userSrv.canDeactivateSubmit$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((rout: RouterStateSnapshot) => {
                this._userSrv.submitSave = this.submit('');
            });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    ngOnInit() {
        this.editFlag = !!this.isCurrentSettings;
        const config = {expand: 'USER_PARMS_List'};
        if (this.mainUser) {
            config['isn_cl'] = this.mainUser;
        }
        this._userSrv.getUserIsn(config)
            .then(() => {
                this.currentUser = this._userSrv.curentUser;
                this.selectedSertificatePopup = null;
                let cryptoStr;
                this._appContext.CurrentUser['USER_PARMS_List'].forEach((params) => {
                    if (params['PARM_NAME'] === 'CRYPTO_INITSTR') {
                        cryptoStr = params['PARM_VALUE'];
                    }
                });
                const addr = cryptoStr ? cryptoStr : 'SERVER="http://localhost:8080"';
                const store: Istore[] = [{ Location: 'sscu', Address: '', Name: 'My' }];
                this.loadSert = true;
                this.carma2Srv.connectWrapper(addr, store, false)
                .then((res) => {
                    this.isCarma = true;
                    this.isLoading = false;
                    this.getSerts();
                })
                .catch((err) => {
                    this.isCarma = false;
                    this.isLoading = false;
                    this.getSertNotCarma();
                    console.log('ошибка подключения к карме', err);
                    this._msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Предупреждение:',
                        msg: 'Сервис КАРМА недоступен'
                    });
                });
                /* this.certStoresService.init(null, store)
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
                    ); */
            })
            .catch(err => {

            });
    }
    checkVersion(): boolean {
        const arrVersion = this.carma2Srv.getServiceInfo().carmaVersion.split('.');
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
        return this.apiSrv.read<USER_CERT_PROFILE>(query)
        .then((result: USER_CERT_PROFILE[]) => {
            this.DBserts = result;
            this.getInfoForDBSerts().then(() => {
                if (this.listsSertInfo.length > 0) {
                    this.selectCurent(this.listsSertInfo[0]);
                }
                this.loadSert = false;
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
        return this.apiSrv.read<USER_CERT_PROFILE>(query).then((result: USER_CERT_PROFILE[]) => {
            this.DBserts = result;
            if (this.DBserts) {
                this.DBserts.forEach((el) => { this.notDataSert(el); });
            }
            if (this.listsSertInfo.length > 0) {
                this.selectCurent(this.listsSertInfo[0]);
            }
            this.loadSert = false;
        });
    }

    notDataSert(sert) {
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
            notFound: true,
        });
    }

    getInfoForDBSerts(): Promise<any> {
        if (this.checkVersion()) {
            return this.bettaGetInfo();
        } else {
            return this.stableGetInfo();
        }
    }
    async stableGetInfo() {
        const arrRequestSerts = [];
        for (let index = 0; index < this.DBserts.length; index++) {
            const ans = await this.certStoresService.getStores(this.DBserts[index]['ID_CERTIFICATE'])
            .then((data) => {
                return data;
            })
            .catch((e) => {
                console.log('error', e);
                return { code: 2000, message: 'Проверьте соединение с кармой' };
            });
            arrRequestSerts.push(ans);
        }
        // return Promise.reject();
        /* return Promise.all(arrRequestSerts).then(data => { */
            arrRequestSerts.forEach((infoSert, index) => {
                if (!infoSert.errorCode && !infoSert.code) {
                    if (infoSert['certInfo']) {
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
                    } else {
                        this.listsSertInfo.push({
                            who: infoSert['Issuer'],
                            sn: infoSert['Serial'],
                            whom: this.parseSertWhom(infoSert['X500Description']),
                            data: infoSert,
                            selected: false,
                            id: this.DBserts[index]['ID_CERTIFICATE'],
                            key: this.DBserts[index]['ISN_CERT_PROFILE'],
                            create: false,
                            delete: false,
                            valid: this.parceValid(infoSert['Validity']),
                        });
                    }
                } else {
                    this.notDataSert(this.DBserts[index]);
                }
            });
            return Promise.resolve();
            /* });
        }).catch(error => {
            this._msgSrv.addNewMessage(PARM_ERROR_CARMA);
        }); */
    }
    bettaGetInfo() {
        const arrRequestSerts = [];
        this.DBserts.forEach((sert: USER_CERT_PROFILE) => {
            arrRequestSerts.push(sert['ID_CERTIFICATE']);
        });
        return this.carma2Srv.GetCertInfoMulty(arrRequestSerts.join(';')).then(serts => {
            if (Array.isArray(serts)) {
                serts.forEach((infoSert, index) => {
                    if (!infoSert.errorCode) {
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
                    } else {
                        this.notDataSert(this.DBserts[index]);
                    }
                });
            } /* else {
                if (!serts.errorCode) {
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
                } else {
                    this.notDataSert(this.DBserts[0]);
                }
            } */
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
        if(this.selectList) {
            this.openCarmWindow(this.selectList.id);
        } else if (this.selectedFromAllList) {
            this.openCarmWindow(this.selectedFromAllList.id);
        }
    }

    openCarmWindow(idSert) {
        this.carma2Srv.ShowCert(String(idSert))
    }


    openSertService(): void {
        const openSerts: ICertificateInit = {
            OnlyWithPrivateKey: true,
            /** убираю галочку Запомнить выбранный сертификат в профиле */
            add_cert: false
        };
        if (this.selectList && this.selectList.selected[0]) {
            openSerts.cert_id = this.selectList.selected[0].id;
        }
        this._certService.openCerts(openSerts).then((data: string) => {
            if (data) {
                this.carma2Srv.GetCertInfoP(data).then(result => {
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
            // this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
            this.listsSertInfo.splice(0, this.listsSertInfo.length);
            if (!this.isCurrentSettings) {
                this.editFlag = false;
            }
            this.checkchanges();
            if (this.isCarma) {
                this.getSerts();
            } else {
                this.getSertNotCarma();
            }
            this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
        }).catch(error => {
            this._errorSrv.errorHandler(error);
            this.cancellation(false);
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
        });
    }
    cancellation(event) {
        this._userSrv.closeWindowForCurrentSettings(this.isCurrentSettings);
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

    private checkingListEmpty  () {
        let visibleElement = true;
        const length = this.listsSertInfo.length

        for (let i = 0; i < length; i++) {
            if(!this.listsSertInfo[i].delete) {
                visibleElement = false;
                break;
            }
        }
        return visibleElement;
    }
}
