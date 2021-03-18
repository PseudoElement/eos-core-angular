import { WaitClassifService } from 'app/services/waitClassif.service';
import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[eosClickMode]'
})

export class EosClickModeDirective {
    constructor(private _waitClassifSrv: WaitClassifService) {
    }

    @HostListener('click', ['$event']) onClick(event: MouseEvent) {
        event.preventDefault();
        const isCtrl = event.ctrlKey;
        this._waitClassifSrv.ctrlClickHandler(isCtrl);
    }
}
