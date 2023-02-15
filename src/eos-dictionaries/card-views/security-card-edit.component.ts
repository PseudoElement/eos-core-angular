import { Component, Injector } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';

@Component({
    selector: 'eos-security-card-edit',
    templateUrl: 'security-card-edit.component.html',
})
export class SecurityCardEditComponent extends BaseCardEditDirective {
    constructor(injector: Injector) {
        super(injector);
    }
}
