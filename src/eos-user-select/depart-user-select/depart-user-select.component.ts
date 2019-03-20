import { Component, Input } from '@angular/core';
@Component({
    selector: 'eos-depart-user-select',
    templateUrl: 'depart-user-select.component.html'
})

export class DepartUserSelectComponent {
    @Input()showComponent: boolean;
    @Input() department: Array<any>;
    constructor() {
    }
}
