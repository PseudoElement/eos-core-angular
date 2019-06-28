import { Component, Injector } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { RC_PARAM } from '../shared/consts/rc.consts';
import {
    PARM_CHANGE_RC_RES_LAYER,
    PARM_CANCEL_CHANGE,
    REG_RANGE_0_60_2,
    REG_RANGE_0_24_2,
    REG_RANGE_0_10_2
} from '../shared/consts/eos-parameters.const';
import { /* Validators, */ AbstractControl } from '@angular/forms';
import { ValidatorsControl } from 'eos-dictionaries/validators/validators-control';

@Component({
    selector: 'eos-param-rc',
    templateUrl: 'param-rc.component.html'
})
export class ParamRcComponent extends BaseParamComponent {
    constructor(injector: Injector) {
        super(injector, RC_PARAM);
        this.init()
            .then(() => {
                this.afterInitRC();
                setTimeout(() => {
                    this._updateValidators(this.form.controls);
                });
            })
            .catch(err => {
                if (err.code !== 434) {
                    console.log(err);
                }
            });
    }
    _updateValidators(controls: any): any {
        controls['rec.REG_PERIOD'].clearValidators();
        ValidatorsControl.appendValidator(controls['rec.REG_PERIOD'],
            (control: AbstractControl): { [key: string]: any } => {
                const v = control.value;
                if (v) {
                    if (v === '0') {
                        return { valueError: 'Ноль нельзя сохранить' };
                    }
                } else {
                    return { valueError: 'Значение не должно быть пустым' };
                }
                switch (this.form.controls['rec.REG_UNIT'].value) {
                    case '1':
                        if (!REG_RANGE_0_60_2.test(v)) {
                            return { valueError: 'Некорректное значение' };
                        }
                        break;
                    case '2':
                        if (!REG_RANGE_0_24_2.test(v)) {
                            return { valueError: 'Некорректное значение' };
                        }
                        break;
                    case '3':
                        if (!REG_RANGE_0_10_2.test(v)) {
                            return { valueError: 'Некорректное значение' };
                        }
                        break;
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
                    this.afterInitRC();
                }).catch(err => {
                    if (err.code !== 434) {
                        console.log(err);
                    }
                });
        }
    }
    afterInitRC() {
        this.checkDataToDisabled('RC_CTRL', '1');
        this.subscriptions.push(
            this.form.controls['rec.RC_CTRL_RES_LAYER'].valueChanges
                .subscribe(newValue => {
                    if (this.changeByPath('rec.RC_CTRL_RES_LAYER', newValue)) {
                        this.msgSrv.addNewMessage(PARM_CHANGE_RC_RES_LAYER);
                }
            })
        );

        this.subscriptions.push(
            this.form.controls['rec.REG_UNIT'].valueChanges
                .subscribe(newValue => {
                    this._updateValidators(this.form.controls);
            })
        );
    }
    // changePattern(value) {
    //     if (value === '1') {
    //         this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_60_2));
    //     } else if (value === '2') {
    //         // this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_24_2));
    //         if (this.form.controls['rec.REG_PERIOD'].value > 24) {
    //             this.form.controls['rec.REG_PERIOD'].patchValue('24');
    //         }
    //     } else if (value === '3') {
    //         this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_10_2));
    //         if (this.form.controls['rec.REG_PERIOD'].value > 10) {
    //             this.form.controls['rec.REG_PERIOD'].patchValue('10');
    //         }
    //     }
    // }
}
