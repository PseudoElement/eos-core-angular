import { Component, Injector, OnDestroy } from '@angular/core';
import { UserParamVisualizationSrv } from '../shared-user-param/services/user-param-visualization.service';

@Component({
    selector: 'eos-user-param-visualization',
    templateUrl: 'user-param-visualization.component.html'
})

export class UserParamVisualizationComponent extends UserParamVisualizationSrv implements OnDestroy {
    prepInputsAttach;
    constructor( injector: Injector ) {
        super(injector);
    }
    ngOnDestroy() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

}
