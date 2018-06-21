import { Component, Input } from '@angular/core';

@Component({
    selector: 'eos-param-header',
    templateUrl: 'header.component.html'
})
export class ParamHeaderComponent {
    @Input() title: string;
}
