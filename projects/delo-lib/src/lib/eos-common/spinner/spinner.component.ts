import { Component, Input } from '@angular/core';

@Component({
    selector: 'eos-spinner',
    templateUrl: 'spinner.component.html',
})
export class SpinnerComponent {
    @Input() size: string;
    constructor() {}
}
