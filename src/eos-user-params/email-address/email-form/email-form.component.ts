import { Component, Input } from '@angular/core';
// Input, Output, EventEmitter
@Component({
    selector: 'eos-email-form',
    templateUrl: 'email-form.component.html'
})
export class EmailFormComponent {
@Input() fo: number;
    constructor() {

    }
}
