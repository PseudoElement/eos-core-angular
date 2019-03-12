import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'eos-rights-delo-cards',
    templateUrl: 'rights-delo-cards.component.html'
})

export class RightsDeloCardsComponent implements OnInit, OnDestroy {
    // private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        // private _userParamsSetSrv: UserParamsService,
        // private servApi: UserParamApiSrv,
        // private _inputCtrlSrv: InputParamControlService,
    ) {}
    ngOnInit() {
        console.log('ngOnInit()');
    }
    ngOnDestroy() {
        console.log('ngOnDestroy()');
    }
}
