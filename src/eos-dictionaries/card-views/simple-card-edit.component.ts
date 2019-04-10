import { Component, Injector } from '@angular/core';

import { BaseCardEditComponent } from './base-card-edit.component';
import { IDynamicInputOptions } from 'eos-common/dynamic-form-input/dynamic-input.component';

@Component({
    selector: 'eos-simple-card-edit',
    templateUrl: 'simple-card-edit.component.html',
})

export class SimpleCardEditComponent extends BaseCardEditComponent {

    selOpts: IDynamicInputOptions = {
        defaultValue: {
            value: '',
            title: '...',
        }
    };

    constructor(injector: Injector) {
        super(injector);
    }
}
