import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { SertsBase } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { CarmaHttpService } from 'app/services/carmaHttp.service';
import { CertificateService } from 'app/services/certificate.service';
import { USER_CERTIFICATE } from 'eos-rest';
import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
import { ICertificateInit } from 'eos-common/interfaces';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { of } from 'rxjs';
import { /* PARM_CANCEL_CHANGE, */ PARM_SUCCESS_SAVE,  PARM_ERROR_DB, PARM_ERROR_CARMA } from '../../user-params-set/shared-user-param/consts/eos-user-params.const';
import { catchError } from 'rxjs/operators';
@Component({
    selector: 'eos-base-serts',
    templateUrl: 'base-serts.component.html',
    styleUrls: ['base-serts.component.scss'],
})
export class BaseSertsComponent implements OnInit {
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
        private carmaSrv: CarmaHttpService,
        private _userParamSrv: UserParamsService,
        private _certService: CertificateService,
        private pip: PipRX,
        private _msg: EosMessageService,
    ) {

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
            this.carmaSrv.init(null, store).subscribe(data => {
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
            });
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
        arrayQuery.push(this.carmaSrv.GetCertInfo2(this.userSerts.SIGN_MAIL_CERT));
        arrayQuery.push(this.carmaSrv.GetCertInfo2(this.userSerts.ENC_MAIL_CERT));
        if (arrayQuery.length > 0) {
            Promise.all([...arrayQuery]).then(([singd, encs]) => {

                if (typeof singd === 'object' && singd.hasOwnProperty('certInfo')) {
                    this.stateSerts.sing_mail = singd['certInfo']['Description'];
                    this.stateSerts.sing_mail_origin = singd['certInfo']['Description'];
                }
                if (typeof encs === 'object' && encs.hasOwnProperty('certInfo')) {
                    this.stateSerts.enc_mail = encs['certInfo']['Description'];
                    this.stateSerts.enc_mail_origin = encs['certInfo']['Description'];
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
        this._certService.openCerts(openSerts).then(data => {
            let newSert = null;
            if (data) {
                newSert = data['certId'];
                this.carmaSrv.GetCertInfo2(newSert).then(result => {
                    this.stateSerts[paramSert] = result['certInfo']['Description'];
                    this.stateSerts[id_sert] = result['certInfo']['Serial'] + result['certInfo']['Issuer'];
                });
            }
        }).catch(error => {
            console.log('error');
        });
    }
    save(): void {
        this.pip.batch(this.getSave(), '').then(res => {
            this._msg.addNewMessage(PARM_SUCCESS_SAVE);
            this.stateSerts.sing_mail_origin = this.stateSerts.sing_mail;
            this.stateSerts.enc_mail_origin = this.stateSerts.enc_mail;
            this.stateSerts.id_sing_origin = this.stateSerts.id_sing;
            this.stateSerts.id_enc_origin = this.stateSerts.id_enc;
            if (this.flagSave = 'POST') {
                this.flagSave = 'MERGE';
            }
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
        this.carmaSrv.ShowCert(ids)
        .pipe(
            catchError(e => {
                this._msg.addNewMessage(PARM_ERROR_CARMA);
                return of(null);
            })
        )
        .subscribe(() => { });
    }
    checkVersion(): boolean {
        const arrVersion = this.carmaSrv.ServiceInfo.carmaVersion.split('.');
        if (arrVersion[2] === '135') {
            return false;
        }
        if (arrVersion[2] === '145') {
            return true;
        }
        return false;
    }
}
