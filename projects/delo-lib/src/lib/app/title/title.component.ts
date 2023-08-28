import { Component, Input, OnInit } from '@angular/core';
import { logoOverrideServices } from '../../app/services/logo-overrride.service';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';

@Component({
    selector: 'eos-title',
    templateUrl: 'title.component.html'
})

export class TitleComponent  implements OnInit {
    @Input() tooltipText: String;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    /* todo: define it or remove. Mocked now*/
    title = 'Настройка системы';
    pathLogo: string;

    constructor(private logoOverrideSrv: logoOverrideServices) {}

    ngOnInit(): void {
        this.pathLogo = this.logoOverrideSrv.pathLogo;
        this.tooltipText = this.logoOverrideSrv.tooltip || this.tooltipText;
    }

    openDelo() {
        try {
            this.clearCK();
            document.location.assign('../ArmSite/Site/ArmMain.html');
        } catch (e) {
            // IE fix if user click 'stay in page'
            console.error('openDelo failed', e);
        }

    }

    clearCK() {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
            if (key.startsWith('ck ')) {
                localStorage.removeItem(key);
            }
        }
    }
}
