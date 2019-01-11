import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IChengeItemAbsolute } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/right-delo.intefaces';
import { RightClassifNode } from './absolute-rights-classif-node';
import { TECH_USER_CLASSIF } from 'eos-user-params/rights-delo/shared-rights-delo/consts/tech-user-classif.consts';
import { ITechUserClassifConst } from 'eos-user-params/rights-delo/shared-rights-delo/interfaces/tech-user-classif.interface';


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
    isShell: Boolean = false;
    listClassif: RightClassifNode[] = [];
    constructor (
        // private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
        // private _waitClassifSrv: WaitClassifService,
        // private apiSrv: UserParamApiSrv,
    ) {}
    ngOnInit() {
        console.log(this.curentUser.USER_TECH_List);
        this._init();
    }
    expendList(node: RightClassifNode) {
        node.isExpanded = !node.isExpanded;
    }
    private _init () {
        if (this.selectedNode.isCreate || !this.curentUser['TECH_RIGHTS']) {
            const techRights: string = new Array(39).fill('1').join('');
            const chenge: IChengeItemAbsolute = {
                method: 'MERGE',
                user_cl: true,
                data: {
                    TECH_RIGHTS: techRights
                }
            };
            this.selectedNode.pushChange(chenge);
            this.curentUser['TECH_RIGHTS'] = techRights;
        }
        TECH_USER_CLASSIF.forEach((item: ITechUserClassifConst) => {
            const index = item.key - 1; // индекс массива с нуля
            this.listClassif.push(new RightClassifNode(item, +(this.curentUser['TECH_RIGHTS'][index]), this.selectedNode));
        });
    }
}
