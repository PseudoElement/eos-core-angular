import { Component, Input } from '@angular/core';

@Component({
    selector: 'eos-params-base-param',
    templateUrl: './base-param.component.html'
})

export class ParamsBaseParamComponent {
    @Input('newUser') newUser: boolean;
}
