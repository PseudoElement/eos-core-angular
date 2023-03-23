import { Component } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { EosMessageService } from '../../../eos-common/index';

@Component({
    selector: 'lib-eos-param-licensing',
    templateUrl: './eos-param-licensing.component.html',
    styleUrls: ['./eos-param-licensing.component.scss']
})
export class EosParamLicensingComponent {


    constructor(private msg: EosMessageService) {

    }
    ngAfterViewInit(): void {
        try {
            Manager.loadPlugins({ 'target': 'LicenseSettings' }).then(() => {
            })
        } catch (error) {
            this.msg.addNewMessage({ "title": "Предупреждение", "type": "warning", "msg": error.massage || error })
        }

    }
}
