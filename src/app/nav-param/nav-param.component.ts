import { Component } from '@angular/core';

@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent {
    isWide = false;
    changeState() {
        this.isWide = !this.isWide;
    }
}
