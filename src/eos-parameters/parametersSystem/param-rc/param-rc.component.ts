import { Component, Injector } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { RC_PARAM } from '../shared/consts/rc.consts';
import {
    PARM_CHANGE_RC_RES_LAYER,
    PARM_CANCEL_CHANGE,
    REG_RANGE_0_60,
    REG_RANGE_0_24,
    REG_RANGE_0_10
} from '../shared/consts/eos-parameters.const';
import { Validators } from '@angular/forms';

@Component({
    selector: 'eos-param-rc',
    templateUrl: 'param-rc.component.html'
})
export class ParamRcComponent extends BaseParamComponent {
    constructor( injector: Injector ) {
        super(injector, RC_PARAM);
        this.init()
        .then(() => {
            this.afterInitRC();
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
        this.changePattern(this.prepareData.rec.REG_UNIT);
        this.subscriptions.push(
            this.form.controls['rec.REG_UNIT'].valueChanges
            .subscribe(newValue => {
                this.changePattern(newValue);
            })
        );
    }
    changePattern(value) {
        if (value === '1') {
            this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_60));
        } else if (value === '2') {
            this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_24));
            if (this.form.controls['rec.REG_PERIOD'].value > 24) {
                this.form.controls['rec.REG_PERIOD'].patchValue('24');
            }
        } else if (value === '3') {
            this.form.controls['rec.REG_PERIOD'].setValidators(Validators.pattern(REG_RANGE_0_10));
            if (this.form.controls['rec.REG_PERIOD'].value > 10) {
                this.form.controls['rec.REG_PERIOD'].patchValue('10');
            }
        }
    }
}
