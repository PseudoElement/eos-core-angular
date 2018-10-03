import { Component, Injector } from '@angular/core';
import { UserParamVisualizationSrv } from '../../shared/services/user-param-visualization.service';

@Component({
    selector: 'eos-user-param-visualization',
    templateUrl: 'user-param-visualization.component.html'
})

export class UserParamVisualizationComponent extends UserParamVisualizationSrv {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
}
