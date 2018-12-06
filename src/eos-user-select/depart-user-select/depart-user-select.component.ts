import { Component, Input } from '@angular/core';
import {DEPARTMENT } from 'eos-rest';
@Component({
    selector: 'eos-depart-user-select',
    templateUrl: 'depart-user-select.component.html'
})

export class DepartUserSelectComponent {
    @Input()showComponent: boolean;
    @Input() department: DEPARTMENT;
    constructor() {
    }
}
