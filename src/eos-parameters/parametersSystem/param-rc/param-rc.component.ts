import { Component, Injector } from '@angular/core';
import { BaseParamComponent } from '../shared/base-param.component';
import { RC_PARAM } from '../shared/consts/rc.consts';
import { PARM_CHANGE_RC_RES_LAYER, PARM_CANCEL_CHANGE } from '../shared/consts/eos-parameters.const';

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
    }
}
