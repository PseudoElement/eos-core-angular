import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-citizen-card',
    templateUrl: 'citizen-card.component.html',
})
export class CitizenCardComponent extends BaseCardEditComponent implements OnChanges {

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    ngOnChanges() {
    }
}
