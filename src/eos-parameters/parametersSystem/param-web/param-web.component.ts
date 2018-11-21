import { Component, Injector, ViewChild } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { PARM_CANCEL_CHANGE } from '../shared/consts/eos-parameters.const';
import { CertStoresComponent } from './cert-stores/cert-stores.component';
import { CertStoresService } from './cert-stores.service';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html',
    providers: [CertStoresService]

})
export class ParamWebComponent extends BaseParamComponent {
    @ViewChild('certStores') certStores: CertStoresComponent;
    constructor(
        injector: Injector,
        private certStoresService: CertStoresService
    ) {
        super( injector, WEB_PARAM);
        this.init()
        .then(() => {
            this.certStoresService.formControl = this.form.controls['rec.CERT_APPSRV_STORES'];
            this.certStoresService.formControlInit = this.form.controls['rec.APPSRV_CRYPTO_INITSTR'];
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
                this.certStores.ngOnInit();
            });
        }
    }
}
