import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CONFIRM_REESTRTYPE_DELIVERY_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { PipRX } from 'eos-rest';
import { INFO_REESTR_NOT_UNIQUE } from 'eos-dictionaries/consts/messages.consts';

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
        const oldDelivery = this.prevValues['ISN_DELIVERY'] ? this.prevValues['ISN_DELIVERY'] : (this.isNewRecord ? null : this.data.rec._orig['ISN_DELIVERY']);
        const newDeliv = formChanges['rec.ISN_DELIVERY'];
        const isn = this.isNewRecord ? null : this.data.rec._orig['ISN_LCLASSIF'];

        if (oldDelivery !== newDeliv) {
            this._checkReestrsUnique(isn, Number(newDeliv)).then ( res => {
                if (res) {
                    const msg = Object.assign({}, INFO_REESTR_NOT_UNIQUE);
                    msg.msg = msg.msg
                        .replace('{{exists}}', String(res['CLASSIF_NAME']));
                    this._msgSrv.addNewMessage(msg);
                }
            });

            if (!this.isNewRecord && this._deliv_checkneed) {
                this._checkReestrs(isn).then ( res => {
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
            this.prevValues['ISN_DELIVERY'] = newDeliv;
        }

    }

    private _checkReestrsUnique (isn, deliv_id): Promise<any> {
        const req = { REESTRTYPE_CL: ''};
        return this._apiSrv.read(req).then (data => {
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e['ISN_DELIVERY'] === deliv_id && e['ISN_LCLASSIF'] !== isn) {
                    return Promise.resolve(e);
                }
            }
            return Promise.resolve(null);
        });
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
