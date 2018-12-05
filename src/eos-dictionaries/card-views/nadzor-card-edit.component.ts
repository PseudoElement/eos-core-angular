import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-nadzor-card-edit',
    templateUrl: 'nadzor-card-edit.component.html',
    styleUrls: ['./nadzor-card-edit.component.scss']
})
export class NadzorCardEditComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
