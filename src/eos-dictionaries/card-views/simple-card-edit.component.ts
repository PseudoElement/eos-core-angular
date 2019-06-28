import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})

export class SimpleCardEditComponent extends BaseCardEditComponent {

    constructor(injector: Injector) {
        super(injector);
    }
}
