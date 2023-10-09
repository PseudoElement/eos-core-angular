import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { EosMessageService } from '../../../eos-common/index';
import { EosUtils } from '../../../eos-common/core/utils';

@Component({
    selector: 'lib-eos-param-licensing',
    templateUrl: './eos-param-licensing.component.html',
    styleUrls: ['./eos-param-licensing.component.scss'],

})
export class EosParamLicensingComponent implements AfterViewInit, OnDestroy {


    constructor(private msg: EosMessageService) {}
    ngAfterViewInit(): void {
        try {
            Manager.loadPlugins({ targets: ['LicenseSettings'] }).then(() => {
            })
        } catch (error) {
            this.msg.addNewMessage({ "title": "Предупреждение", "type": "warning", "msg": error.massage || error })
        }
    }
    ngOnDestroy(): void {
        EosUtils.removeUselessStyles('data-styled')
        EosUtils.removeUselessStyles('id', 'index.1-style')
    }
}
