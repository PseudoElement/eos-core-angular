import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-reestrtype-card',
    templateUrl: 'reestrtype-card.component.html',
    styleUrls: ['./reestrtype-card.component.scss']
})
export class ReestrtypeCardComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
        super(injector);
    }
}
