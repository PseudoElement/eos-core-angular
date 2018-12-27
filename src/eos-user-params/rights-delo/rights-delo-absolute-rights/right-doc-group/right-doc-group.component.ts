import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NodeAbsoluteRight } from '../node-absolute';
import { IParamUserCl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { UserParamsService } from 'eos-user-params/shared/services/user-params.service';
// import { WaitClassifService } from 'app/services/waitClassif.service';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { NodeDocsTree } from 'eos-user-params/shared/list-docs-tree/node-docs-tree';
import { DOCGROUP_CL, USER_RIGHT_DOCGROUP } from 'eos-rest';

@Component({
    selector: 'eos-right-absolute-doc-group',
    templateUrl: 'right-doc-group.component.html'
})
export class RightAbsoluteDocGroupComponent implements OnInit {
    @Input() selectedNode: NodeAbsoluteRight;
    @Input() curentUser: IParamUserCl;
    @Output() Changed = new EventEmitter();
    isLoading: boolean = false;
    list: NodeDocsTree[] = [];
    constructor (
        // private _msgSrv: EosMessageService,
        // private _userParmSrv: UserParamsService,
        // private _waitClassifSrv: WaitClassifService,
        private apiSrv: UserParamApiSrv,
    ) {}

    ngOnInit() {
        this._init();
    }
    select(event) {
        console.log(event);
    }
    addDoc() {
        console.log('addDoc()');
    }
    DeleteDoc() {
        console.log('DeleteDoc()');
    }

    private _init() {
        this.isLoading = true;
        const str = this.curentUser.USER_RIGHT_DOCGROUP_List.map(i => i.DUE);
        this.apiSrv.getDocGroup(str.join('||'))
        .then((data: DOCGROUP_CL[]) => {
            this.curentUser.USER_RIGHT_DOCGROUP_List.forEach((item: USER_RIGHT_DOCGROUP) => {
                data.forEach((doc: DOCGROUP_CL) => {
                    if (item.DUE === doc.DUE) {
                        this._addList(item, doc);
                    }
                });
            });

            this.isLoading = false;
        });
    }
    private _addList(rDoc: USER_RIGHT_DOCGROUP, doc: DOCGROUP_CL) {
        this.list.push(new NodeDocsTree(
            doc.DUE,
            doc.CLASSIF_NAME,
            !!rDoc.ALLOWED,
            {
                rightDocGroup: rDoc,
                docGroup: doc
            }
        ));
    }
}
