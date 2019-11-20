import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})

export class SimpleCardEditComponent extends BaseCardEditComponent {

    get styleModeEdit() {
        if (this.dictSrv.currentDictionary.id === 'ca-category' && this.editMode && !this.isNewRecord) {
            return { 'height': 'calc(100vh - 225px)' };
        }
        return '';
    }
    constructor(injector: Injector) {
        super(injector);
    }
}
