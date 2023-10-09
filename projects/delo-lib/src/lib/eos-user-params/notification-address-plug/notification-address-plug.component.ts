import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';
import { EosMessageService } from '../../eos-common/index';
import { EosUtils } from '../../eos-common/core/utils';

@Component({
    selector: 'notificationl-address-plug',
    templateUrl: './notification-address-plug.component.html',
    styleUrls: ['./notification-address-plug.component.scss']
})
export class NotificationAddressPlugComponent implements AfterViewInit, OnDestroy {

    constructor(@Inject(DOCUMENT) private document: Document, private _msg: EosMessageService) { }

    ngAfterViewInit(): void {
        try {
            Manager.loadPlugins({ targets: ['NotificationSettings'], mountPoint: 'notification-settings-plugin' });
        } catch (e) {
            this._msg.addNewMessage({ "title": "Ошибка", "type": "danger", "msg": e?.message || e })
        }

    }

    ngOnDestroy(): void {
        EosUtils.removeUselessStyles('data-styled')
        EosUtils.removeUselessStyles('id', 'plugin.1-style')
        const head = this.document.querySelector('head');
        if (head && /\.App/.test(head.lastChild.textContent)) head.removeChild(head.lastChild);
    }

}
