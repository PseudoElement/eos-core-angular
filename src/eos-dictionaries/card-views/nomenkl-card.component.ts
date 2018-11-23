import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-nomenkl-card',
    templateUrl: 'nomenkl-card.component.html',
})
export class NomenklCardComponent extends BaseCardEditComponent implements OnChanges {

    constructor(
        injector: Injector,
    ) {
        super(injector);
    }
    ngOnChanges() {
    }
}
