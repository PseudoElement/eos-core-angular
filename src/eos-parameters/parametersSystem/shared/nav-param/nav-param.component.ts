import { Component } from '@angular/core';

@Component({
    selector: 'eos-nav-param',
    templateUrl: 'nav-param.component.html'
})
export class NavParamComponent {
    infoOpened: boolean;
    isWide = false;
    changeState() {
        this.isWide = !this.isWide;
    }
}
