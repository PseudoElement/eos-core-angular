import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { EosMessageService } from '../../eos-common/index';

@Component({
    selector: 'notificationl-address-plug',
    templateUrl: './notification-address-plug.component.html',
    styleUrls: ['./notification-address-plug.component.scss']
})
export class NotificationAddressPlugComponent implements AfterViewInit, OnDestroy {

    constructor(@Inject(DOCUMENT) private document: Document, private _msg: EosMessageService) { }

    ngAfterViewInit(): void {
        try {
            Manager.loadPlugins({ 'target': 'NotificationsSettings', mountPoint: 'notification-settings-plugin' });
        } catch (e) {
            this._msg.addNewMessage({ "title": "Ошибка", "type": "danger", "msg": e?.message || e })
        }

    }

    ngOnDestroy(): void {
        const header = this.document.getElementsByTagName('head');
        console.log(header);

        if (header[0]) {
            if (/\.App/.test(header[0].lastChild.textContent)) {
                header[0].removeChild(header[0].lastChild);
            }
        }
    }

}
