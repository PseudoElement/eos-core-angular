import { Component, Input, ViewChild } from '@angular/core';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { WARN_LINK_PIN } from '../consts/messages.consts';
import { BsDropdownDirective } from 'ngx-bootstrap';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';

@Component({
    selector: 'eos-pushpin',
    templateUrl: 'pushpin.component.html',
    styleUrls: ['./pushpin.component.scss']
})
export class PushpinComponent {
    @Input() infoOpened: boolean;

    hideSystem = true;
    showSelected = false;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    @ViewChild('dropDown', { static: true }) private _dropDown: BsDropdownDirective;

    constructor(private _deskSrv: EosDeskService, private _msgSrv: EosMessageService) { }

    /**
     * Add dictionary to desktop
     * @param desk desktop with which add dictionary
     */
    pin(desk: EosDesk) {
        if (!this._deskSrv.appendDeskItemToView(desk)) {
            this._msgSrv.addNewMessage(WARN_LINK_PIN);
        }
        this._dropDown.toggle(false);
    }

    hideDropdown(toggleValue: boolean) {
        this._dropDown.toggle(toggleValue);
    }
}
