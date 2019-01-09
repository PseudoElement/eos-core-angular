import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';


@Component({
    selector: 'eos-absolute-rights-classif',
    templateUrl: 'absolute-rights-classif.component.html'
})

// @Injectable()
export class AbsoluteRightsClassifComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = false;
    curentNode;
    isShell: Boolean = false;
    constructor (
        // private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
        // private _waitClassifSrv: WaitClassifService,
        // private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        console.log(this.selectedNode);
    }
}
