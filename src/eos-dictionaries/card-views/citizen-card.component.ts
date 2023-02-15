import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';

@Component({
    selector: 'eos-citizen-card',
    templateUrl: 'citizen-card.component.html',
})
export class CitizenCardComponent extends BaseCardEditDirective implements OnChanges {

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    ngOnChanges() {
    }
}
