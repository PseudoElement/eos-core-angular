import { Component, Input } from '@angular/core';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';

// import { EosDeskService } from '../services/eos-desk.service';

@Component({
    selector: 'eos-title',
    templateUrl: 'title.component.html'
})
export class TitleComponent {
    @Input() tooltip: String;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    /* todo: define it or remove. Mocked now*/
    title = 'Настройка системы';
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
