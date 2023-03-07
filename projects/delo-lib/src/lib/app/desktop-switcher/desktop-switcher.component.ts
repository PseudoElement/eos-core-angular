import {Component, ViewChild, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

import { EosDeskService } from '../services/eos-desk.service';
import { EosDesk } from '../core/eos-desk';
import {Subscription} from 'rxjs';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';

@Component({
    selector: 'eos-desktop-switcher',
    templateUrl: 'desktop-switcher.component.html',
})
export class DesktopSwitcherComponent implements OnInit, OnDestroy {
    selectedDesk: EosDesk;
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    @ViewChild('dropDown', {static: false}) private _dropDown!: BsDropdownDirective;

    private _selectedDeskSubscription: Subscription;

    constructor(private _deskSrv: EosDeskService,
        private _router: Router,
    ) {
        this._selectedDeskSubscription = this._deskSrv.selectedDesk.subscribe((res) =>
            setTimeout(() => this.selectedDesk = res, 0));
    }

    ngOnInit(): void {
        this._deskSrv.reloadDeskList();
    }

    ngOnDestroy(): void {
        this._dropDown.autoClose = false;
        this._selectedDeskSubscription.unsubscribe();
    }

    openDesk(desk: EosDesk): void {
        this._router.navigate(['/desk', desk.id]);
        this._dropDown.toggle(false);
    }
    /* Открывать уже выбранный рабочий стол */
    openDeskDefault($evt) {
        $evt.preventDefault();
        $evt.stopPropagation();
        this._router.navigate(['/desk', this.selectedDesk.id]);
        this._dropDown.toggle(false);
    }
}
