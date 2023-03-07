import { Component, Output, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { SertsBase } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CarmaHttp2Service } from './../../../app/services/camaHttp2.service';
import { CertificateService } from '../../../app/services/certificate.service';
import { USER_CERTIFICATE } from '../../../eos-rest';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { ICertificateInit } from '../../../eos-common/interfaces';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { of } from 'rxjs';
import { /* PARM_CANCEL_CHANGE, */ PARM_SUCCESS_SAVE,  PARM_ERROR_DB, PARM_ERROR_CARMA } from '../../user-params-set/shared-user-param/consts/eos-user-params.const';
@Component({
    selector: 'eos-base-serts',
    templateUrl: 'base-serts.component.html',
    styleUrls: ['base-serts.component.scss'],
})
export class BaseSertsComponent implements OnInit, OnDestroy {
    userSerts: USER_CERTIFICATE;
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
    public isCarma: boolean;
    public flagSave: string = 'POST';
    get disabledBtn(): boolean {
        if (this.stateSerts.id_enc !== this.stateSerts.id_enc_origin || this.stateSerts.id_sing !== this.stateSerts.id_sing_origin) {
            return false;
        } else {
            return true;
        }
    }
    @Output() closeModal: EventEmitter<any> = new EventEmitter();
    constructor(
        private carma2Srv: CarmaHttp2Service,
        private _userParamSrv: UserParamsService,
        private _certService: CertificateService,
        private pip: PipRX,
        private _msg: EosMessageService,
    ) {

    }
    ngOnDestroy() {
        if (this._certService.w) {
            this._certService.w['close']();
        }
    }

    ngOnInit() {
        this._userParamSrv.getSertSBaseParams().then((user_Sert: USER_CERTIFICATE[]) => {
            this.userSerts = user_Sert[0];
            if (user_Sert.length) {
                this.flagSave = 'MERGE';
                this.setId();
            } else {
                this.flagSave = 'POST';
            }
            const store = [{ Location: 'sscu', Address: '', Name: 'My' }];
            this.carma2Srv.connectWrapper('MODULE=', store).then((res) => {
                this.isCarma = true;
                if (user_Sert.length) {
                    this.getInfoSerts();
                }
            }).catch((err) => {
                this.isCarma = false;
                if (user_Sert.length) {
                    this.setId();
                }
                this.notCarma();
                this._msg.addNewMessage(PARM_ERROR_CARMA);
            });
            /* this.carmaSrv.init(null, store).subscribe(data => {
                this.isCarma = true;
                if (user_Sert.length) {
                    this.getInfoSerts();
                }
            }, error => {
                this.isCarma = false;
                if (user_Sert.length) {
                    this.setId();
                }
                this.notCarma();
                this._msg.addNewMessage(PARM_ERROR_CARMA);
            }); */
        }).catch(error => {
            this._msg.addNewMessage(PARM_ERROR_DB);
        });
    }
    notCarma() {
        this.stateSerts.sing_mail = this.stateSerts.id_sing;
        this.stateSerts.sing_mail_origin = this.stateSerts.id_sing;
        this.stateSerts.enc_mail = this.stateSerts.id_enc;
        this.stateSerts.enc_mail_origin = this.stateSerts.id_enc;
    }
    setId() {
        this.stateSerts.id_enc = this.userSerts.ENC_MAIL_CERT;
        this.stateSerts.id_enc_origin = this.userSerts.ENC_MAIL_CERT;
        this.stateSerts.id_sing = this.userSerts.SIGN_MAIL_CERT;
        this.stateSerts.id_sing_origin = this.userSerts.SIGN_MAIL_CERT;
    }
    getInfoSerts() {
        const arrayQuery = [];
        if (this.userSerts.SIGN_MAIL_CERT) {
            arrayQuery.push(this.carma2Srv.GetCertInfoP(this.userSerts.SIGN_MAIL_CERT));
        }
        if (this.userSerts.ENC_MAIL_CERT) {
            arrayQuery.push(this.carma2Srv.GetCertInfoP(this.userSerts.ENC_MAIL_CERT));
        }
        if (arrayQuery.length > 0) {
            Promise.all([...arrayQuery]).then(([singd, encs]) => {
                if (typeof singd === 'object') {
                    this.stateSerts.sing_mail = singd['Description'];
                    this.stateSerts.sing_mail_origin = singd['Description'];
                }   else {
                    this.stateSerts.sing_mail = this.userSerts.SIGN_MAIL_CERT;
                    this.stateSerts.sing_mail_origin = this.userSerts.SIGN_MAIL_CERT;
                }
                if (typeof encs === 'object') {
                    this.stateSerts.enc_mail = encs['Description'];
                    this.stateSerts.enc_mail_origin = encs['Description'];
                }   else {
                    this.stateSerts.enc_mail = this.userSerts.ENC_MAIL_CERT;
                    this.stateSerts.enc_mail_origin = this.userSerts.ENC_MAIL_CERT;
                }
            });
        }
    }

    openSertService(paramSert: string, id_sert: string): void {
        const openSerts: ICertificateInit = {
            Stores: 'sscu:My',
            init_str: 'SERVER="http://localhost:8080";',
            // FilterBlockVisible: 1,
            // cert_id: '2C1C653E145FE1B94E8955E597B133A5loc, mr, MNSDC1-CA'
        };
        this._certService.openCerts(openSerts).then((data: string) => {
            // let newSert = null;
            if (data) {
                // newSert = data['certId'];
                this.carma2Srv.GetCertInfoP(data).then(result => {
                    this.stateSerts[paramSert] = result['Description'];
                    this.stateSerts[id_sert] = result['Serial'] + result['Issuer'];
                });
            }
        }).catch(error => {
            console.log('error');
        });
    }
    save(): void {
        this.pip.batch(this.getSave(), '')
        .then(res => {
            this._msg.addNewMessage(PARM_SUCCESS_SAVE);
            this.stateSerts.sing_mail_origin = this.stateSerts.sing_mail;
            this.stateSerts.enc_mail_origin = this.stateSerts.enc_mail;
            this.stateSerts.id_sing_origin = this.stateSerts.id_sing;
            this.stateSerts.id_enc_origin = this.stateSerts.id_enc;
            if (this.flagSave = 'POST') {
                this.flagSave = 'MERGE';
            }
            this._userParamSrv.ProtocolService(this._userParamSrv.curentUser.ISN_LCLASSIF, 4);
            this.closeModal.emit();
        }).catch(error => {
            this._msg.addNewMessage(PARM_ERROR_DB);
        });
    }
    getSave(): Array<any> {
        const id = this._userParamSrv.curentUser['ISN_LCLASSIF'];
        const query = [];
        // todo - удалить после правки, при создании пользователя не добавляется запись в таб. user_certificate
        if (this.flagSave === 'MERGE') {
            query.push({
                method: `MERGE`,
                requestUri: `USER_CL(${id})/USER_CERTIFICATE_List(${id})`,
                data: {
                    SIGN_MAIL_CERT: this.stateSerts.id_sing,
                    ENC_MAIL_CERT: this.stateSerts.id_enc
                }
            });
        } else {
            query.push({
                method: `POST`,
                requestUri: `USER_CL(${id})/USER_CERTIFICATE_List`,
                data: {
                    ISN_USER: `${id}`,
                    // SING_CERT: '',
                    // ENC_CERT: '',
                    SIGN_MAIL_CERT: this.stateSerts.id_sing,
                    ENC_MAIL_CERT: this.stateSerts.id_enc
                }
            });
        }

        // if (this.stateSerts.sing_mail !== this.stateSerts.sing_mail_origin) {
        // }

        // if (this.stateSerts.enc_mail !== this.stateSerts.enc_mail_origin) {
        //     query.push({
        //         method: `MERGE`,
        //         requestUri: `USER_CL(${id})/USER_CERTIFICATE_List(${id})`,
        //         data: {
        //         }
        //     });
        // }
        return query;
    }


    closeSerts(): void {
        this.stateSerts.sing_mail = this.stateSerts.sing_mail_origin;
        this.stateSerts.enc_mail = this.stateSerts.enc_mail_origin;
        this.stateSerts.id_sing = this.stateSerts.id_sing_origin;
        this.stateSerts.id_enc = this.stateSerts.id_enc_origin;
        this.closeModal.emit();
    }
    deliteSert(paramStr: string, id: string) {
        this.stateSerts[paramStr] = null;
        this.stateSerts[id] = null;
    }
    show(id: string) {
       const ids = this.stateSerts[id];
        this.carma2Srv.ShowCert(ids)
        .catch((e) => {
            this._msg.addNewMessage(PARM_ERROR_CARMA);
            return of(null);
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
}
