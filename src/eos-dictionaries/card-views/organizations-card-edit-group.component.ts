import { AfterViewInit, Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-organizations-card-edit-group',
    templateUrl: 'organizations-card-edit-group.component.html',
})
export class OrganizationsCardEditGroupComponent extends BaseCardEditComponent implements AfterViewInit {
    constructor(injector: Injector) {
        super(injector);
    }

    ngAfterViewInit(): void {
        // this.inputs['rec.CLASSIF_NAME'].label = 'Наименование группы';
    }
}
