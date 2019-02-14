import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CONFIRM_REESTRTYPE_DELIVERY_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { PipRX } from 'eos-rest';

@Component({
    selector: 'eos-reestrtype-card',
    templateUrl: 'reestrtype-card.component.html',
    styleUrls: ['./reestrtype-card.component.scss']
})
export class ReestrtypeCardComponent extends BaseCardEditComponent implements OnChanges {

    private _deliv_checkneed: boolean;

    constructor(injector: Injector,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private _apiSrv: PipRX,
        ) {
        super(injector);
        this._deliv_checkneed = true;
    }


    ngOnChanges() {

        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    private updateForm(formChanges: any) {
        const oldDelivery = this.data.rec._orig['ISN_DELIVERY'];

        if (this._deliv_checkneed && (oldDelivery !== formChanges['rec.ISN_DELIVERY'])) {
            this._checkReestrs(this.data.rec._orig['ISN_LCLASSIF']).then ( res => {

                if (res === 'REESTR_NEW_EXISTS') {
                    const _confrm = Object.assign({}, CONFIRM_REESTRTYPE_DELIVERY_CHANGE);
                    this._confirmSrv.confirm(_confrm)
                        .then((confirmed: boolean) => {
                            if (confirmed) {
                                this._deliv_checkneed = false;
                            } else {
                                this.setValue('rec.ISN_DELIVERY', oldDelivery);
                            }
                            return Promise.resolve(null);
                        });
                } else {
                    this._deliv_checkneed = false;
                }

            }).catch(err => { this._errHandler(err); });

        }

    }
    private _checkReestrs(isn): Promise<any> {
        // OData.svc/CanChangeClassif?type=%27REESTRTYPE_CL%27&oper=%27CHANGE_ISN_DELIVERY%27&id=%273780%27
        const query = { args: { type: 'REESTRTYPE_CL', oper: 'CHANGE_ISN_DELIVERY', id: String(isn) } };
        const req = { CanChangeClassif: query};
        return this._apiSrv.read(req);
    }

    private _errHandler(err) {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка проверки',
            msg: errMessage,
        });
    }

}
