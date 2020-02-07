import { Component, Injector, OnChanges, OnInit } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { CONFIRM_REESTRTYPE_DELIVERY_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { PipRX } from 'eos-rest';
import { INFO_REESTR_NOT_UNIQUE } from 'eos-dictionaries/consts/messages.consts';
import { ValidatorsControl } from 'eos-dictionaries/validators/validators-control';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'eos-reestrtype-card',
    templateUrl: 'reestrtype-card.component.html',
    styleUrls: ['./reestrtype-card.component.scss']
})
export class ReestrtypeCardComponent extends BaseCardEditComponent implements OnChanges, OnInit {

    private _deliv_checkneed: boolean;

    constructor(injector: Injector,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private _apiSrv: PipRX,
        ) {
        super(injector);
        this._deliv_checkneed = true;
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    onAfterLoadRelated() {
        super.onAfterLoadRelated();
        const req = { REESTRTYPE_CL: ''};
        this._apiSrv.read(req).then ( data => {
            ValidatorsControl.appendValidator(this.form.controls['rec.ISN_DELIVERY'], this._isReestrsUniqueValidator(data));
            this.inputs['rec.ISN_DELIVERY'].options.forEach( o => {
                const isn = this.isNewRecord ? null : this.data.rec._orig['ISN_LCLASSIF'];
                const ex = data.find (d => d['ISN_LCLASSIF'] !== isn && d['ISN_DELIVERY'] === o.value);
                if (ex) {
                    o.disabled = true;
                }
            });
            if (this.isNewRecord && this.inputs['rec.ISN_DELIVERY'].options[0]) {
                this.setValue('rec.ISN_DELIVERY', this.inputs['rec.ISN_DELIVERY'].options[0].value);
                // this.form.controls['rec.ISN_DELIVERY'].updateValueAndValidity();
                this.inputs['rec.ISN_DELIVERY'].dib.delayedTooltip();
            }
        });
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    private _isReestrsUniqueValidator (data: any[]): ValidatorFn {
        return (control: AbstractControl) => {
            const deliv_id = Number(control.value);
            const isn = this.isNewRecord ? null : this.data.rec._orig['ISN_LCLASSIF'];
            let res = null;
            for (let i = 0; i < data.length; i++) {
                const e = data[i];
                if (e['ISN_DELIVERY'] === deliv_id && e['ISN_LCLASSIF'] !== isn) {
                    res = e;
                    const msg = Object.assign({}, INFO_REESTR_NOT_UNIQUE);
                    msg.msg = msg.msg
                        .replace('{{exists}}', String(res['CLASSIF_NAME']));
                    return {valueError: msg.msg};
                }
            }
            return null;
        };
    }

    private updateForm(formChanges: any) {
        const oldDelivery = this.prevValues['ISN_DELIVERY'] ? this.prevValues['ISN_DELIVERY'] : (this.isNewRecord ? null : this.data.rec._orig['ISN_DELIVERY']);
        const newDeliv = formChanges['rec.ISN_DELIVERY'];
        const isn = this.isNewRecord ? null : this.data.rec._orig['ISN_LCLASSIF'];

        if (oldDelivery !== newDeliv) {

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
