import { Component, Input, ViewChild, HostListener } from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
    selector: 'eos-info',
    templateUrl: 'info.component.html',
})
export class InfoComponent {
    @Input() info: string;
    @ViewChild('pop', { static: true }) private _tooltip: TooltipDirective;

    private _pinned: boolean;
    private _innerClick: boolean;

    @HostListener('window:click', [])
    clickout() {
        if (this._tooltip && !this._innerClick) {
            this._pinned = false;
            this._tooltip.hide();
        }
        this._innerClick = false;
    }

    check() {
        if (this._tooltip && !this._pinned) {
            this._tooltip.hide();
        }
    }

    hide() {
        this._pinned = false;
        if (this._tooltip) {
            this._tooltip.hide();
        }
    }

    reverse($evt: Event) {
        $evt.stopPropagation();
        this._innerClick = true;
        this._pinned = !this._pinned;
        this.check();
    }
}
