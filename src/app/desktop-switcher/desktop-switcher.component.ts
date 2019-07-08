import {Component, ViewChild, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import { TOOLTIP_DELAY_VALUE } from 'eos-common/services/eos-message.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent implements OnInit, OnDestroy {
    selectedDesk: EosDesk;
    innerClick: boolean;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    @ViewChild('dropDown') private _dropDown: BsDropdownDirective;

    private _selectedDeskSubscription: Subscription;
    private _boundClickCallback: EventListener;

    constructor(private _deskSrv: EosDeskService,
        private _router: Router,
    ) {
        this._selectedDeskSubscription = this._deskSrv.selectedDesk.subscribe((res) =>
            setTimeout(() => this.selectedDesk = res, 0));
    }

    ngOnInit(): void {
        this._boundClickCallback = this.clickOut.bind(this);
        window.addEventListener('click', this._boundClickCallback);
        this._deskSrv.reloadDeskList();
    }

    ngOnDestroy(): void {
        this._selectedDeskSubscription.unsubscribe();
        window.removeEventListener('click', this._boundClickCallback);
    }

    clickOut() {
        if (!this.innerClick) {
            this._dropDown.toggle(false);
        }
        this.innerClick = false;
    }

    setInnerClick() {
        this.innerClick = true;
    }

    openDesk(desk: EosDesk): void {
        this._router.navigate(['/desk', desk.id]);
        this._dropDown.toggle(false);
    }
}
