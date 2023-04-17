import { Component, Injector, Input } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
// import { PARM_SUCCESS_SAVE } from '../shared/consts/eos-parameters.const';
import { INLINE_SCANNING_PARAM } from '../shared/consts/inline-scanning-params.const';
import { Validators } from '@angular/forms';

@Component({
    selector: 'eos-param-inline-scanning',
    templateUrl: 'param-dictionaries.component.html'
})
export class ParamInlineScanningComponent extends BaseParamComponent {
    @Input() btnError;
    public masDisable: any[] = [];
    constructor( injector: Injector,
        // private _eaps: EosAccessPermissionsService,
        ) {
        super( injector, INLINE_SCANNING_PARAM);
        this.init()
        .then(() => {
            this.updateField();
            this.cancelEdit();
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    async init() {
        await super.init();
        this.subscr();
        this.updateField();
        this.form.controls['rec.SITE_MRSCAN'].setValidators(Validators.required);
        this.form.controls['rec.NETWORK_MRSCAN'].setValidators(Validators.required);
        this.form.controls['rec.LOCAL_MRSCAN'].setValidators(Validators.required);
    }
    subscr() {
        this.subscriptions.push(
            this.form.controls['rec.SITE_MRSCAN_CHECK'].valueChanges
            .subscribe(newValue => {
                if (newValue) {
                    this.form.controls['rec.SITE_MRSCAN'].setValue('Модуль');
                } else {
                    this.form.controls['rec.SITE_MRSCAN'].setValue('');
                }
                
            })
        );
        this.subscriptions.push(
            this.form.controls['rec.NETWORK_MRSCAN_CHECK'].valueChanges
            .subscribe(newValue => {
                if (newValue) {
                    this.form.controls['rec.NETWORK_MRSCAN'].setValue('Локальный');
                } else {
                    this.form.controls['rec.NETWORK_MRSCAN'].setValue('');
                }
            })
        );
        this.subscriptions.push(
            this.form.controls['rec.LOCAL_MRSCAN_CHECK'].valueChanges
            .subscribe(newValue => {
                if (newValue) {
                    this.form.controls['rec.LOCAL_MRSCAN'].setValue('Локальный');
                } else {
                    this.form.controls['rec.LOCAL_MRSCAN'].setValue('');
                }
            })
        );
    }
    updateField() {
        if (this.form.controls['rec.SITE_MRSCAN'].value === 'localhost') {
            this.form.controls['rec.SITE_MRSCAN'].setValue('Модуль', { emitEvent: false });
            this.form.controls['rec.SITE_MRSCAN_CHECK'].setValue(true, { emitEvent: false });
            this.prepareData.rec['SITE_MRSCAN'] = 'Модуль';
            this.prepareData.rec['SITE_MRSCAN_CHECK'] = true;
        }
        if (this.form.controls['rec.NETWORK_MRSCAN'].value === 'localhost') {
            this.form.controls['rec.NETWORK_MRSCAN'].setValue('Локальный', { emitEvent: false });
            this.form.controls['rec.NETWORK_MRSCAN_CHECK'].setValue(true, { emitEvent: false });
            this.prepareData.rec['NETWORK_MRSCAN'] = 'Локальный';
            this.prepareData.rec['NETWORK_MRSCAN_CHECK'] = true;
        }
        if (this.form.controls['rec.LOCAL_MRSCAN'].value === 'localhost') {
            this.form.controls['rec.LOCAL_MRSCAN'].setValue('Локальный', { emitEvent: false });
            this.form.controls['rec.LOCAL_MRSCAN_CHECK'].setValue(true, { emitEvent: false });
            this.prepareData.rec['LOCAL_MRSCAN'] = 'Локальный';
            this.prepareData.rec['LOCAL_MRSCAN_CHECK'] = true;
        }
    }
    edit() {
        Object.keys(this.form.controls).forEach(key => {
            if (this.masDisable.indexOf(key) >= 0) {
                this.form.controls[key].enable({ emitEvent: false });
            }
        });
    }
    cancelEdit() {
        super.cancel();
        this.masDisable = [];
        Object.keys(this.form.controls).forEach(key => {
            if (!this.form.controls[key].disabled) {
                this.masDisable.push(key);
            }
        });
        this.form.disable({ emitEvent: false });
    }
    preSubmit() {
        delete this.updateData['SITE_MRSCAN_CHECK'];
        delete this.updateData['NETWORK_MRSCAN_CHECK'];
        delete this.updateData['LOCAL_MRSCAN_CHECK'];
        if (this.updateData['LOCAL_MRSCAN'] === 'Локальный') {
            this.updateData['LOCAL_MRSCAN'] = 'localhost';
        }
        if (this.updateData['NETWORK_MRSCAN'] === 'Локальный') {
            this.updateData['NETWORK_MRSCAN'] = 'localhost';
        }
        if (this.updateData['SITE_MRSCAN'] === 'Модуль') {
            this.updateData['SITE_MRSCAN'] = 'localhost';
        }
        this.submit();
    }
}
