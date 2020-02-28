import { Component, Injector, ViewChild, Input } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE, PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { CertStoresComponent } from './cert-stores/cert-stores.component';
import { CertStoresService } from './cert-stores.service';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html',
    providers: [CertStoresService]

})
export class ParamWebComponent extends BaseParamComponent {
    @ViewChild('certStores') certStores: CertStoresComponent;
    @Input() btnError;
    editMode: boolean;
    public masDisable: any [] = [];
    constructor(
        injector: Injector,
        private certStoresService: CertStoresService
    ) {
        super( injector, WEB_PARAM);
        this.init()
        .then(() => {
            this.certStoresService.formControl = this.form.controls['rec.CERT_APPSRV_STORES'];
            this.certStoresService.formControlInit = this.form.controls['rec.APPSRV_CRYPTO_INITSTR'];
            this.cancelEdit();
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    cancel() {
        if (this.isChangeForm) {
            this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
            this.isChangeForm = false;
            this.formChanged.emit(false);
            this.ngOnDestroy();
            this.init()
            .then(() => {
                this.certStoresService.formControl = this.form.controls['rec.CERT_APPSRV_STORES'];
                this.certStoresService.formControlInit = this.form.controls['rec.APPSRV_CRYPTO_INITSTR'];
                this.cancelEdit();
                this.certStores.ngOnInit();
            });
        }
        this.cancelEdit();
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
        this.editMode = true;
    }

    submit() {
        if (this.newData) {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.paramApiSrv
            .setData(this.createObjRequest())
            .then(data => {
                    this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this.cancelEdit();
                })
                .catch(data => {
                    this.formChanged.emit(true);
                    this.isChangeForm = true;
                    this.msgSrv.addNewMessage({
                        type: 'danger',
                        title: 'Ошибка сервера',
                        msg: data.message ? data.message : data
                    });
                    this.cancelEdit();
                });
        }
    }

    cancelEdit() {
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.editMode = false;
        this.form.disable({ emitEvent: false });
    }
}
