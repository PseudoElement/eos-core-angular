import { Component, OnInit, Input} from '@angular/core';
@Component({
    selector: 'eos-user-system',
    templateUrl: 'user-system.component.html'
})

export class UserSystemComponent  implements OnInit {
    @Input() infoSystem;
   constructor() {
   }

    ngOnInit() {

    }
}

