import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserParamsService } from '../../shared/services/user-params.service';
import { CarmaHttpService } from 'app/services/carmaHttp.service';
import { Router} from '@angular/router';
// import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../shared-user-param/consts/eos-user-params.const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import {Observable} from 'rxjs/Observable';
export interface Istore {
    Location: string;
    Address?: string;
    Name?: string;
}
interface SertInfo {
    whom: string;
    sn: string;
    who: string;
    data: Array<any>;
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


export class UserParamsProfSertComponent  implements OnInit {
    public selectedSertificatePopup: SertInfo;
    public listsSertInfo: Array<SertInfo> = [];
    public alllistSertInfo: Array<SertInfo> = [];
    public selectList: SertInfo;
    public selectedFromAllList: SertInfo;
    public editFlag = false;
    public btnDisabled: boolean = false;
    public selfLink: string;
    public titleHeader: string;
    public link;
    public flagHideBtn: boolean = false;

    private DBserts: Array<any> = [];
    private modalRef: BsModalRef;
    constructor(
        public certStoresService: CarmaHttpService,
        private _userSrv: UserParamsService,
        private _router: Router,
        private _modalService: BsModalService,
        private apiSrv: PipRX,
        private _msgSrv: EosMessageService,
    ) {
        this.titleHeader =  `${this._userSrv.curentUser.SURNAME_PATRON} - Профиль сертификатов`;
        this.selfLink = this._router.url.split('?')[0];
        this.selectedSertificatePopup  = null;
        this.link = this._userSrv.userContextId;
        this.getSerts();
    }

    ngOnInit() {
        const arrPromise = [];
        const store: Istore[] =  [{Location: 'sscu', Address: '', Name: 'My'}];
        this.certStoresService.init(null, store).subscribe(data => {
            this.certStoresService.EnumCertificates('', '', '').subscribe(datas => {
                datas.forEach(sert => {
                    arrPromise.push(this.certStoresService.GetCertInfo2(sert));
                });
                Promise.all(arrPromise).then(arrayInfo => {
                    arrayInfo.forEach((infoSert, index) => {
                        this.alllistSertInfo.push({
                            whom: infoSert['certInfo']['Issuer'],
                            sn: infoSert['certInfo']['Serial'],
                            who: this.parseSertWhom(infoSert['certInfo']['X500Description']),
                            data: infoSert,
                            selected: false,
                            id: datas[index],
                            create: false,
                            delete: false,
                            valid: this.parceValid(infoSert['certInfo']['Validity']) ,
                        });
                    });
                });
            });
        });
    }
    parceValid(value: string): boolean {
        if (value === 'VALID') {
            return true;
        }   else {
            return false;
        }
    }
    initForm() {

    }
    getSerts() {
        const query = {
            USER_CERT_PROFILE: {
                criteries: {
                    ISN_USER: String(this._userSrv.userContextId)
                }
            }
        };
        this.apiSrv.read(query).then(result => {
            this.DBserts = result;
            this.getInfoForDBSerts().then(() => {
                if (this.listsSertInfo.length > 0) {
                    this.selectCurent(this.listsSertInfo[0]);
                }
            });
        }).catch(error => {
            console.log(error);
        });
    }

    getInfoForDBSerts(): Promise<any> {
        const arrRequestSerts = [];
        this.DBserts.forEach(sert => {
            arrRequestSerts.push(this.certStoresService.GetCertInfo2(sert['ID_CERTIFICATE']));
        });
      return  Promise.all(arrRequestSerts).then(data => {
            data.forEach((infoSert, index) => {
                this.listsSertInfo.push({
                    whom: infoSert['certInfo']['Issuer'],
                    sn: infoSert['certInfo']['Serial'],
                    who: this.parseSertWhom(infoSert['certInfo']['X500Description']),
                    data: infoSert,
                    selected: false,
                    id:  this.DBserts[index]['ID_CERTIFICATE'],
                    key: this.DBserts[index]['ISN_CERT_PROFILE'],
                    create: false,
                    delete: false,
                    valid: this.parceValid(infoSert['certInfo']['Validity']) ,
                });
            });
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
        return code.replace(/\w+=/g, ' ');
    }

    showSert(selected?: string): void {
        if (selected) {
            this.openCarmWindow(selected);
        }   else {
            if (this.selectList) {
                this.openCarmWindow(this.selectList.id);
            }
        }
    }

    openCarmWindow(idSert) {
        this.certStoresService.ShowCert(String(idSert)).catch(e => {
            this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            return Observable.of(null);
        })
        .subscribe((data) => {
            console.log(data);
        });
    }


    chooseSertificate(template: TemplateRef<any>): void {
        this.modalRef = this._modalService.show(template);
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
      return  this.listsSertInfo.some((list: SertInfo) => {
            return list.id === this.selectedSertificatePopup.id;
        });
    }
    findNeedSert() {
        return this.listsSertInfo.filter((sert: SertInfo) => {
            return sert.id === this.selectedSertificatePopup.id && sert.delete;
        });
    }

    addSertificate(sert: SertInfo): void {
        let newSert: SertInfo = null;
        const findsert = this.findNeedSert();
            if (this.checkSert()) {
                if (findsert.length) {
                    findsert[0].delete = false;
                    this.selectCurent(findsert[0]);
                }   else {
                    this._msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Настройка профиля пользователя',
                        msg: 'Данный сертификат уже добавлен в профиль',
                        dismissOnTimeout: 10000
                    });
                }
            } else {
                newSert = Object.assign({}, sert);
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
            }   else {
                this.flagHideBtn = true;
            }
        }
        this.checkchanges();
    }

    submit(event) {
       const queryCreate = this.getQueryCreate();
       const queryDelete = this.getQueryDelete();
       const requestCreate = this.apiSrv.batch(queryCreate, '');
       const requestDelete = this.apiSrv.batch(queryDelete, '');
       Promise.all([requestCreate, requestDelete]).then(data => {
        this.listsSertInfo.splice(0, this.listsSertInfo.length);
        this.getSerts();
        this._msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
       this.checkchanges();
       }).catch(error => {
        this._msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            console.log(error);
       });
    }
    cancellation(event) {
        this.editFlag = event;
        this.listsSertInfo =  this.listsSertInfo.filter((sert: SertInfo, index) => {
                if (!sert.create && sert.delete) {
                    sert.delete = false;
                }
            return !sert.create;
        });
        if (this.listsSertInfo.length) {
            this.selectCurent(this.listsSertInfo[0]);
        }
        this.checkchanges();
    }
    edit(event) {
        this.editFlag = event;
    }
    close(event) {
        this.editFlag = event;
        this._router.navigate(['user_param', JSON.parse(sessionStorage.getItem('lastNodeDue'))]);
    }

    getQueryCreate(): Array<any> {
        const query = [];
        this.listsSertInfo.forEach((sert: SertInfo) => {
            if (sert.create && !sert.delete) {
                query.push({
                    method: 'POST',
                    requestUri: `USER_CERT_PROFILE`,
                    data: {
                        ISN_USER: this._userSrv.curentUser['ISN_LCLASSIF'],
                        ID_CERTIFICATE: String(sert.id),
                    }
                });
            }
        });
        return query;
    }

    getQueryDelete() {
        const query = [];
        this.listsSertInfo.forEach((sert: SertInfo) => {
            if (!sert.create && sert.delete) {
                query.push({
                    method: 'DELETE',
                    requestUri: `USER_CERT_PROFILE(${sert.key})`,
                });
            }
        });
        return query;
    }
    checkchanges() {
     const check =   this.listsSertInfo.some((sert: SertInfo) => {
            return ((sert.create && !sert.delete) || (!sert.create && sert.delete));
        });
        if (check) {
            this.btnDisabled = true;
        } else {
            this.btnDisabled = false;
        }
    }
    default(event) {
        return;
    }

}
