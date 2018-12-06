import { Component, Input} from '@angular/core';

@Component({
    selector: 'eos-cabinet-user',
    templateUrl: 'cabinet-user.component.html'
})

export class CabinetUserComponent {
    @Input() CabinetInfo;
    constructor() {

    }
}
